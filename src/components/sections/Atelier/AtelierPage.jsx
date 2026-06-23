import PageHeroBanner from "../../layout/PageHeroBanner";
import OrnamentDivider from "../../ui/OrnamentDivider";
import CollectionsHeroCarousel from "../HomePage/CollectionsHeroCarousel";
import PanassorSectionHeader from "../../layout/PanassorSectionHeader";
import SectionAtmosphere from "../../layout/SectionAtmosphere";
import SectionTitle from "../../layout/SectionTitle";
import CornerFrame from "../../ui/CornerFrame";

import AtelierVideoShowcase from "./AtelierVideoShowcase";
import AtelierConventionGallery from "./AtelierConventionGallery";

function AtelierPage() {
  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <PageHeroBanner
        image="/images/collections-hero.png"
        alt="Atelier Panassor"
        eyebrow="Dans l’atelier"
        title="Atelier"
        description="Photos, vidéos et sneak peeks futurs dans l’univers Panassor."
      />

      <AtelierConventionGallery />

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
        Panassor crée des kits immersifs pour les personnages qui construisent
        l’histoire autrement : soigneurs, artisans, voleurs, érudits,
        manipulateurs et tous ceux qui font vivre un univers sans forcément
        porter l’épée.
      </p>

      <p className="mt-6 font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/75 md:text-2xl md:leading-9">
        Notre objectif est simple : créer des objets qui ont assez de présence
        pour être remarqués, assez de solidité pour être utilisés, et assez
        d’âme pour devenir une partie du personnage.
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

      <section className="relative overflow-hidden bg-[#080504] px-6 pt-8 pb-24 text-[#f3e7cf]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(35,72,40,0.22),transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,155,60,0.12),transparent_30%)]" />

        <div className="relative z-10 mx-auto max-w-[92rem]">
          <PanassorSectionHeader
            eyebrow="Vidéos d’atelier"
            title="Voir la vision Panassor"
            showAtmosphere={false}
            showTitleDivider={false}
            showOrnament={true}
            ornamentClassName="mt-7"
            className="mx-auto mb-16 max-w-[78rem]"
          />

          <AtelierVideoShowcase />

          <OrnamentDivider
            className="mx-auto mt-20"
            width={112}
            opacity={0.55}
          />
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#080504] px-6 pt-16 pb-32 text-[#f3e7cf]">
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
  Le prochain univers Panassor se prépare dans l’ombre. Suivez-nous sur
  Facebook pour voir les aperçus, les pistes de création et nous laisser vos
  suggestions.
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

      <CollectionsHeroCarousel />
    </main>
  );
}

export default AtelierPage;