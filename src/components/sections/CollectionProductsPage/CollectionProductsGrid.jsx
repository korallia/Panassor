import ProductCard from "../../ui/ProductCard";
import OrnamentDivider from "../../ui/OrnamentDivider";
import PanassorSectionHeader from "../../layout/PanassorSectionHeader";

function CollectionProductsGrid({ eyebrow, title, description, products }) {
  return (
    <section
      id="produits"
      className="relative overflow-hidden bg-[#080504] px-6 pt-24 pb-32 text-[#f3e7cf]"
    >
      <PanassorSectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        atmosphere="collection"
        className="mx-auto mb-16 max-w-[82rem]"
        ornamentClassName="mt-10"
      />

      <div className="relative z-10 mx-auto max-w-[82rem]">
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>

        <OrnamentDivider className="mt-20" width={112} opacity={0.55} />
      </div>
    </section>
  );
}

export default CollectionProductsGrid;