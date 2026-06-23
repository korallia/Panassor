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
    <section
      className="relative overflow-hidden bg-[#120c07] md:h-[var(--page-hero-height)]"
      style={{ "--page-hero-height": desktopHeight }}
    >
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.54] contrast-[1.08] saturate-[0.95] md:brightness-[0.68]"
      />

      <div className="absolute inset-0 bg-[#080504]/28 md:bg-[#080504]/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080504]/76 via-[#080504]/36 to-[#080504]/88 md:bg-gradient-to-r md:from-[#080504]/94 md:via-[#080504]/64 md:to-[#080504]/24" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/52 via-transparent to-[#080504]/52 md:bg-gradient-to-t md:from-[#080504]/76 md:via-transparent md:to-[#080504]/30" />

      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-36 bg-gradient-to-r from-[#080504] to-transparent md:block" />
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-36 bg-gradient-to-l from-[#080504] to-transparent md:block" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent via-[#080504]/70 to-[#080504]" />

      <CornerFrame
        inset="collectionIntro"
        size="sm"
        thickness="subtle"
        color="paleGold"
      />

      <div className="relative z-30 mx-auto flex min-h-[34rem] max-w-[88rem] items-center justify-center px-5 py-16 md:grid md:h-full md:min-h-0 md:grid-cols-2 md:items-center md:justify-start md:px-6 md:py-0">
        <div className="mx-auto flex w-full max-w-[34rem] flex-col items-center text-center md:mx-0 md:-translate-y-6 md:max-w-none md:items-start md:text-left">
          <OrnamentDivider
            className="mb-6 justify-center md:justify-start"
            width={96}
            opacity={0.7}
          />

          {eyebrow && (
            <p className="mb-5 max-w-full font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.28em] text-[#d8a24c] md:text-sm md:tracking-[0.38em]">
              {eyebrow}
            </p>
          )}

          <h1 className="mx-auto max-w-[92vw] font-['IM_Fell_English_SC'] text-[clamp(2.65rem,11vw,3.45rem)] uppercase leading-[0.9] tracking-[0.01em] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:mx-0 md:max-w-none md:text-7xl md:leading-[0.88] xl:text-8xl">
            <span className="md:hidden">
              {titleWords.map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </span>

            <span className="hidden md:inline">{title}</span>
          </h1>

          {description && (
            <p className="mt-7 max-w-[31rem] font-['EB_Garamond'] text-[1.3rem] leading-7 text-[#d7c8ad]/88 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] md:mt-8 md:max-w-2xl md:text-2xl md:leading-9">
              {description}
            </p>
          )}

          <OrnamentDivider
            className="mt-7 justify-center md:justify-start"
            width={96}
            opacity={0.7}
          />
        </div>
      </div>
    </section>
  );
}

export default PageHeroBanner;