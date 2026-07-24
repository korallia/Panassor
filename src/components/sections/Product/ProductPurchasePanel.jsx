import { useEffect, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import { useCart } from "../../../context/CartContext";
import { getProductSlug, t } from "../../../utils/localization";
import { getAssetUrl } from "../../../utils/assets";

import OrnamentDivider from "../../ui/OrnamentDivider";

import ProductPanelTitle from "./ProductPanelTitle";
import ProductColorOptions from "./ProductColorOptions";
import CustomizableItemsList from "./CustomizableItemsList";
import ToolSelectionModal from "./ToolSelectionModal";

function formatPrice(priceCents, language = "fr", currency = "CAD") {
  if (priceCents == null) {
    return "";
  }

  const locale = language === "en" ? "en-CA" : "fr-CA";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(priceCents) / 100);
}

function ProductPurchasePanel({
  product,
  collection,
  productImageUrl,
  leatherColors = [],
  customizableItems = [],
  selectedColorIndex = 0,
  onSelectColor,
  copy = {},
}) {
  const { language } = useLanguage();
  const { addItem } = useCart();

  const [selectedItems, setSelectedItems] = useState(customizableItems);
  const [toolOptions, setToolOptions] = useState([]);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  useEffect(() => {
    setSelectedItems(customizableItems);
  }, [customizableItems]);

  useEffect(() => {
    async function loadToolOptions() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/customizable`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load customizable products: ${response.status}`
          );
        }

        const data = await response.json();

        setToolOptions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Failed to load customizable products:",
          error
        );

        setToolOptions([]);
      }
    }

    loadToolOptions();
  }, []);

  if (!product || !collection) {
    return null;
  }

  const collectionName = t(collection, "name", language);
  const productName = t(product, "name", language);
  const productSlug = getProductSlug(product, language);

  const productDescription =
    t(product, "long_description", language) ||
    t(product, "description", language);

  const selectedColor =
    leatherColors[selectedColorIndex] ??
    leatherColors[0] ??
    null;

  const basePriceCents = Number(product.price_cents || 0);

  const selectedColorPriceDeltaCents = Number(
    selectedColor?.priceDeltaCents ?? 0
  );

  const finalPriceCents = Number(
    selectedColor?.finalPriceCents ??
      basePriceCents + selectedColorPriceDeltaCents
  );

  const cartImageUrl = getAssetUrl(
    productImageUrl || product.image_url
  );

  const addToCartLabel =
    copy.addToCart ||
    (language === "en"
      ? "Add to cart"
      : "Ajouter au panier");

  const activeItem =
    activeItemIndex !== null
      ? selectedItems[activeItemIndex]
      : null;

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

  const handleAddToCart = () => {
    addItem({
      type: product.is_kit ? "kit" : "product",

      productId: product.id,
      productSlug,
      quantity: 1,

      // On garde colorKey pour la compatibilité avec le panier,
      // mais sa valeur correspond maintenant à colors.id.
      colorKey:
        selectedColor?.id != null
          ? String(selectedColor.id)
          : null,

      colorId: selectedColor?.id ?? null,

      colorName_fr:
        selectedColor?.name_fr ||
        selectedColor?.name ||
        "",

      colorName_en:
        selectedColor?.name_en ||
        selectedColor?.name ||
        "",

      selectedItems: selectedItems.map((item) => ({
        productId: item.id,
        productSlug_fr: getProductSlug(item, "fr"),
        productSlug_en: getProductSlug(item, "en"),
        name_fr: t(item, "name", "fr"),
        name_en: t(item, "name", "en"),
      })),

      displaySnapshot: {
        name_fr: t(product, "name", "fr"),
        name_en: t(product, "name", "en"),
        imageUrl: cartImageUrl,
        priceCents: finalPriceCents,
        basePriceCents,
        colorPriceDeltaCents:
          selectedColorPriceDeltaCents,
      },
    });
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
              {formatPrice(finalPriceCents, language)}
            </p>

            {selectedColorPriceDeltaCents > 0 && (
              <p className="mt-2 font-['EB_Garamond'] text-base text-[#d7c8ad]/70">
                {language === "en"
                  ? `Includes ${formatPrice(
                      selectedColorPriceDeltaCents,
                      language
                    )} color supplement`
                  : `Inclut un supplément couleur de ${formatPrice(
                      selectedColorPriceDeltaCents,
                      language
                    )}`}
              </p>
            )}

            <OrnamentDivider
              className="mt-4 w-52 justify-start"
              width={64}
              opacity={0.5}
            />

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-4 inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.16em] text-[#e7c97b] transition hover:bg-[#c89b3c] hover:text-[#100805]"
            >
              {addToCartLabel}
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
            onSelectColor={onSelectColor}
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
                copy={copy}
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