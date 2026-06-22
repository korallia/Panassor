import { useEffect, useState } from "react";

import ProductCard from "../../ui/ProductCard";
import PageHeroBanner from "../../layout/PageHeroBanner";
import OrnamentDivider from "../../ui/OrnamentDivider";
import PanassorSectionHeader from "../../layout/PanassorSectionHeader";

function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products`
      );

      const data = await response.json();

      setProducts(data);
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <PageHeroBanner
        image="/images/products-hero.png"
        alt="Produits Panassor"
        eyebrow="Catalogue Panassor"
        title="Produits"
        description="Des instruments immersifs, durables et sécuritaires pensés pour enrichir vos scènes de jeu et donner du poids aux rôles non-combattants."
      />

      <section className="relative overflow-hidden bg-[#080504] px-6 pt-24 pb-32">
        <PanassorSectionHeader
          eyebrow="Tous les produits"
          title="Explorer le catalogue"
          description="Chaque accessoire est conçu pour soutenir une ambiance, un geste et une présence en jeu."
          atmosphere="productsIndex"
          className="mx-auto mb-16 max-w-[78rem]"
        />

        <div className="relative z-10 mx-auto max-w-[78rem]">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <OrnamentDivider className="mt-20" width={112} opacity={0.55} />
        </div>
      </section>
    </main>
  );
}

export default ProductsPage;