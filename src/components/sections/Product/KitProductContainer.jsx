import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import {
  getCollectionUrl,
  getProductSlug,
  t,
} from "../../../utils/localization";

import OrnamentDivider from "../../ui/OrnamentDivider";
import ProductMediaGallery from "./ProductMediaGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import ProductNarrativeBanner from "./ProductNarrativeBanner";
import CollectionsHeroCarousel from "../HomePage/CollectionsHeroCarousel";

function KitProductContainer({
  product,
  collection,
  relatedCollections = [],
  copy,
}) {
  const { language } = useLanguage();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const productSlug = getProductSlug(product, language);
  const productName = t(product, "name", language);
  const collectionName = t(collection, "name", language);
  const collectionTitle = t(collection, "title", language);
  const collectionUrl = getCollectionUrl(collection, language);

  useEffect(() => {
    setSelectedColorIndex(0);
  }, [productSlug]);

  const defaultProductImage =
    product.images?.find((image) => image.is_main)?.url ??
    product.images?.[0]?.url ??
    product.image_url;

  const kitImagesByColor =
    product.slug_fr === "kit-chirurgien"
      ? [
          "/images/hero-kit-chirurgien.jpg",
          "/images/PlaceHolderRouge.png",
          "/images/PlaceHolderNoir.png",
        ]
      : [];

  const mainProductImage =
    kitImagesByColor[selectedColorIndex] ?? defaultProductImage;

  const productMedia = [
    {
      type: "image",
      src: mainProductImage,
      alt: productName,
    },
    ...(product.images ?? [])
      .filter((image) => image.url !== mainProductImage)
      .map((image) => ({
        type: "image",
        src: image.url,
        alt: t(image, "alt", language) || productName,
      })),
    ...(collection.video_url
      ? [
          {
            type: "video",
            src: collection.video_url,
            poster: collection.video_poster_url,
            alt: collectionTitle || copy.media.productVideo,
          },
        ]
      : []),
    {
      type: "image",
      src: collection.hero_image_url,
      alt: collectionName,
    },
    {
      type: "image",
      src: collection.thumbnail_image_url,
      alt: collectionName,
    },
  ].filter((item) => item.src);

  const kitItems =
    product.kit_items?.length > 0
      ? product.kit_items
      : (collection.products ?? []).filter((item) => !item.is_kit);

  const customizableItems = kitItems.filter((item) => item.customizable);

  const leatherColors = [
    { name: copy.leatherColors.darkBrown, value: "#2a160c" },
    { name: copy.leatherColors.burgundy, value: "#401918" },
    { name: copy.leatherColors.black, value: "#141414" },
  ];

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
            <Link
              to="/"
              className="hidden shrink-0 transition hover:text-[#c89b3c] md:inline"
            >
              {copy.breadcrumbs.home}
            </Link>

            <span className="hidden shrink-0 text-[#6f5423] md:inline">›</span>

            <Link
              to="/produits"
              className="shrink-0 transition hover:text-[#c89b3c]"
            >
              {copy.breadcrumbs.products}
            </Link>

            <span className="shrink-0 text-[#6f5423]">›</span>

            <Link
              to={collectionUrl}
              className="shrink-0 transition hover:text-[#c89b3c]"
            >
              {collectionName}
            </Link>

            <span className="shrink-0 text-[#6f5423]">›</span>

            <span className="shrink-0 text-[#c89b3c]">{productName}</span>
          </nav>

          <div className="grid min-w-0 gap-8 lg:grid-cols-[1.42fr_0.72fr] lg:items-stretch">
            <div className="min-w-0">
              <ProductMediaGallery
                key={selectedColorIndex}
                media={productMedia}
                productName={productName}
              />
            </div>

            <div className="min-w-0">
              <ProductPurchasePanel
                product={product}
                collection={collection}
                leatherColors={leatherColors}
                customizableItems={customizableItems}
                selectedColorIndex={selectedColorIndex}
                onSelectColor={setSelectedColorIndex}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pt-10 pb-8 md:px-6">
        <OrnamentDivider
          className="mx-auto max-w-[88rem]"
          width={288}
          opacity={0.65}
        />
      </section>

      <ProductNarrativeBanner collection={collection} />

      <section className="relative px-4 pt-8 pb-8 md:px-6">
        <OrnamentDivider
          className="mx-auto max-w-[88rem]"
          width={288}
          opacity={0.65}
        />
      </section>

      <CollectionsHeroCarousel
        collections={relatedCollections}
        copy={copy.relatedCollections}
      />
    </main>
  );
}

export default KitProductContainer;