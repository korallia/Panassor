import { useEffect, useRef } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import { getAssetUrl } from "../../../utils/assets";

import CarouselArrow from "../../ui/CarouselArrow";

function VideoThumbnailFallback({ label }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_42%,rgba(200,155,60,0.18),transparent_34%),linear-gradient(180deg,#120c07_0%,#080504_100%)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c89b3c]/85 bg-[#080504]/80 pl-0.5 font-['IM_Fell_English_SC'] text-base text-[#e4c36a]">
        ▶
      </span>

      <span className="sr-only">{label}</span>
    </div>
  );
}

function ProductMediaRail({
  media = [],
  selectedMediaIndex,
  onSelectMedia,
  onPrevious,
  onNext,
}) {
  const thumbnailRefs = useRef([]);
  const { language } = useLanguage();

  const labels = {
    video: language === "en" ? "Video" : "Vidéo",
    media: language === "en" ? "View media" : "Voir le média",
    previous: language === "en" ? "Previous image" : "Image précédente",
    next: language === "en" ? "Next image" : "Image suivante",
  };

  useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[selectedMediaIndex];

    if (!activeThumbnail) {
      return;
    }

    activeThumbnail.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedMediaIndex]);

  if (!media.length) {
    return null;
  }

  function renderThumbnail(item, index, className, labelClassName) {
    const isVideo = item.type === "video";

    /**
     * Important :
     * On ne met jamais item.src comme thumbnail si c’est une vidéo,
     * parce que item.src est un .mp4, pas une image.
     */
    const thumbnailSrc = isVideo ? item.poster : item.src;
    const thumbnailUrl = thumbnailSrc ? getAssetUrl(thumbnailSrc) : "";

    return (
      <button
        key={`${item.src}-${index}`}
        ref={(element) => {
          thumbnailRefs.current[index] = element;
        }}
        type="button"
        onClick={() => onSelectMedia(index)}
        className={className}
        aria-label={`${labels.media} ${index + 1}`}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt=""
            className="h-full w-full object-cover brightness-[0.74] contrast-[1.08]"
          />
        ) : (
          <VideoThumbnailFallback label={labels.video} />
        )}

        <div className="absolute inset-0 shadow-[inset_0_0_18px_rgba(8,5,4,0.58)]" />

        {isVideo && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c89b3c]/85 bg-[#080504]/78 pl-0.5 font-['IM_Fell_English_SC'] text-base text-[#e4c36a] shadow-[0_0_18px_rgba(0,0,0,0.55)]">
                ▶
              </span>
            </div>

            <span className={labelClassName}>{labels.video}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="shrink-0 border-t border-[#6f5423]/55 bg-[#0b0705]/92 px-3 py-3 md:px-5 md:py-5">
      {/* MOBILE */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {media.map((item, index) =>
            renderThumbnail(
              item,
              index,
              `relative h-20 w-20 shrink-0 overflow-hidden border bg-[#120c07] transition ${
                selectedMediaIndex === index
                  ? "border-[#c89b3c] shadow-[0_0_16px_rgba(200,155,60,0.22)]"
                  : "border-[#6f5423]/65"
              }`,
              "absolute inset-x-1 bottom-1 border border-[#c89b3c]/65 bg-[#080504]/82 px-1 py-1 font-['IM_Fell_English_SC'] text-[0.48rem] uppercase tracking-[0.1em] text-[#d8b56f]"
            )
          )}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:grid md:grid-cols-[48px_1fr_48px] md:items-center md:gap-4">
        <CarouselArrow
          direction="previous"
          onClick={onPrevious}
          label={labels.previous}
        />

        {media.length <= 5 ? (
          <div className="grid grid-cols-5 gap-3">
            {media.map((item, index) =>
              renderThumbnail(
                item,
                index,
                `relative h-[92px] overflow-hidden border bg-[#120c07] transition ${
                  selectedMediaIndex === index
                    ? "border-[#c89b3c] shadow-[0_0_18px_rgba(200,155,60,0.24)]"
                    : "border-[#6f5423]/65 hover:border-[#c89b3c]/80"
                }`,
                "absolute inset-x-2 bottom-2 border border-[#c89b3c]/65 bg-[#080504]/78 px-2 py-1 font-['IM_Fell_English_SC'] text-[0.58rem] uppercase tracking-[0.14em] text-[#d8b56f]"
              )
            )}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {media.map((item, index) =>
              renderThumbnail(
                item,
                index,
                `relative h-[92px] w-[128px] shrink-0 overflow-hidden border bg-[#120c07] transition ${
                  selectedMediaIndex === index
                    ? "border-[#c89b3c] shadow-[0_0_18px_rgba(200,155,60,0.24)]"
                    : "border-[#6f5423]/65 hover:border-[#c89b3c]/80"
                }`,
                "absolute inset-x-2 bottom-2 border border-[#c89b3c]/65 bg-[#080504]/78 px-2 py-1 font-['IM_Fell_English_SC'] text-[0.58rem] uppercase tracking-[0.14em] text-[#d8b56f]"
              )
            )}
          </div>
        )}

        <CarouselArrow direction="next" onClick={onNext} label={labels.next} />
      </div>
    </div>
  );
}

export default ProductMediaRail;