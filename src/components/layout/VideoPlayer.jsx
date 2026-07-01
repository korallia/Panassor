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
      className="relative overflow-hidden bg-[#080504] px-4 pb-24 pt-18 text-[#f3e7cf] sm:px-6 md:pb-28 md:pt-24 xl:px-8 xl:pb-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(35,72,40,0.22),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,155,60,0.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto grid max-w-[92rem] gap-12 xl:min-h-[640px] xl:grid-cols-[0.82fr_1.18fr] xl:items-center xl:gap-20">
        <div className="mx-auto max-w-[42rem] text-center xl:mx-0 xl:max-w-xl xl:text-left">
          <p className="mb-4 font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.24em] text-[#c89b3c] sm:text-sm">
            {eyebrow}
          </p>

          <h2 className="font-['IM_Fell_English_SC'] text-[clamp(3.1rem,9vw,5.6rem)] uppercase leading-[0.9] text-[#fff1d2] xl:text-8xl">
            {title}
          </h2>

          <div className="mx-auto my-7 h-px w-56 bg-gradient-to-r from-transparent via-[#c89b3c] to-transparent xl:mx-0 xl:bg-gradient-to-r xl:from-[#c89b3c] xl:via-[#c89b3c]/70 xl:to-transparent" />

          <p className="mx-auto mb-9 max-w-[38rem] font-['EB_Garamond'] text-[1.35rem] leading-8 text-[#d7c8ad]/88 sm:text-2xl sm:leading-9 xl:mx-0 xl:text-3xl xl:leading-10">
            {description}
          </p>

          <div className="flex justify-center xl:justify-start">
            <GreenButton />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[52rem] border border-[#c89b3c]/70 bg-[#120c07] p-3 shadow-[0_26px_70px_rgba(0,0,0,0.7)] sm:p-4 md:p-5 xl:max-w-none">
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