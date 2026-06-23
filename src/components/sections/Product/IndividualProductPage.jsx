import { Link } from "react-router-dom";

import OrnamentDivider from "../../ui/OrnamentDivider";

import ProductMediaGallery from "./ProductMediaGallery";
import ProductNarrativeBanner from "./ProductNarrativeBanner";
import IndividualProductPanel from "./IndividualProductPanel";

import FeaturedProductsCarousel from "../HomePage/FeaturedProductsCarousel";

function IndividualProductPage({
  product,
  collection,
  productMedia,
  relatedProducts = [],
}) {
  if (!product || !collection) {
    return null;
  }

  const relatedCollection = {
    ...collection,
    title_fr: "Compléter la trousse",
    products: relatedProducts,
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080504] text-[#f3e7cf]">
      <section className="relative px-4 pt-9 pb-8 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(200,155,60,0.13),transparent_30%),radial-gradient(circle_at_18%_72%,rgba(6,40,24,0.34),transparent_34%),radial-gradient(circle_at_86%_68%,rgba(88,43,18,0.24),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,7,0.84),rgba(8,5,4,0.96)_32%,#080504)]" />

        <div className="relative mx-auto max-w-[88rem]">
          <nav
            aria-label="Fil d’Ariane"
            className="mb-7 flex min-w-0 items-center gap-3 overflow-x-auto whitespace-nowrap pb-1 font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.18em] text-[#a47b36] [scrollbar-width:none] md:mb-6 md:flex-wrap md:overflow-visible md:pb-0 md:text-[0.78rem] md:tracking-[0.2em] [&::-webkit-scrollbar]:hidden"
          >
            <Link
              to="/"
              className="hidden shrink-0 transition hover:text-[#c89b3c] md:inline"
            >
              Accueil
            </Link>

            <span className="hidden shrink-0 text-[#6f5423] md:inline">›</span>

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

            <span className="shrink-0 text-[#6f5423]">›</span>

            <span className="shrink-0 text-[#c89b3c]">
              {product.name_fr}
            </span>
          </nav>

          <div className="grid min-w-0 gap-8 lg:grid-cols-[1.42fr_0.72fr] lg:items-stretch">
            <div className="min-w-0">
              <ProductMediaGallery
                media={productMedia}
                productName={product.name_fr}
              />
            </div>

            <div className="min-w-0">
              <IndividualProductPanel
                product={product}
                collection={collection}
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

      <FeaturedProductsCarousel
        collection={relatedCollection}
        className="pt-20 pb-8"
        showCollectionButton={false}
      />

      <section className="relative px-4 pt-0 pb-8 md:px-6">
        <OrnamentDivider
          className="mx-auto max-w-[88rem]"
          width={288}
          opacity={0.65}
        />
      </section>

      <ProductNarrativeBanner collection={collection} />

      <section className="bg-[#080504] pb-24" />
    </main>
  );
}

export default IndividualProductPage;