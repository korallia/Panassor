import SectionAtmosphere from "../../layout/SectionAtmosphere";
import OrnamentDivider from "../../ui/OrnamentDivider";

function AtelierVisionSection() {
  const visionPoints = [
    "Des objets pour les rôles qui font vivre l’univers.",
    "Une présence forte, sans voler la scène aux joueurs.",
    "Des accessoires faits pour être vus, manipulés et incarnés.",
  ];

  return (
    <section className="relative overflow-hidden bg-[#080504] text-[#f3e7cf]">
      <SectionAtmosphere variant="featured" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,rgba(200,155,60,0.13),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_58%,rgba(35,72,40,0.2),transparent_34%)]" />

      {/* MOBILE */}
      <div className="relative z-10 px-4 py-20 md:hidden">
        <div className="relative overflow-hidden border border-[#6f5423]/70 bg-[#120c07] px-5 py-10 shadow-[0_22px_70px_rgba(0,0,0,0.68)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(200,155,60,0.16),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_84%,rgba(35,72,40,0.24),transparent_38%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080504]/28 via-transparent to-[#080504]/58" />

          <div className="pointer-events-none absolute inset-3 border border-[#c89b3c]/10" />
          <div className="pointer-events-none absolute left-6 top-6 h-14 w-14 border-l border-t border-[#c89b3c]/55" />
          <div className="pointer-events-none absolute right-6 top-6 h-14 w-14 border-r border-t border-[#c89b3c]/55" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-14 w-14 border-b border-l border-[#c89b3c]/55" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-14 w-14 border-b border-r border-[#c89b3c]/55" />

          <div className="relative z-10">
            <div className="mx-auto mb-8 flex h-56 w-56 items-center justify-center">
              <div className="pointer-events-none absolute h-56 w-56 rounded-full border border-[#c89b3c]/10" />
              <div className="pointer-events-none absolute h-72 w-72 rounded-full border border-[#c89b3c]/[0.06]" />

              <img
                src="/images/logo_panassor.png"
                alt="Logo Panassor"
                className="h-52 w-52 object-contain opacity-95 drop-shadow-[0_24px_55px_rgba(0,0,0,0.92)]"
              />
            </div>

            <div className="text-center">
              <div className="mx-auto mb-5 flex max-w-[17rem] items-center justify-center gap-3 text-[#c89b3c]">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/70" />
                <span className="text-lg">✦</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/70" />
              </div>

              <p className="mb-4 font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.28em] text-[#c89b3c]">
                Vision Panassor
              </p>

              <h2 className="mx-auto max-w-[22rem] font-['IM_Fell_English_SC'] text-[clamp(2.25rem,9vw,3.25rem)] uppercase leading-[0.9] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.85)]">
                Donner du poids aux rôles oubliés
              </h2>
            </div>

            <div className="mx-auto my-8 h-px w-48 bg-gradient-to-r from-transparent via-[#c89b3c]/80 to-transparent" />

            <div className="grid gap-3">
              {visionPoints.map((point) => (
                <div
                  key={point}
                  className="border border-[#6f5423]/60 bg-[#080504]/44 px-4 py-4 shadow-[0_0_22px_rgba(0,0,0,0.28)]"
                >
                  <p className="font-['EB_Garamond'] text-[1.15rem] leading-7 text-[#d7c8ad]/88">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <OrnamentDivider className="mt-9" width={96} opacity={0.55} />
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="relative z-10 mx-auto hidden max-w-[88rem] grid-cols-[0.92fr_1.08fr] items-center gap-14 px-6 py-32 md:grid">
        <div>
          <p className="mb-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
            Vision Panassor
          </p>

          <h2 className="font-['IM_Fell_English_SC'] text-7xl uppercase leading-[0.9] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.75)]">
            Donner du poids aux rôles oubliés
          </h2>

          <div className="my-8 h-px w-72 bg-gradient-to-r from-[#c89b3c] to-transparent" />

          <p className="font-['EB_Garamond'] text-3xl leading-10 text-[#d7c8ad]/88">
            Panassor crée des kits immersifs pour les personnages qui
            construisent l’histoire autrement : soigneurs, artisans, voleurs,
            érudits, manipulateurs et tous ceux qui font vivre un univers sans
            forcément porter l’épée.
          </p>

          <p className="mt-6 font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/75">
            Notre objectif est simple : créer des objets qui ont assez de
            présence pour être remarqués, assez de solidité pour être utilisés,
            et assez d’âme pour devenir une partie du personnage.
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
              src="/images/logo_panassor.png"
              alt="Logo Panassor"
              className="h-[38rem] w-[38rem] object-contain opacity-95 drop-shadow-[0_30px_65px_rgba(0,0,0,0.92)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AtelierVisionSection;