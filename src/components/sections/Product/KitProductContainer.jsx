import { Link, Navigate, useParams } from "react-router-dom";

import OrnamentDivider from "../../ui/OrnamentDivider";
import IndividualProductPage from "./IndividualProductPage";
import ProductMediaGallery from "./ProductMediaGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import ProductNarrativeBanner from "./ProductNarrativeBanner";

import { collectionsList } from "../../../data/panassorCollections";

import CollectionsHeroCarousel from "../HomePage/CollectionsHeroCarousel";

function KitProductContainer() {
  const { slug } = useParams();

  let productMatch = null;

  for (const collection of collectionsList) {
    const product = collection.products.find((item) => item.slug === slug);

    if (product) {
      productMatch = { product, collection };
      break;
    }
  }

  if (!productMatch) {
    return <Navigate to="/collections" replace />;
  }

  const { product, collection } = productMatch;

  const productMedia = [
    {
      type: "image",
      src: product.image,
      alt: product.name,
    },
    ...(product.gallery ?? []).map((image) => ({
      type: "image",
      src: image,
      alt: product.name,
    })),
    ...(collection.video?.src
      ? [
          {
            type: "video",
            src: collection.video.src,
            poster: collection.video.poster,
            alt: collection.video.title ?? "Vidéo du produit",
          },
        ]
      : []),
    {
      type: "image",
      src: collection.heroImage,
      alt: collection.name,
    },
    {
      type: "image",
      src: collection.thumbnail,
      alt: collection.name,
    },
  ].filter((item) => item.src);

  const kitItems = collection.products.filter((item) => !item.featured);

  const customizableItems = kitItems.filter((item) => item.customizable);

  const leatherColors = product.leatherColors ?? [
    { name: "Brun foncé", value: "#2a160c" },
    { name: "Bordeaux", value: "#401918" },
    { name: "Noir", value: "#141414" },
  ];

  const relatedProducts = collection.products
    .filter((item) => item.slug !== product.slug)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  const relatedCollections = collectionsList.filter(
    (item) => item.slug !== collection.slug
  );

  if (!product.featured) {
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
              {collection.name}
            </Link>

            <span className="text-[#6f5423]">›</span>

            <span className="text-[#c89b3c]">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.42fr_0.72fr] lg:items-stretch">
            <ProductMediaGallery
              media={productMedia}
              productName={product.name}
            />

            <ProductPurchasePanel
              product={product}
              collection={collection}
              leatherColors={leatherColors}
              customizableItems={customizableItems}
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