import CarouselArrow from "../../ui/CarouselArrow";

function ProductMediaRail({
  media = [],
  selectedMediaIndex,
  onSelectMedia,
  onPrevious,
  onNext,
}) {
  if (!media.length) {
    return null;
  }

  return (
    <div className="shrink-0 border-t border-[#6f5423]/55 bg-[#0b0705]/92 px-3 py-3 md:px-5 md:py-5">
      {/* MOBILE */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-color:#c89b3c_#120c07] [scrollbar-width:thin]">
          {media.map((item, index) => {
            const thumbnailSrc =
              item.type === "video" ? item.poster ?? item.src : item.src;

            return (
              <button
                key={`${item.src}-${index}`}
                type="button"
                onClick={() => onSelectMedia(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden border bg-[#120c07] transition ${
                  selectedMediaIndex === index
                    ? "border-[#c89b3c] shadow-[0_0_16px_rgba(200,155,60,0.22)]"
                    : "border-[#6f5423]/65"
                }`}
                aria-label={`Voir le média ${index + 1}`}
              >
                <img
                  src={thumbnailSrc}
                  alt=""
                  className="h-full w-full object-cover brightness-[0.78] contrast-[1.08]"
                />

                <div className="absolute inset-0 shadow-[inset_0_0_16px_rgba(8,5,4,0.55)]" />

                {item.type === "video" && (
                  <span className="absolute inset-x-1 bottom-1 border border-[#c89b3c]/65 bg-[#080504]/82 px-1 py-1 font-['IM_Fell_English_SC'] text-[0.48rem] uppercase tracking-[0.1em] text-[#d8b56f]">
                    Vidéo
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:grid md:grid-cols-[48px_1fr_48px] md:items-center md:gap-4">
        <CarouselArrow
          direction="previous"
          onClick={onPrevious}
          label="Image précédente"
        />

        <div className="grid grid-cols-5 gap-3">
          {media.slice(0, 5).map((item, index) => {
            const thumbnailSrc =
              item.type === "video" ? item.poster ?? item.src : item.src;

            return (
              <button
                key={`${item.src}-${index}`}
                type="button"
                onClick={() => onSelectMedia(index)}
                className={`relative h-[92px] overflow-hidden border bg-[#120c07] transition ${
                  selectedMediaIndex === index
                    ? "border-[#c89b3c] shadow-[0_0_18px_rgba(200,155,60,0.24)]"
                    : "border-[#6f5423]/65 hover:border-[#c89b3c]/80"
                }`}
                aria-label={`Voir le média ${index + 1}`}
              >
                <img
                  src={thumbnailSrc}
                  alt=""
                  className="h-full w-full object-cover brightness-[0.74] contrast-[1.08]"
                />

                {item.type === "video" && (
                  <span className="absolute inset-x-2 bottom-2 border border-[#c89b3c]/65 bg-[#080504]/78 px-2 py-1 font-['IM_Fell_English_SC'] text-[0.58rem] uppercase tracking-[0.14em] text-[#d8b56f]">
                    Vidéo
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <CarouselArrow
          direction="next"
          onClick={onNext}
          label="Image suivante"
        />
      </div>
    </div>
  );
}

export default ProductMediaRail;