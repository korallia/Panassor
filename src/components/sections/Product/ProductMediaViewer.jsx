import CornerFrame from "../../ui/CornerFrame";

function ProductMediaViewer({ selectedMedia, productName }) {
  if (!selectedMedia?.src) {
    return null;
  }

  return (
    <div className="relative min-h-[520px] flex-1 overflow-hidden md:min-h-[620px] lg:min-h-[0px]">
      {selectedMedia.type === "video" ? (
        <video
          src={selectedMedia.src}
          poster={selectedMedia.poster}
          controls
          className="h-full w-full object-cover brightness-[0.78] contrast-[1.1] saturate-[0.92]"
        />
      ) : (
        <img
          src={selectedMedia.src}
          alt={selectedMedia.alt ?? productName}
          className="h-full w-full object-cover brightness-[0.78] contrast-[1.1] saturate-[0.92]"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080504]/35 via-transparent to-[#080504]/12" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.68)]" />

      <CornerFrame size="lg" />
    </div>
  );
}

export default ProductMediaViewer;