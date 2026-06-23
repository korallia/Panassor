import { useRef } from "react";

import ProductCard from "../../ui/ProductCard";
import CarouselArrow from "../../ui/CarouselArrow";
import SectionTitle from "../../layout/SectionTitle";
import GoldButton from "../../ui/GoldButton";
import OrnamentDivider from "../../ui/OrnamentDivider";
import SectionAtmosphere from "../../layout/SectionAtmosphere";

function FeaturedProductsCarousel({
  collection,
  className = "pt-20 pb-8 md:py-20",
  showCollectionButton = true,
}) {
  const desktopRailRef = useRef(null);

  const scrollCarousel = (direction) => {
    desktopRailRef.current?.scrollBy({
      left: direction === "left" ? -520 : 520,
      behavior: "smooth",
    });
  };

  if (!collection?.products?.length) {
    return null;
  }

  return (
    <section
      className={`relative overflow-hidden bg-[#080504] px-6 text-[#f3e7cf] ${className}`}
    >
      <SectionAtmosphere variant="featured" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="relative mb-16">
          <SectionTitle
            eyebrow="Produits de la collection"
            title={collection.title_fr}
            align="center"
            showDivider={false}
          />

          <OrnamentDivider
            className="mt-6 mb-12"
            width={112}
            opacity={0.65}
          />

          <div className="hidden justify-center gap-3 md:absolute md:right-0 md:top-[7.5rem] md:flex">
            <CarouselArrow
              direction="previous"
              onClick={() => scrollCarousel("left")}
              label="Produits précédents"
            />

            <CarouselArrow
              direction="next"
              onClick={() => scrollCarousel("right")}
              label="Produits suivants"
            />
          </div>
        </div>

        {/* MOBILE: une carte par écran */}
        <div className="relative left-1/2 w-screen -translate-x-1/2 md:hidden">
          <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-6 [scrollbar-color:#c89b3c_#120c07] [scrollbar-width:thin]">
            {collection.products.map((product) => (
              <div
                key={product.id}
                className="w-screen shrink-0 snap-center px-6"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP: ancien comportement */}
        <div
          ref={desktopRailRef}
          className="hidden snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-color:#c89b3c_#120c07] [scrollbar-width:thin] md:flex"
        >
          {collection.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {showCollectionButton && (
          <div className="mt-8 hidden justify-center md:flex">
            <GoldButton collection_url={collection.url} />
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProductsCarousel;