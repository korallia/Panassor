import OrnamentDivider from "../../ui/OrnamentDivider";
import SectionAtmosphere from "../../layout/SectionAtmosphere";
import SectionTitle from "../../layout/SectionTitle";
import CornerFrame from "../../ui/CornerFrame";

function AtelierSneakPeekSection() {
  return (
    <section
      id="sneak-peek"
      className="relative scroll-mt-40 overflow-hidden bg-[#080504] px-6 pt-16 pb-32 text-[#f3e7cf]"
    >
      <SectionAtmosphere variant="featured" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <SectionTitle
            eyebrow="Sneak peek"
            title="Un nouveau kit se prépare"
            align="center"
            showDivider={false}
          />

          <OrnamentDivider className="mt-7" width={112} opacity={0.65} />
        </div>

        <div className="relative min-h-[620px] overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
          <img
            src="/images/kit_de_voleur.jpg"
            alt="Aperçu du futur kit de voleur Panassor"
            className="absolute inset-0 h-full w-full object-cover brightness-[0.52] contrast-[1.12] saturate-[0.9]"
          />

          <div className="absolute inset-0 bg-[#080504]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/96 via-[#080504]/72 to-[#080504]/18" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/88 via-transparent to-[#080504]/50" />

          <CornerFrame size="lg" />

          <div className="relative z-10 flex min-h-[620px] items-center px-8 py-16 md:px-16">
            <div className="max-w-3xl">
              <p className="mb-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
                Prochainement
              </p>

              <h3 className="font-['IM_Fell_English_SC'] text-6xl uppercase leading-[0.85] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-8xl">
                Kit de voleur
              </h3>

              <div className="my-8 h-px w-60 bg-gradient-to-r from-[#c89b3c] to-transparent" />

              <p className="max-w-2xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/90 md:text-3xl md:leading-10">
                Le prochain univers Panassor se prépare dans l’ombre.
                Suivez-nous sur Facebook pour voir les aperçus, les pistes de
                création et nous laisser vos suggestions.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://www.facebook.com/profile.php?id=61587079943525"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
                >
                  <span className="mr-3 text-[#f8edd3] group-hover:text-[#120904]">
                    ✦
                  </span>
                  Suivre sur Facebook
                </a>

                <a
                  href="/collections"
                  className="inline-flex items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
                >
                  Voir les collections
                </a>
              </div>
            </div>
          </div>
        </div>

        <OrnamentDivider className="mt-20" width={112} opacity={0.55} />
      </div>
    </section>
  );
}

export default AtelierSneakPeekSection;