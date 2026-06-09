import "./index.css";
import PanassorHero from "./components/sections/PanassorHero";
import FeaturedProductsCarousel from "./components/sections/FeaturedProductsCarousel";
import FeatureVideo from "./components/sections/FeatureVIdeoPlayer";
import CollectionsHeroCarousel from "./components/sections/CollectionsHeroCarousel";
import Footer from "./components/layout/Footer";
function App() {
  return (
    <>
      <PanassorHero />
      <FeaturedProductsCarousel />
      <FeatureVideo />
      <CollectionsHeroCarousel />
         <Footer />
    </>
  );
}

export default App;