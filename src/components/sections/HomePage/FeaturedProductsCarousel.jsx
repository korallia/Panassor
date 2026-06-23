import { useRef } from "react";

import ProductCard from "../../ui/ProductCard";
import CarouselArrow from "../../ui/CarouselArrow";
import SectionTitle from "../../layout/SectionTitle";
import GoldButton from "../../ui/GoldButton";
import OrnamentDivider from "../../ui/OrnamentDivider";
import SectionAtmosphere from "../../layout/SectionAtmosphere";

function FeaturedProductsCarousel({
  collection,
  className = "py-20",
  showCollectionButton = true,
}) {
  const railRef = useRef(null);

  const scrollCarousel = (direction) => {
    railRef.current?.scrollBy({
      left: direction === "left" ? -520 : 520,
      behavior: "smooth",
    });
  };

  if (!collection?.products?.length) {
    return null;
  }

  return (
    <section
      className={`relative overflow-hidden bg-[#080504] px-6 text-[#f3e7cf] ${className} md:min-h-0`}
    >
      <SectionAtmosphere variant="featured" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="relative mb-10 md:mb-16">
          <SectionTitle
            eyebrow="Produits de la collection"
            title={collection.title_fr}
            align="center"
            showDivider={false}
          />

          <OrnamentDivider
            className="mt-6 mb-8 md:mb-12"
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

        <div className="relative left-1/2 w-screen -translate-x-1/2 md:left-auto md:w-auto md:translate-x-0">
          <div
            ref={railRef}
            className="flex h-[calc(100svh-16rem)] min-h-[34rem] snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scroll-smooth px-6 pb-6 [scrollbar-color:#c89b3c_#120c07] [scrollbar-width:thin] md:h-auto md:min-h-0 md:gap-6 md:px-0"
          >
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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