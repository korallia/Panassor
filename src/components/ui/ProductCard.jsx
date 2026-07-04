import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../context/LanguageContext";
import { getProductUrl, t } from "../../utils/localization";

function ProductCard({ product, variant = "carousel" }) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isGrid = variant === "grid";

  if (!product) {
    return null;
  }

  const productName = t(product, "name", language);
  const productDescription = t(product, "description", language);
  const productUrl = getProductUrl(product, language);

  const productButtonLabel =
    language === "en" ? "View product" : "Voir le produit";

  const articleClass = isGrid
    ? "group relative flex h-full cursor-pointer flex-col overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#170f08_0%,#0d0805_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.62)] transition duration-300 hover:-translate-y-1 hover:border-[#c89b3c]/90 hover:shadow-[0_24px_70px_rgba(0,0,0,0.78)]"
    : "group relative flex min-w-[300px] cursor-pointer snap-start flex-col overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#170f08_0%,#0d0805_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.62)] transition duration-300 hover:-translate-y-1 hover:border-[#c89b3c]/90 hover:shadow-[0_24px_70px_rgba(0,0,0,0.78)] sm:min-w-[360px] lg:min-w-[calc(25%-1.125rem)]";

  const imageAspect = isGrid ? "aspect-[5/4]" : "aspect-[4/5]";
  const contentPadding = isGrid ? "p-7" : "p-6";
  const titleHeight = isGrid ? "min-h-[4.5rem]" : "min-h-[5rem]";
  const descHeight = isGrid ? "min-h-[5.5rem]" : "min-h-[6.5rem]";

  const cornerClass =
    "absolute h-12 w-12 border-[#e0b24f] opacity-95 drop-shadow-[0_2px_4px_rgba(8,5,4,0.95)] transition duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_7px_rgba(224,178,79,0.42)]";

  return (
    <article
      className={articleClass}
      role="button"
      tabIndex={0}
      onClick={() => navigate(productUrl)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(productUrl);
        }
      }}
    >
      <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/12" />

      <div className="relative flex h-full flex-col">
        <div className={`relative overflow-hidden bg-[#0b0704] ${imageAspect}`}>
          <img
            src={product.image_url}
            alt={productName}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover brightness-[0.9] contrast-[1.1] saturate-[1.02] transition duration-500 group-hover:scale-[1.035] group-hover:brightness-[0.98]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/66 via-transparent to-[#080504]/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/16 via-transparent to-[#080504]/16" />
          <div className="absolute inset-0 shadow-[inset_0_0_54px_rgba(8,5,4,0.58)]" />

          <div className="absolute inset-0 border border-[#080504]/55" />

          <div className={`${cornerClass} left-4 top-4 border-l-2 border-t-2`} />
          <div className={`${cornerClass} right-4 top-4 border-r-2 border-t-2`} />
          <div className={`${cornerClass} bottom-4 left-4 border-b-2 border-l-2`} />
          <div className={`${cornerClass} bottom-4 right-4 border-b-2 border-r-2`} />

          <div className="absolute left-5 top-5 h-8 w-8 border-l border-t border-[#120c07]/70" />
          <div className="absolute right-5 top-5 h-8 w-8 border-r border-t border-[#120c07]/70" />
          <div className="absolute bottom-5 left-5 h-8 w-8 border-b border-l border-[#120c07]/70" />
          <div className="absolute bottom-5 right-5 h-8 w-8 border-b border-r border-[#120c07]/70" />
        </div>

        <div className={`flex flex-1 flex-col ${contentPadding}`}>
          <div className="mb-4 h-px w-20 bg-[#c89b3c]/70" />

          <h3
            className={`mb-4 font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] ${titleHeight}`}
          >
            {productName}
          </h3>

          <p
            className={`mb-7 font-['EB_Garamond'] text-xl leading-7 text-[#d7c8ad]/86 ${descHeight}`}
          >
            {productDescription}
          </p>

          <div className="mt-auto pt-2">
            <span className="inline-flex w-fit items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-3 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.06em] text-[#e7c97b] transition group-hover:bg-[#c89b3c] group-hover:text-[#100805]">
              {productButtonLabel}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;