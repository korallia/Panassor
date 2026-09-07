import { env } from "../config/env.js";
import pool from "../db/pool.js";

// =========================================
// DISCORD ORDER NOTIFICATIONS
//
// Posts a message to a Discord channel (via an incoming webhook)
// whenever a new paid order gets its shipment created, i.e. as soon
// as we know the recipient name, shipping address and item list.
//
// Configure DISCORD_ORDER_WEBHOOK_URL in the environment to enable
// this. If it's not set, notifications are silently skipped so local
// dev / CI never needs a real webhook.
// =========================================

function formatAddressLines({
  line1,
  line2,
  locality,
  province,
  postalCode,
  country,
} = {}) {
  const lines = [];

  if (line1) lines.push(line1);
  if (line2) lines.push(line2);

  const cityProvince = [locality, province].filter(Boolean).join(" ");
  const cityLine = [cityProvince, postalCode].filter(Boolean).join(" ");

  if (cityLine) lines.push(cityLine);
  if (country) lines.push(String(country).toUpperCase());

  return lines;
}

// Groups flat shipment_items rows (parents + selected-item children)
// back into one entry per top-level item, the way orders.service.js /
// shipments.service.js store them.
export function buildItemSummaries(shipmentItems = []) {
  const topLevelItems = shipmentItems.filter(
    (item) => !item.parent_shipment_item_id
  );

  return topLevelItems.map((item) => ({
    quantity: item.quantity,
    name: item.name,
    colorName: item.color_name,
    selectedItemNames: shipmentItems
      .filter((child) => child.parent_shipment_item_id === item.id)
      .map((child) => child.name),
  }));
}

function formatItemLine(item) {
  const details = [];

  if (item.selectedItemNames.length > 0) {
    details.push(`outils : ${item.selectedItemNames.join(", ")}`);
  } else {
    details.push("aucune modification");
  }

  if (item.colorName) {
    details.push(`couleur ${item.colorName}`);
  }

  return `${item.quantity}x ${item.name}, ${details.join(", ")}`;
}

function formatTotal(order) {
  if (typeof order?.total_cents !== "number") {
    return "—";
  }

  return `${(order.total_cents / 100).toFixed(2)} $ ${order.currency || "CAD"}`;
}

// Fire-and-forget: this must never throw and never block the caller
// (the Square webhook handler) on a slow/broken Discord request.
export async function notifyNewOrderShipment({ order, shipment, shipmentItems }) {
  const webhookUrl = env.discord.orderWebhookUrl;

  if (!webhookUrl) {
    console.log(
      "DISCORD_ORDER_WEBHOOK_URL not set, skipping Discord order notification."
    );
    return;
  }

  try {
    const addressLines = formatAddressLines({
      line1: shipment.address_line_1,
      line2: shipment.address_line_2,
      locality: shipment.locality,
      province: shipment.province,
      postalCode: shipment.postal_code,
      country: shipment.country,
    });

    const itemsText =
      buildItemSummaries(shipmentItems).map(formatItemLine).join("\n") || "—";

    const trackingEntryUrl = shipment.admin_access_token
      ? `${env.siteUrl}/expedition?shipmentId=${shipment.id}&key=${shipment.admin_access_token}`
      : null;

    const embed = {
      title: `🆕 Nouvelle commande payée — #${order.id}`,
      color: 0x2ecc71,
      fields: [
        {
          name: "Client",
          value: shipment.recipient_display_name || "—",
        },
        {
          name: "Adresse",
          value: addressLines.join("\n") || "—",
        },
        {
          name: "Articles",
          value: itemsText,
        },
        {
          name: "Total",
          value: formatTotal(order),
          inline: true,
        },
        // Opens the tracking-entry page for THIS shipment (see
        // ShipmentTrackingEntryPage.jsx) -- enter the carrier + tracking
        // number there once it's shipped, and the customer's tracking
        // email goes out automatically.
        ...(trackingEntryUrl
          ? [
              {
                name: "Rentrer le tracking",
                value: `[Cliquer ici](${trackingEntryUrl})`,
              },
            ]
          : []),
      ],
      timestamp: new Date().toISOString(),
    };

    const roleId = env.discord.orderRoleId;

    // Discord webhooks ignore "@RoleName" typed as plain text — a mention
    // only actually pings when it's the special <@&roleId> token AND the
    // role is listed in `allowed_mentions`. Without both, the message
    // posts fine but nobody gets notified.
    const payload = roleId
      ? {
          content: `<@&${roleId}>`,
          allowed_mentions: { roles: [roleId] },
          embeds: [embed],
        }
      : { embeds: [embed] };

    // ?wait=true makes Discord return the created message (including its
    // id) instead of a bare 204 -- we need that id to edit this same
    // message in place later (see editShipmentDiscordStatus below), as
    // the shipment moves from "reçue" -> "en chemin" -> "livrée".
    const response = await fetch(`${webhookUrl}?wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.warn(
        "Discord order notification failed:",
        response.status,
        body
      );
      return;
    }

    const sentMessage = await response.json().catch(() => null);

    if (sentMessage?.id) {
      await pool.query(
        `UPDATE shipments SET discord_message_id = $1 WHERE id = $2;`,
        [sentMessage.id, shipment.id]
      );
    }
  } catch (error) {
    console.warn("Discord order notification threw an error:", error);
  }
}

// =========================================
// EDITING THE ORDER MESSAGE AS THE SHIPMENT PROGRESSES
//
// The "new order" message posted above stays as the single message for
// this order -- instead of posting new messages, we PATCH it in place
// as the shipment moves through 3 stages:
//   1. reçue      (posted by notifyNewOrderShipment above)
//   2. in_transit (tracking number entered -- see shipments.service.js)
//   3. delivered  (detected automatically -- see jobs/trackingPoller.js)
//
// Requires shipment.discord_message_id, captured via ?wait=true when
// the original message was sent. If it's missing (message send failed,
// or DISCORD_ORDER_WEBHOOK_URL wasn't set at the time), this silently
// no-ops -- never blocks the caller on a Discord hiccup.
// =========================================

const SHIPMENT_STAGE_CONFIG = {
  in_transit: { titlePrefix: "🚚 En chemin", color: 0x3498db },
  delivered: { titlePrefix: "✅ Livré", color: 0x9b59b6 },
};

const CARRIER_LABELS_FR = {
  postes_canada: "Postes Canada",
  purolator: "Purolator",
};

export async function editShipmentDiscordStatus({
  order,
  shipment,
  shipmentItems,
  stage,
  trackingUrl = null,
}) {
  const webhookUrl = env.discord.orderWebhookUrl;
  const stageConfig = SHIPMENT_STAGE_CONFIG[stage];

  if (!webhookUrl || !shipment?.discord_message_id || !stageConfig) {
    return;
  }

  try {
    const addressLines = formatAddressLines({
      line1: shipment.address_line_1,
      line2: shipment.address_line_2,
      locality: shipment.locality,
      province: shipment.province,
      postalCode: shipment.postal_code,
      country: shipment.country,
    });

    const itemsText =
      buildItemSummaries(shipmentItems).map(formatItemLine).join("\n") || "—";

    const fields = [
      { name: "Client", value: shipment.recipient_display_name || "—" },
      { name: "Adresse", value: addressLines.join("\n") || "—" },
      { name: "Articles", value: itemsText },
      { name: "Total", value: formatTotal(order), inline: true },
    ];

    if (shipment.carrier && shipment.tracking_number) {
      fields.push({
        name: "Transporteur",
        value: CARRIER_LABELS_FR[shipment.carrier] || shipment.carrier,
        inline: true,
      });
      fields.push({
        name: "Numéro de suivi",
        value: trackingUrl
          ? `[${shipment.tracking_number}](${trackingUrl})`
          : shipment.tracking_number,
      });
    }

    const embed = {
      title: `${stageConfig.titlePrefix} — commande #${order.id}`,
      color: stageConfig.color,
      fields,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(
      `${webhookUrl}/messages/${shipment.discord_message_id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      }
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.warn(
        `Discord shipment status edit (${stage}) failed:`,
        response.status,
        body
      );
    }
  } catch (error) {
    console.warn(
      `Discord shipment status edit (${stage}) threw an error:`,
      error
    );
  }
}
