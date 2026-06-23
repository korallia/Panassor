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
      className={`relative overflow-hidden bg-[#080504] text-[#f3e7cf] ${className}`}
    >
      <SectionAtmosphere variant="featured" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="relative mb-7 px-6 md:mb-16 md:px-0">
          <div className="hidden md:block">
            <SectionTitle
              eyebrow="Produits de la collection"
              title={collection.title_fr}
              align="center"
              showDivider={false}
            />
          </div>

          <div className="md:hidden">
            <p className="text-center font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
              Produits de la collection
            </p>
          </div>

          <OrnamentDivider
            className="mt-5 mb-0 md:mt-6 md:mb-12"
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
            className="flex h-[calc(100svh-11rem)] min-h-[38rem] snap-x snap-mandatory overflow-x-auto scroll-smooth pb-5 [scrollbar-color:#c89b3c_#120c07] [scrollbar-width:thin] md:h-auto md:min-h-0 md:gap-6 md:pb-6"
          >
            {collection.products.map((product) => (
              <div
                key={product.id}
                className="flex h-full w-screen shrink-0 snap-center px-4 md:h-auto md:w-auto md:px-0"
              >
                <div className="h-full w-full [&>*]:h-full [&>*]:w-full">
                  <ProductCard product={product} />
                </div>
              </div>
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