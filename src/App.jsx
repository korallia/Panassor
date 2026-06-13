import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import RouteReset from "./components/RouteReset";
import CollectionsPage from "./pages/CollectionsPage";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
      <>
       <RouteReset />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/collections/:slug" element={<CollectionPage />} />
      <Route path="/produits/:slug" element={<ProductPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      </>
  );
}

export default App;