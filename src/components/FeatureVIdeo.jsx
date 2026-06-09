import { useState } from "react";

function FeatureVideo() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#0b0704] px-6 py-36 text-[#f3e7cf]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(35,72,40,0.22),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,155,60,0.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto grid min-h-[560px] max-w-[88rem] gap-16 md:grid-cols-[0.82fr_1.18fr] md:items-center">
        <div className="max-w-xl">
          <p className="mb-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
            Vidéo explicative
          </p>

          <h2 className="font-['IM_Fell_English_SC'] text-6xl uppercase leading-[0.9] text-[#fff1d2] md:text-8xl">
            Voir le kit en action
          </h2>

          <div className="my-7 h-px w-56 bg-gradient-to-r from-[#c89b3c] to-transparent" />

          <p className="mb-9 font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/88 md:text-3xl md:leading-10">
            Chaque pièce est pensée pour être manipulée, observée et intégrée
            naturellement au jeu. Cette vidéo présente le contenu du kit, sa
            logique de rangement et son usage en scène.
          </p>

          <a
            href="#"
            className="inline-flex items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-8 py-4 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
          >
            Découvrir l’atelier
          </a>
        </div>

        <div className="relative border border-[#c89b3c]/70 bg-[#120c07] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.65)]">
          <div className="absolute -left-4 -top-4 h-20 w-20 border-l-2 border-t-2 border-[#c89b3c]" />
          <div className="absolute -right-4 -top-4 h-20 w-20 border-r-2 border-t-2 border-[#c89b3c]" />
          <div className="absolute -bottom-4 -left-4 h-20 w-20 border-b-2 border-l-2 border-[#c89b3c]" />
          <div className="absolute -bottom-4 -right-4 h-20 w-20 border-b-2 border-r-2 border-[#c89b3c]" />

          <div className="relative aspect-video overflow-hidden bg-[#080504]">
            {!isVideoLoaded ? (
              <button
                type="button"
                onClick={() => setIsVideoLoaded(true)}
                className="group relative h-full w-full"
                aria-label="Lire la vidéo"
              >
                <img
                  src="/images/video-kit-chirurgien-poster.jpg"
                  alt="Aperçu vidéo du kit chirurgien"
                  loading="lazy"
                  className="h-full w-full object-cover brightness-[0.72] contrast-[1.08] transition duration-500 group-hover:scale-[1.03] group-hover:brightness-[0.85]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/75 via-transparent to-[#080504]/30" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-24 w-24 items-center justify-center rounded-full border border-[#c89b3c] bg-[#120c07]/85 pl-1 font-['IM_Fell_English_SC'] text-4xl text-[#e4c36a] shadow-[0_0_28px_rgba(0,0,0,0.55)] transition group-hover:bg-[#c89b3c] group-hover:text-[#100805]">
                    ▶
                  </span>
                </div>
              </button>
            ) : (
              <video
                className="h-full w-full object-cover"
                src="/videos/kit-chirurgien-demo.mp4"
                controls
                autoPlay
                preload="none"
              >
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureVideo;