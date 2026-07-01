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

      {/* ZONE DE CADRAGE GLOBALE (Le grand rectangle invisible qui gère les grands coins) */}
      <div className="relative z-10 mx-auto min-h-[430px] w-full max-w-[1440px] px-6 py-10 sm:px-12">
        <div className="relative min-h-[350px] w-full">
          
          {/* Les cadres de coins restent ancrés ici, tout au bout du conteneur de 1440px */}
          <CornerFrame className="absolute left-0 top-0 opacity-90" />
          <CornerFrame className="absolute bottom-0 right-0 rotate-180 opacity-90" />

          {/* ZONE DU CONTENU : Centrée verticalement, mais isolée des angles par un padding fixe */}
          <div className="flex min-h-[350px] items-center justify-start py-8 pl-14 pr-6 sm:pl-20 md:pl-24">
            
            {/* CORRECTION RADICALE : 
              - max-w-[580px] force le texte à sauter à la ligne BIEN AVANT de pouvoir s'étaler vers la droite.
              - flex flex-col assure que les OrnamentDivider restent alignés sans dépasser.
            */}
            <div className="w-full max-w-[580px] flex flex-col items-start">
              
              <OrnamentDivider className="mb-6 w-full max-w-[260px]" />

              <p className="font-['IM_Fell_English_SC'] text-[0.9rem] uppercase tracking-[0.45em] text-[#d6a13b] sm:text-[1rem]">
                Univers Panassor
              </p>

              <h1 className="mt-5 font-['Uncial_Antiqua'] text-[clamp(2.8rem,5vw,5.2rem)] leading-[0.95] tracking-[0.02em] text-[#fff1d6] drop-shadow-[0_5px_18px_rgba(0,0,0,0.75)]">
                Collections
              </h1>

              <p className="mt-6 font-['EB_Garamond'] text-[clamp(1.1rem,1.35vw,1.35rem)] font-semibold leading-relaxed text-[#d8c7a1]">
                Des kits immersifs pensés pour enrichir les scènes, soutenir
                les personnages et donner une vraie présence aux moments de
                jeu.
              </p>

              <OrnamentDivider className="mt-6 w-full max-w-[260px]" />
            </div>

          </div>
        </div>
      </div>

      {/* Bordure de fin de section */}
      <div className="relative z-10 h-8 border-t border-[#2b1c0d] bg-[#120b06]" />
    </section>
  );
}

export default CollectionsHero;