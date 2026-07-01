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

      {/* Conteneur principal fixe */}
      <div className="relative z-10 mx-auto min-h-[430px] w-full max-w-[1440px] px-6 py-10 sm:px-8">
        <div className="relative min-h-[350px] w-full">
          
          {/* Les équerres de coins : Statiques, elles ne bougent plus et ne s'en vont nulle part */}
          <CornerFrame className="absolute left-0 top-0 opacity-90" />
          <CornerFrame className="absolute bottom-0 right-0 rotate-180 opacity-90" />

          {/* ZONE FIXE : Un padding immuable à gauche (pl-16 passant à pl-28 sur grand écran) 
              qui crée un mur invisible. Le texte est bloqué derrière ce mur et ne touchera JAMAIS les coins. */}
          <div className="flex min-h-[350px] items-center justify-start pl-16 pr-12 sm:pl-20 md:pl-28">
            
            {/* La boîte de contenu a une largeur maximale fixe */}
            <div className="w-full max-w-[620px] flex flex-col items-start text-left">
              
              <OrnamentDivider className="mb-6 w-full max-w-[260px]" />

              <p className="font-['IM_Fell_English_SC'] text-[0.9rem] uppercase tracking-[0.45em] text-[#d6a13b] sm:text-[1rem]">
                Univers Panassor
              </p>

              {/* POLICE FLUIDE AGRESSIVE : 
                  Le titre utilise un clamp qui commence très bas (2.2rem) pour les petits écrans 
                  et grimpe proprement à l'aide des unités de vue (5vw) jusqu'à un maximum de 5.2rem. 
                  C'est la taille de la police qui encaisse la réduction de l'écran, le bloc reste en place. */}
              <h1 className="mt-4 font-['Uncial_Antiqua'] text-[clamp(2.2rem,5vw,5.2rem)] leading-none tracking-[0.02em] text-[#fff1d6] drop-shadow-[0_5px_18px_rgba(0,0,0,0.75)]">
                Collections
              </h1>

              <p className="mt-6 font-['EB_Garamond'] text-[clamp(1.1rem,1.3vw,1.35rem)] font-semibold leading-relaxed text-[#d8c7a1]">
                Des kits immersifs pensés pour enrichir les scènes, soutenir
                les personnages et donner une vraie présence aux moments de
                jeu.
              </p>

              <OrnamentDivider className="mt-6 w-full max-w-[260px]" />
            </div>

          </div>
        </div>
      </div>

      <div className="relative z-10 h-8 border-t border-[#2b1c0d] bg-[#120b06]" />
    </section>
  );
}

export default CollectionsHero;