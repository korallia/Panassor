import CornerFrame from "../ui/CornerFrame";
import OrnamentDivider from "../ui/OrnamentDivider";

function PageHeroBanner({
  image,
  alt,
  eyebrow,
  title,
  description,
  height = "h-[430px]",
}) {
  return (
    <section className={`relative ${height} overflow-hidden bg-[#120c07]`}>
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
  );
}

export default PageHeroBanner;