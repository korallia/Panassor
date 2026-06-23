import { useState } from "react";

import LazyVideoPlayer from "../../ui/LazyVideoPlayer";
import CornerFrame from "../../ui/CornerFrame";
import CarouselArrow from "../../ui/CarouselArrow";

const atelierVideos = [
  {
    id: "kit-chirurgien",
    eyebrow: "Présentation produit",
    title: "Kit Chirurgien",
    description:
      "Une première présentation du kit chirurgien, de son contenu et de sa présence en jeu.",
    src: "/video/kit-chirurgien-panassor.mp4",
    poster: "/images/video-kit-chirurgien-poster.jpg",
  },
  {
    id: "vision-kit-chirurgien",
    eyebrow: "Vision Panassor Chirurgien",
    title: "La vision derrière le kit du chirurgien",
    description: "Une vidéo sur la vision du kit de chirurgien.",
    src: "/video/kit-chirurgien-panassor.mp4",
    poster: "/images/video-kit-chirurgien-poster.jpg",
  },
  {
    id: "kit-tortionnaire",
    eyebrow: "Présentation produit",
    title: "Kit Tortionnaire",
    description:
      "Une première présentation du kit tortionnaire, de son contenu et de sa présence en jeu.",
    src: "/video/kit-chirurgien-panassor.mp4",
    poster: "/images/PochetteTortionaire.png",
  },
  {
    id: "vision-kit-tortionnaire",
    eyebrow: "Vision Panassor Tortionnaire",
    title: "La vision derrière le kit du tortionnaire",
    description: "Une vidéo sur la vision du kit de tortionnaire.",
    src: "/video/kit-chirurgien-panassor.mp4",
    poster: "/images/PochetteTortionaire.png",
  },
];

function AtelierVideoShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedVideo = atelierVideos[selectedIndex];

  const goPrevious = () => {
    setSelectedIndex((current) =>
      current === 0 ? atelierVideos.length - 1 : current - 1
    );
  };

  const goNext = () => {
    setSelectedIndex((current) =>
      current === atelierVideos.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="relative mx-auto max-w-[78rem]">
      <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(circle_at_50%_35%,rgba(200,155,60,0.1),transparent_46%)]" />

      <div className="relative border border-[#c89b3c]/55 bg-[#120c07] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.72)]">
        <CornerFrame inset="outside" size="lg" />

        <div className="relative overflow-hidden bg-[#080504]">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#080504]/72 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_46px_rgba(8,5,4,0.72)]" />

          <div className="relative aspect-video overflow-hidden">
            {selectedVideo.src ? (
              <LazyVideoPlayer
                key={selectedVideo.id}
                src={selectedVideo.src}
                poster={selectedVideo.poster}
                title={selectedVideo.title}
              />
            ) : (
              <>
                <img
                  src={selectedVideo.poster}
                  alt={selectedVideo.title}
                  className="h-full w-full object-cover opacity-25"
                />

                <div className="absolute inset-0 bg-[#080504]/65" />

                <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                  <div>
                    <p className="mb-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
                      À venir
                    </p>

                    <p className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-none text-[#fff1d2] md:text-7xl">
                      Vidéo en préparation
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
              <CarouselArrow
                direction="previous"
                onClick={goPrevious}
                label="Vidéo précédente"
              />
            </div>

            <div className="absolute right-5 top-1/2 z-30 -translate-y-1/2">
              <CarouselArrow
                direction="next"
                onClick={goNext}
                label="Vidéo suivante"
              />
            </div>

            <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-3">
              {atelierVideos.map((video, index) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full border transition ${
                    index === selectedIndex
                      ? "border-[#c89b3c] bg-[#c89b3c]"
                      : "border-[#c89b3c]/60 bg-transparent hover:bg-[#c89b3c]/40"
                  }`}
                  aria-label={`Voir la vidéo ${video.title}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-20 px-1 pt-7">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-px w-16 bg-[#c89b3c]/75" />

            <p className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.24em] text-[#c89b3c]/85">
              {selectedVideo.eyebrow}
            </p>

            <div className="hidden h-px w-16 bg-[#c89b3c]/55 sm:block" />
          </div>

          <h3 className="font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] md:text-5xl">
            {selectedVideo.title}
          </h3>

          <p className="mt-3 max-w-4xl font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/78">
            {selectedVideo.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AtelierVideoShowcase;