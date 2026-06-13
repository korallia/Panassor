import OrnamentDivider from "../../ui/OrnamentDivider";

import { formatPrice } from "../../../data/panassorCollections";

import ProductPanelTitle from "./ProductPanelTitle";
import ProductColorOptions from "./ProductColorOptions";
import CustomizableItemsList from "./CustomizableItemsList";

function ProductPurchasePanel({
  product,
  collection,
  leatherColors = [],
  customizableItems = [],
}) {
  return (
    <aside className="h-full">
      <div className="group relative overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#160e08_0%,#0b0603_100%)] px-8 py-9 text-left shadow-[0_18px_50px_rgba(0,0,0,0.62)] hover:border-[#c89b3c]/90 md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/10" />

        <div className="relative z-10">
          <ProductPanelTitle
            collectionName={collection.name}
            productName={product.name}
            description={product.longDescription ?? product.description}
          />

          <div className="mt-8 max-w-[300px]">
            <p className="font-['EB_Garamond'] text-4xl leading-none text-[#e7c97b]">
              {formatPrice(product.price, product.currency)}
            </p>

            <OrnamentDivider
              className="mt-4 w-52 justify-start"
              width={64}
              opacity={0.5}
            />

            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.16em] text-[#e7c97b] hover:bg-[#c89b3c] hover:text-[#100805]"
            >
              Ajouter au panier
            </button>
          </div>

          <OrnamentDivider
            className="mt-8 w-52 justify-start"
            width={64}
            opacity={0.5}
          />

          <ProductColorOptions colors={leatherColors} />

          {customizableItems.length > 0 && (
            <>
              <OrnamentDivider
                className="mt-7 w-52 justify-start"
                width={64}
                opacity={0.5}
              />

              <CustomizableItemsList items={customizableItems} />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

export default ProductPurchasePanel;