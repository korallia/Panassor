import { useState } from "react";

import LazyVideoPlayer from "../../ui/LazyVideoPlayer";
import CornerFrame from "../../ui/CornerFrame";

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
    eyebrow: "Vision Panassor Chirgurien",
    title: "La vision derrière le kit du chirgurien",
    description:
      "Une vidéo sur la vision du kit de chirgurien.",
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
    eyebrow: "Vision Panassor tortionnaire",
    title: "La vision derrière le kit du tortionnaire",
    description:
      "Une vidéo sur la vision du kit de tortionnaire.",
    src: "/video/kit-chirurgien-panassor.mp4",
    poster: "/images/PochetteTortionaire.png",
   
  },
];

function AtelierVideoShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedVideo = atelierVideos[selectedIndex];

  return (
    <div className="relative mx-auto max-w-[78rem] border border-[#c89b3c]/60 bg-[#120c07] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.75)]">
      <CornerFrame
        inset="cardImage"
        size="lg"
        thickness="subtle"
        color="gold"
      />

      <div className="relative aspect-video overflow-hidden bg-[#080504]">
        {selectedVideo.src ? (
          <LazyVideoPlayer
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
      </div>

      <div className="pt-7">
        <p className="mb-2 font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.24em] text-[#c89b3c]/80">
          {selectedVideo.eyebrow}
        </p>

        <h3 className="font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] md:text-5xl">
          {selectedVideo.title}
        </h3>

        <p className="mt-3 max-w-4xl font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/78">
          {selectedVideo.description}
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {atelierVideos.map((video, index) => {
          const isSelected = index === selectedIndex;

          return (
            <button
              key={video.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`group relative overflow-hidden border bg-[#080504] text-left transition duration-300 ${
                isSelected
                  ? "border-[#c89b3c]"
                  : "border-[#c89b3c]/25 hover:border-[#c89b3c]/70"
              }`}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.poster}
                  alt={video.title}
                  className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                    isSelected ? "opacity-80" : "opacity-45"
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080504] via-[#080504]/35 to-transparent" />

            

                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-['IM_Fell_English_SC'] text-[10px] uppercase tracking-[0.18em] text-[#c89b3c]/80">
                    {video.eyebrow}
                  </p>

                  <h4 className="font-['IM_Fell_English_SC'] text-xl uppercase leading-none text-[#fff1d2] transition group-hover:text-[#c89b3c]">
                    {video.title}
                  </h4>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AtelierVideoShowcase;