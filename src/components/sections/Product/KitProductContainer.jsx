import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import {
  getCollectionUrl,
  getProductSlug,
  t,
} from "../../../utils/localization";
import { getAssetUrl } from "../../../utils/assets";

import OrnamentDivider from "../../ui/OrnamentDivider";
import ProductMediaGallery from "./ProductMediaGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import ProductNarrativeBanner from "./ProductNarrativeBanner";
import CollectionsHeroCarousel from "../HomePage/CollectionsHeroCarousel";

function isUsableVideoUrl(value) {
  if (!value) return false;
  const url = String(value).trim();
  if (!url) return false;
  const invalidValues = ["null", "undefined", "false", "none"];
  if (invalidValues.includes(url.toLowerCase())) return false;
  return url.startsWith("http") || url.startsWith("/videos/");
}

function KitProductContainer({
  product,
  collection,
  relatedCollections = [],
  copy,
}) {
  const { language } = useLanguage();

  const productSlug = getProductSlug(product, language);
  const productName = t(product, "name", language);
  const collectionName = t(collection, "name", language);
  const collectionTitle = t(collection, "title", language);
  const collectionUrl = getCollectionUrl(collection, language);

  // Les couleurs viennent directement de la BDD via l'API
  const availableColors = useMemo(() => {
    return product.colors ?? [];
  }, [product]);

  const defaultColorId = useMemo(() => {
    const mainImage = product.images?.find((image) => image.is_main) || product.images?.[0];
    return mainImage?.color_id || availableColors[0]?.id || null;
  }, [product.images, availableColors]);

  const [selectedColorId, setSelectedColorId] = useState(defaultColorId);

  useEffect(() => {
    if (defaultColorId) {
      setSelectedColorId(defaultColorId);
    }
  }, [productSlug, defaultColorId]);

  const activeColorId = selectedColorId || defaultColorId;

  const selectedColorIndex = Math.max(
    availableColors.findIndex((color) => color.id === activeColorId),
    0
  );

  const leatherColors = availableColors.map((color) => {
    const priceDeltaCents = Number(color.price_delta_cents || 0);
    const basePriceCents = Number(product.price_cents || 0);
    const finalPriceCents = basePriceCents + priceDeltaCents;

    return {
      id: color.id,
      name: language === "en" ? color.name_en : color.name_fr,
      name_fr: color.name_fr,
      name_en: color.name_en,
      value: color.hex_code,
      priceDeltaCents,
      finalPriceCents,
    };
  });

  // Filtrage des images par le color_id de la BDD
  const colorImages =
    activeColorId && product.images?.length
      ? product.images.filter((image) => image.color_id === activeColorId)
      : [];

  const visibleImages =
    colorImages.length > 0 ? colorImages : product.images ?? [];

  const defaultProductImage =
    visibleImages.find((image) => image.is_main)?.url ??
    visibleImages[0]?.url ??
    product.image_url;

  const collectionVideoUrl = isUsableVideoUrl(collection.video_url)
    ? collection.video_url.trim()
    : "";

  const collectionVideoPoster = collection.video_poster_url?.trim() || "";

  const productMedia = [
    {
      type: "image",
      src: getAssetUrl(defaultProductImage),
      alt: productName,
    },
    ...visibleImages
      .filter((image) => image.url !== defaultProductImage)
      .map((image) => ({
        type: "image",
        src: getAssetUrl(image.url),
        alt: t(image, "alt", language) || productName,
      })),
    ...(collectionVideoUrl
      ? [
          {
            type: "video",
            src: getAssetUrl(collectionVideoUrl),
            poster: getAssetUrl(collectionVideoPoster),
            alt: copy.media?.productVideo || (language === "en" ? "Product video" : "Vidéo du produit"),
            title: collectionTitle || productName,
          },
        ]
      : []),
  ].filter((item) => item.src);

  const kitItems =
    product.kit_items?.length > 0
      ? product.kit_items
      : (collection.products ?? []).filter((item) => !item.is_kit);

  const customizableItems = kitItems.filter((item) => item.customizable);

  const handleSelectColor = (index) => {
    const selectedColor = availableColors[index];
    if (!selectedColor) return;
    setSelectedColorId(selectedColor.id);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080504] text-[#f3e7cf]">
      <section className="relative px-4 pt-9 pb-8 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(200,155,60,0.13),transparent_30%),radial-gradient(circle_at_18%_72%,rgba(6,40,24,0.34),transparent_34%),radial-gradient(circle_at_86%_68%,rgba(88,43,18,0.24),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,7,0.84),rgba(8,5,4,0.96)_32%,#080504)]" />

        <div className="relative mx-auto max-w-[88rem]">
          <nav
            aria-label={copy.breadcrumbs.ariaLabel}
            className="mb-7 flex min-w-0 items-center gap-3 overflow-x-auto whitespace-nowrap pb-1 font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.18em] text-[#a47b36] [scrollbar-width:none] md:mb-6 md:flex-wrap md:overflow-visible md:pb-0 md:text-[0.78rem] md:tracking-[0.2em] [&::-webkit-scrollbar]:hidden"
          >
            <Link to="/" className="hidden shrink-0 transition hover:text-[#c89b3c] md:inline">
              {copy.breadcrumbs.home}
            </Link>
            <span className="hidden shrink-0 text-[#6f5423] md:inline">›</span>
            <Link to="/produits" className="shrink-0 transition hover:text-[#c89b3c]">
              {copy.breadcrumbs.products}
            </Link>
            <span className="shrink-0 text-[#6f5423]">›</span>
            <Link to={collectionUrl} className="shrink-0 transition hover:text-[#c89b3c]">
              {collectionName}
            </Link>
            <span className="shrink-0 text-[#6f5423]">›</span>
            <span className="shrink-0 text-[#c89b3c]">{productName}</span>
          </nav>

          <div className="grid min-w-0 gap-8 lg:grid-cols-[1.42fr_0.72fr] lg:items-stretch">
            <div className="min-w-0">
              <ProductMediaGallery
                key={activeColorId || productSlug}
                media={productMedia}
                productName={productName}
              />
            </div>

            <div className="min-w-0">
              <ProductPurchasePanel
                product={product}
                collection={collection}
                productImageUrl={getAssetUrl(defaultProductImage)}
                leatherColors={leatherColors}
                customizableItems={customizableItems}
                selectedColorIndex={selectedColorIndex}
                onSelectColor={handleSelectColor}
                copy={copy.purchasePanel}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pt-10 pb-8 md:px-6">
        <OrnamentDivider className="mx-auto max-w-[88rem]" width={288} opacity={0.65} />
      </section>

      <ProductNarrativeBanner collection={collection} copy={copy.narrativeBanner} />

      <section className="relative px-4 pt-8 pb-8 md:px-6">
        <OrnamentDivider className="mx-auto max-w-[88rem]" width={288} opacity={0.65} />
      </section>

      <CollectionsHeroCarousel collections={relatedCollections} copy={copy.relatedCollections} />
    </main>
  );
}

export default KitProductContainer;