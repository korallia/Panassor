import SectionTitle from "../ui/SectionTitle";
import CollectionProductCard from "../ui/CollectionProductCard";

function CollectionProductsGrid({ eyebrow, title, products }) {
  return (
    <section
      id="produits"
      className="relative overflow-hidden bg-[#080504] px-6 py-20 text-[#f3e7cf]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,155,60,0.1),transparent_36%)]" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          align="center"
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <CollectionProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CollectionProductsGrid;