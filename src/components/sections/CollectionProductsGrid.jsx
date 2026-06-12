import SectionTitle from "../ui/SectionTitle";
import CollectionProductCard from "../ui/CollectionProductCard";

function CollectionProductsGrid({ eyebrow, title, products }) {
  return (
    <section
      id="produits"
      className="relative overflow-hidden bg-[#080504] px-6 py-28 text-[#f3e7cf]"
    >
      {/* Ambiance background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(200,155,60,0.16),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_42%,rgba(35,72,40,0.22),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_58%,rgba(35,72,40,0.18),transparent_28%)]" />

      {/* Side ornaments */}
      <div className="pointer-events-none absolute left-8 top-40 hidden h-[68%] w-px bg-gradient-to-b from-transparent via-[#c89b3c]/55 to-transparent lg:block" />
      <div className="pointer-events-none absolute right-8 top-40 hidden h-[68%] w-px bg-gradient-to-b from-transparent via-[#c89b3c]/55 to-transparent lg:block" />

      <div className="pointer-events-none absolute left-8 top-40 hidden h-px w-28 bg-gradient-to-r from-[#c89b3c]/70 to-transparent lg:block" />
      <div className="pointer-events-none absolute right-8 top-40 hidden h-px w-28 bg-gradient-to-l from-[#c89b3c]/70 to-transparent lg:block" />

      <div className="pointer-events-none absolute bottom-28 left-8 hidden h-px w-28 bg-gradient-to-r from-[#c89b3c]/70 to-transparent lg:block" />
      <div className="pointer-events-none absolute bottom-28 right-8 hidden h-px w-28 bg-gradient-to-l from-[#c89b3c]/70 to-transparent lg:block" />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-32 w-[34rem] -translate-x-1/2 rounded-full bg-[#c89b3c]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-1/2 h-48 w-[44rem] -translate-x-1/2 rounded-full bg-[#234828]/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[84rem]">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          align="center"
          className="mb-8"
        />

        <p className="mx-auto mb-20 max-w-3xl text-center font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/80">
          Chaque pièce de cette collection est pensée pour enrichir le jeu,
          soutenir la narration et donner une vraie présence aux scènes de
          terrain.
        </p>

        <div className="relative">
          {/* Top decorative separator */}
          <div className="mb-12 flex items-center justify-center gap-4 text-[#c89b3c]">
            <div className="h-px w-28 bg-gradient-to-r from-transparent to-[#c89b3c]/70" />
            <span className="text-lg">✦</span>
            <div className="h-px w-28 bg-gradient-to-l from-transparent to-[#c89b3c]/70" />
          </div>

          <div className="grid grid-cols-1 gap-x-14 gap-y-24 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => {
                const remainder = products.length % 3;
                const isLastRowWithTwoItems = remainder === 2 && index >= products.length - 2;

                const centeredClass =
                    isLastRowWithTwoItems && index === products.length - 2
                    ? "xl:col-start-1 xl:translate-x-1/2"
                    : isLastRowWithTwoItems && index === products.length - 1
                        ? "xl:col-start-2 xl:translate-x-1/2"
                        : "";

                return (
                    <div key={product.id} className={centeredClass}>
                    <CollectionProductCard product={product} />
                    </div>
                );
                })}
          </div>

          {/* Bottom decorative separator */}
          <div className="mt-20 flex items-center justify-center gap-4 text-[#c89b3c]">
            <div className="h-px w-28 bg-gradient-to-r from-transparent to-[#c89b3c]/70" />
            <span className="text-lg">✦</span>
            <div className="h-px w-28 bg-gradient-to-l from-transparent to-[#c89b3c]/70" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollectionProductsGrid;