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

  return (
    <section className="relative px-6 pb-4">
      <div className="relative mx-auto max-w-[88rem] overflow-hidden border border-[#6f5423]/75 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.58)]">
        <img
          src={collection.hero_image_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover brightness-[0.26] contrast-[1.18] saturate-[0.9]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/97 via-[#080504]/82 to-[#080504]/38" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/50 via-transparent to-[#080504]/34" />
        <div className="absolute inset-0 shadow-[inset_0_0_76px_rgba(0,0,0,0.82)]" />

        <CornerFrame size="md" />

        <div className="relative z-10 grid min-h-[300px] gap-9 px-8 py-10 md:grid-cols-[1fr_230px] md:px-12">
          <div className="flex max-w-3xl flex-col justify-center">
            <div className="mb-5">
              <div className="mb-4 flex w-72 max-w-full items-center gap-4 text-[#c89b3c]">
                <div className="h-px flex-1 bg-[#c89b3c]/65" />

                <span className="font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.24em] text-[#c89b3c]">
                  L’empreinte Panassor
                </span>

                <div className="h-px flex-1 bg-[#c89b3c]/65" />
              </div>

              <h2 className="font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] md:text-5xl">
                Chaque détail doit mériter sa place en jeu.
              </h2>
            </div>

            <p className="max-w-2xl font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/90">
              La collection {collection.name_fr} est pensée pour les scènes où le
              détail compte. Chaque pièce est conçue pour rester crédible en
              jeu, respecter les exigences du décorum et donner aux joueurs des
              outils qu’ils peuvent manipuler avec fierté.
            </p>

            <p className="mt-4 max-w-2xl font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/84">
              Inspirés par l’histoire, fabriqués au Québec et portés par notre
              passion du grandeur nature, nos kits existent pour enrichir
              l’immersion sans sacrifier la sécurité, la durabilité ou la
              qualité.
            </p>

            <OrnamentDivider
              className="mt-6 justify-start"
              width={96}
              opacity={0.58}
            />

            <Link
              to="/atelier"
              className="mt-7 inline-flex w-fit items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.1em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] hover:bg-[#2a4630] hover:text-[#f7ead2]"
            >
              Découvrir l’atelier
            </Link>
          </div>

          <div className="flex flex-col justify-center gap-4">
            {badges.map(([icon, label]) => (
              <div
                key={label}
                className="flex items-center gap-4 border border-[#6f5423]/70 bg-[#080504]/64 px-4 py-4 shadow-[0_0_22px_rgba(0,0,0,0.32)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b8964a]/80 bg-[#1f3324]/80 font-['IM_Fell_English_SC'] text-lg text-[#e4c36a]">
                  {icon}
                </span>

                <span className="font-['IM_Fell_English_SC'] text-[0.72rem] uppercase leading-4 tracking-[0.16em] text-[#e7c97b]">
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