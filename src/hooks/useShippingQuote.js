import { useEffect, useRef, useState } from "react";

import { getShippingQuote } from "../api/panassorApi";

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

// Une requete par transporteur, en parallele : Purolator repond en ~0,5 s,
// Postes Canada peut prendre 10-30 s quand leur API est lente. On affiche
// chaque transporteur des qu'il repond au lieu d'attendre le plus lent.
// L'ordre ici = l'ordre d'affichage (stable, pour que la liste ne "saute"
// pas sous le doigt du client quand Postes Canada arrive apres).
const CARRIERS = ["purolator", "postes_canada"];

// Code postal canadien complet (même règle que le serveur). Sinon, c'est
// une adresse hors Canada : on demande le pays avant de calculer.
const CA_POSTAL_CODE_REGEX =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/i;

export function isCanadianPostalCode(postalCode) {
  return CA_POSTAL_CODE_REGEX.test(String(postalCode || "").replace(/[\s-]+/g, ""));
}

function sortByCarrier(options) {
  return [...options].sort(
    (a, b) => CARRIERS.indexOf(a.carrier) - CARRIERS.indexOf(b.carrier)
  );
}

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

  // Hors Canada sans virgule (« Tokyo 100-0001 », « London SW1A 1AA »,
  // « 75001 Paris ») : les mots qui contiennent un chiffre, à la fin ou
  // au début, sont le code postal; le reste est la ville.
  const words = trimmedValue.split(/\s+/);
  const hasDigit = (word) => /\d/.test(word);
  let end = words.length;
  while (end > 0 && hasDigit(words[end - 1])) end -= 1;
  if (end > 0 && end < words.length) {
    return { city: words.slice(0, end).join(" "), postalCode: words.slice(end).join(" ") };
  }
  let start = 0;
  while (start < words.length && hasDigit(words[start])) start += 1;
  if (start > 0 && start < words.length) {
    return { city: words.slice(start).join(" "), postalCode: words.slice(0, start).join(" ") };
  }

  return trimmedValue ? { city: "", postalCode: trimmedValue } : null;
}

// items: the cart's line items ({productId, quantity}), so the backend
// can look up each product's real weight/dimensions and pick the right
// box (see backend/services/packing.service.js) instead of always using
// the flat placeholder parcel.
export function useShippingQuote(items = []) {
  const [postalCode, setPostalCodeState] = useState("");
  // Pays de destination, demandé seulement pour une adresse hors Canada.
  const [country, setCountry] = useState("");
  const [askCountry, setAskCountry] = useState(false);

  function setPostalCode(value) {
    setPostalCodeState(value);

    // Redevenue une adresse canadienne : on cache le choix du pays.
    const parsed = parseShippingInput(value);
    if (parsed && isCanadianPostalCode(parsed.postalCode)) {
      setAskCountry(false);
    }
  }
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  // The parsed {city, postalCode} that produced the current `quote` --
  // needed so a chosen option can carry its destination through to
  // checkout for server-side re-validation (see useCheckout.js).
  const [destination, setDestination] = useState(null);

  // Set once a quote has successfully come back, cleared on error/reset.
  // Used (not React state, so changing it never re-renders on its own)
  // to know whether the cart-change effect below should bother
  // auto-refreshing -- never fire before the shopper has asked for a
  // first quote.
  const hasQuoteRef = useRef(false);

  // Transporteurs dont la reponse n'est pas encore arrivee (pour afficher
  // "Chargement des tarifs Postes Canada..." sous les options deja la).
  const [pendingCarriers, setPendingCarriers] = useState([]);
  // Transporteurs qui ne desservent pas le pays choisi (ex. Postes Canada
  // vers la France) : on ne les affiche pas du tout.
  const [notServedCarriers, setNotServedCarriers] = useState([]);

  // Ignore les reponses d'un ancien clic "Calculer" si le client a relance
  // entre-temps (autre code postal, panier modifie...).
  const requestIdRef = useRef(0);

  // A cart with the same items in a different order is the same cart --
  // sort so re-ordering the cart doesn't trigger a pointless re-quote.
  const itemsSignature = items
    .map((item) => `${item.productId}:${item.quantity}`)
    .sort()
    .join("|");

  async function requestQuote(countryOverride) {
    const parsed = parseShippingInput(postalCode);

    if (!parsed) {
      setStatus("error");
      setError("EMPTY_POSTAL_CODE");
      return;
    }

    const isDomestic = isCanadianPostalCode(parsed.postalCode);
    const wantedCountry = isDomestic ? "CA" : countryOverride || country;

    // Hors Canada sans pays choisi : on le demande avant de calculer.
    if (!isDomestic) {
      setAskCountry(true);

      if (!wantedCountry) {
        requestIdRef.current += 1;
        setPendingCarriers([]);
        setNotServedCarriers([]);
        setQuote(null);
        setDestination(null);
        setStatus("needsCountry");
        setError("");
        hasQuoteRef.current = false;
        return;
      }
    }

    // Purolator et Postes Canada, au Canada comme ailleurs.
    const carriersForRequest = CARRIERS;

    const { city, postalCode: parsedPostalCode } = parsed;

    // Purolator exige la ville hors Canada.
    if (!isDomestic && !city) {
      requestIdRef.current += 1;
      setPendingCarriers([]);
      setNotServedCarriers([]);
      setQuote(null);
      setDestination(null);
      setStatus("error");
      setError("CITY_REQUIRED");
      hasQuoteRef.current = false;
      return;
    }

    const requestId = ++requestIdRef.current;
    const isCurrent = () => requestId === requestIdRef.current;

    setStatus("loading");
    setError("");
    setPendingCarriers(carriersForRequest);
    setNotServedCarriers([]);

    const payload = {
      postalCode: parsedPostalCode,
      city,
      ...(isDomestic ? {} : { country: wantedCountry }),
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    let merged = null;
    let lastError = null;

    await Promise.all(
      carriersForRequest.map(async (carrier) => {
        try {
          const result = await getShippingQuote({ ...payload, carriers: [carrier] });

          if (isCurrent() && result?.notServed?.length) {
            setNotServedCarriers((current) => [...current, ...result.notServed]);
          }

          if (!isCurrent() || !result?.options?.length) {
            return;
          }

          const known = new Set((merged?.options || []).map((option) => option.id));
          merged = {
            ...(merged || result),
            options: sortByCarrier([
              ...(merged?.options || []),
              ...result.options.filter((option) => !known.has(option.id)),
            ]),
          };

          setQuote(merged);
          setDestination({ city, postalCode: parsedPostalCode, country: wantedCountry });
          setStatus("success");
          hasQuoteRef.current = true;
        } catch (err) {
          lastError = err;
        } finally {
          if (isCurrent()) {
            setPendingCarriers((current) => current.filter((c) => c !== carrier));
          }
        }
      })
    );

    if (!isCurrent()) {
      return;
    }

    // Erreur seulement si AUCUN transporteur n'a donne d'option.
    if (!merged) {
      setStatus("error");
      setError(lastError?.message || "QUOTE_FAILED");
      setQuote(null);
      setDestination(null);
      hasQuoteRef.current = false;
    }
  }

  // Re-run the quote automatically when the cart's contents change --
  // otherwise a shopper who adds a second kit *after* calculating
  // shipping would keep the price for the first kit all the way to
  // checkout (the number on screen, not what's billed -- the backend
  // always re-validates against the live cart -- but showing the wrong
  // number is confusing regardless). Debounced so a couple of quick
  // quantity clicks in a row only trigger one API call. Never fires
  // before a first successful quote exists for this destination.
  useEffect(() => {
    if (!hasQuoteRef.current) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      requestQuote();
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsSignature]);

  function resetQuote() {
    requestIdRef.current += 1;
    setPendingCarriers([]);
    setNotServedCarriers([]);
    setQuote(null);
    setDestination(null);
    setStatus("idle");
    setError("");
    hasQuoteRef.current = false;
  }

  return {
    postalCode,
    setPostalCode,
    country,
    setCountry,
    askCountry,
    status,
    quote,
    destination,
    error,
    pendingCarriers,
    notServedCarriers,
    requestQuote,
    resetQuote,
  };
}
