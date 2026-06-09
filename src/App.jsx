import "./index.css";
import PanassorHero from "./components/PanassorHero";
import FeaturedProductsCarousel from "./components/FeaturedProductsCarousel";
import FeatureVideo from "./components/FeatureVideo";
import CollectionsHeroCarousel from "./components/CollectionsHeroCarousel";
function App() {
  return (
    <>
      <PanassorHero />
      <FeaturedProductsCarousel />
      <FeatureVideo />
      <CollectionsHeroCarousel />
    </>
  );
}

export default App;