import { useState } from "react";

import { getShippingQuote } from "../../backend/panassorApi";

// The single shipping input is filled in as "Ville, Code postal" (see the
// postalCodePlaceholder copy) so we can send a real city to Purolator
// instead of guessing one from the postal code alone -- more accurate.
// Falls back to treating the whole value as a bare postal code if there's
// no comma, so it still works if someone ignores the placeholder format.
function parseShippingInput(rawValue) {
  const trimmedValue = String(rawValue || "").trim();
  const commaIndex = trimmedValue.indexOf(",");

  if (commaIndex === -1) {
    return { city: "", postalCode: trimmedValue };
  }

  return {
    city: trimmedValue.slice(0, commaIndex).trim(),
    postalCode: trimmedValue.slice(commaIndex + 1).trim(),
  };
}

export function useShippingQuote() {
  const [postalCode, setPostalCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  // The parsed {city, postalCode} that produced the current `quote` --
  // needed so a chosen option can carry its destination through to
  // checkout for server-side re-validation (see useCheckout.js).
  const [destination, setDestination] = useState(null);

  async function requestQuote() {
    const { city, postalCode: parsedPostalCode } = parseShippingInput(postalCode);

    if (!parsedPostalCode) {
      setStatus("error");
      setError("EMPTY_POSTAL_CODE");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const result = await getShippingQuote({ postalCode: parsedPostalCode, city });
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
