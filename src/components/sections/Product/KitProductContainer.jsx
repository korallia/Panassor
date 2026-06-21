import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import OrnamentDivider from "../../ui/OrnamentDivider";
import IndividualProductPage from "./IndividualProductPage";
import ProductMediaGallery from "./ProductMediaGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import ProductNarrativeBanner from "./ProductNarrativeBanner";
import CollectionsHeroCarousel from "../HomePage/CollectionsHeroCarousel";

function KitProductContainer() {
  const { slug } = useParams();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [collection, setCollection] = useState(null);
  const [collections, setCollections] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProductPage() {
      setProduct(null);
      setCollection(null);
      setNotFound(false);
      setSelectedColorIndex(0);

      const productResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${slug}`)

      if (productResponse.status === 404) {
        setNotFound(true);
        return;
      }

      const productData = await productResponse.json();

      const collectionResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/collections/${productData.collection_slug}`
      );

      const collectionData = await collectionResponse.json();

      const collectionsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/collections`)

      const collectionsData = await collectionsResponse.json();

      setProduct(productData);
      setCollection(collectionData);
      setCollections(collectionsData);
    }

    loadProductPage();
  }, [slug]);

  if (notFound) {
    return <Navigate to="/collections" replace />;
  }

  if (!product || !collection) {
    return null;
  }

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
      : collection.products.filter((item) => !item.is_kit);

  const customizableItems = kitItems.filter((item) => item.customizable);

  const leatherColors = [
    { name: "Brun foncé", value: "#2a160c" },
    { name: "Bordeaux", value: "#401918" },
    { name: "Noir", value: "#141414" },
  ];

  const relatedProducts = collection.products
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
        productMedia={productMedia}
        relatedProducts={relatedProducts}
      />
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080504] text-[#f3e7cf]">
      <section className="relative px-6 pt-9 pb-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(200,155,60,0.13),transparent_30%),radial-gradient(circle_at_18%_72%,rgba(6,40,24,0.34),transparent_34%),radial-gradient(circle_at_86%_68%,rgba(88,43,18,0.24),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,7,0.84),rgba(8,5,4,0.96)_32%,#080504)]" />

        <div className="relative mx-auto max-w-[88rem]">
          <nav className="mb-6 flex flex-wrap items-center gap-2 font-['IM_Fell_English_SC'] text-[0.78rem] uppercase tracking-[0.2em] text-[#a47b36]">
            <Link to="/" className="transition hover:text-[#c89b3c]">
              Accueil
            </Link>

            <span className="text-[#6f5423]">›</span>

            <Link to="/boutique" className="transition hover:text-[#c89b3c]">
              Boutique
            </Link>

            <span className="text-[#6f5423]">›</span>

            <Link to={collection.url} className="transition hover:text-[#c89b3c]">
              {collection.name_fr}
            </Link>

            <span className="text-[#6f5423]">›</span>

            <span className="text-[#c89b3c]">{product.name_fr}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.42fr_0.72fr] lg:items-stretch">
            <ProductMediaGallery
              key={selectedColorIndex}
              media={productMedia}
              productName={product.name_fr}
            />

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
      </section>

      <section className="relative px-6 pt-10 pb-8">
        <OrnamentDivider
          className="mx-auto max-w-[88rem]"
          width={288}
          opacity={0.65}
        />
      </section>

      <ProductNarrativeBanner collection={collection} />

      <section className="relative px-6 pt-8 pb-8">
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