import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { getProductBySlug } from "../../backend/panassorApi";
import {
  useCollections,
  useCollectionDetails,
} from "../context/CollectionsContext";

import KitProductContainer from "../components/sections/Product/KitProductContainer";
import IndividualProductPage from "../components/sections/Product/IndividualProductPage";

const RETRY_DELAY_MS = 3000;

function ProductPage() {
  const { slug } = useParams();

  const collections = useCollections();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const { collection } = useCollectionDetails(product?.collection_slug);

  useEffect(() => {
    let isMounted = true;
    let retryTimeoutId = null;

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

  const relatedProducts = (collection.products ?? [])
    .filter((item) => item.slug !== product.slug)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  const relatedCollections = collections.filter(
    (item) => item.slug !== collection.slug
  );

  if (!product.is_kit) {
    return (
      <IndividualProductPage
        product={product}
        collection={collection}
        productMedia={buildProductMedia(product, collection)}
        relatedProducts={relatedProducts}
      />
    );
  }

  return (
    <KitProductContainer
      product={product}
      collection={collection}
      relatedCollections={relatedCollections}
    />
  );
}

function buildProductMedia(product, collection) {
  const defaultProductImage =
    product.images?.find((image) => image.is_main)?.url ??
    product.images?.[0]?.url ??
    product.image_url;

  return [
    {
      type: "image",
      src: defaultProductImage,
      alt: product.name_fr,
    },
    ...(product.images ?? [])
      .filter((image) => image.url !== defaultProductImage)
      .map((image) => ({
        type: "image",
        src: image.url,
        alt: image.alt_fr ?? product.name_fr,
      })),
    ...(collection.video_url
      ? [
          {
            type: "video",
            src: collection.video_url,
            poster: collection.video_poster_url,
            alt: collection.title_fr ?? "Vidéo du produit",
          },
        ]
      : []),
    {
      type: "image",
      src: collection.hero_image_url,
      alt: collection.name_fr,
    },
    {
      type: "image",
      src: collection.thumbnail_image_url,
      alt: collection.name_fr,
    },
  ].filter((item) => item.src);
}

export default ProductPage;