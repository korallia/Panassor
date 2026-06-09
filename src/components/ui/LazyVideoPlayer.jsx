import { useState } from "react";

function LazyVideoPlayer({ src, poster, title }) {
  const [isVideoActive, setIsVideoActive] = useState(false);

  if (isVideoActive) {
    return (
      <video
        className="h-full w-full object-cover"
        src={src}
        controls
        autoPlay
        preload="metadata"
      >
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsVideoActive(true)}
      className="group relative h-full w-full"
      aria-label={`Lire la vidéo : ${title}`}
    >
      <img
        src={poster}
        alt={`Aperçu vidéo : ${title}`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover brightness-[0.72] contrast-[1.08] transition duration-500 group-hover:scale-[1.03] group-hover:brightness-[0.85]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/75 via-transparent to-[#080504]/30" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full border border-[#c89b3c] bg-[#120c07]/85 pl-1 font-['IM_Fell_English_SC'] text-4xl text-[#e4c36a] shadow-[0_0_28px_rgba(0,0,0,0.55)] transition group-hover:bg-[#c89b3c] group-hover:text-[#100805]">
          ▶
        </span>
      </div>
    </button>
  );
}

export default LazyVideoPlayer;