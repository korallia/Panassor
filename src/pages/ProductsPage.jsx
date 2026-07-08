import { useEffect, useState } from "react";

import { getProducts } from "../../backend/panassorApi";

import { useLanguage } from "../context/LanguageContext";
import { getPageText } from "../utils/content";
import { productsContent } from "../content/productsContent";

import ProductCard from "../components/ui/ProductCard";
import PageHeroBanner from "../components/layout/PageHeroBanner";
import OrnamentDivider from "../components/ui/OrnamentDivider";
import PanassorSectionHeader from "../components/layout/PanassorSectionHeader";

const RETRY_DELAY_MS = 3000;

function ProductsPage() {
  const { language } = useLanguage();
  const copy = getPageText(productsContent, language);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    let retryTimeoutId = null;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (!isMounted) return;

        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);

        if (!isMounted) return;

        retryTimeoutId = window.setTimeout(loadProducts, RETRY_DELAY_MS);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;

      if (retryTimeoutId) {
        window.clearTimeout(retryTimeoutId);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <PageHeroBanner
        image={copy.hero.image}
        alt={copy.hero.alt}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
      />

      <section className="relative overflow-hidden bg-[#080504] px-6 pt-24 pb-32">
        <PanassorSectionHeader
          eyebrow={copy.index.eyebrow}
          title={copy.index.title}
          description={copy.index.description}
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