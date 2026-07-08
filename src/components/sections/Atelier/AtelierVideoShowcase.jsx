import { useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../utils/localization";
import { getAssetUrl } from "../../../utils/assets";

import LazyVideoPlayer from "../../ui/LazyVideoPlayer";
import CornerFrame from "../../ui/CornerFrame";
import CarouselArrow from "../../ui/CarouselArrow";

function getVideoUrl(video) {
  if (!video?.video_url) return "";

  const url = String(video.video_url).trim();

  if (!url) return "";

  const invalidValues = ["null", "undefined", "false", "none"];

  if (invalidValues.includes(url.toLowerCase())) {
    return "";
  }

  return url;
}

function AtelierVideoShowcase({ videos = [], copy = {} }) {
  const { language } = useLanguage();

  const validVideos = videos.filter((video) => getVideoUrl(video));
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!validVideos.length) {
    return null;
  }

  const selectedVideo = validVideos[selectedIndex] ?? validVideos[0];

  const selectedVideoUrl = getVideoUrl(selectedVideo);
  const selectedPoster = selectedVideo.poster_url?.trim() || "";

  const selectedTitle =
    t(selectedVideo, "title", language) ||
    selectedVideo.title_fr ||
    selectedVideo.title_en;

  const selectedEyebrow =
    t(selectedVideo, "eyebrow", language) ||
    selectedVideo.eyebrow_fr ||
    selectedVideo.eyebrow_en;

  const selectedDescription =
    t(selectedVideo, "description", language) ||
    selectedVideo.description_fr ||
    selectedVideo.description_en;

  const previousLabel =
    copy.previousLabel ||
    (language === "en" ? "Previous video" : "Vidéo précédente");

  const nextLabel =
    copy.nextLabel || (language === "en" ? "Next video" : "Vidéo suivante");

  const viewVideoLabel =
    copy.viewVideoLabel ||
    (language === "en" ? "View video" : "Voir la vidéo");

  const goPrevious = () => {
    setSelectedIndex((current) =>
      current === 0 ? validVideos.length - 1 : current - 1
    );
  };

  const goNext = () => {
    setSelectedIndex((current) =>
      current === validVideos.length - 1 ? 0 : current + 1
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
            <LazyVideoPlayer
              key={selectedVideo.id}
              src={getAssetUrl(selectedVideoUrl)}
              poster={selectedPoster ? getAssetUrl(selectedPoster) : undefined}
              title={selectedTitle}
            />

            {validVideos.length > 1 && (
              <>
                <div className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                  <CarouselArrow
                    direction="previous"
                    onClick={goPrevious}
                    label={previousLabel}
                  />
                </div>

                <div className="absolute right-5 top-1/2 z-30 -translate-y-1/2">
                  <CarouselArrow
                    direction="next"
                    onClick={goNext}
                    label={nextLabel}
                  />
                </div>

                <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-3">
                  {validVideos.map((video, index) => {
                    const videoTitle =
                      t(video, "title", language) ||
                      video.title_fr ||
                      video.title_en;

                    return (
                      <button
                        key={video.id}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className={`h-2.5 w-2.5 rounded-full border transition ${
                          index === selectedIndex
                            ? "border-[#c89b3c] bg-[#c89b3c]"
                            : "border-[#c89b3c]/60 bg-transparent hover:bg-[#c89b3c]/40"
                        }`}
                        aria-label={`${viewVideoLabel} ${videoTitle}`}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative z-20 px-1 pt-7">
          {selectedEyebrow && (
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-16 bg-[#c89b3c]/75" />

              <p className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.24em] text-[#c89b3c]/85">
                {selectedEyebrow}
              </p>

              <div className="hidden h-px w-16 bg-[#c89b3c]/55 sm:block" />
            </div>
          )}

          <h3 className="font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] md:text-5xl">
            {selectedTitle}
          </h3>

          {selectedDescription && (
            <p className="mt-3 max-w-4xl font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/78">
              {selectedDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AtelierVideoShowcase;