import { useNavigate } from "react-router-dom";

import GreenButton from "../../ui/GreenButton";
import GoldButton from "../../ui/GoldButton";
import CornerFrame from "../../ui/CornerFrame";

function PanassorHero({ collection }) {
  const navigate = useNavigate();

  if (!collection) {
    return null;
  }

  const collectionUrl = collection.url || `/collections/${collection.slug}`;
  const titleWords = collection.title_fr.split(" ");

  const goToCollection = () => {
    navigate(collectionUrl);
  };

  return (
    <div className="bg-[#080504] text-[#f7ead2]">
      {/* MOBILE HERO */}
      <section className="bg-[#0b0704] px-4 pb-16 pt-8 md:hidden">
        <div className="overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
          <button
            type="button"
            onClick={goToCollection}
            className="group relative block min-h-[30rem] w-full overflow-hidden text-center"
            aria-label={`Découvrir la collection ${collection.title_fr}`}
          >
            <img
              src={collection.hero_image_url}
              alt={collection.title_fr}
              className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.52] contrast-[1.12] saturate-[0.9] transition duration-500 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-0 bg-[#080504]/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#080504]/68 via-[#080504]/24 to-[#080504]/86" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/58 via-transparent to-[#080504]/52" />

            <CornerFrame
              inset="hero"
              size="lg"
              thickness="strong"
              color="gold"
            />

            <div className="relative z-20 flex min-h-[30rem] flex-col justify-center px-5 py-12">
              <div className="mb-8 flex items-center justify-center gap-3 text-[#d8a24c]">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d8a24c]/70" />

                <span className="whitespace-nowrap font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.22em] text-[#d8a24c]">
                  {collection.eyebrow_fr}
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8a24c]/70" />
              </div>

              <h1 className="mx-auto w-full max-w-full font-['IM_Fell_English_SC'] text-[clamp(2.85rem,14vw,3.35rem)] font-normal uppercase leading-[0.88] tracking-[0.02em] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
                {titleWords.map((word) => (
                  <span key={word} className="block">
                    {word}
                  </span>
                ))}
              </h1>

              <div className="mx-auto mt-8 flex w-full max-w-[18rem] items-center justify-center gap-3 text-[#d8a24c]">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d8a24c]/70" />
                <span className="text-lg">✦</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8a24c]/70" />
              </div>
            </div>
          </button>

          <div className="relative border-t border-[#6f5423]/70 bg-[#080504]/92 px-6 pb-7 pt-6 text-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,155,60,0.1),transparent_45%)]" />

            <div className="relative z-10">
              <p className="mx-auto max-w-[31rem] font-['EB_Garamond'] text-[1.32rem] leading-7 text-[#f7ead2]/84">
                {collection.description_fr}
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
            </div>
          </div>
        </div>
      </section>

      {/* DESKTOP HERO */}
      <section className="relative hidden min-h-[calc(100vh-6rem)] overflow-hidden bg-[#0b0704] md:block">
        <img
          src={collection.hero_image_url}
          alt={collection.title_fr}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.78] contrast-[1.12] saturate-[0.92]"
        />

        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/90 via-[#080504]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/85 via-transparent to-[#080504]/55" />

        <CornerFrame inset="hero" size="lg" thickness="strong" color="gold" />

        <CornerFrame
          inset="heroInner"
          size="sm"
          thickness="subtle"
          color="paleGold"
        />

        <div className="relative z-20 mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center px-6 py-12">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-16 bg-[#d8a24c]/70" />

              <span className="font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.22em] text-[#d8a24c]">
                {collection.eyebrow_fr}
              </span>

              <div className="h-px w-16 bg-[#d8a24c]/70" />
            </div>

            <h1 className="font-['IM_Fell_English_SC'] text-8xl font-normal uppercase leading-[0.82] tracking-wide text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] xl:text-9xl">
              {collection.title_fr}
            </h1>

            <div className="my-7 flex items-center gap-3 text-[#d8a24c]">
              <div className="h-px w-20 bg-[#d8a24c]/70" />
              <span className="text-xl">✦</span>
              <div className="h-px w-20 bg-[#d8a24c]/70" />
            </div>

            <p className="max-w-xl font-['EB_Garamond'] text-3xl leading-10 text-[#f7ead2]/88 drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]">
              {collection.description_fr}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <GoldButton collection_url={collectionUrl} />
              <GreenButton />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PanassorHero;