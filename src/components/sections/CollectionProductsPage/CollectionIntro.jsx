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

      {/* Conteneur principal calibré */}
      <div className="relative z-10 mx-auto min-h-[430px] w-full max-w-[1440px] px-8 py-10">
        <div className="relative min-h-[350px]">
          
          {/* Les cadres de coins restent fixes aux extrémités de la zone */}
          <CornerFrame className="absolute left-0 top-0 opacity-90" />
          <CornerFrame className="absolute bottom-0 right-0 rotate-180 opacity-90" />

          {/* Zone flex alignée à gauche */}
          <div className="flex min-h-[350px] items-center justify-start">
            
            {/* BLOC TEXTE + LIGNES DÉCORATIVES :
              Le padding (p-12 sm:p-16) crée la zone tampon indispensable pour 
              que ce bloc ne touche plus JAMAIS les coins, peu importe la taille de l'écran.
            */}
            <div className="w-full max-w-[700px] p-12 sm:p-16 flex flex-col items-start">
              
              <OrnamentDivider className="mb-8 w-full max-w-[300px]" />

              <p className="font-['IM_Fell_English_SC'] text-[0.9rem] uppercase tracking-[0.45em] text-[#d6a13b] sm:text-[1rem]">
                Univers Panassor
              </p>

              <h1 className="mt-6 font-['Uncial_Antiqua'] text-[clamp(3.3rem,5.6vw,5.8rem)] leading-[0.92] tracking-[0.02em] text-[#fff1d6] drop-shadow-[0_5px_18px_rgba(0,0,0,0.75)]">
                Collections
              </h1>

              <p className="mt-8 max-w-[660px] font-['EB_Garamond'] text-[clamp(1.1rem,1.45vw,1.45rem)] font-semibold leading-relaxed text-[#d8c7a1]">
                Des kits immersifs pensés pour enrichir les scènes, soutenir
                les personnages et donner une vraie présence aux moments de
                jeu.
              </p>

              <OrnamentDivider className="mt-8 w-full max-w-[300px]" />
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