import { env } from "../config/env.js";

export function normalizeLanguage(language) {
  return language === "en" ? "en" : "fr";
}

export function getBuyerLanguageKey(language) {
  const normalizedLanguage = normalizeLanguage(language);

  return normalizedLanguage === "en" ? "en-CA" : "fr-CA";
}

export function getRedirectUrl(language) {
  const normalizedLanguage = normalizeLanguage(language);
  const siteUrl = env.siteUrl;

  return normalizedLanguage === "en"
    ? `${siteUrl}/thank-you`
    : `${siteUrl}/merci`;
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