import SectionAtmosphere from "../../layout/SectionAtmosphere";
import OrnamentDivider from "../../ui/OrnamentDivider";

function AtelierVisionSection() {
  return (
    <section className="relative overflow-hidden bg-[#080504] px-6 py-32 text-[#f3e7cf]">
      <SectionAtmosphere variant="featured" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,rgba(200,155,60,0.13),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_58%,rgba(35,72,40,0.2),transparent_34%)]" />

      <div className="relative z-10 mx-auto grid max-w-[88rem] gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <p className="mb-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
            Vision Panassor
          </p>

          <h2 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-[0.9] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.75)] md:text-7xl">
            Donner du poids aux rôles oubliés
          </h2>

          <div className="my-8 h-px w-72 bg-gradient-to-r from-[#c89b3c] to-transparent" />

          <p className="font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/88 md:text-3xl md:leading-10">
            Panassor crée des kits immersifs pour les personnages qui
            construisent l’histoire autrement : soigneurs, artisans, voleurs,
            érudits, manipulateurs et tous ceux qui font vivre un univers sans
            forcément porter l’épée.
          </p>

          <p className="mt-6 font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/75 md:text-2xl md:leading-9">
            Notre objectif est simple : créer des objets qui ont assez de
            présence pour être remarqués, assez de solidité pour être utilisés,
            et assez d’âme pour devenir une partie du personnage.
          </p>

          <OrnamentDivider className="mt-12" width={112} opacity={0.55} />
        </div>

        <div className="relative flex min-h-[600px] w-full items-center justify-center lg:justify-self-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(200,155,60,0.18),transparent_38%)]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(35,72,40,0.13),transparent_46%)]" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c89b3c]/10" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c89b3c]/[0.07]" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[42rem] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#c89b3c]/18 to-transparent" />

          <div className="relative flex h-[38rem] w-[38rem] -translate-y-4 items-center justify-center">
            <img
              src="/images/logo_panassor.png"
              alt="Logo Panassor"
              className="h-[30rem] w-[30rem] object-contain opacity-95 drop-shadow-[0_30px_65px_rgba(0,0,0,0.92)] md:h-[38rem] md:w-[38rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AtelierVisionSection;