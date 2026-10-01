// =========================================
// LIVRAISON HORS CANADA -- Purolator et Postes Canada
//
// Codes confirmés par backend/scripts/testPurolatorInternational.js
// (2026-10-01) :
//   - États-Unis : PurolatorGroundU.S. (par la route, 2 à 5 jours).
//     « PurolatorExpressInternational » est refusé pour les États-Unis.
//   - Reste du monde : PurolatorExpressInternational (seul service offert).
// Les droits et taxes d'importation sont à la charge du client, payables
// à la réception (décision de Korallia, 2026-09-30).
// =========================================

export const US_SERVICE_ID = "PurolatorGroundU.S.";

// Postes Canada : services standards seulement (pas d'Xpresspost). Deux
// par destination pour garder le panier épuré -- à ajuster ici au besoin.
// Les noms de champs de la destination (unitedStates.zipCode,
// international.countryCode) sont ceux que la nouvelle API (2026)
// accepte ; la sandbox ne renvoie qu'une réponse d'exemple, les vrais
// prix ne se voient qu'en production.
export const CANADA_POST_US_SERVICE_CODES = ["USA.TP", "USA.EP"];
// Ordre de préférence : on affiche au plus 2 services parmi ceux que
// Postes Canada offre réellement pour le colis et le pays.
export const CANADA_POST_WORLD_SERVICE_CODES = ["INT.TP", "INT.IP.SURF", "INT.SP.AIR", "INT.IP.AIR"];
export const CANADA_POST_MAX_OPTIONS = 2;

export function canadaPostDestination(country, postalCode) {
  return country === "US"
    ? { unitedStates: { zipCode: String(postalCode).trim().slice(0, 5) } }
    : { international: { countryCode: country } };
}
export const WORLD_SERVICE_ID = "PurolatorExpressInternational";

// Noms affichés au client (Purolator ne renvoie que des codes).
export const PUROLATOR_SERVICE_LABELS = {
  PurolatorExpress: "Express",
  "PurolatorGroundU.S.": "Ground États-Unis",
  PurolatorExpressInternational: "Express International",
};

export function isValidCountryCode(country) {
  return /^[A-Z]{2}$/.test(String(country || "")) && country !== "CA";
}

// État américain déduit des 3 premiers chiffres du code ZIP, pour que le
// client n'ait pas à le choisir (Purolator en a besoin pour les É.-U.).
const US_ZIP3_RANGES = [
  [5, 5, "NY"], [6, 9, "PR"], [10, 27, "MA"], [28, 29, "RI"], [30, 38, "NH"],
  [39, 49, "ME"], [50, 59, "VT"], [60, 69, "CT"], [70, 89, "NJ"], [90, 99, "AE"],
  [100, 149, "NY"], [150, 196, "PA"], [197, 199, "DE"], [200, 205, "DC"],
  [206, 219, "MD"], [220, 246, "VA"], [247, 268, "WV"], [270, 289, "NC"],
  [290, 299, "SC"], [300, 319, "GA"], [320, 349, "FL"], [350, 369, "AL"],
  [370, 385, "TN"], [386, 397, "MS"], [398, 399, "GA"], [400, 427, "KY"],
  [430, 459, "OH"], [460, 479, "IN"], [480, 499, "MI"], [500, 528, "IA"],
  [530, 549, "WI"], [550, 567, "MN"], [570, 577, "SD"], [580, 588, "ND"],
  [590, 599, "MT"], [600, 629, "IL"], [630, 658, "MO"], [660, 679, "KS"],
  [680, 693, "NE"], [700, 714, "LA"], [716, 729, "AR"], [730, 749, "OK"],
  [750, 799, "TX"], [800, 816, "CO"], [820, 831, "WY"], [832, 838, "ID"],
  [840, 847, "UT"], [850, 865, "AZ"], [870, 884, "NM"], [885, 885, "TX"],
  [889, 898, "NV"], [900, 961, "CA"], [962, 966, "AP"], [967, 968, "HI"],
  [969, 969, "GU"], [970, 979, "OR"], [980, 994, "WA"], [995, 999, "AK"],
];

export function usStateFromZip(zip) {
  const prefix = Number(String(zip || "").replace(/\D/g, "").slice(0, 3));
  if (!Number.isFinite(prefix)) return "";
  const range = US_ZIP3_RANGES.find(([from, to]) => prefix >= from && prefix <= to);
  return range ? range[2] : "";
}

export function isValidUsZip(zip) {
  return /^\d{5}(-?\d{4})?$/.test(String(zip || "").trim());
}
