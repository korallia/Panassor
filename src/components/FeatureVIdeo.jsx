function FeatureVideo() {
  return (
    <section className="relative overflow-hidden bg-[#0b0704] px-6 py-24 text-[#f3e7cf]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(35,72,40,0.22),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,155,60,0.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center">
        <div>
          <p className="mb-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
            Vidéo explicative
          </p>

          <h2 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-none text-[#fff1d2] md:text-7xl">
            Pourquoi ce kit existe
          </h2>

          <div className="my-6 h-px w-52 bg-gradient-to-r from-[#c89b3c] to-transparent" />

          <p className="mb-8 font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/88">
            Chaque pièce est pensée pour être manipulée, observée et intégrée
            naturellement au jeu. Cette vidéo présente la logique du kit, ses
            usages en scène et la manière dont il soutient les personnages de
            soin en grandeur nature.
          </p>

          <a
            href="#"
            className="inline-flex items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-4 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
          >
            Voir l’atelier
          </a>
        </div>

        <div className="relative border border-[#c89b3c]/70 bg-[#120c07] p-3 shadow-[0_18px_44px_rgba(0,0,0,0.55)]">
          <div className="absolute -left-3 -top-3 h-16 w-16 border-l-2 border-t-2 border-[#c89b3c]" />
          <div className="absolute -right-3 -top-3 h-16 w-16 border-r-2 border-t-2 border-[#c89b3c]" />
          <div className="absolute -bottom-3 -left-3 h-16 w-16 border-b-2 border-l-2 border-[#c89b3c]" />
          <div className="absolute -bottom-3 -right-3 h-16 w-16 border-b-2 border-r-2 border-[#c89b3c]" />

          <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-[#080504]">
            {/* Remplace ce placeholder par un vrai iframe ou une vidéo plus tard */}
            <img
              src="/images/hero-kit-chirurgien.png"
              alt="Aperçu vidéo du kit chirurgien"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.55] contrast-[1.1]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/80 via-transparent to-[#080504]/40" />

            <button
              className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-[#c89b3c] bg-[#120c07]/80 font-['IM_Fell_English_SC'] text-4xl text-[#e4c36a] shadow-[0_0_28px_rgba(0,0,0,0.55)] transition hover:bg-[#c89b3c] hover:text-[#100805]"
              aria-label="Lire la vidéo"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureVideo;