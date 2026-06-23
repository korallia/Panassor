import { useCollections, useCollectionDetails } from "../context/CollectionsContext";

import PanassorHero from "../components/sections/HomePage/PanassorHero";
import FeaturedProductsCarousel from "../components/sections/HomePage/FeaturedProductsCarousel";
import VideoPlayer from "../components/layout/VideoPlayer";
import CollectionsHeroCarousel from "../components/sections/HomePage/CollectionsHeroCarousel";

function HomePage() {
  const collections = useCollections();

  const featured =
    collections.find((collection) => collection.featured) ??
    collections[0];

  const { collection: featuredCollection } = useCollectionDetails(
    featured?.slug
  );

  if (!featuredCollection) return null;

  return (
    <>
      <PanassorHero collection={featuredCollection} />

      <FeaturedProductsCarousel collection={featuredCollection} />

      <VideoPlayer
        video={{
          src: featuredCollection.video_url,
          poster: featuredCollection.video_poster_url,
          title: featuredCollection.title_fr,
        }}
      />

      <CollectionsHeroCarousel collections={collections} />
    </>
  );
}

export default HomePage;