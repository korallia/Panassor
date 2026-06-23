import SectionAtmosphere from "../../layout/SectionAtmosphere";

function AtelierVisionSection() {
  return (
    <section className="relative overflow-hidden bg-[#080504] px-6 py-32 text-[#f3e7cf]">
      <SectionAtmosphere variant="featured" />

      <div className="relative z-10 mx-auto grid max-w-[88rem] gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="mb-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
            Vision Panassor
          </p>

          <h2 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-[0.9] text-[#fff1d2] md:text-7xl">
            Donner du poids aux rôles oubliés
          </h2>

          <div className="my-8 h-px w-60 bg-gradient-to-r from-[#c89b3c] to-transparent" />

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
        </div>

        <div className="relative flex min-h-[520px] items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,155,60,0.14),transparent_48%)]" />

          <img
            src="/images/logo_panassor.png"
            alt="Logo Panassor"
            className="relative z-10 h-72 w-72 object-contain opacity-90 drop-shadow-[0_18px_45px_rgba(0,0,0,0.75)] md:h-96 md:w-96"
          />

          <div className="pointer-events-none absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-[#c89b3c]/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}

export default AtelierVisionSection;