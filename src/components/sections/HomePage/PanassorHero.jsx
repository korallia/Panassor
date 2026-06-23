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
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.58] contrast-[1.12] saturate-[0.92] md:brightness-[0.78]"
        />

        <div className="absolute inset-0 bg-black/20 md:bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/92 via-[#080504]/62 to-[#080504]/18 md:from-[#080504]/90 md:via-[#080504]/45 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/92 via-[#080504]/18 to-[#080504]/58 md:from-[#080504]/85 md:via-transparent md:to-[#080504]/55" />

        <CornerFrame inset="hero" size="lg" thickness="strong" color="gold" />

        <CornerFrame
          inset="heroInner"
          size="sm"
          thickness="subtle"
          color="paleGold"
        />

        <div className="relative z-20 mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-5 py-12 md:min-h-[calc(100vh-6rem)] md:px-6 md:py-12">
          <div className="w-full max-w-[36rem] md:max-w-2xl">
            <div className="mb-5 flex items-center gap-3 md:mb-6 md:gap-4">
              <div className="h-px w-10 bg-[#d8a24c]/70 md:w-16" />

              <span className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.2em] text-[#d8a24c] md:text-base md:tracking-[0.22em]">
                {collection.eyebrow_fr}
              </span>

              <div className="hidden h-px w-16 bg-[#d8a24c]/70 sm:block" />
            </div>

            <h1 className="max-w-full break-words font-['IM_Fell_English_SC'] text-5xl font-normal uppercase leading-[0.9] tracking-wide text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] sm:text-6xl md:text-8xl md:leading-[0.82] xl:text-9xl">
              {collection.title_fr}
            </h1>

            <div className="my-6 flex items-center gap-3 text-[#d8a24c] md:my-7">
              <div className="h-px w-14 bg-[#d8a24c]/70 md:w-20" />
              <span className="text-lg md:text-xl">✦</span>
              <div className="h-px w-14 bg-[#d8a24c]/70 md:w-20" />
            </div>

            <p className="max-w-[32rem] font-['EB_Garamond'] text-xl leading-8 text-[#f7ead2]/88 drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)] sm:text-2xl sm:leading-9 md:max-w-xl md:text-3xl md:leading-10">
              {collection.description_fr}
            </p>

            <div className="mt-9 flex w-full max-w-md flex-col gap-4 sm:flex-row md:mt-10 md:max-w-none">
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