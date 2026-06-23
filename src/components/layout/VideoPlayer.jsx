import LazyVideoPlayer from "../ui/LazyVideoPlayer";
import GreenButton from "../ui/GreenButton";
import CornerFrame from "../ui/CornerFrame";

function VideoPlayer({
  video,
  eyebrow = "Vidéo du produit",
  title = "Voir le kit en action",
  description = "Chaque pièce est pensée pour être manipulée, observée et intégrée naturellement au jeu. Cette vidéo présente le contenu du kit, sa logique de rangement et son usage en scène.",
}) {
  if (!video?.src) return null;

  return (
    <section
      id="video"
      className="relative overflow-hidden bg-[#080504] px-6 pt-20 pb-32 text-[#f3e7cf]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(35,72,40,0.22),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,155,60,0.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto grid min-h-[640px] max-w-[92rem] gap-20 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div className="max-w-xl">
          <p className="mb-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
            {eyebrow}
          </p>

          <h2 className="font-['IM_Fell_English_SC'] text-6xl uppercase leading-[0.9] text-[#fff1d2] md:text-8xl">
            {title}
          </h2>

          <div className="my-7 h-px w-56 bg-gradient-to-r from-[#c89b3c] to-transparent" />

          <p className="mb-9 font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/88 md:text-3xl md:leading-10">
            {description}
          </p>

          <GreenButton/>
        </div>

        <div className="relative border border-[#c89b3c]/70 bg-[#120c07] p-5 shadow-[0_26px_70px_rgba(0,0,0,0.7)]">
          <CornerFrame inset="outside" size="lg" />

          <div className="relative aspect-video overflow-hidden bg-[#080504]">
            <LazyVideoPlayer
              src={video.src}
              poster={video.poster}
              title={video.title}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoPlayer;