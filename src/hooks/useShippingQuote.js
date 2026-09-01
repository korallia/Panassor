import { useState } from "react";

import { getShippingQuote } from "../../backend/panassorApi";

// The placeholder suggests "Ville, Code postal", but the comma is a
// suggestion, not a hard requirement -- if someone just types
// "Rougemont J0L 1M0" we still want that to work. So: split on the
// comma if there is one; otherwise look for a Canadian-postal-code-
// shaped chunk at the end of the string and treat everything before it
// as the city; otherwise fall back to treating the whole value as a
// (possibly international) postal/zip code, same as before comma
// support existed. This is all pure string/regex work -- no lookup, no
// extra network round trip, so it stays instant.
//
// NOTE: this only recognizes a *well-formed* Canadian postal code
// (see canadaPost.service.js's regex) at the end of the input -- it does
// NOT try to correct typos (e.g. a letter "O" for the digit "0"), since
// guessing those would risk misreading a genuine international code as
// a domestic one (see getShippingQuote()'s INTL fallback + warning).
const CA_POSTAL_CODE_TAIL_REGEX =
  /([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s*\d[ABCEGHJ-NPRSTV-Z]\d)\s*$/i;

function parseShippingInput(rawValue) {
  const trimmedValue = String(rawValue || "").trim();
  const commaIndex = trimmedValue.indexOf(",");

  if (commaIndex !== -1) {
    const city = trimmedValue.slice(0, commaIndex).trim();
    const postalCode = trimmedValue.slice(commaIndex + 1).trim();
    return postalCode ? { city, postalCode } : null;
  }

  const tailMatch = trimmedValue.match(CA_POSTAL_CODE_TAIL_REGEX);
  if (tailMatch) {
    return {
      city: trimmedValue.slice(0, tailMatch.index).trim(),
      postalCode: tailMatch[1].trim(),
    };
  }

  return trimmedValue ? { city: "", postalCode: trimmedValue } : null;
}

// items: the cart's line items ({productId, quantity}), so the backend
// can look up each product's real weight/dimensions and pick the right
// box (see backend/services/packing.service.js) instead of always using
// the flat placeholder parcel.
export function useShippingQuote(items = []) {
  const [postalCode, setPostalCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  // The parsed {city, postalCode} that produced the current `quote` --
  // needed so a chosen option can carry its destination through to
  // checkout for server-side re-validation (see useCheckout.js).
  const [destination, setDestination] = useState(null);

  async function requestQuote() {
    const parsed = parseShippingInput(postalCode);

    if (!parsed) {
      setStatus("error");
      setError("EMPTY_POSTAL_CODE");
      return;
    }

    const { city, postalCode: parsedPostalCode } = parsed;

    setStatus("loading");
    setError("");

    try {
      const result = await getShippingQuote({
        postalCode: parsedPostalCode,
        city,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      setQuote(result);
      setDestination({ city, postalCode: parsedPostalCode });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "QUOTE_FAILED");
      setQuote(null);
      setDestination(null);
    }
  }

  function resetQuote() {
    setQuote(null);
    setDestination(null);
    setStatus("idle");
    setError("");
  }

  return {
    postalCode,
    setPostalCode,
    status,
    quote,
    destination,
    error,
    requestQuote,
    resetQuote,
  };
}
