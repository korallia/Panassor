import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionPage from "./pages/CollectionPage";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <div className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collections/:slug" element={<CollectionPage />} />
        <Route path="/produits/:slug" element={<ProductPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;