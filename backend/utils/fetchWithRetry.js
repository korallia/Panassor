// Thin wrapper around fetch() that adds a per-attempt timeout and a
// single retry on a transient failure (network error, or a 5xx gateway
// response). Added after seeing a one-off 504 from Canada Post's OAuth
// endpoint when called from the deployed server (Render) -- carriers'
// APIs occasionally hiccup for a moment, and without this a single blip
// killed the whole shipping quote for the shopper.

const DEFAULT_TIMEOUT_MS = 8000;

function isRetryableStatus(status) {
  return status >= 500 && status <= 599;
}

/**
 * @param {string} url
 * @param {RequestInit} [options]
 * @param {{timeoutMs?: number, retries?: number}} [config]
 */
export async function fetchWithRetry(url, options = {}, config = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, retries = 1 } = config;
  let lastNetworkError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);

      // Only retry a retryable status if we still have attempts left --
      // otherwise return the response as-is so the caller's existing
      // error-body parsing (reading data.message, etc.) still applies.
      if (isRetryableStatus(response.status) && attempt < retries) {
        continue;
      }

      return response;
    } catch (networkError) {
      clearTimeout(timeoutId);
      lastNetworkError = networkError;
      if (attempt >= retries) {
        throw networkError;
      }
      // else fall through and retry on the next loop iteration
    }
  }

  throw lastNetworkError;
}
