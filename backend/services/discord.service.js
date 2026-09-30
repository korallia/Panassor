// Ancien point d'entrée, gardé pour les scripts de test.
// Tout ce qui touche Discord est maintenant dans discord/discordManager.js.
export {
  announceNewOrder as notifyNewOrderShipment,
  updateOrderMessage as editShipmentDiscordStatus,
} from "./discord/discordManager.js";
export { buildItemSummaries } from "./shipments/shipmentItems.util.js";
