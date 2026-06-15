import { useRef } from "react";
import { useNavigate } from "react-router-dom";
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
   const navigate = useNavigate();
  const railRef = useRef(null);

  const scrollCarousel = (direction) => {
    railRef.current?.scrollBy({
      left: direction === "left" ? -520 : 520,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={`relative overflow-hidden bg-[#080504] px-6 text-[#f3e7cf] ${className}`}
    >
      <SectionAtmosphere variant="featured" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="relative mb-16">
          <SectionTitle
            eyebrow={collection.productsSection.eyebrow}
            title={collection.productsSection.title}
            align="center"
            showDivider={false}
          />

          <OrnamentDivider className="mt-6 mb-12" width={112} opacity={0.65} />

          <div className="flex justify-center gap-3 md:absolute md:right-0 md:top-[7.5rem]">
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

        {showCollectionButton && (
          <div className="mt-8 flex justify-center">
           <GoldButton onClick={() => navigate(collection.url)}>
              Voir toute la collection
            </GoldButton>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProductsCarousel;