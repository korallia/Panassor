import CornerFrame from "../../ui/CornerFrame";
import OrnamentDivider from "../../ui/OrnamentDivider";

function CollectionsHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#6f5423]/70 bg-[#080504] text-[#f8ead2]">
      <img
        src="/images/collections/collections-hero.jpg"
        alt="Accessoires médiévaux Panassor"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.42] contrast-[1.08] saturate-[0.85]"
      />

      <div className="absolute inset-0 bg-[#050302]/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050302]/95 via-[#050302]/72 to-[#050302]/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050302]/35 via-transparent to-[#050302]/85" />

      <div className="relative z-10 mx-auto min-h-[430px] w-full max-w-[1440px] px-8 py-10">
        <div className="relative min-h-[350px]">
          {/* Les grands coins extérieurs restent à leur place aux extrémités */}
          <CornerFrame className="absolute left-0 top-0 opacity-90" />
          <CornerFrame className="absolute bottom-0 right-0 rotate-180 opacity-90" />

          {/* On centre le contenu verticalement et on met un padding fluide et raisonnable (ex: px-16 ou px-20) pour éviter les coins */}
          <div className="flex min-h-[350px] items-center px-12 md:px-20">
            
            {/* CORRECTION ICI : Le bloc de l'image image_18bd5e.jpg est isolé, bridé et ne peut plus fuir dans les coins */}
            <div className="w-full max-w-[680px] flex flex-col items-start gap-y-2">
              
              <OrnamentDivider className="mb-4 max-w-[300px]" />

              <p className="font-['IM_Fell_English_SC'] text-[0.9rem] uppercase tracking-[0.45em] text-[#d6a13b] sm:text-[1rem]">
                Univers Panassor
              </p>

              <h1 className="mt-2 font-['Uncial_Antiqua'] text-[clamp(2.8rem,5.2vw,5.2rem)] leading-[0.95] tracking-[0.02em] text-[#fff1d6] drop-shadow-[0_5px_18px_rgba(0,0,0,0.75)]">
                Collections
              </h1>

              <p className="mt-4 max-w-[620px] font-['EB_Garamond'] text-[clamp(1.1rem,1.4vw,1.35rem)] font-semibold leading-relaxed text-[#d8c7a1]">
                Des kits immersifs pensés pour enrichir les scènes, soutenir
                les personnages et donner une vraie présence aux moments de
                jeu.
              </p>

              <OrnamentDivider className="mt-6 max-w-[300px]" />
              
            </div>

          </div>
        </div>
      </div>

      <div className="relative z-10 h-8 border-t border-[#2b1c0d] bg-[#120b06]" />
    </section>
  );
}

export default CollectionsHero;