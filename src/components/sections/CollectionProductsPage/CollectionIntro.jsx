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
      {/* MOBILE */}
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[#120c07] text-[#f3e7cf] md:hidden">
        <img
          src={collection.hero_image_url}
          alt={collection.title_fr}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.5] contrast-[1.12] saturate-[0.9]"
        />

        <div className="absolute inset-0 bg-[#080504]/24" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080504]/70 via-[#080504]/28 to-[#080504]/88" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/62 via-transparent to-[#080504]/62" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent via-[#080504]/70 to-[#080504]" />

        <CornerFrame
          inset="collectionIntro"
          size="sm"
          thickness="subtle"
          color="paleGold"
          className="z-20"
        />

        <div className="relative z-30 flex min-h-[calc(100svh-5rem)] w-full items-center justify-center px-6 py-16">
          <div className="mx-auto flex w-full max-w-[26rem] flex-col items-center text-center">
            <div className="mb-8 flex w-full max-w-[18rem] items-center justify-center gap-3 text-[#d8a24c]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d8a24c]/70" />
              <span className="text-lg">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8a24c]/70" />
            </div>

            <p className="mb-7 w-full text-center font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.32em] text-[#d8a24c]">
              {collection.eyebrow_fr || "Univers Panassor"}
            </p>

            <h1 className="mx-auto w-full text-center font-['IM_Fell_English_SC'] text-[clamp(3rem,12vw,4.1rem)] uppercase leading-[0.9] tracking-[0.01em] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
              {mobileTitle}
            </h1>

            <div className="mt-8 flex w-full max-w-[18rem] items-center justify-center gap-3 text-[#d8a24c]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d8a24c]/70" />
              <span className="text-lg">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8a24c]/70" />
            </div>
          </div>
        </div>
      </section>

      {/* DESKTOP */}
      <section className="relative hidden h-[430px] overflow-hidden bg-[#120c07] text-[#f3e7cf] md:block">
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

        <div className="relative z-30 mx-auto grid h-full max-w-[88rem] items-center px-6 lg:grid-cols-2">
          <div className="-translate-y-6 flex flex-col items-start text-left">
            <OrnamentDivider
              className="mb-6 justify-start"
              width={96}
              opacity={0.7}
            />

            <h1 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-[0.88] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-7xl xl:text-8xl">
              {collection.title_fr}
            </h1>

            <OrnamentDivider
              className="mt-6 justify-start"
              width={96}
              opacity={0.7}
            />
          </div>

          <div className="hidden lg:block" />
        </div>
      </section>
    </>
  );
}

export default CollectionIntro;