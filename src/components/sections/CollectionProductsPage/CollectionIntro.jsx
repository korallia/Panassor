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
          
          {/* SWITCH MODE MOBILE : Les équerres ne s'affichent qu'à partir de 'lg' (1024px) pour ne pas gêner */}
          <CornerFrame className="hidden lg:block absolute left-0 top-0 opacity-90" />
          <CornerFrame className="hidden lg:block absolute bottom-0 right-0 rotate-180 opacity-90" />

          {/* SWITCH DE LAYOUT :
            - En dessous de 1024px (mode mobile/tablette) : On centre le texte (`justify-center text-center px-4`)
            - À partir de `lg:` (mode grand écran) : On bascule sur l'alignement à gauche d'origine avec le padding idéal
          */}
          <div className="flex min-h-[350px] items-center justify-center lg:justify-start px-4 lg:pl-24 lg:pr-8">
            
            {/* On ajuste l'alignement des éléments internes (items-center sur mobile, items-start sur grand écran) */}
            <div className="w-full max-w-[680px] flex flex-col items-center lg:items-start text-center lg:text-left">
              
              <OrnamentDivider className="mb-6 lg:mb-8 max-w-[260px] lg:max-w-[300px]" />

              <p className="font-['IM_Fell_English_SC'] text-[0.85rem] sm:text-[0.9rem] lg:text-[1rem] uppercase tracking-[0.45em] text-[#d6a13b]">
                Univers Panassor
              </p>

              <h1 className="mt-4 lg:mt-6 font-['Uncial_Antiqua'] text-[clamp(2.5rem,5.2vw,5.5rem)] leading-[0.95] tracking-[0.02em] text-[#fff1d6] drop-shadow-[0_5px_18px_rgba(0,0,0,0.75)]">
                Collections
              </h1>

              <p className="mt-6 lg:mt-8 max-w-[660px] font-['EB_Garamond'] text-[clamp(1.1rem,1.4vw,1.4rem)] font-semibold leading-relaxed text-[#d8c7a1]">
                Des kits immersifs pensés pour enrichir les scènes, soutenir
                les personnages et donner une vraie présence aux moments de
                jeu.
              </p>

              <OrnamentDivider className="mt-6 lg:mt-8 max-w-[260px] lg:max-w-[300px]" />
            </div>
          </div>

        </div>
      </div>

      <div className="relative z-10 h-8 border-t border-[#2b1c0d] bg-[#120b06]" />
    </section>
  );
}

export default CollectionsHero;