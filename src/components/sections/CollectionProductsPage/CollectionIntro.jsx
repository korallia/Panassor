import CornerFrame from "../../ui/CornerFrame";
import OrnamentDivider from "../../ui/OrnamentDivider";

function getMobileTitle(title) {
  const words = String(title || "")
    .split(" ")
    .filter(Boolean);

  if (words[0]?.toLowerCase() === "kit" && words.length > 1) {
    return words.slice(1).join(" ");
  }

  return title;
}

function CollectionIntro({ collection }) {
  if (!collection) {
    return null;
  }

  const mobileTitle = getMobileTitle(collection.title_fr);

  return (
    <>
      {/* MOBILE + TABLETTE + PETIT DESKTOP */}
      <section className="relative min-h-[34rem] overflow-hidden bg-[#120c07] text-[#f3e7cf] xl:hidden md:min-h-[38rem]">
        <img
          src={collection.hero_image_url}
          alt={collection.title_fr}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.5] contrast-[1.12] saturate-[0.9]"
        />

        <div className="absolute inset-0 bg-[#080504]/24" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080504]/72 via-[#080504]/32 to-[#080504]/88" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/64 via-[#080504]/20 to-[#080504]/64" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent via-[#080504]/70 to-[#080504]" />

        <CornerFrame
          inset="collectionIntro"
          size="sm"
          thickness="subtle"
          color="paleGold"
          className="z-20"
        />

        <div className="relative z-30 flex min-h-[34rem] w-full items-center justify-center px-6 py-16 md:min-h-[38rem] md:px-10">
          <div className="mx-auto flex w-full max-w-[42rem] flex-col items-center text-center">
            <OrnamentDivider
              className="mb-7 justify-center"
              width={112}
              opacity={0.7}
            />

            <p className="mb-6 w-full text-center font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.32em] text-[#d8a24c] md:text-sm">
              {collection.eyebrow_fr || "Univers Panassor"}
            </p>

            <h1 className="mx-auto w-full max-w-[40rem] text-center font-['IM_Fell_English_SC'] text-[clamp(2.75rem,8vw,4.8rem)] uppercase leading-[0.9] tracking-[0.01em] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
              {mobileTitle}
            </h1>

            {collection.description_fr && (
              <p className="mt-7 max-w-[36rem] font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/88 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] md:text-2xl md:leading-9">
                {collection.description_fr}
              </p>
            )}

            <OrnamentDivider
              className="mt-8 justify-center"
              width={112}
              opacity={0.7}
            />
          </div>
        </div>
      </section>

      {/* DESKTOP LARGE */}
      <section className="relative hidden h-[430px] overflow-hidden bg-[#120c07] text-[#f3e7cf] xl:block">
        <img
          src={collection.hero_image_url}
          alt={collection.title_fr}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.72] contrast-[1.1] saturate-[0.95]"
        />

        <div className="absolute inset-0 bg-[#080504]/18" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/92 via-[#080504]/62 to-[#080504]/22" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/72 via-transparent to-[#080504]/28" />

        <div className="pointer-events-none absolute left-0 top-0 h-full w-36 bg-gradient-to-r from-[#080504] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-36 bg-gradient-to-l from-[#080504] to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent via-[#080504]/70 to-[#080504]" />

        <CornerFrame
          inset="collectionIntro"
          size="sm"
          thickness="subtle"
          color="paleGold"
          className="z-20"
        />

        <div className="relative z-30 flex h-full items-center pl-[clamp(4rem,8vw,9rem)] pr-[clamp(2rem,6vw,6rem)]">
          <div className="-translate-y-4 flex max-w-[46rem] flex-col items-start text-left">
            <OrnamentDivider
              className="mb-6 justify-start"
              width={112}
              opacity={0.7}
            />

            <p className="mb-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.34em] text-[#d8a24c]">
              {collection.eyebrow_fr || "Univers Panassor"}
            </p>

            <h1 className="font-['IM_Fell_English_SC'] text-[clamp(4.5rem,6vw,7.5rem)] uppercase leading-[0.88] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] 2xl:text-8xl">
              {collection.title_fr}
            </h1>

            {collection.description_fr && (
              <p className="mt-7 max-w-2xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/88 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                {collection.description_fr}
              </p>
            )}

            <OrnamentDivider
              className="mt-7 justify-start"
              width={112}
              opacity={0.7}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default CollectionIntro;