import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../../context/LanguageContext";
import { getCollectionUrl, t } from "../../../utils/localization";

import GreenButton from "../../ui/GreenButton";
import GoldButton from "../../ui/GoldButton";
import CornerFrame from "../../ui/CornerFrame";

function PanassorHero({ collection }) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  if (!collection) {
    return null;
  }

  const collectionUrl = getCollectionUrl(collection, language);
  const title = t(collection, "title", language);
  const eyebrow = t(collection, "eyebrow", language);
  const description = t(collection, "description", language);
  const titleWords = title.split(" ").filter(Boolean);

  const goToCollection = () => {
    navigate(collectionUrl);
  };

  return (
    <div className="bg-[#080504] text-[#f7ead2]">
      {/* MOBILE HERO */}
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[#0b0704] md:hidden">
        <button
          type="button"
          onClick={goToCollection}
          className="group relative block min-h-[calc(100svh-5rem)] w-full overflow-hidden text-center"
          aria-label={`Découvrir la collection ${title}`}
        >
          <img
            src={collection.hero_image_url}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.5] contrast-[1.12] saturate-[0.9] transition duration-500 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-[#080504]/22" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080504]/70 via-[#080504]/26 to-[#080504]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/64 via-transparent to-[#080504]/58" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-b from-transparent via-[#080504]/72 to-[#080504]" />

          <CornerFrame
            inset="hero"
            size="lg"
            thickness="strong"
            color="gold"
          />

          <CornerFrame
            inset="heroInner"
            size="sm"
            thickness="subtle"
            color="paleGold"
          />

          <div className="relative z-20 flex min-h-[calc(100svh-5rem)] flex-col justify-center px-6 py-16">
            <div className="mx-auto flex w-full max-w-[28rem] flex-col items-center text-center">
              <div className="mb-8 flex w-full items-center justify-center gap-3 text-[#d8a24c]">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d8a24c]/70" />

                <span className="whitespace-nowrap font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.22em] text-[#d8a24c]">
                  {eyebrow}
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8a24c]/70" />
              </div>

              <h1 className="mx-auto w-full max-w-full text-center font-['IM_Fell_English_SC'] text-[clamp(2.85rem,14vw,3.35rem)] font-normal uppercase leading-[0.88] tracking-[0.02em] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
                {titleWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="block w-full text-center"
                  >
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
          </div>
        </button>

        <div className="relative z-30 bg-[#080504] px-5 pb-16 pt-8 text-center">
          <p className="mx-auto max-w-[33rem] font-['EB_Garamond'] text-[1.32rem] leading-7 text-[#f7ead2]/84">
            {description}
          </p>

          <div className="mx-auto mt-8 flex max-w-[30rem] flex-col gap-3">
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
      </section>

      {/* DESKTOP HERO */}
      <section className="relative hidden min-h-[calc(100vh-6rem)] overflow-hidden bg-[#0b0704] md:block">
        <img
          src={collection.hero_image_url}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.78] contrast-[1.12] saturate-[0.92]"
        />

        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/94 via-[#080504]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/86 via-transparent to-[#080504]/55" />

        <CornerFrame inset="hero" size="lg" thickness="strong" color="gold" />

        <CornerFrame
          inset="heroInner"
          size="sm"
          thickness="subtle"
          color="paleGold"
        />

        <div className="relative z-20 flex min-h-[calc(100vh-6rem)] items-center py-12 pl-[clamp(3.5rem,9vw,10rem)] pr-[clamp(2rem,6vw,6rem)]">
          <div className="max-w-[min(48rem,58vw)]">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-16 bg-[#d8a24c]/70" />

              <span className="font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.22em] text-[#d8a24c]">
                {eyebrow}
              </span>

              <div className="h-px w-16 bg-[#d8a24c]/70" />
            </div>

            <h1 className="font-['IM_Fell_English_SC'] text-[clamp(5rem,7.4vw,8.4rem)] font-normal uppercase leading-[0.82] tracking-wide text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] 2xl:text-9xl">
              {title}
            </h1>

            <div className="my-7 flex items-center gap-3 text-[#d8a24c]">
              <div className="h-px w-20 bg-[#d8a24c]/70" />
              <span className="text-xl">✦</span>
              <div className="h-px w-20 bg-[#d8a24c]/70" />
            </div>

            <p className="max-w-xl font-['EB_Garamond'] text-[clamp(1.65rem,2.1vw,2rem)] leading-[1.28] text-[#f7ead2]/88 drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]">
              {description}
            </p>

            <div className="mt-10 flex max-w-[42rem] flex-col gap-4 min-[920px]:flex-row">
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