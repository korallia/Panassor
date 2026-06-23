import { Link } from "react-router-dom";

import CornerFrame from "../../ui/CornerFrame";
import OrnamentDivider from "../../ui/OrnamentDivider";

function ProductNarrativeBanner({ collection }) {
  const badges = [
    ["⚜", "Fabrication québécoise"],
    ["✦", "Exigence décorum"],
    ["◌", "Pensé pour le GN"],
    ["◆", "Sécuritaire en jeu"],
    ["◇", "Inspiré de l’histoire"],
  ];

  if (!collection) {
    return null;
  }

  return (
    <section className="relative px-4 pb-4 md:px-6">
      <div className="relative mx-auto max-w-[88rem] overflow-hidden border border-[#6f5423]/75 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.58)]">
        <img
          src={collection.hero_image_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover brightness-[0.2] contrast-[1.18] saturate-[0.9] md:brightness-[0.26]"
        />

        <div className="absolute inset-0 bg-[#080504]/70 md:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080504]/94 via-[#080504]/84 to-[#080504]/96 md:bg-gradient-to-r md:from-[#080504]/97 md:via-[#080504]/82 md:to-[#080504]/38" />
        <div className="absolute inset-0 shadow-[inset_0_0_76px_rgba(0,0,0,0.82)]" />

        {/* MOBILE : cadre léger, pas de gros crochets qui serrent le texte */}
        <div className="pointer-events-none absolute inset-3 z-20 border border-[#c89b3c]/12 md:hidden" />
        <div className="pointer-events-none absolute left-5 top-5 z-20 h-12 w-12 border-l border-t border-[#c89b3c]/55 md:hidden" />
        <div className="pointer-events-none absolute right-5 top-5 z-20 h-12 w-12 border-r border-t border-[#c89b3c]/55 md:hidden" />
        <div className="pointer-events-none absolute bottom-5 left-5 z-20 h-12 w-12 border-b border-l border-[#c89b3c]/55 md:hidden" />
        <div className="pointer-events-none absolute bottom-5 right-5 z-20 h-12 w-12 border-b border-r border-[#c89b3c]/55 md:hidden" />

        {/* DESKTOP */}
        <div className="hidden md:block">
          <CornerFrame size="md" />
        </div>

        <div className="relative z-10 grid gap-10 px-6 py-12 md:min-h-[300px] md:grid-cols-[1fr_230px] md:px-12 md:py-10">
          <div className="flex max-w-3xl flex-col justify-center">
            <div className="mb-7">
              <div className="mb-5 flex w-full items-center gap-3 text-[#c89b3c] md:max-w-[22rem] md:gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/65 md:bg-[#c89b3c]/65" />

                <span className="shrink-0 font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.18em] text-[#c89b3c] md:text-[0.72rem] md:tracking-[0.24em]">
                  L’empreinte Panassor
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/65 md:bg-[#c89b3c]/65" />
              </div>

              <h2 className="font-['IM_Fell_English_SC'] text-[clamp(2.15rem,8.8vw,3.15rem)] uppercase leading-[0.92] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.9)] md:text-5xl md:leading-none">
                Chaque détail doit mériter sa place en jeu.
              </h2>
            </div>

            <div className="space-y-5">
              <p className="max-w-2xl font-['EB_Garamond'] text-[1.22rem] leading-7 text-[#d7c8ad]/90 md:text-xl md:leading-8">
                La collection {collection.name_fr} est pensée pour les scènes où
                le détail compte. Chaque pièce est conçue pour rester crédible
                en jeu, respecter les exigences du décorum et donner aux joueurs
                des outils qu’ils peuvent manipuler avec fierté.
              </p>

              <p className="max-w-2xl font-['EB_Garamond'] text-[1.22rem] leading-7 text-[#d7c8ad]/84 md:text-xl md:leading-8">
                Inspirés par l’histoire, fabriqués au Québec et portés par notre
                passion du grandeur nature, nos kits existent pour enrichir
                l’immersion sans sacrifier la sécurité, la durabilité ou la
                qualité.
              </p>
            </div>

            <OrnamentDivider
              className="mt-8 justify-start"
              width={96}
              opacity={0.58}
            />

            <Link
              to="/atelier"
              className="mt-8 inline-flex w-full items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.1em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2] sm:w-fit md:py-3"
            >
              Découvrir l’atelier
            </Link>
          </div>

          <div className="flex flex-col justify-center gap-3 md:gap-4">
            {badges.map(([icon, label]) => (
              <div
                key={label}
                className="flex items-center gap-4 border border-[#6f5423]/70 bg-[#080504]/58 px-4 py-4 shadow-[0_0_22px_rgba(0,0,0,0.32)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b8964a]/80 bg-[#1f3324]/80 font-['IM_Fell_English_SC'] text-lg text-[#e4c36a]">
                  {icon}
                </span>

                <span className="font-['IM_Fell_English_SC'] text-[0.68rem] uppercase leading-4 tracking-[0.14em] text-[#e7c97b] md:text-[0.72rem] md:tracking-[0.16em]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductNarrativeBanner;