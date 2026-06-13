import { Link } from "react-router-dom";

import CornerFrame from "../../ui/CornerFrame";

function ProductNarrativeBanner({ collection }) {
  return (
    <section className="relative px-6 pb-4">
      <div className="relative mx-auto max-w-[88rem] overflow-hidden border border-[#6f5423]/75 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.58)]">
        <img
          src={collection.heroImage ?? collection.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover brightness-[0.3] contrast-[1.15] saturate-[0.88]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/96 via-[#080504]/80 to-[#080504]/42" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/45 via-transparent to-[#080504]/32" />
        <div className="absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.78)]" />

        <CornerFrame size="md" />

        <div className="relative z-10 grid min-h-[260px] gap-8 px-8 py-9 md:grid-cols-[1fr_205px] md:px-12">
          <div className="flex max-w-3xl flex-col justify-center">
            <div className="mb-5 flex w-64 max-w-full items-center gap-4 text-[#c89b3c]">
              <div className="h-px flex-1 bg-[#c89b3c]/65" />

              <span className="font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.24em] text-[#c89b3c]">
                L’atelier Panassor
              </span>

              <div className="h-px flex-1 bg-[#c89b3c]/65" />
            </div>

            <h2 className="font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] md:text-5xl">
              Pensé pour le jeu, façonné pour durer.
            </h2>

            <p className="mt-5 max-w-2xl font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/88">
              Chaque pièce de la collection {collection.name} est conçue pour
              soutenir les scènes sans voler la place aux joueurs. Le kit existe
              pour enrichir l’ambiance, donner du poids aux gestes et faire
              sentir qu’un objet a vraiment sa place dans l’univers.
            </p>

            <Link
              to="/atelier"
              className="mt-7 inline-flex w-fit items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.1em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
            >
              Voir l’atelier
            </Link>
          </div>

          <div className="flex flex-col justify-center gap-4">
            {[
              ["⚜", "100% québécois"],
              ["✦", "Fait pour durer"],
              ["◌", "Petite série"],
            ].map(([icon, label]) => (
              <div
                key={label}
                className="flex items-center gap-4 border border-[#6f5423]/70 bg-[#080504]/60 px-4 py-4"
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