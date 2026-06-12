import CornerFrame from "../ui/CornerFrame";
import GoldButton from "../ui/GoldButton";
import GreenButton from "../ui/GreenButton";

function CollectionIntro({ collection }) {
  return (
    <section className="relative overflow-hidden bg-[#0b0704] px-6 py-14 text-[#f3e7cf] md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(200,155,60,0.12),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_35%,rgba(35,72,40,0.18),transparent_32%)]" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="relative min-h-[420px] overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)] md:min-h-[480px]">
          <img
            src={collection.heroImage}
            alt={collection.title}
            className="absolute inset-0 h-full w-full object-cover brightness-[0.68] contrast-[1.12] saturate-[0.9]"
          />

          <div className="absolute inset-0 bg-[#080504]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/95 via-[#080504]/68 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/78 via-transparent to-[#080504]/35" />

          <CornerFrame size="lg" />

          <div className="relative z-10 flex min-h-[420px] items-center px-7 py-14 md:min-h-[480px] md:px-14">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-4">
                <div className="h-px w-14 bg-[#c89b3c]" />

                <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
                  {collection.eyebrow}
                </p>

                <div className="hidden h-px w-14 bg-[#c89b3c] sm:block" />
              </div>

              <h1 className="font-['IM_Fell_English_SC'] text-6xl uppercase leading-[0.86] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-8xl">
                {collection.title}
              </h1>

              <div className="my-7 flex items-center gap-3 text-[#d8a24c]">
                <div className="h-px w-20 bg-[#d8a24c]/70" />
                <span className="text-xl">✦</span>
                <div className="h-px w-20 bg-[#d8a24c]/70" />
              </div>

              <p className="max-w-xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/90 drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)] md:text-3xl md:leading-10">
                {collection.description}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                {collection.primaryCta && (
                  <GoldButton href={collection.primaryCta.href}>
                    <span className="mr-3">✦</span>
                    {collection.primaryCta.label}
                  </GoldButton>
                )}

                {collection.secondaryCta && (
                  <GreenButton href={collection.secondaryCta.href}>
                    {collection.secondaryCta.label}
                  </GreenButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollectionIntro;