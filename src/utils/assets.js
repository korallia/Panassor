// src/utils/assets.js

const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || "";

function isExternalUrl(value) {
  return /^https?:\/\//i.test(value || "");
}

export function getAssetUrl(path) {
  if (!path) {
    return "";
  }

  if (isExternalUrl(path)) {
    return path;
  }

  if (!ASSETS_BASE_URL) {
    return path;
  }

  const cleanBaseUrl = ASSETS_BASE_URL.replace(/\/$/, "");
  const cleanPath = String(path).startsWith("/") ? path : `/${path}`;

  return `${cleanBaseUrl}${cleanPath}`;
}