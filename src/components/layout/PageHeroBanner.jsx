import CornerFrame from "../ui/CornerFrame";
import OrnamentDivider from "../ui/OrnamentDivider";

function getHeightValue(height) {
  if (!height) return "430px";

  if (height.startsWith("h-[") && height.endsWith("]")) {
    return height.slice(3, -1);
  }

  return "430px";
}

function PageHeroBanner({
  image,
  alt,
  eyebrow,
  title,
  description,
  height = "h-[430px]",
}) {
  const desktopHeight = getHeightValue(height);
  const titleWords = String(title || "").split(" ");

  return (
    <>
      {/* MOBILE + TABLETTE + PETIT DESKTOP */}
      <section className="relative overflow-hidden bg-[#120c07] xl:hidden">
        <div className="relative min-h-[34rem] overflow-hidden bg-[#120c07] md:min-h-[38rem]">
          <img
            src={image}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.5] contrast-[1.08] saturate-[0.95]"
          />

          <div className="absolute inset-0 bg-[#080504]/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080504]/76 via-[#080504]/36 to-[#080504]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/62 via-transparent to-[#080504]/62" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent via-[#080504]/70 to-[#080504]" />

          <CornerFrame
            inset="collectionIntro"
            size="sm"
            thickness="subtle"
            color="paleGold"
          />

          <div className="relative z-30 flex min-h-[34rem] w-full items-center justify-center px-5 py-16 md:min-h-[38rem] md:px-10">
            <div className="flex w-full max-w-[42rem] flex-col items-center text-center">
              <OrnamentDivider
                className="mb-7 justify-center"
                width={112}
                opacity={0.7}
              />

              {eyebrow && (
                <p className="mb-6 w-full text-center font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.32em] text-[#d8a24c] md:text-sm">
                  {eyebrow}
                </p>
              )}

              <h1 className="mx-auto w-full max-w-[38rem] text-center font-['IM_Fell_English_SC'] text-[clamp(2.55rem,8vw,4.6rem)] uppercase leading-[0.9] tracking-[0.01em] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
                {titleWords.map((word, index) => (
                  <span key={`${word}-${index}`} className="block w-full text-center">
                    {word}
                  </span>
                ))}
              </h1>

              {description && (
                <p className="mt-7 max-w-[36rem] font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/88 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] md:text-2xl md:leading-9">
                  {description}
                </p>
              )}

              <div className="mt-8 flex w-full max-w-[18rem] items-center justify-center gap-3 text-[#d8a24c] md:max-w-[22rem]">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d8a24c]/70" />
                <span className="text-lg">✦</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8a24c]/70" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESKTOP LARGE */}
      <section
        className="relative hidden overflow-hidden bg-[#120c07] xl:block xl:h-[var(--page-hero-height)]"
        style={{ "--page-hero-height": desktopHeight }}
      >
        <img
          src={image}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.62] contrast-[1.08] saturate-[0.95]"
        />

        <div className="absolute inset-0 bg-[#080504]/22" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/95 via-[#080504]/66 to-[#080504]/28" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/78 via-transparent to-[#080504]/32" />

        <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-[#080504] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-[#080504] to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent via-[#080504]/70 to-[#080504]" />

        <CornerFrame
          inset="collectionIntro"
          size="sm"
          thickness="subtle"
          color="paleGold"
        />

        <div className="relative z-30 mx-auto grid h-full max-w-[88rem] items-center px-12 lg:px-16 xl:grid-cols-[0.95fr_1.05fr] 2xl:px-8">
          <div className="-translate-y-3 flex max-w-[44rem] flex-col items-start text-left">
            <OrnamentDivider
              className="mb-6 justify-start"
              width={112}
              opacity={0.7}
            />

            {eyebrow && (
              <p className="mb-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.38em] text-[#d8a24c]">
                {eyebrow}
              </p>
            )}

            <h1 className="font-['IM_Fell_English_SC'] text-7xl uppercase leading-[0.88] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] 2xl:text-8xl">
              {title}
            </h1>

            {description && (
              <p className="mt-8 max-w-2xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/88 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                {description}
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

export default PageHeroBanner;