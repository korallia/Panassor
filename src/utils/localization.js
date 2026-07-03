export function t(item, field, language = "fr") {
  if (!item) return "";

  const localizedValue = item[`${field}_${language}`];
  const fallbackValue = item[`${field}_fr`];
  const baseValue = item[field];

  return localizedValue || fallbackValue || baseValue || "";
}

export function getCollectionSlug(collection, language = "fr") {
  if (!collection) return "";

  if (language === "en") {
    return collection.slug_en || collection.slug_fr || collection.slug || "";
  }

  return collection.slug_fr || collection.slug || collection.slug_en || "";
}

export function getProductSlug(product, language = "fr") {
  if (!product) return "";

  if (language === "en") {
    return product.slug_en || product.slug_fr || product.slug || "";
  }

  return product.slug_fr || product.slug || product.slug_en || "";
}

export function getCollectionUrl(collection, language = "fr") {
  if (!collection) return "/collections";

  if (language === "en") {
    if (collection.url_en) return collection.url_en;

    const slug = getCollectionSlug(collection, language);
    return slug ? `/collections/${slug}` : "/collections";
  }

  if (collection.url) return collection.url;

  const slug = getCollectionSlug(collection, language);
  return slug ? `/collections/${slug}` : "/collections";
}

export function getProductUrl(product, language = "fr") {
  if (!product) return "/produits";

  const slug = getProductSlug(product, language);

  return slug ? `/produits/${slug}` : "/produits";
}