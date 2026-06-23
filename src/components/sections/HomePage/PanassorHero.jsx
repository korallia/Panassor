import { useNavigate } from "react-router-dom";

import GreenButton from "../../ui/GreenButton";
import GoldButton from "../../ui/GoldButton";
import CornerFrame from "../../ui/CornerFrame";

function PanassorHero({ collection }) {
  const navigate = useNavigate();

  if (!collection) {
    return null;
  }

  const collectionUrl =
    collection.url || `/collections/${collection.slug}`;

  const goToCollection = () => {
    navigate(collectionUrl);
  };

  return (
    <div className="bg-[#080504] text-[#f7ead2]">
      {/* MOBILE HERO */}
      <section className="md:hidden">
        <div className="relative overflow-hidden bg-[#0b0704] px-4 pt-8">
          <button
            type="button"
            onClick={goToCollection}
            className="group relative block min-h-[30rem] w-full overflow-hidden border border-[#6f5423]/80 bg-[#120c07] text-center shadow-[0_18px_60px_rgba(0,0,0,0.6)]"
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

            <div className="relative z-20 flex min-h-[30rem] flex-col justify-center px-6 py-12">
              <div className="mb-8 flex items-center justify-center gap-3 text-[#d8a24c]">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d8a24c]/70" />

                <span className="whitespace-nowrap font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.22em] text-[#d8a24c]">
                  {collection.eyebrow_fr}
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8a24c]/70" />
              </div>

              <h1 className="font-['IM_Fell_English_SC'] text-[3.75rem] font-normal uppercase leading-[0.86] tracking-wide text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
                {collection.title_fr.split(" ").map((word) => (
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
        </div>

        <div className="bg-[#080504] px-5 pb-16 pt-8 text-center">
          <p className="mx-auto max-w-[33rem] font-['EB_Garamond'] text-[1.48rem] leading-8 text-[#f7ead2]/88 drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]">
            {collection.description_fr}
          </p>

          <div className="mx-auto mt-8 flex max-w-[30rem] flex-col gap-4">
            <button
              type="button"
              onClick={goToCollection}
              className="inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
            >
              <span className="mr-3">✦</span>
              Découvrir la collection
            </button>

            <button
              type="button"
              onClick={() => navigate("/atelier")}
              className="inline-flex w-full items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
            >
              Voir l’atelier
            </button>
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