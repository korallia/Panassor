import CornerFrame from "../../ui/CornerFrame";
import OrnamentDivider from "../../ui/OrnamentDivider";

function CollectionsHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#6f5423]/70 bg-[#080504] text-[#f8ead2]">
      {/* Image de fond */}
      <img
        src="/images/collections/collections-hero.jpg"
        alt="Accessoires médiévaux Panassor"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.42] contrast-[1.08] saturate-[0.85]"
      />

      {/* Overlays de dégradés */}
      <div className="absolute inset-0 bg-[#050302]/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050302]/95 via-[#050302]/72 to-[#050302]/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050302]/35 via-transparent to-[#050302]/85" />

      {/* Conteneur principal */}
      <div className="relative z-10 mx-auto min-h-[430px] w-full max-w-[1440px] px-6 py-10 sm:px-8">
        <div className="relative min-h-[350px]">
          
          {/* SWITCH PLUS TÔT (xl: 1280px) : Les équerres disparaissent sous 1280px pour ne pas bloquer le texte */}
          <CornerFrame className="hidden xl:block absolute left-0 top-0 opacity-90" />
          <CornerFrame className="hidden xl:block absolute bottom-0 right-0 rotate-180 opacity-90" />

          {/* SWITCH DE LAYOUT PASSE À 'xl:' :
            - Sous 1280px : Tout est centré proprement (`justify-center text-center`)
            - À partir de 1280px (xl) : On reprend l'alignement à gauche parfait avec le grand espace (`xl:justify-start xl:pl-24`)
          */}
          <div className="flex min-h-[350px] items-center justify-center xl:justify-start px-4 xl:pl-24 xl:pr-8">
            
            {/* L'alignement interne bascule aussi au breakpoint 'xl' */}
            <div className="w-full max-w-[680px] flex flex-col items-center xl:items-start text-center xl:text-left">
              
              <OrnamentDivider className="mb-6 xl:mb-8 max-w-[260px] xl:max-w-[300px]" />

              <p className="font-['IM_Fell_English_SC'] text-[0.9rem] uppercase tracking-[0.45em] text-[#d6a13b] sm:text-[1rem]">
                Univers Panassor
              </p>

              <h1 className="mt-4 xl:mt-6 font-['Uncial_Antiqua'] text-[clamp(2.8rem,5.6vw,5.8rem)] leading-[0.92] tracking-[0.02em] text-[#fff1d6] drop-shadow-[0_5px_18px_rgba(0,0,0,0.75)]">
                Collections
              </h1>

              <p className="mt-6 xl:mt-8 max-w-[660px] font-['EB_Garamond'] text-[clamp(1.1rem,1.45vw,1.45rem)] font-semibold leading-relaxed text-[#d8c7a1]">
                Des kits immersifs pensés pour enrichir les scènes, soutenir
                les personnages et donner une vraie présence aux moments de
                jeu.
              </p>

              <OrnamentDivider className="mt-6 xl:mt-8 max-w-[260px] xl:max-w-[300px]" />
            </div>
          </div>

        </div>
      </div>

      <div className="relative z-10 h-8 border-t border-[#2b1c0d] bg-[#120b06]" />
    </section>
  );
}

export default CollectionsHero;