import SectionTitle from "../ui/SectionTitle";
import CollectionProductCard from "../ui/CollectionProductCard";

function CollectionProductsGrid({ eyebrow, title, products }) {
  return (
    <section
      id="produits"
      className="relative overflow-hidden bg-[#080504] px-6 pt-24 pb-32 text-[#f3e7cf]"
    >
      {/* Transition douce depuis le bandeau */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#120c07] via-[#080504] to-transparent" />

      {/* Ambiance discrète, pas un décor compétitif */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-[30rem] w-[64rem] -translate-x-1/2 rounded-full bg-[#c89b3c]/9 blur-3xl" />
      <div className="pointer-events-none absolute left-[12%] top-[38rem] h-[34rem] w-[34rem] rounded-full bg-[#15361f]/16 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[52rem] h-[30rem] w-[30rem] rounded-full bg-[#234828]/12 blur-3xl" />

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

        <div className="mb-16 flex items-center justify-center gap-4 text-[#c89b3c]">
          <div className="h-px w-28 bg-gradient-to-r from-transparent to-[#c89b3c]/65" />
          <span className="text-lg">✦</span>
          <div className="h-px w-28 bg-gradient-to-l from-transparent to-[#c89b3c]/65" />
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2">
          {products.map((product) => (
            <CollectionProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-20 flex items-center justify-center gap-4 text-[#c89b3c]">
          <div className="h-px w-28 bg-gradient-to-r from-transparent to-[#c89b3c]/55" />
          <span className="text-lg">✦</span>
          <div className="h-px w-28 bg-gradient-to-l from-transparent to-[#c89b3c]/55" />
        </div>
      </div>
    </section>
  );
}

export default CollectionProductsGrid;