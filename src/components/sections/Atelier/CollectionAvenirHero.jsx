import { useNavigate } from "react-router-dom";

import CornerFrame from "../../ui/CornerFrame";

function CollectionAvenirHero({ collection, primaryAction, secondaryAction }) {
  const navigate = useNavigate();

  if (!collection) {
    return null;
  }

  return (
    <>
      {/* MOBILE */}
      <div className="relative overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)] md:hidden">
        <img
          src={collection.hero_image_url}
          alt={collection.name_fr}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.78] contrast-[1.08] saturate-[0.92]"
        />

        <div className="absolute inset-0 bg-[#080504]/18" />
        <div className="absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-[#080504]/72 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-[#080504]/97 via-[#080504]/76 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/36 via-transparent to-[#080504]/32" />
        <div className="absolute inset-0 shadow-[inset_0_0_48px_rgba(8,5,4,0.72)]" />

        <div className="pointer-events-none absolute inset-4 border border-[#c89b3c]/14" />
        <div className="pointer-events-none absolute left-6 top-6 h-12 w-12 border-l border-t border-[#c89b3c]/65" />
        <div className="pointer-events-none absolute right-6 top-6 h-12 w-12 border-r border-t border-[#c89b3c]/65" />
        <div className="pointer-events-none absolute bottom-6 left-6 h-12 w-12 border-b border-l border-[#c89b3c]/65" />
        <div className="pointer-events-none absolute bottom-6 right-6 h-12 w-12 border-b border-r border-[#c89b3c]/65" />

        <div className="relative z-10 flex min-h-[680px] flex-col justify-end px-6 py-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px w-16 bg-[#c89b3c]/75" />

            <p className="font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.24em] text-[#c89b3c] drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
              {collection.eyebrow_fr}
            </p>
          </div>

          <h3 className="max-w-[22rem] font-['IM_Fell_English_SC'] text-[clamp(3rem,14vw,4.7rem)] uppercase leading-[0.82] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
            {collection.title_fr}
          </h3>

          <div className="my-7 h-px w-44 bg-gradient-to-r from-[#c89b3c] to-transparent" />

          <p className="max-w-[22rem] font-['EB_Garamond'] text-[1.25rem] leading-7 text-[#d7c8ad]/92 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
            {collection.description_fr}
          </p>

          {(primaryAction || secondaryAction) && (
            <div className="mt-9 flex flex-col gap-3">
              {primaryAction && (
                <a
                  href={primaryAction.href}
                  target={primaryAction.external ? "_blank" : undefined}
                  rel={primaryAction.external ? "noreferrer" : undefined}
                  className="group relative inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-6 py-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
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
                  className="inline-flex w-full items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-6 py-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="relative hidden min-h-[780px] overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)] md:block">
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
    </>
  );
}

export default CollectionAvenirHero;