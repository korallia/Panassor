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

  const titleWords = String(title || "")
    .split(" ")
    .filter(Boolean);

  return (
    <>
      {/* MOBILE HERO */}
      <section className="bg-[#0b0704] px-4 pb-16 pt-8 md:hidden">
        <div className="overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
          <div className="relative min-h-[30rem] w-full overflow-hidden text-center">
            <img
              src={image}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.52] contrast-[1.12] saturate-[0.9]"
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

                {eyebrow && (
                  <span className="whitespace-nowrap font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.22em] text-[#d8a24c]">
                    {eyebrow}
                  </span>
                )}

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8a24c]/70" />
              </div>

              <h1 className="mx-auto w-full max-w-full text-center font-['IM_Fell_English_SC'] text-[clamp(2.85rem,14vw,3.35rem)] font-normal uppercase leading-[0.88] tracking-[0.02em] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
                {titleWords.map((word) => (
                  <span key={word} className="block w-full text-center">
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
        </div>
      </section>

      {/* DESKTOP HERO */}
      <section
        className="relative hidden overflow-hidden bg-[#120c07] md:block md:h-[var(--page-hero-height)]"
        style={{ "--page-hero-height": desktopHeight }}
      >
        <img
          src={image}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.68] contrast-[1.08] saturate-[0.95]"
        />

        <div className="absolute inset-0 bg-[#080504]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/94 via-[#080504]/64 to-[#080504]/24" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/76 via-transparent to-[#080504]/30" />

        <div className="pointer-events-none absolute left-0 top-0 h-full w-36 bg-gradient-to-r from-[#080504] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-36 bg-gradient-to-l from-[#080504] to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent via-[#080504]/70 to-[#080504]" />

        <CornerFrame
          inset="collectionIntro"
          size="sm"
          thickness="subtle"
          color="paleGold"
        />

        <div className="relative z-30 mx-auto grid h-full max-w-[88rem] items-center px-6 lg:grid-cols-2">
          <div className="-translate-y-6 flex flex-col items-start text-left">
            <OrnamentDivider
              className="mb-6 justify-start"
              width={96}
              opacity={0.7}
            />

            {eyebrow && (
              <p className="mb-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.38em] text-[#d8a24c]">
                {eyebrow}
              </p>
            )}

            <h1 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-[0.88] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-7xl xl:text-8xl">
              {title}
            </h1>

            {description && (
              <p className="mt-8 max-w-2xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/88 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                {description}
              </p>
            )}

            <OrnamentDivider
              className="mt-7 justify-start"
              width={96}
              opacity={0.7}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default PageHeroBanner;