import { Navigate, useParams } from "react-router-dom";

import { useCollectionDetails } from "../context/CollectionsContext";

import CollectionIntro from "../components/sections/CollectionProductsPage/CollectionIntro";
import CollectionProductsGrid from "../components/sections/CollectionProductsPage/CollectionProductsGrid";
import FeatureVideoPlayer from "../components/layout/VideoPlayer";

function CollectionProductsPage() {
  const { slug } = useParams();
  const { collection, notFound } = useCollectionDetails(slug);

  if (notFound) {
    return <Navigate to="/collections" replace />;
  }

  if (!collection) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <CollectionIntro collection={collection} />

      <CollectionProductsGrid
        eyebrow="Produits de la collection"
        title={collection.title_fr}
        products={collection.products}
      />

      <FeatureVideoPlayer
        video={{
          src: collection.video_url,
          poster: collection.video_poster_url,
          title: collection.title_fr,
        }}
      />
    </main>
  );
}

export default CollectionProductsPage;