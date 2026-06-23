import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import OrnamentDivider from "../../ui/OrnamentDivider";
import ProductMediaGallery from "./ProductMediaGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import ProductNarrativeBanner from "./ProductNarrativeBanner";
import CollectionsHeroCarousel from "../HomePage/CollectionsHeroCarousel";

function KitProductContainer({ product, collection, relatedCollections = [] }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  useEffect(() => {
    setSelectedColorIndex(0);
  }, [product.slug]);

  const defaultProductImage =
    product.images?.find((image) => image.is_main)?.url ??
    product.images?.[0]?.url ??
    product.image_url;

  const kitImagesByColor =
    product.slug === "kit-chirurgien"
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
      alt: product.name_fr,
    },
    ...(product.images ?? [])
      .filter((image) => image.url !== mainProductImage)
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

  const kitItems =
    product.kit_items?.length > 0
      ? product.kit_items
      : (collection.products ?? []).filter((item) => !item.is_kit);

  const customizableItems = kitItems.filter((item) => item.customizable);

  const leatherColors = [
    { name: "Brun foncé", value: "#2a160c" },
    { name: "Bordeaux", value: "#401918" },
    { name: "Noir", value: "#141414" },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#080504] text-[#f3e7cf]">
      <section className="relative px-4 pt-9 pb-8 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(200,155,60,0.13),transparent_30%),radial-gradient(circle_at_18%_72%,rgba(6,40,24,0.34),transparent_34%),radial-gradient(circle_at_86%_68%,rgba(88,43,18,0.24),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,7,0.84),rgba(8,5,4,0.96)_32%,#080504)]" />

        <div className="relative mx-auto max-w-[88rem]">
          <div className="mb-7">
            <nav
              aria-label="Fil d’Ariane"
              className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 font-['IM_Fell_English_SC'] text-[0.68rem] uppercase tracking-[0.18em] text-[#a47b36] md:text-[0.78rem] md:tracking-[0.2em]"
            >
              <Link
                to="/"
                className="shrink-0 transition hover:text-[#c89b3c]"
              >
                Accueil
              </Link>

              <span className="shrink-0 text-[#6f5423]">›</span>

              <Link
                to="/produits"
                className="shrink-0 transition hover:text-[#c89b3c]"
              >
                Produits
              </Link>

              <span className="shrink-0 text-[#6f5423]">›</span>

              <Link
                to={`/collections/${collection.slug}`}
                className="shrink-0 transition hover:text-[#c89b3c]"
              >
                {collection.name_fr}
              </Link>
            </nav>

            <div className="mt-4 flex items-center gap-3 text-[#c89b3c]">
              <div className="h-px w-12 bg-gradient-to-r from-[#c89b3c]/70 to-transparent" />

              <p className="font-['IM_Fell_English_SC'] text-[0.78rem] uppercase tracking-[0.22em] text-[#c89b3c] md:text-sm">
                {product.name_fr}
              </p>
            </div>
          </div>

          <div className="grid min-w-0 gap-8 lg:grid-cols-[1.42fr_0.72fr] lg:items-stretch">
            <div className="min-w-0">
              <ProductMediaGallery
                key={selectedColorIndex}
                media={productMedia}
                productName={product.name_fr}
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
        eyebrow="Explorer le reste de Panassor"
        title="D’autres univers à faire vivre"
      />
    </main>
  );
}

export default KitProductContainer;