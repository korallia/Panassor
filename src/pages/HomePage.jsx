import { useCollections, useCollectionDetails } from "../context/CollectionsContext";
import { useLanguage } from "../context/LanguageContext";
import { getCollectionSlug, t } from "../utils/localization";
import { getPageText } from "../utils/content";
import { homeContent } from "../content/homeContent";

import PanassorHero from "../components/sections/HomePage/PanassorHero";
import FeaturedProductsCarousel from "../components/sections/HomePage/FeaturedProductsCarousel";
import VideoPlayer from "../components/layout/VideoPlayer";
import CollectionsHeroCarousel from "../components/sections/HomePage/CollectionsHeroCarousel";

function HomePage() {
  const collections = useCollections();
  const { language } = useLanguage();

  const copy = getPageText(homeContent, language);

  const featured =
    collections.find((collection) => collection.featured) ?? collections[0];

  const featuredSlug = getCollectionSlug(featured, language);

  const { collection: featuredCollection } = useCollectionDetails(featuredSlug);

  if (!featuredCollection) return null;

  return (
    <>
      <PanassorHero collection={featuredCollection} copy={copy.hero} />

      <FeaturedProductsCarousel
        collection={featuredCollection}
        copy={copy.featuredProducts}
      />

      <VideoPlayer
        video={{
          src: featuredCollection.video_url,
          poster: featuredCollection.video_poster_url,
          title: t(featuredCollection, "title", language),
        }}
      />

      <CollectionsHeroCarousel
        collections={collections}
        copy={copy.collectionsCarousel}
      />
    </>
  );
}

export default HomePage;