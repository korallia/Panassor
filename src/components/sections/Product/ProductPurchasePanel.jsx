import { useEffect, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../utils/localization";

import OrnamentDivider from "../../ui/OrnamentDivider";

import ProductPanelTitle from "./ProductPanelTitle";
import ProductColorOptions from "./ProductColorOptions";
import CustomizableItemsList from "./CustomizableItemsList";
import ToolSelectionModal from "./ToolSelectionModal";

function formatPrice(priceCents, language = "fr", currency = "CAD") {
  if (priceCents == null) return "";

  const locale = language === "en" ? "en-CA" : "fr-CA";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

function ProductPurchasePanel({
  product,
  collection,
  leatherColors = [],
  customizableItems = [],
  selectedColorIndex = 0,
  onSelectColor,
  copy,
}) {
  const { language } = useLanguage();

  const [selectedItems, setSelectedItems] = useState(customizableItems);
  const [toolOptions, setToolOptions] = useState([]);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  useEffect(() => {
    setSelectedItems(customizableItems);
  }, [customizableItems]);

  useEffect(() => {
    async function loadToolOptions() {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/customizable`
      );

      const data = await response.json();
      setToolOptions(data);
    }

    loadToolOptions();
  }, []);

  const collectionName = t(collection, "name", language);
  const productName = t(product, "name", language);
  const productDescription =
    t(product, "long_description", language) ||
    t(product, "description", language);

  const activeItem =
    activeItemIndex !== null ? selectedItems[activeItemIndex] : null;

  const openToolModal = (_, index) => {
    setActiveItemIndex(index);
  };

  const closeToolModal = () => {
    setActiveItemIndex(null);
  };

  const selectTool = (tool) => {
    setSelectedItems((currentItems) =>
      currentItems.map((item, index) =>
        index === activeItemIndex ? tool : item
      )
    );

    closeToolModal();
  };

  return (
    <aside className="h-full">
      <div className="group relative overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#160e08_0%,#0b0603_100%)] px-8 py-9 text-left shadow-[0_18px_50px_rgba(0,0,0,0.62)] hover:border-[#c89b3c]/90 md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/10" />

        <div className="relative z-10">
          <ProductPanelTitle
            collectionName={collectionName}
            productName={productName}
            description={productDescription}
          />

          <div className="mt-8 max-w-[300px]">
            <p className="font-['EB_Garamond'] text-4xl leading-none text-[#e7c97b]">
              {formatPrice(product.price_cents, language)}
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
              {copy.addToCart}
            </button>
          </div>

          <OrnamentDivider
            className="mt-8 w-52 justify-start"
            width={64}
            opacity={0.5}
          />

          <ProductColorOptions
            colors={leatherColors}
            selectedIndex={selectedColorIndex}
            onSelectColor={(_, index) => onSelectColor?.(index)}
          />

          {selectedItems.length > 0 && (
            <>
              <OrnamentDivider
                className="mt-7 w-52 justify-start"
                width={64}
                opacity={0.5}
              />

              <CustomizableItemsList
                items={selectedItems}
                onSelectItem={openToolModal}
              />
            </>
          )}
        </div>
      </div>

      <ToolSelectionModal
        isOpen={activeItemIndex !== null}
        tools={toolOptions}
        selectedItem={activeItem}
        onSelectTool={selectTool}
        onClose={closeToolModal}
      />
    </aside>
  );
}

export default ProductPurchasePanel;