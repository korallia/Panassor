import {  useState } from "react";

const collections = [
  {
    id: 1,
    name: "Tortionnaire",
    eyebrow: "Collection",
    title: "Tortionnaire",
    description:
      "Des accessoires immersifs conçus pour les scènes de tension, d’interrogatoire et de menace contrôlée en grandeur nature.",
    image: "/images/video-kit-chirurgien-poster.jpg",
    cta: "Découvrir la collection",
  },
  {
    id: 2,
    name: "Voleur",
    eyebrow: "Collection",
    title: "Voleur",
    description:
      "Outils, accessoires et pièces de terrain pour les personnages furtifs, habiles et toujours prêts à ouvrir ce qui devait rester fermé.",
    image: "/images/video-kit-chirurgien-poster.jpg",
    cta: "Découvrir la collection",
  },
  {
    id: 3,
    name: "Chirurgien",
    eyebrow: "Collection mise en avant",
    title: "Kit Chirurgien",
    description:
      "Des accessoires immersifs pensés pour donner du poids aux scènes de soin, de tension et de survie en grandeur nature.",
    image: "/images/video-kit-chirurgien-poster.jpg",
    cta: "Voir la collection",
  },
];

function CollectionsHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

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
    <section className="relative overflow-hidden bg-[#080504] px-6 py-31 text-[#f3e7cf]">
      <div className="relative mx-auto max-w-[88rem]">
        <div className="mb-10 text-center">
          <p className="mb-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
            Explorer Panassor
          </p>

          <h2 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-none text-[#fff1d2] md:text-7xl">
            Nos collections
          </h2>

          <div className="mx-auto mt-5 h-px w-52 bg-gradient-to-r from-transparent via-[#c89b3c] to-transparent" />
        </div>

        <div className="relative min-h-[620px] overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
          <img
            key={activeCollection.image}
            src={activeCollection.image}
            alt={activeCollection.name}
            className="absolute inset-0 h-full w-full object-cover brightness-[0.65] contrast-[1.12] saturate-[0.9] transition-opacity duration-700"
          />

          <div className="absolute inset-0 bg-[#080504]/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/95 via-[#080504]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/85 via-transparent to-[#080504]/50" />

          <div className="pointer-events-none absolute left-5 top-5 z-10 h-20 w-20 border-l-2 border-t-2 border-[#c89b3c]/85" />
          <div className="pointer-events-none absolute right-5 top-5 z-10 h-20 w-20 border-r-2 border-t-2 border-[#c89b3c]/85" />
          <div className="pointer-events-none absolute bottom-5 left-5 z-10 h-20 w-20 border-b-2 border-l-2 border-[#c89b3c]/85" />
          <div className="pointer-events-none absolute bottom-5 right-5 z-10 h-20 w-20 border-b-2 border-r-2 border-[#c89b3c]/85" />

          <div className="relative z-10 flex min-h-[620px] items-center px-8 py-16 md:px-16">
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
                <a
                  href="#"
                  className="inline-flex items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-7 py-4 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
                >
                  {activeCollection.cta}
                </a>

                <a
                  href="#"
                  className="inline-flex items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-4 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
                >
                  Voir tous les produits
                </a>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
            <button
              onClick={goPrevious}
              className="flex h-12 w-12 items-center justify-center border border-[#c89b3c]/70 bg-[#120c07]/85 font-['IM_Fell_English_SC'] text-3xl leading-none text-[#d8a24c] transition hover:bg-[#c89b3c] hover:text-[#100805]"
              aria-label="Collection précédente"
            >
              ‹
            </button>

            <button
              onClick={goNext}
              className="flex h-12 w-12 items-center justify-center border border-[#c89b3c]/70 bg-[#120c07]/85 font-['IM_Fell_English_SC'] text-3xl leading-none text-[#d8a24c] transition hover:bg-[#c89b3c] hover:text-[#100805]"
              aria-label="Collection suivante"
            >
              ›
            </button>
          </div>

          <div className="absolute bottom-9 left-1/2 z-20 flex -translate-x-1/2 gap-3">
            {collections.map((collection, index) => (
              <button
                key={collection.id}
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