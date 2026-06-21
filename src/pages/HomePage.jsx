import { useEffect, useState } from "react";

import PanassorHero from "../components/sections/HomePage/PanassorHero";
import FeaturedProductsCarousel from "../components/sections/HomePage/FeaturedProductsCarousel";
import VideoPlayer from "../components/layout/VideoPlayer";
import CollectionsHeroCarousel from "../components/sections/HomePage/CollectionsHeroCarousel";

function HomePage() {
  const [collections, setCollections] = useState([]);
  const [featuredCollection, setFeaturedCollection] = useState(null);

  useEffect(() => {
    async function loadHomePage() {
      const collectionsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/collections`)

      const collectionsData = await collectionsResponse.json();

      const featured =
        collectionsData.find((collection) => collection.featured) ??
        collectionsData[0];

      const featuredResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/collections/${featured.slug}`
      );

      const featuredData = await featuredResponse.json();

      setCollections(collectionsData);
      setFeaturedCollection(featuredData);
    }

    loadHomePage();
  }, []);

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