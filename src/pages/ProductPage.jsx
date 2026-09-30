import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { getProductBySlug } from "../api/panassorApi";
import {
  useCollections,
  useCollectionDetails,
} from "../context/CollectionsContext";
import { useLanguage } from "../context/LanguageContext";
import { useLocalizedUrl } from "../hooks/useLocalizedUrl";
import { getCollectionSlug, getProductSlug, t } from "../utils/localization";
import { getPageText } from "../utils/content";
import { getAssetUrl } from "../utils/assets";
import { productPageContent } from "../content/productPageContent";

import KitProductContainer from "../components/sections/Product/KitProductContainer";
import IndividualProductPage from "../components/sections/Product/IndividualProductPage";

const RETRY_DELAY_MS = 3000;

function getProductCollectionSlug(product, language = "fr") {
  if (!product) return "";

  if (language === "en") {
    return product.collection_slug_en || product.collection_slug_fr || "";
  }

  return product.collection_slug_fr || product.collection_slug_en || "";
}

function ProductPage() {
  const { slug } = useParams();
  const { language } = useLanguage();

  const copy = getPageText(productPageContent, language);

  const collections = useCollections();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const collectionSlug = getProductCollectionSlug(product, language);
  const { collection } = useCollectionDetails(collectionSlug);

  useLocalizedUrl(product?.id, `/produits/${slug}`, product && {
    fr: `/produits/${product.slug_fr}`,
    en: product.slug_en ? `/produits/${product.slug_en}` : "",
  });

  // Le produit déjà affiché, pour ne pas le recharger quand seule
  // l'adresse change de langue (slug FR <-> slug EN).
  const productRef = useRef(null);

  useEffect(() => {
    productRef.current = product;
  }, [product]);

  useEffect(() => {
    let isMounted = true;
    let retryTimeoutId = null;

    const shown = productRef.current;
    if (shown && (shown.slug_fr === slug || shown.slug_en === slug)) {
      return;
    }

    async function loadProduct() {
      try {
        setProduct(null);
        setNotFound(false);

        const productData = await getProductBySlug(slug);

        if (!isMounted) return;

        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product:", error);

        if (!isMounted) return;

        if (error.status === 404) {
          setNotFound(true);
          return;
        }

        retryTimeoutId = window.setTimeout(loadProduct, RETRY_DELAY_MS);
      }
    }

    loadProduct();

    return () => {
      isMounted = false;

      if (retryTimeoutId) {
        window.clearTimeout(retryTimeoutId);
      }
    };
  }, [slug]);

  if (notFound) {
    return <Navigate to="/collections" replace />;
  }

  if (!product || !collection) {
    return null;
  }

  const productSlug = getProductSlug(product, language);
  const collectionSlugCurrent = getCollectionSlug(collection, language);

  const relatedProducts = (collection.products ?? [])
    .filter((item) => getProductSlug(item, language) !== productSlug)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  const relatedCollections = collections.filter(
    (item) => getCollectionSlug(item, language) !== collectionSlugCurrent
  );

  if (!product.is_kit) {
    const productMedia = buildIndividualProductMedia(product, language);

    return (
      <IndividualProductPage
        product={product}
        collection={collection}
        productMedia={productMedia}
        relatedProducts={relatedProducts}
        copy={copy}
      />
    );
  }

  return (
    <KitProductContainer
      product={product}
      collection={collection}
      relatedCollections={relatedCollections}
      copy={copy}
    />
  );
}

function buildIndividualProductMedia(product, language) {
  const productName = t(product, "name", language);

  const defaultProductImage =
    product.images?.find((image) => image.is_main)?.url ??
    product.images?.[0]?.url ??
    product.image_url;

  return [
    {
      type: "image",
      src: getAssetUrl(defaultProductImage),
      alt: productName,
    },
    ...(product.images ?? [])
      .filter((image) => image.url !== defaultProductImage)
      .map((image) => ({
        type: "image",
        src: getAssetUrl(image.url),
        alt: t(image, "alt", language) || productName,
      })),
  ].filter((item) => item.src);
}

export default ProductPage;