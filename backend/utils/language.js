export function normalizeLanguage(language) {
  return language === "en" ? "en" : "fr";
}

export function getBuyerLanguageKey(language) {
  const normalizedLanguage = normalizeLanguage(language);

  return normalizedLanguage === "en" ? "en-CA" : "fr-CA";
}

export function getThankYouPath(language) {
  const normalizedLanguage = normalizeLanguage(language);

  return normalizedLanguage === "en" ? "/thank-you" : "/merci";
}

export function getLocalizedValue(source, baseKey, language = "fr") {
  if (!source) {
    return "";
  }

  const normalizedLanguage = normalizeLanguage(language);
  const localizedKey = `${baseKey}_${normalizedLanguage}`;
  const fallbackLocalizedKey =
    normalizedLanguage === "en" ? `${baseKey}_fr` : `${baseKey}_en`;

  return (
    source[localizedKey] ||
    source[baseKey] ||
    source[fallbackLocalizedKey] ||
    ""
  );
}