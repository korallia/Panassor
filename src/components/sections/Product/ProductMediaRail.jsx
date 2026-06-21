import CarouselArrow from "../../ui/CarouselArrow";

function ProductMediaRail({
  media = [],
  selectedMediaIndex,
  onSelectMedia,
  onPrevious,
  onNext,
}) {
  return (
    <div className="shrink-0 border-t border-[#6f5423]/55 bg-[#0b0705]/92 px-5 py-5">
      <div className="grid grid-cols-[48px_1fr_48px] items-center gap-4">
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