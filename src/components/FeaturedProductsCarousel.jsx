import { useRef } from "react";

const products = [
  {
    id: 1,
    name: "Kit Chirurgien",
    description:
      "La trousse complète pour incarner les scènes de soin, de tension et de survie.",
    image: "/images/hero-kit-chirurgien.jpg",
  },
  {
    id: 2,
    name: "Aiguilles de suture",
    description:
      "Des pièces visuelles pour enrichir les scènes de couture, de soin et d’intervention.",
    image: "/images/aiguilles_suture.jpg",
  },
  {
    id: 3,
    name: "Pince",
    description:
      "Un outil de manipulation pensé pour les examens, traitements et scènes médicales.",
    image: "/images/pinces.jpg",
  },
  {
    id: 4,
    name: "Bandage",
    description:
      "Un élément simple et efficace pour appuyer les blessures et les soins sur le terrain.",
    image: "/images/bandage.jpg",
  },
  {
    id: 5,
    name: "Crochet",
    description:
      "Un instrument immersif conçu pour ajouter du détail aux scènes de soin spécialisées.",
    image: "/images/crochet.jpg",
  },
  {
    id: 6,
    name: "Spatule",
    description:
      "Une pièce crédible pour les préparations, manipulations et gestes de terrain.",
    image: "/images/spatule.jpg",
  },
  {
    id: 7,
    name: "Scalpel",
    description:
      "Un accessoire de détail pour renforcer le réalisme des scènes chirurgicales.",
    image: "/images/scalpel.jpg",
  },
  {
    id: 8,
    name: "Curette",
    description:
      "Un outil visuel pensé pour les scènes techniques, tendues ou spécialisées.",
    image: "/images/curette.jpg",
  },
];

function ProductCard({ product }) {
  return (
    <article className="group min-w-[300px] snap-start overflow-hidden border border-[#6f5423]/70 bg-[#120c07] shadow-[0_14px_36px_rgba(0,0,0,0.45)] transition duration-300 hover:border-[#c89b3c]/85 hover:shadow-[0_20px_54px_rgba(0,0,0,0.65)] sm:min-w-[360px] lg:min-w-[calc(25%-1.125rem)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0b0704]">
       <img
  src={product.image}
  alt={product.name}
  loading="lazy"
  decoding="async"
  className="h-full w-full object-cover brightness-[0.82] contrast-[1.08] transition duration-500 group-hover:scale-[1.04] group-hover:brightness-[0.95]"
/>

        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/80 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 h-10 w-10 border-l border-t border-[#c89b3c]/75" />
        <div className="absolute right-4 top-4 h-10 w-10 border-r border-t border-[#c89b3c]/75" />
        <div className="absolute bottom-4 left-4 h-10 w-10 border-b border-l border-[#c89b3c]/75" />
        <div className="absolute bottom-4 right-4 h-10 w-10 border-b border-r border-[#c89b3c]/75" />
      </div>

      <div className="p-6">
        <div className="mb-4 h-px w-20 bg-[#c89b3c]/70" />

        <h3 className="mb-3 font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2]">
          {product.name}
        </h3>

        <p className="mb-6 min-h-[5rem] font-['EB_Garamond'] text-xl leading-7 text-[#d7c8ad]/85">
          {product.description}
        </p>

        <a
          href="#"
          className="inline-flex items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-3 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.06em] text-[#e7c97b] transition hover:bg-[#c89b3c] hover:text-[#100805]"
        >
          Voir le produit
        </a>
      </div>
    </article>
  );
}

function FeaturedProductsCarousel() {
  const railRef = useRef(null);

  const scrollLeft = () => {
    railRef.current?.scrollBy({
      left: -520,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    railRef.current?.scrollBy({
      left: 520,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#080504] px-6 py-20 text-[#f3e7cf]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,155,60,0.12),transparent_38%)]" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
              Produits de la collection
            </p>

            <h2 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-none text-[#fff1d2] md:text-7xl">
              Le kit du chirurgien
            </h2>

            <div className="mt-5 h-px w-52 bg-gradient-to-r from-[#c89b3c] to-transparent" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="flex h-12 w-12 items-center justify-center border border-[#c89b3c]/70 bg-[#120c07] font-['IM_Fell_English_SC'] text-3xl leading-none text-[#d8a24c] transition hover:bg-[#c89b3c] hover:text-[#100805]"
              aria-label="Produits précédents"
            >
              ‹
            </button>

            <button
              onClick={scrollRight}
              className="flex h-12 w-12 items-center justify-center border border-[#c89b3c]/70 bg-[#120c07] font-['IM_Fell_English_SC'] text-3xl leading-none text-[#d8a24c] transition hover:bg-[#c89b3c] hover:text-[#100805]"
              aria-label="Produits suivants"
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-color:#c89b3c_#120c07] [scrollbar-width:thin]"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-8 py-4 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
          >
            Voir toute la collection
          </a>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsCarousel;