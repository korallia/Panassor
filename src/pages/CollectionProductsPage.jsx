import { Navigate, useParams } from "react-router-dom";

import { useCollectionDetails } from "../context/CollectionsContext";
import { useLocalizedUrl } from "../hooks/useLocalizedUrl";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../utils/localization";
import { getPageText } from "../utils/content";
import { collectionProductsContent } from "../content/collectionProductsContent";

import CollectionIntro from "../components/sections/CollectionProductsPage/CollectionIntro";
import CollectionProductsGrid from "../components/sections/CollectionProductsPage/CollectionProductsGrid";
import FeatureVideoPlayer from "../components/layout/VideoPlayer";

function CollectionProductsPage() {
  const { slug } = useParams();
  const { language } = useLanguage();

  const { collection, notFound } = useCollectionDetails(slug);
  const copy = getPageText(collectionProductsContent, language);

  useLocalizedUrl(collection?.id, `/collections/${slug}`, collection && {
    fr: `/collections/${collection.slug_fr}`,
    en: collection.slug_en ? `/collections/${collection.slug_en}` : "",
  });

  if (notFound) {
    return <Navigate to="/collections" replace />;
  }

  if (!collection) {
    return null;
  }

  const collectionTitle = t(collection, "title", language);

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <CollectionIntro collection={collection} />

      <CollectionProductsGrid
        eyebrow={copy.productsGrid.eyebrow}
        title={collectionTitle}
        description={t(collection, "description", language)}
        products={collection.products}
      />

      <FeatureVideoPlayer
        video={{
          src: collection.video_url,
          poster: collection.video_poster_url,
          title: collectionTitle,
        }}
      />
    </main>
  );
}

export default CollectionProductsPage;