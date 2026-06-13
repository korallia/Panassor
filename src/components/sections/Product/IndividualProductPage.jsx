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
  const relatedCollection = {
    ...collection,
    products: relatedProducts,
    productsSection: {
      eyebrow: `Collection ${collection.name}`,
      title: "Compléter la trousse",
    },
  };

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

            <IndividualProductPanel
              product={product}
              collection={collection}
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

      <FeaturedProductsCarousel
        collection={relatedCollection}
        className="pt-20 pb-8"
        showCollectionButton={false}
      />

      <section className="relative px-6 pt-0 pb-8">
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