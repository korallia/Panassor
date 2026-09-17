// scripts/testTrackingEmail.js
//
// Sends one real tracking email through Resend using fake order/shipment
// data -- no database, no order, no shipment needed. For testing that
// RESEND_API_KEY + RESEND_FROM_EMAIL (in your local .env) are wired up
// correctly and that the template renders the way you expect.
//
// Usage: node backend/scripts/testTrackingEmail.js ton-adresse@courriel.com [postes_canada|purolator]

import "dotenv/config";
import { sendTrackingEmail } from "../services/trackingEmail.service.js";

const toEmail = process.argv[2];
const carrier = process.argv[3] || "postes_canada";

if (!toEmail) {
  console.error(
    "Usage: node backend/scripts/testTrackingEmail.js ton-adresse@courriel.com [postes_canada|purolator]"
  );
  process.exit(1);
}

if (!["postes_canada", "purolator"].includes(carrier)) {
  console.error('Transporteur invalide -- utilise "postes_canada" ou "purolator".');
  process.exit(1);
}

const result = await sendTrackingEmail({
  recipientEmail: toEmail,
  recipientName: "Test Client",
  orderId: 9999,
  shipmentItems: [
    {
      id: 1,
      parent_shipment_item_id: null,
      name: "Trousse de premiers soins immersive",
      color_name: "Noir",
      quantity: 1,
    },
    {
      id: 2,
      parent_shipment_item_id: null,
      name: "Bandage",
      color_name: null,
      quantity: 3,
    },
  ],
  carrier,
  trackingNumber: carrier === "purolator" ? "329020024470" : "1234567890123",
});

if (result === null) {
  console.error(
    "RESEND_API_KEY manquant dans ton .env -- ajoute-le puis relance."
  );
  process.exit(1);
}

console.log("Courriel envoyé -- vérifie la boîte de réception (et les spams) de", toEmail);
