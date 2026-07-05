import CornerFrame from "../../ui/CornerFrame";
import { useLanguage } from "../../../context/LanguageContext";

function ProductMediaViewer({ selectedMedia, productName }) {
  const { language } = useLanguage();

  if (!selectedMedia?.src) {
    return null;
  }

  const isVideo = selectedMedia.type === "video";
  const mediaTitle = selectedMedia.title || selectedMedia.alt || productName;

  const unsupportedLabel =
    language === "en"
      ? "Your browser does not support video playback."
      : "Votre navigateur ne supporte pas la lecture vidéo.";

  return (
    <div className="relative min-h-[420px] flex-1 overflow-hidden bg-[#080504] md:min-h-[560px] lg:min-h-[680px]">
      {isVideo ? (
        <video
          key={selectedMedia.src}
          src={selectedMedia.src}
          poster={selectedMedia.poster || undefined}
          className="h-full w-full object-cover"
          controls
          autoPlay
          muted
          playsInline
          preload="metadata"
          aria-label={mediaTitle}
        >
          {unsupportedLabel}
        </video>
      ) : (
        <img
          src={selectedMedia.src}
          alt={selectedMedia.alt || productName}
          className="h-full w-full object-cover brightness-[0.9] contrast-[1.08] saturate-[0.96]"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080504]/48 via-transparent to-[#080504]/12" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080504]/18 via-transparent to-[#080504]/18" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_rgba(8,5,4,0.58)]" />

      <CornerFrame
        inset="cardImage"
        size="lg"
        thickness="strong"
        color="gold"
      />
    </div>
  );
}

export default ProductMediaViewer;