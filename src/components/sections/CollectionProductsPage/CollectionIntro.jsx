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

      {/* DESKTOP */}
      <div className="relative z-10 hidden min-h-[370px] w-full items-center xl:flex">
        <div className="relative mx-auto w-full max-w-[1440px] px-8">
          <CornerFrame className="absolute left-8 top-8 opacity-90" />
          <CornerFrame className="absolute bottom-8 right-8 rotate-180 opacity-90" />

          <div className="pl-[10.5rem] pr-16 py-16">
            <div className="max-w-[760px]">
              <OrnamentDivider className="mb-8 max-w-[290px]" />

              <p className="font-['IM_Fell_English_SC'] text-[0.9rem] uppercase tracking-[0.45em] text-[#d6a13b]">
                Univers Panassor
              </p>

              <h1 className="mt-6 font-['Uncial_Antiqua'] text-[5rem] leading-[0.92] tracking-[0.02em] text-[#fff1d6] drop-shadow-[0_5px_18px_rgba(0,0,0,0.75)]">
                Collections
              </h1>

              <p className="mt-8 max-w-[660px] font-['EB_Garamond'] text-[1.35rem] font-semibold leading-relaxed text-[#d8c7a1]">
                Des kits immersifs pensés pour enrichir les scènes, soutenir les
                personnages et donner une vraie présence aux moments de jeu.
              </p>

              <OrnamentDivider className="mt-8 max-w-[290px]" />
            </div>
          </div>
        </div>
      </div>

      {/* TABLETTE / MOBILE */}
      <div className="relative z-10 flex min-h-[390px] items-center px-7 py-16 sm:px-10 md:px-14 xl:hidden">
        <div className="mx-auto w-full max-w-[760px]">
          <OrnamentDivider className="mb-7 max-w-[280px]" />

          <p className="font-['IM_Fell_English_SC'] text-[0.82rem] uppercase tracking-[0.38em] text-[#d6a13b] sm:text-[0.9rem]">
            Univers Panassor
          </p>

          <h1 className="mt-5 font-['Uncial_Antiqua'] text-[clamp(3.2rem,10vw,5rem)] leading-[0.92] tracking-[0.02em] text-[#fff1d6] drop-shadow-[0_5px_18px_rgba(0,0,0,0.75)]">
            Collections
          </h1>

          <p className="mt-7 max-w-[620px] font-['EB_Garamond'] text-[clamp(1.1rem,3vw,1.35rem)] font-semibold leading-relaxed text-[#d8c7a1]">
            Des kits immersifs pensés pour enrichir les scènes, soutenir les
            personnages et donner une vraie présence aux moments de jeu.
          </p>

          <OrnamentDivider className="mt-7 max-w-[280px]" />
        </div>
      </div>

      <div className="relative z-10 h-8 border-t border-[#2b1c0d] bg-[#120b06]" />
    </section>
  );
}

export default CollectionsHero;