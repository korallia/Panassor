import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import CollectionProductsPage from "../src/pages/CollectionProductsPage"
import CollectionsPage from "../src/pages/CollectionsPage"
import ProductPage from "./pages/ProductPage";
import RouteReset from "./components/RouteReset";
import ProductsPage from "./pages/ProductsPage";
import AtelierPage from "./pages/AtelierPage";
import  { CollectionsProvider } from "../src/context/CollectionsContext"
function App() {
  return (
      <CollectionsProvider>
    <div className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <Navbar />
  <RouteReset />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collections/:slug" element={<CollectionProductsPage />} />
         <Route path="/produits" element={<ProductsPage />} />
        <Route path="/produits/:slug" element={<ProductPage />} />
        <Route path="/atelier" element={<AtelierPage />} />
      </Routes>

      <Footer />
    </div>
    </CollectionsProvider>
  );
}

export default App;