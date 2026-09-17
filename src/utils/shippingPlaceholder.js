// Placeholder shipping-quote data source.
//
// This mocks the future POST /api/shipping/quote endpoint (Postes Canada
// for domestic destinations, Purolator for international — see the
// shipping plan). The shape returned here — { country, options[] } — is
// the contract the real endpoint should also return, so ShippingEstimator
// and useShippingQuote won't need to change when this is swapped for a
// real fetch() call.

const CA_POSTAL_CODE_REGEX =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

export function isDomesticPostalCode(postalCode) {
  return CA_POSTAL_CODE_REGEX.test(String(postalCode || "").trim());
}

// TODO(shipping-api): replace the body of this function with a real call
// to POST /api/shipping/quote once Postes Canada + Purolator are wired
// in on the backend. Keep the same input/output shape.
export function getShippingQuote({ postalCode }) {
  const trimmedPostalCode = String(postalCode || "").trim();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!trimmedPostalCode) {
        reject(new Error("EMPTY_POSTAL_CODE"));
        return;
      }

      if (isDomesticPostalCode(trimmedPostalCode)) {
        resolve({
          country: "CA",
          options: [
            {
              id: "cp-expedited",
              carrier: "postes_canada",
              carrierLabel: "Postes Canada",
              serviceLabel: "Colis Expedité",
              priceCents: 1299,
              etaLabel_fr: "5 à 7 jours ouvrables",
              etaLabel_en: "5 to 7 business days",
            },
            {
              id: "cp-xpresspost",
              carrier: "postes_canada",
              carrierLabel: "Postes Canada",
              serviceLabel: "Xpresspost",
              priceCents: 1999,
              etaLabel_fr: "2 à 3 jours ouvrables",
              etaLabel_en: "2 to 3 business days",
            },
          ],
        });
        return;
      }

      resolve({
        country: "INTL",
        options: [
          {
            id: "purolator-international",
            carrier: "purolator",
            carrierLabel: "Purolator",
            serviceLabel: "International",
            priceCents: 4500,
            etaLabel_fr: "7 à 10 jours ouvrables",
            etaLabel_en: "7 to 10 business days",
          },
        ],
      });
    }, 600);
  });
}
