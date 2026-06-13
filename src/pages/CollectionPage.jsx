import { Navigate, useParams } from "react-router-dom";

import { getCollectionBySlug } from "../data/panassorCollections";



import CollectionIntro from "../components/sections/CollectionIntro";
import CollectionProductsGrid from "../components/sections/CollectionProductsGrid";
import FeatureVideoPlayer from "../components/sections/VideoPlayer";

function CollectionPage() {
  const { slug } = useParams();

  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">



      <CollectionIntro collection={collection} />

      <CollectionProductsGrid
        eyebrow={collection.productsSection.eyebrow}
        title={collection.productsSection.title}
        products={collection.products}
      />

      <FeatureVideoPlayer video={collection.video} />

    </main>
  );
}

export default CollectionPage;