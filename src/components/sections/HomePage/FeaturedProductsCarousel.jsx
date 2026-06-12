import { useRef } from "react";

import ProductCard from "../../ui/ProductCard";
import CarouselArrow from "../../ui/CarouselArrow";
import SectionTitle from "../../ui/SectionTitle";
import GoldButton from "../../ui/GoldButton";

function FeaturedProductsCarousel({ collection }) {
  const railRef = useRef(null);

  const scrollCarousel = (direction) => {
    railRef.current?.scrollBy({
      left: direction === "left" ? -520 : 520,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#080504] px-6 py-20 text-[#f3e7cf]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,155,60,0.12),transparent_38%)]" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow={collection.productsSection.eyebrow}
            title={collection.productsSection.title}
          />

          <div className="flex items-center gap-3">
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

        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-color:#c89b3c_#120c07] [scrollbar-width:thin]"
        >
          {collection.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <GoldButton href={collection.url}>Voir toute la collection</GoldButton>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsCarousel;