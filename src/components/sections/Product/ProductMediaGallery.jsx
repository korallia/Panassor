import { useEffect, useState } from "react";

import ProductMediaViewer from "./ProductMediaViewer";
import ProductMediaRail from "./ProductMediaRail";

function ProductMediaGallery({ media = [], productName }) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    setSelectedMediaIndex(0);
  }, [media]);

  const selectedMedia = media[selectedMediaIndex] ?? media[0];

  const goPreviousMedia = () => {
    setSelectedMediaIndex((current) =>
      current === 0 ? media.length - 1 : current - 1
    );
  };

  const goNextMedia = () => {
    setSelectedMediaIndex((current) =>
      current === media.length - 1 ? 0 : current + 1
    );
  };

  if (!media.length) {
    return null;
  }

  return (
    <div className="relative h-full">
      <div className="relative flex h-full flex-col overflow-hidden border border-[#6f5423]/75 bg-[#120c07] shadow-[0_22px_70px_rgba(0,0,0,0.68)]">
        <ProductMediaViewer
          selectedMedia={selectedMedia}
          productName={productName}
        />

        <ProductMediaRail
          media={media}
          selectedMediaIndex={selectedMediaIndex}
          onSelectMedia={setSelectedMediaIndex}
          onPrevious={goPreviousMedia}
          onNext={goNextMedia}
        />
      </div>
    </div>
  );
}

export default ProductMediaGallery;