// Ancien point d'entrée, gardé pour les scripts de test.
// Le code est maintenant découpé dans services/shipments/ :
//   - shipments.repository.js        : base de données
//   - shipmentCreation.service.js    : commande payée -> envoi
//   - shipmentTracking.service.js    : suivi, courriel, livraison
export * from "./shipments/shipments.repository.js";
export { ensureShipmentForOrderId } from "./shipments/shipmentCreation.service.js";
export {
  getShipmentForTrackingEntry,
  submitShipmentTracking,
  recordShipmentDelivered,
} from "./shipments/shipmentTracking.service.js";
