const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    const error = new Error(
      errorBody?.message || `API request failed: ${response.status}`
    );

    error.status = response.status;
    error.errors = errorBody?.errors || [];

    throw error;
  }

  return response.json();
}

export function getCollections() {
  return request("/api/collections");
}

export function getComingSoonCollections() {
  return request("/api/collections/coming-soon");
}

export function getCollectionBySlug(slug) {
  return request(`/api/collections/${slug}`);
}

export function getProducts() {
  return request("/api/products");
}

export function getProductBySlug(slug) {
  return request(`/api/products/${slug}`);
}

export function getCustomizableProducts() {
  return request("/api/products/customizable");
}

export function getAtelierVideos() {
  return request("/api/atelier/videos");
}

export function createCheckout(payload) {
  return request("/api/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export function getOrderSummary(orderId, key) {
  const params = new URLSearchParams();

  if (key) {
    params.set("key", key);
  }

  return request(`/api/orders/${orderId}/summary?${params.toString()}`);
}

export function syncSquareOrder(orderId, key) {
  const params = new URLSearchParams();

  if (key) {
    params.set("key", key);
  }

  return request(`/api/orders/${orderId}/sync-square?${params.toString()}`, {
    method: "POST",
  });
}