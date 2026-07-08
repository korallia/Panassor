import SectionAtmosphere from "../../layout/SectionAtmosphere";
import OrnamentDivider from "../../ui/OrnamentDivider";

import { getAssetUrl } from "../../../utils/assets";

function AtelierVisionSection({ copy = {} }) {
  const visionPoints = copy.points ?? [];

  return (
    <section className="relative overflow-hidden bg-[#080504] text-[#f3e7cf]">
      <SectionAtmosphere variant="featured" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,rgba(200,155,60,0.13),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_58%,rgba(35,72,40,0.2),transparent_34%)]" />

      {/* MOBILE + TABLETTE + PETIT DESKTOP */}
      <div className="relative z-10 px-4 py-16 sm:px-6 md:py-20 xl:hidden">
        <div className="relative mx-auto max-w-[42rem] overflow-hidden border border-[#6f5423]/70 bg-[#120c07] px-5 py-10 shadow-[0_22px_70px_rgba(0,0,0,0.68)] sm:px-8 md:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(200,155,60,0.15),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_86%,rgba(35,72,40,0.24),transparent_40%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080504]/28 via-transparent to-[#080504]/58" />

          <div className="pointer-events-none absolute inset-3 border border-[#c89b3c]/10" />

          <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-[#c89b3c]/55" />
          <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r border-t border-[#c89b3c]/55" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b border-l border-[#c89b3c]/55" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-[#c89b3c]/55" />

          <div className="relative z-10">
            <div className="mx-auto mb-7 flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72 md:h-[22rem] md:w-[22rem] lg:h-[24rem] lg:w-[24rem]">
              <div className="pointer-events-none absolute h-56 w-56 rounded-full border border-[#c89b3c]/10 sm:h-72 sm:w-72 md:h-[22rem] md:w-[22rem] lg:h-[24rem] lg:w-[24rem]" />
              <div className="pointer-events-none absolute h-72 w-72 rounded-full border border-[#c89b3c]/[0.06] sm:h-96 sm:w-96 md:h-[29rem] md:w-[29rem] lg:h-[31rem] lg:w-[31rem]" />

              <img
                src={getAssetUrl("/images/logo_panassor.png")}
                alt={copy.logoAlt}
                className="h-52 w-52 object-contain opacity-95 drop-shadow-[0_24px_55px_rgba(0,0,0,0.92)] sm:h-64 sm:w-64 md:h-[20rem] md:w-[20rem] lg:h-[22rem] lg:w-[22rem]"
              />
            </div>

            <div className="mx-auto mb-6 flex max-w-[17rem] items-center justify-center gap-3 text-[#c89b3c] md:max-w-[20rem]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/70" />
              <span className="text-lg">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/70" />
            </div>

            <div className="text-center">
              <p className="mb-4 font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.28em] text-[#c89b3c] sm:text-sm">
                {copy.eyebrow}
              </p>

              <h2 className="mx-auto max-w-[34rem] font-['IM_Fell_English_SC'] text-[clamp(2.4rem,7.2vw,4rem)] uppercase leading-[0.92] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.85)]">
                {copy.title}
              </h2>
            </div>

            <div className="mx-auto my-8 h-px w-48 bg-gradient-to-r from-transparent via-[#c89b3c]/80 to-transparent sm:w-72 md:w-80" />

            <div className="grid gap-3">
              {visionPoints.map((point) => (
                <div
                  key={point}
                  className="border border-[#6f5423]/60 bg-[#080504]/44 px-4 py-4 shadow-[0_0_22px_rgba(0,0,0,0.28)] sm:px-5 md:px-6"
                >
                  <p className="font-['EB_Garamond'] text-[1.15rem] leading-7 text-[#d7c8ad]/88 sm:text-[1.3rem] sm:leading-8 md:text-[1.38rem] md:leading-8">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-9 flex max-w-[14rem] items-center justify-center gap-3 text-[#c89b3c] md:max-w-[18rem]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/55" />
              <span className="text-sm">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/55" />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP LARGE SEULEMENT */}
      <div className="relative z-10 mx-auto hidden max-w-[88rem] grid-cols-[0.92fr_1.08fr] items-center gap-14 px-6 py-32 xl:grid">
        <div>
          <p className="mb-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
            {copy.eyebrow}
          </p>

          <h2 className="font-['IM_Fell_English_SC'] text-7xl uppercase leading-[0.9] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.75)]">
            {copy.title}
          </h2>

          <div className="my-8 h-px w-72 bg-gradient-to-r from-[#c89b3c] to-transparent" />

          <p className="font-['EB_Garamond'] text-3xl leading-10 text-[#d7c8ad]/88">
            {copy.desktopParagraphs?.[0]}
          </p>

          <p className="mt-6 font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/75">
            {copy.desktopParagraphs?.[1]}
          </p>

          <OrnamentDivider className="mt-12" width={112} opacity={0.55} />
        </div>

        <div className="relative flex min-h-[600px] w-full items-center justify-center justify-self-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(200,155,60,0.18),transparent_38%)]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(35,72,40,0.13),transparent_46%)]" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c89b3c]/10" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c89b3c]/[0.07]" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[42rem] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#c89b3c]/18 to-transparent" />

          <div className="relative flex h-[38rem] w-[38rem] -translate-y-4 items-center justify-center">
            <img
              src={getAssetUrl("/images/logo_panassor.png")}
              alt={copy.logoAlt}
              className="h-[38rem] w-[38rem] object-contain opacity-95 drop-shadow-[0_30px_65px_rgba(0,0,0,0.92)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AtelierVisionSection;