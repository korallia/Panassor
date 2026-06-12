import { getFeaturedCollection, panassorCollections } from "../data/panassorCollections";

import PanassorHero from "../components/sections/HomePage/PanassorHero";
import FeaturedProductsCarousel from "../components/sections/HomePage/FeaturedProductsCarousel";
import VideoPlayer from "../components/sections/VideoPlayer";
import CollectionsHeroCarousel from "../components/sections/HomePage/CollectionsHeroCarousel";
import Footer from "../components/layout/Footer";

function HomePage() {
  const featuredCollection = getFeaturedCollection();

  return (
    <>
      <PanassorHero collection={featuredCollection} />

      <FeaturedProductsCarousel collection={featuredCollection} />

      <VideoPlayer video={featuredCollection.video} />

      <CollectionsHeroCarousel collections={panassorCollections} />

      <Footer />
    </>
  );
}

export default HomePage;