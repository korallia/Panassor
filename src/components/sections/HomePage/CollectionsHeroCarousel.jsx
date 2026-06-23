import { useEffect, useMemo, useState } from "react";
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
}) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselCollections = useMemo(() => {
    if (!collections?.length) return [];

    const regularCollections = collections.filter(
      (collection) => !collection.featured
    );

    const featuredCollections = collections.filter(
      (collection) => collection.featured
    );

    return [...regularCollections, ...featuredCollections];
  }, [collections]);

  useEffect(() => {
    setActiveIndex(0);
  }, [carouselCollections.length]);

  if (!carouselCollections.length) return null;

  const activeCollection = carouselCollections[activeIndex];
  const titleWords = activeCollection.title_fr.split(" ");
  const collectionUrl =
    activeCollection.url || `/collections/${activeCollection.slug}`;

  const goToCollection = () => {
    navigate(collectionUrl);
  };

  const goPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? carouselCollections.length - 1 : current - 1
    );
  };

  const goNext = () => {
    setActiveIndex((current) =>
      current === carouselCollections.length - 1 ? 0 : current + 1
    );
  };

  const selectCollection = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="relative overflow-hidden bg-[#080504] px-4 pt-12 pb-24 text-[#f3e7cf] md:px-6 md:pb-32">
      <div className="relative mx-auto max-w-[88rem]">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <SectionTitle
            eyebrow={eyebrow}
            title={title}
            align="center"
            showDivider={false}
            className="mb-0"
          />

          <div className="mx-auto mt-6 h-px w-72 max-w-full bg-gradient-to-r from-transparent via-[#c89b3c]/85 to-transparent" />

          {description && (
            <p className="mx-auto mt-7 max-w-3xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/82">
              {description}
            </p>
          )}

          {description && (
            <OrnamentDivider className="mt-9" width={112} opacity={0.65} />
          )}
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          <div className="overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
            <button
              type="button"
              onClick={goToCollection}
              className="group relative block min-h-[30rem] w-full overflow-hidden text-center"
              aria-label={`Découvrir la collection ${activeCollection.name_fr}`}
            >
              <img
                key={activeCollection.hero_image_url}
                src={activeCollection.hero_image_url}
                alt={activeCollection.name_fr}
                className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.52] contrast-[1.12] saturate-[0.9] transition duration-500 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-[#080504]/24" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#080504]/68 via-[#080504]/22 to-[#080504]/86" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/58 via-transparent to-[#080504]/52" />

              <CornerFrame size="lg" />

              <div className="relative z-20 flex min-h-[30rem] flex-col justify-center px-5 py-12">
                <div className="mb-8 flex items-center justify-center gap-3 text-[#c89b3c]">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/70" />

                  <span className="whitespace-nowrap font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.22em] text-[#c89b3c]">
                    {activeCollection.eyebrow_fr}
                  </span>

                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/70" />
                </div>

                <h3 className="mx-auto w-full max-w-full font-['IM_Fell_English_SC'] text-[clamp(2.85rem,14vw,3.35rem)] font-normal uppercase leading-[0.88] tracking-[0.02em] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
                  {titleWords.map((word) => (
                    <span key={word} className="block">
                      {word}
                    </span>
                  ))}
                </h3>

                <div className="mx-auto mt-8 flex w-full max-w-[18rem] items-center justify-center gap-3 text-[#c89b3c]">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/70" />
                  <span className="text-lg">✦</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/70" />
                </div>
              </div>
            </button>

            <div className="relative border-t border-[#6f5423]/70 bg-[#080504]/92 px-6 pb-7 pt-6 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,155,60,0.1),transparent_45%)]" />

              <div className="relative z-10">
                <p className="mx-auto max-w-[31rem] font-['EB_Garamond'] text-[1.32rem] leading-7 text-[#d7c8ad]/86">
                  {activeCollection.description_fr}
                </p>

                <div className="mx-auto mt-7 flex max-w-[28rem] flex-col gap-3">
                  <button
                    type="button"
                    onClick={goToCollection}
                    className="inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-6 py-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
                  >
                    <span className="mr-3">✦</span>
                    Découvrir la collection
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/atelier")}
                    className="inline-flex w-full items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-6 py-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
                  >
                    Voir l’atelier
                  </button>
                </div>

                {carouselCollections.length > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-3">
                    {carouselCollections.map((collection, index) => (
                      <button
                        key={collection.id}
                        type="button"
                        onClick={() => selectCollection(index)}
                        className={`h-3 w-3 rounded-full border transition ${
                          index === activeIndex
                            ? "border-[#c89b3c] bg-[#c89b3c]"
                            : "border-[#c89b3c]/60 bg-transparent"
                        }`}
                        aria-label={`Voir la collection ${collection.name_fr}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="relative hidden min-h-[780px] overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)] md:block">
          <img
            key={activeCollection.hero_image_url}
            src={activeCollection.hero_image_url}
            alt={activeCollection.name_fr}
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
                  {activeCollection.eyebrow_fr}
                </p>

                <div className="hidden h-px w-16 bg-[#c89b3c] sm:block" />
              </div>

              <h3 className="font-['IM_Fell_English_SC'] text-6xl uppercase leading-[0.85] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-8xl">
                {activeCollection.title_fr}
              </h3>

              <div className="my-7 h-px w-52 bg-gradient-to-r from-[#c89b3c] to-transparent" />

              <p className="max-w-xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/90 md:text-3xl md:leading-10">
                {activeCollection.description_fr}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <GoldButton collection_url={collectionUrl} />
                <GreenButton />
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
            {carouselCollections.map((collection, index) => (
              <button
                key={collection.id}
                type="button"
                onClick={() => selectCollection(index)}
                className={`h-3 w-3 rounded-full border transition ${
                  index === activeIndex
                    ? "border-[#c89b3c] bg-[#c89b3c]"
                    : "border-[#c89b3c]/60 bg-transparent hover:bg-[#c89b3c]/40"
                }`}
                aria-label={`Voir la collection ${collection.name_fr}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollectionsHeroCarousel;