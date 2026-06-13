import SectionTitle from "../ui/SectionTitle";
import ProductCard from "../ui/ProductCard";
import SectionAtmosphere from "../ui/SectionAtmosphere";
import OrnamentDivider from "../ui/OrnamentDivider";

function CollectionProductsGrid({ eyebrow, title, products }) {
  return (
    <section
      id="produits"
      className="relative overflow-hidden bg-[#080504] px-6 pt-24 pb-32 text-[#f3e7cf]"
    >
      <SectionAtmosphere variant="collection" />

      <div className="relative z-10 mx-auto max-w-[82rem]">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          align="center"
          className="mb-8"
        />

        <p className="mx-auto mb-16 max-w-3xl text-center font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/82">
          Chaque pièce de cette collection est pensée pour enrichir le jeu,
          soutenir la narration et donner une vraie présence aux scènes de
          terrain.
        </p>

        <OrnamentDivider className="mb-16" />

        <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="grid"
            />
          ))}
        </div>

        <OrnamentDivider className="mt-20" opacity="subtle" />
      </div>
    </section>
  );
}

export default CollectionProductsGrid;