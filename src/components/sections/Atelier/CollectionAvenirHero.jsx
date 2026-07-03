import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../utils/localization";

import CornerFrame from "../../ui/CornerFrame";

function CollectionAvenirHero({ collection, primaryAction, secondaryAction }) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  if (!collection) {
    return null;
  }

  const name = t(collection, "name", language);
  const title = t(collection, "title", language);
  const eyebrow = t(collection, "eyebrow", language);
  const description = t(collection, "description", language);

  return (
    <>
      {/* MOBILE */}
      <div className="relative overflow-hidden border border-[#6f5423]/80 bg-[#080504] shadow-[0_18px_60px_rgba(0,0,0,0.6)] md:hidden">
        <div className="relative min-h-[620px] overflow-hidden border-b border-[#6f5423]/70 bg-[#120c07]">
          <img
            src={collection.hero_image_url}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.42] contrast-[1.12] saturate-[0.9]"
          />

          <div className="absolute inset-0 bg-[#080504]/22" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080504]/72 via-[#080504]/28 to-[#080504]/86" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/38 via-transparent to-[#080504]/38" />
          <div className="absolute inset-0 shadow-[inset_0_0_58px_rgba(8,5,4,0.78)]" />

          <CornerFrame
            inset="hero"
            size="lg"
            thickness="strong"
            color="gold"
          />

          <div className="relative z-10 flex min-h-[620px] flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-8 flex w-full max-w-[21rem] items-center justify-center gap-3 text-[#c89b3c]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/70" />

              <p className="shrink-0 font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.26em] text-[#c89b3c] drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                {eyebrow}
              </p>

              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/70" />
            </div>

            <h3 className="mx-auto max-w-[23rem] font-['IM_Fell_English_SC'] text-[clamp(3.1rem,14vw,4.9rem)] uppercase leading-[0.84] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
              {title}
            </h3>

            <div className="mx-auto mt-8 flex w-full max-w-[18rem] items-center justify-center gap-3 text-[#c89b3c]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/70" />
              <span className="text-lg">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/70" />
            </div>
          </div>
        </div>

        <div className="relative px-6 py-10 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,155,60,0.1),transparent_34%)]" />

          <div className="relative z-10">
            <p className="mx-auto max-w-[23rem] font-['EB_Garamond'] text-[1.45rem] leading-8 text-[#d7c8ad]/90">
              {description}
            </p>

            {(primaryAction || secondaryAction) && (
              <div className="mx-auto mt-10 flex max-w-[23rem] flex-col gap-4">
                {primaryAction && (
                  <a
                    href={primaryAction.href}
                    target={primaryAction.external ? "_blank" : undefined}
                    rel={primaryAction.external ? "noreferrer" : undefined}
                    className="group relative inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-6 py-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.1em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
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
                    className="inline-flex w-full items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-6 py-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.1em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="relative hidden min-h-[780px] overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)] md:block">
        <img
          src={collection.hero_image_url}
          alt={name}
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
                {eyebrow}
              </p>

              <div className="hidden h-px w-16 bg-[#c89b3c] sm:block" />
            </div>

            <h3 className="font-['IM_Fell_English_SC'] text-6xl uppercase leading-[0.85] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-8xl">
              {title}
            </h3>

            <div className="my-7 h-px w-52 bg-gradient-to-r from-[#c89b3c] to-transparent" />

            <p className="max-w-xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/90 md:text-3xl md:leading-10">
              {description}
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