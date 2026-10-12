import { env } from "../config/env.js";
import { sendEmail } from "./resend.service.js";
import { buildItemSummaries } from "./shipments/shipmentItems.util.js";

// Sends the "your order has shipped" email once Korallia enters a
// tracking number (see the tracking-entry page + shipments.controller.js).
// Deliberately NOT in Panassor's dark/gothic site branding -- this is a
// trust-building, purely functional message (same reasoning as keeping
// it close to Square's own receipt style), just with a light touch of
// the brand (wordmark + gold accent) instead of a generic template.
//
// Bilingual (FR then EN) in one email rather than branching on a stored
// order language -- orders.language isn't tracked anywhere today, and a
// stacked FR/EN message is simpler and never wrong, matching how the
// international-shipping copy elsewhere in the cart is handled.

const GOLD = "#a9781f";
const INK = "#2a2117";
const MUTED = "#6b5f4d";
const BORDER = "#e4dcc8";

const CARRIER_LABELS = {
  "postes_canada": "Postes Canada",
  purolator: "Purolator",
  poste_lettres: "Postes Canada (Poste-lettres)",
};

function getCarrierLabel(carrier) {
  return CARRIER_LABELS[carrier] || carrier || "Transporteur";
}

// Best-effort public tracking URL when Korallia doesn't paste one in
// herself -- both carriers accept the raw tracking/PIN number as a query
// param on their public tracking pages.
export function buildTrackingUrl(carrier, trackingNumber) {
  const encodedNumber = encodeURIComponent(trackingNumber);

  if (carrier === "postes_canada") {
    return `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${encodedNumber}`;
  }

  if (carrier === "purolator") {
    return `https://www.purolator.com/en/shipping/tracker?pin=${encodedNumber}`;
  }

  return null;
}

function formatItemLine(item) {
  const details = [];

  if (item.selectedItemNames.length > 0) {
    details.push(item.selectedItemNames.join(", "));
  }

  if (item.colorName) {
    details.push(item.colorName);
  }

  return `${item.quantity}x ${item.name}${details.length ? ` (${details.join(" — ")})` : ""}`;
}

function buildItemsHtml(shipmentItems) {
  const lines = buildItemSummaries(shipmentItems).map(formatItemLine);

  if (!lines.length) {
    return "";
  }

  return `
    <ul style="margin:0; padding:0 0 0 18px; color:${INK}; font-size:14px; line-height:1.6;">
      ${lines.map((line) => `<li>${line}</li>`).join("\n      ")}
    </ul>
  `;
}

function buildEmailHtml({
  recipientName,
  orderId,
  shipmentItems,
  carrierLabel,
  trackingNumber,
  trackingUrl,
}) {
  const itemsHtml = buildItemsHtml(shipmentItems);
  const greetingName = recipientName ? recipientName.split(" ")[0] : "";

  return `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
  </head>
  <body style="margin:0; padding:0; background:#f4f1ea; font-family:Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:520px; background:#ffffff; border:1px solid ${BORDER};">
            <tr>
              <td style="padding:32px 32px 24px; text-align:center; border-bottom:2px solid ${GOLD};">
                <img src="https://assets.panassor.ca/images/logo_panassor.png" alt="Panassor" width="240" style="display:block; margin:0 auto; width:240px; height:auto;" />
              </td>
            </tr>

            <tr>
              <td style="padding:28px 32px 8px;">
                <p style="margin:0 0 4px; color:${MUTED}; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">Commande #${orderId}</p>
                <h1 style="margin:0 0 16px; color:${INK}; font-size:20px;">Ta commande est en route${greetingName ? `, ${greetingName}` : ""} !</h1>
                <p style="margin:0 0 20px; color:${INK}; font-size:14px; line-height:1.6;">
                  ${
                    trackingNumber
                      ? `Bonne nouvelle -- ta commande vient d'être expédiée par ${carrierLabel}. Voici les détails pour la suivre :`
                      : `Bonne nouvelle -- ta commande vient d'être expédiée par ${carrierLabel}. Elle voyage en lettre, sans numéro de suivi : compte environ 2 semaines.`
                  }
                </p>
              </td>
            </tr>

            ${trackingNumber ? `<tr>
              <td style="padding:0 32px 20px;">
                <table role="presentation" width="100%" style="border:1px solid ${BORDER}; border-radius:4px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <p style="margin:0 0 6px; color:${MUTED}; font-size:12px; text-transform:uppercase; letter-spacing:0.06em;">Transporteur</p>
                      <p style="margin:0 0 14px; color:${INK}; font-size:15px;">${carrierLabel}</p>
                      <p style="margin:0 0 6px; color:${MUTED}; font-size:12px; text-transform:uppercase; letter-spacing:0.06em;">Numéro de suivi</p>
                      <p style="margin:0; color:${INK}; font-size:15px; font-family:monospace;">${trackingNumber}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>` : ""}

            ${
              trackingUrl
                ? `<tr>
              <td style="padding:0 32px 28px; text-align:center;">
                <a href="${trackingUrl}" style="display:inline-block; background:${GOLD}; color:#ffffff; text-decoration:none; padding:12px 28px; font-size:14px; letter-spacing:0.04em; border-radius:3px;">Suivre mon colis</a>
              </td>
            </tr>`
                : ""
            }

            ${
              itemsHtml
                ? `<tr>
              <td style="padding:0 32px 24px;">
                <p style="margin:0 0 8px; color:${MUTED}; font-size:12px; text-transform:uppercase; letter-spacing:0.06em;">Contenu de la commande</p>
                ${itemsHtml}
              </td>
            </tr>`
                : ""
            }

            <tr>
              <td style="padding:20px 32px; border-top:1px solid ${BORDER}; text-align:center;">
                <p style="margin:0; color:${MUTED}; font-size:12px;">Des questions ? Écris-nous à <a href="mailto:support@panassor.ca" style="color:${GOLD};">support@panassor.ca</a></p>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 8px; border-top:1px dashed ${BORDER};">
                <p style="margin:0 0 4px; color:${MUTED}; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">Order #${orderId}</p>
                <h1 style="margin:0 0 16px; color:${INK}; font-size:18px; font-weight:normal;">Your order is on its way${greetingName ? `, ${greetingName}` : ""}!</h1>
                <p style="margin:0 0 16px; color:${INK}; font-size:13px; line-height:1.6;">
                  ${
                    trackingNumber
                      ? `Good news -- your order just shipped with ${carrierLabel}. Tracking details above (same number, both carriers use one tracking page per shipment).`
                      : `Good news -- your order just shipped with ${carrierLabel}. It travels as a letter, without a tracking number: allow about 2 weeks.`
                  }
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 32px 24px; text-align:center;">
                <p style="margin:0; color:${MUTED}; font-size:12px;">Questions? Reach us at <a href="mailto:support@panassor.ca" style="color:${GOLD};">support@panassor.ca</a></p>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 32px 26px; border-top:1px solid ${BORDER}; text-align:center;">
                <p style="margin:0 0 4px; color:${MUTED}; font-size:12px;">Panassor</p>
                <p style="margin:0 0 14px; color:${MUTED}; font-size:12px;">3-99 Rue De L'atmosphère, Gatineau, QC J9A 3A1</p>
                <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="padding:0 8px;">
                      <a href="https://www.facebook.com/profile.php?id=61587079943525">
                        <img src="https://assets.panassor.ca/images/icon-facebook.png?v=2" width="24" height="24" alt="Facebook" style="display:block; width:24px; height:24px;" />
                      </a>
                    </td>
                    <td style="padding:0 8px;">
                      <a href="https://panassor.ca">
                        <img src="https://assets.panassor.ca/images/icon-globe.png" width="24" height="24" alt="Site web" style="display:block; width:24px; height:24px;" />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export async function sendTrackingEmail({
  recipientEmail,
  recipientName,
  orderId,
  shipmentItems,
  carrier,
  trackingNumber,
  trackingUrl,
}) {
  if (!recipientEmail) {
    console.error(
      `sendTrackingEmail: no recipient email for order #${orderId} -- skipping.`
    );
    return null;
  }

  const carrierLabel = getCarrierLabel(carrier);
  const resolvedTrackingUrl =
    trackingUrl || (trackingNumber ? buildTrackingUrl(carrier, trackingNumber) : null);

  const html = buildEmailHtml({
    recipientName,
    orderId,
    shipmentItems,
    carrierLabel,
    trackingNumber,
    trackingUrl: resolvedTrackingUrl,
  });

  return sendEmail({
    to: recipientEmail,
    subject: `Panassor — Ta commande #${orderId} est en route / Your order is on its way`,
    html,
  });
}
