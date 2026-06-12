import { useNavigate } from "react-router-dom";

import Navbar from "../../layout/Navbar";

function PanassorHero({ collection }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080504] text-[#f7ead2]">
      <section className="relative min-h-screen overflow-hidden bg-[#0b0704]">
        <img
          src={collection.heroImage}
          alt={collection.title}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.78] contrast-[1.12] saturate-[0.92]"
        />

        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/90 via-[#080504]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/85 via-transparent to-[#080504]/55" />

        <div className="pointer-events-none absolute left-4 top-28 z-10 h-20 w-20 border-l-2 border-t-2 border-[#c89b3c]/85" />
        <div className="pointer-events-none absolute right-4 top-28 z-10 h-20 w-20 border-r-2 border-t-2 border-[#c89b3c]/85" />
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 h-20 w-20 border-b-2 border-l-2 border-[#c89b3c]/85" />
        <div className="pointer-events-none absolute bottom-4 right-4 z-10 h-20 w-20 border-b-2 border-r-2 border-[#c89b3c]/85" />

        <div className="pointer-events-none absolute left-8 top-32 z-10 h-10 w-10 border-l border-t border-[#f3d58b]/65" />
        <div className="pointer-events-none absolute right-8 top-32 z-10 h-10 w-10 border-r border-t border-[#f3d58b]/65" />
        <div className="pointer-events-none absolute bottom-8 left-8 z-10 h-10 w-10 border-b border-l border-[#f3d58b]/65" />
        <div className="pointer-events-none absolute bottom-8 right-8 z-10 h-10 w-10 border-b border-r border-[#f3d58b]/65" />

        <Navbar />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center px-6 py-16">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-16 bg-[#d8a24c]/70" />

              <span className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#d8a24c] md:text-base">
                {collection.eyebrow}
              </span>

              <div className="hidden h-px w-16 bg-[#d8a24c]/70 sm:block" />
            </div>

            <h1 className="font-['IM_Fell_English_SC'] text-6xl font-normal uppercase leading-[0.82] tracking-wide text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-8xl xl:text-9xl">
              {collection.title}
            </h1>

            <div className="my-7 flex items-center gap-3 text-[#d8a24c]">
              <div className="h-px w-20 bg-[#d8a24c]/70" />
              <span className="text-xl">✦</span>
              <div className="h-px w-20 bg-[#d8a24c]/70" />
            </div>

            <p className="max-w-xl font-['EB_Garamond'] text-2xl leading-9 text-[#f7ead2]/88 drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)] md:text-3xl md:leading-10">
              {collection.description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(collection.url)}
                className="group relative inline-flex items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
              >
                <span className="mr-3 text-[#f8edd3] group-hover:text-[#120904]">
                  ✦
                </span>
                {collection.cta}
              </button>

              <a
                href="#video"
                className="inline-flex items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
              >
                Voir l’atelier
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PanassorHero;