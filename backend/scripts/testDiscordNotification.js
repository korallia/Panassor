// scripts/testDiscordNotification.js
//
// Envoie un message Discord de test avec le meme format que
// notifyNewOrderShipment() (services/discord.service.js) -- sans toucher
// a la base de donnees ni a Square. Juste pour valider que le webhook +
// le role mentionne fonctionnent, independamment du reste du flot de
// commande.
import "dotenv/config";
import { env } from "../config/env.js";

const webhookUrl = env.discord.orderWebhookUrl;

if (!webhookUrl) {
  console.error("DISCORD_ORDER_WEBHOOK_URL n'est pas defini -- rien a tester.");
  process.exit(1);
}

const embed = {
  title: "🆕 Nouvelle commande payee — #TEST",
  color: 0x2ecc71,
  fields: [
    { name: "Client", value: "Client Test" },
    { name: "Adresse", value: "123 Rue Test\nMontreal QC H1H 1H1\nCA" },
    { name: "Articles", value: "1x Produit Test, aucune modification" },
    { name: "Total", value: "29.99 $ CAD", inline: true },
  ],
  timestamp: new Date().toISOString(),
};

const roleId = env.discord.orderRoleId;
const payload = roleId
  ? { content: `<@&${roleId}>`, allowed_mentions: { roles: [roleId] }, embeds: [embed] }
  : { embeds: [embed] };

const response = await fetch(`${webhookUrl}?wait=true`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const body = await response.text();
console.log("Status:", response.status);
console.log("Reponse:", body);
process.exit(response.ok ? 0 : 1);
