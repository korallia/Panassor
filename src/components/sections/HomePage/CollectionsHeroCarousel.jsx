import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../../layout/SectionTitle";
import CornerFrame from "../../ui/CornerFrame";
import GoldButton from "../../ui/GoldButton";
import GreenButton from "../../ui/GreenButton";
import CarouselArrow from "../../ui/CarouselArrow";
import OrnamentDivider from "../../ui/OrnamentDivider";

function CollectionsHeroCarousel({
  collections,
  eyebrow = "Explorer Panassor",
  title = "Nos collections",
  description,
  secondaryHref = "#produits",
  secondaryLabel = "Voir tous les produits",
}) {
   const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!collections?.length) return null;

  const activeCollection = collections[activeIndex];

  const goPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? collections.length - 1 : current - 1
    );
  };

  const goNext = () => {
    setActiveIndex((current) =>
      current === collections.length - 1 ? 0 : current + 1
    );
  };

  const selectCollection = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="relative overflow-hidden bg-[#080504] px-6 pt-12 pb-32 text-[#f3e7cf]">
      <div className="relative mx-auto max-w-[88rem]">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <SectionTitle
            eyebrow={eyebrow}
            title={title}
            align="center"
            showDivider={false}
            className="mb-0"
          />
           <div className="mx-auto mt-6 h-px w-72 bg-gradient-to-r from-transparent via-[#c89b3c]/85 to-transparent" />
          {description && (
            <p className="mx-auto mt-7 max-w-3xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/82">
              {description}
            </p>
          )}

          {description && (
            <OrnamentDivider
              className="mt-9"
              width={112}
              opacity={0.65}
            />
          )}
        </div>

        <div className="relative min-h-[780px] overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
          <img
            key={activeCollection.image}
            src={activeCollection.image}
            alt={activeCollection.name}
            className="absolute inset-0 h-full w-full object-cover brightness-[0.65] contrast-[1.12] saturate-[0.9] transition-opacity duration-700"
          />

          <div className="absolute inset-0 bg-[#080504]/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/95 via-[#080504]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/85 via-transparent to-[#080504]/50" />

          <CornerFrame size="lg" />

          <div className="relative z-10 flex min-h-[780px] items-center px-8 py-16 md:px-16">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-4">
                <div className="h-px w-16 bg-[#c89b3c]" />

                <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
                  {activeCollection.eyebrow}
                </p>

                <div className="hidden h-px w-16 bg-[#c89b3c] sm:block" />
              </div>

              <h3 className="font-['IM_Fell_English_SC'] text-6xl uppercase leading-[0.85] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-8xl">
                {activeCollection.title}
              </h3>

              <div className="my-7 h-px w-52 bg-gradient-to-r from-[#c89b3c] to-transparent" />

              <p className="max-w-xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/90 md:text-3xl md:leading-10">
                {activeCollection.description}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <GoldButton onClick={() => navigate(activeCollection.url)}>
                  {activeCollection.cta}
                </GoldButton>

                <GreenButton onClick={() => navigate(secondaryHref)}>
                  {secondaryLabel}
                </GreenButton>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
            <CarouselArrow
              direction="previous"
              onClick={goPrevious}
              label="Collection précédente"
            />

            <CarouselArrow
              direction="next"
              onClick={goNext}
              label="Collection suivante"
            />
          </div>

          <div className="absolute bottom-9 left-1/2 z-20 flex -translate-x-1/2 gap-3">
            {collections.map((collection, index) => (
              <button
                key={collection.id}
                type="button"
                onClick={() => selectCollection(index)}
                className={`h-3 w-3 rounded-full border transition ${
                  index === activeIndex
                    ? "border-[#c89b3c] bg-[#c89b3c]"
                    : "border-[#c89b3c]/60 bg-transparent hover:bg-[#c89b3c]/40"
                }`}
                aria-label={`Voir la collection ${collection.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollectionsHeroCarousel;