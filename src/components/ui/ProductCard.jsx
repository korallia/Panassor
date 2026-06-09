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

export default ProductCard;