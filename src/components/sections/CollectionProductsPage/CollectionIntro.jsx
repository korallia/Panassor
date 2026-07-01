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

      <CornerFrame className="absolute left-12 top-10 hidden opacity-80 xl:block" />
      <CornerFrame className="absolute right-12 bottom-10 hidden rotate-180 opacity-80 xl:block" />

      <div className="relative z-10 flex min-h-[430px] items-center py-24 sm:min-h-[480px] lg:min-h-[430px]">
        <div className="mx-auto w-full max-w-[1180px] px-8 sm:px-10 md:px-12 lg:px-16 xl:px-20">
          <div className="max-w-[760px]">
            <OrnamentDivider className="mb-8 max-w-[290px]" />

            <p className="font-['IM_Fell_English_SC'] text-[0.9rem] uppercase tracking-[0.45em] text-[#d6a13b] sm:text-[1rem]">
              Univers Panassor
            </p>

            <h1 className="mt-6 font-['Uncial_Antiqua'] text-[clamp(3.3rem,5.6vw,5.8rem)] leading-[0.92] tracking-[0.02em] text-[#fff1d6] drop-shadow-[0_5px_18px_rgba(0,0,0,0.75)]">
              Collections
            </h1>

            <p className="mt-8 max-w-[660px] font-['EB_Garamond'] text-[clamp(1.1rem,1.45vw,1.45rem)] font-semibold leading-relaxed text-[#d8c7a1]">
              Des kits immersifs pensés pour enrichir les scènes, soutenir les
              personnages et donner une vraie présence aux moments de jeu.
            </p>

            <OrnamentDivider className="mt-8 max-w-[290px]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 h-8 border-t border-[#2b1c0d] bg-[#120b06]" />
    </section>
  );
}

export default CollectionsHero;