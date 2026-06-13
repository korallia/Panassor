import {
  getFeaturedCollection,
  collectionsList,
} from "../data/panassorCollections";

import PanassorHero from "../components/sections/HomePage/PanassorHero";
import FeaturedProductsCarousel from "../components/sections/HomePage/FeaturedProductsCarousel";
import VideoPlayer from "../components/layout/VideoPlayer";
import CollectionsHeroCarousel from "../components/sections/HomePage/CollectionsHeroCarousel";


function HomePage() {
  const featuredCollection = getFeaturedCollection();

  return (
    <>
      <PanassorHero collection={featuredCollection} />

      <FeaturedProductsCarousel collection={featuredCollection} />

      <VideoPlayer video={featuredCollection.video} />

      <CollectionsHeroCarousel collections={collectionsList} />
    </>
  );
}

export default HomePage;