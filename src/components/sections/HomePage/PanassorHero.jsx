import GreenButton from "../../ui/GreenButton";
import GoldButton from "../../ui/GoldButton";
import CornerFrame from "../../ui/CornerFrame";

function PanassorHero({ collection }) {
  return (
    <div className="bg-[#080504] text-[#f7ead2]">
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[#0b0704] md:min-h-[calc(100vh-6rem)]">
        <img
          src={collection.hero_image_url}
          alt={collection.title_fr}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.5] contrast-[1.12] saturate-[0.9] md:brightness-[0.78]"
        />

        <div className="absolute inset-0 bg-[#080504]/18 md:bg-black/15" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#080504]/68 via-[#080504]/28 to-[#080504]/88 md:bg-gradient-to-t md:from-[#080504]/85 md:via-transparent md:to-[#080504]/55" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/68 via-[#080504]/26 to-[#080504]/48 md:from-[#080504]/90 md:via-[#080504]/45 md:to-transparent" />

        <CornerFrame inset="hero" size="lg" thickness="strong" color="gold" />

        <div className="hidden md:block">
          <CornerFrame
            inset="heroInner"
            size="sm"
            thickness="subtle"
            color="paleGold"
          />
        </div>

        <div className="relative z-20 mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-6 py-12 md:min-h-[calc(100vh-6rem)] md:px-6 md:py-12">
          <div className="mx-auto flex w-full max-w-[32rem] flex-col items-center text-center md:mx-0 md:max-w-2xl md:items-start md:text-left">
            <div className="mb-7 flex w-full items-center justify-center gap-4 text-[#d8a24c] md:mb-6 md:justify-start">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d8a24c]/70 md:w-16 md:flex-none md:bg-[#d8a24c]/70" />

              <span className="whitespace-nowrap font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.22em] text-[#d8a24c] md:text-base">
                {collection.eyebrow_fr}
              </span>

              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8a24c]/70 md:w-16 md:flex-none md:bg-[#d8a24c]/70" />
            </div>

            <h1 className="max-w-full font-['IM_Fell_English_SC'] text-[4.3rem] font-normal uppercase leading-[0.84] tracking-wide text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] sm:text-7xl md:text-8xl md:leading-[0.82] xl:text-9xl">
              {collection.title_fr}
            </h1>

            <div className="my-7 flex w-full items-center justify-center gap-3 text-[#d8a24c] md:justify-start">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d8a24c]/70 md:w-20 md:flex-none md:bg-[#d8a24c]/70" />
              <span className="text-lg md:text-xl">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8a24c]/70 md:w-20 md:flex-none md:bg-[#d8a24c]/70" />
            </div>

            <p className="max-w-[29rem] font-['EB_Garamond'] text-[1.45rem] leading-8 text-[#f7ead2]/88 drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)] sm:text-2xl sm:leading-9 md:max-w-xl md:text-3xl md:leading-10">
              {collection.description_fr}
            </p>

            <div className="mt-10 flex w-full max-w-[28rem] flex-col gap-4 md:max-w-none md:flex-row">
              <GoldButton collection_url={collection.url} />
              <GreenButton />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PanassorHero;