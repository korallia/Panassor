import { useNavigate } from "react-router-dom";

import CornerFrame from "../../ui/CornerFrame";

function CollectionAvenirHero({ collection, primaryAction, secondaryAction }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[780px] overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
      <img
        src={collection.hero_image_url}
        alt={collection.name_fr}
        className="absolute inset-0 h-full w-full object-cover brightness-[0.65] contrast-[1.12] saturate-[0.9]"
      />

      <div className="absolute inset-0 bg-[#080504]/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/95 via-[#080504]/65 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/85 via-transparent to-[#080504]/50" />

      <CornerFrame size="lg" />

      <div className="relative z-10 flex min-h-[780px] items-center px-8 py-16 md:px-16">
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-px w-16 bg-[#c89b3c]" />

            <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
              {collection.eyebrow_fr}
            </p>

            <div className="hidden h-px w-16 bg-[#c89b3c] sm:block" />
          </div>

          <h3 className="font-['IM_Fell_English_SC'] text-6xl uppercase leading-[0.85] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-8xl">
            {collection.title_fr}
          </h3>

          <div className="my-7 h-px w-52 bg-gradient-to-r from-[#c89b3c] to-transparent" />

          <p className="max-w-xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/90 md:text-3xl md:leading-10">
            {collection.description_fr}
          </p>

          {(primaryAction || secondaryAction) && (
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              {primaryAction && (
                <a
                  href={primaryAction.href}
                  target={primaryAction.external ? "_blank" : undefined}
                  rel={primaryAction.external ? "noreferrer" : undefined}
                  className="group relative inline-flex items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
                >
                  <span className="mr-3 text-[#f8edd3] group-hover:text-[#120904]">
                    ✦
                  </span>
                  {primaryAction.label}
                </a>
              )}

              {secondaryAction && (
                <button
                  type="button"
                  onClick={() => navigate(secondaryAction.href)}
                  className="inline-flex items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollectionAvenirHero;