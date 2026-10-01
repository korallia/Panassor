import { useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../../../context/CartContext";
import { useLanguage } from "../../../context/LanguageContext";
import {
  getCollectionUrl,
  getProductSlug,
  getProductUrl,
  t,
} from "../../../utils/localization";
import { getAssetUrl } from "../../../utils/assets";

import OrnamentDivider from "../../ui/OrnamentDivider";
import ProductPanelTitle from "./ProductPanelTitle";
import ProductOptionPicker from "./ProductOptionPicker";

function formatPrice(priceCents, language = "fr", currency = "CAD") {
  if (priceCents == null) return "";

  const locale = language === "en" ? "en-CA" : "fr-CA";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

function IndividualProductPanel({ product, collection, copy = {} }) {
  const { language } = useLanguage();
  const { addItem } = useCart();
  // Produit à options (ex. aiguilles : 1 droite, 2 pareilles…) : chaque
  // option a son propre prix. La première est choisie par défaut.
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  if (!product || !collection) {
    return null;
  }

  const options = product.options || [];
  const selectedOption =
    options.find((option) => option.id === selectedOptionId) || options[0] || null;
  const displayedPriceCents = selectedOption ? selectedOption.price_cents : product.price_cents;

  const collectionName = t(collection, "name", language);
  const productName = t(product, "name", language);
  const productSlug = getProductSlug(product, language);

  const productDescription =
    t(product, "long_description", language) ||
    t(product, "description", language);

  const kitProduct = collection.products?.find((item) => item.is_kit);

  const kitUrl = kitProduct
    ? getProductUrl(kitProduct, language)
    : getCollectionUrl(collection, language);

  const kitProductName = kitProduct
    ? t(kitProduct, "name", language)
    : collectionName;

  const productImageUrl =
    product.images?.find((image) => image.is_main)?.url ||
    product.images?.[0]?.url ||
    product.image_url;

  const kitImageUrl =
    kitProduct?.image_url ??
    collection.thumbnail_image_url ??
    collection.hero_image_url;

  const addToCartLabel =
    copy.addToCart || (language === "en" ? "Add to cart" : "Ajouter au panier");

  const completeKitLabel =
    copy.completeKit || (language === "en" ? "Complete kit" : "Kit complet");

  const viewCompleteKitPrefix =
    copy.viewCompleteKitPrefix ||
    (language === "en"
      ? "View the complete kit from the"
      : "Voir la trousse complète de la collection");

  const viewCompleteKitSuffix =
    copy.viewCompleteKitSuffix ||
    (language === "en"
      ? "collection, with the tools designed to accompany this piece in play."
      : "avec les outils pensés pour accompagner cette pièce en jeu.");

  const handleAddToCart = () => {
    addItem({
      type: "product",
      productId: product.id,
      productSlug,
      quantity: 1,
      colorKey: null,
      colorName: "",
      optionId: selectedOption?.id ?? null,
      optionName_fr: selectedOption?.label_fr || "",
      optionName_en: selectedOption?.label_en || "",
      optionQuantity: selectedOption?.quantity ?? null,
      selectedItems: [],
      displaySnapshot: {
        name: productName,
        imageUrl: getAssetUrl(productImageUrl),
        priceCents: displayedPriceCents,
        meta: collectionName,
      },
    });
  };

  return (
    <aside className="h-full">
      <div className="group relative flex h-full min-h-[680px] flex-col overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#160e08_0%,#0b0603_100%)] px-8 py-10 text-left shadow-[0_18px_50px_rgba(0,0,0,0.62)] hover:border-[#c89b3c]/90 md:px-10 md:py-12">
        <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/10" />

        <div className="relative z-10 flex h-full flex-col">
          <ProductPanelTitle
            collectionName={collectionName}
            productName={productName}
            description={productDescription}
          />

          <div className="mt-8 max-w-[300px]">
            <p className="font-['EB_Garamond'] text-4xl leading-none text-[#e7c97b]">
              {formatPrice(displayedPriceCents, language)}
            </p>

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

          {/* Même place que les pastilles de couleur sur la page d'un kit. */}
          {options.length > 0 && (
            <>
              <OrnamentDivider
                className="mt-8 w-52 justify-start"
                width={64}
                opacity={0.5}
              />

              <ProductOptionPicker
                options={options}
                selectedOption={selectedOption}
                onSelect={setSelectedOptionId}
                language={language}
              />
            </>
          )}


          <OrnamentDivider
            className="mt-8 w-52 justify-start"
            width={64}
            opacity={0.5}
          />

          <Link
            to={kitUrl}
            className="mt-9 block max-w-[360px] overflow-hidden border border-[#6f5423]/75 bg-[#080504]/45 transition hover:border-[#b8964a] hover:bg-[#102417]/80"
          >
            <div className="grid min-h-[108px] grid-cols-[96px_1fr]">
              <div className="overflow-hidden border-r border-[#6f5423]/70 bg-[#080504]">
                <img
                  src={getAssetUrl(kitImageUrl)}
                  alt={kitProductName}
                  className="h-full w-full object-contain object-center p-1 brightness-[0.82] contrast-[1.12] saturate-[0.9]"
                />
              </div>

              <div className="flex flex-col justify-center px-4 py-4">
                <p className="font-['IM_Fell_English_SC'] text-[0.68rem] uppercase tracking-[0.2em] text-[#c89b3c]">
                  {completeKitLabel}
                </p>

                <p className="mt-2 font-['EB_Garamond'] text-lg leading-6 text-[#d7c8ad]/84">
                  {viewCompleteKitPrefix}{" "}
                  <span className="text-[#fff1d2]">{collectionName}</span>
                  {language === "en" ? " " : ", "}
                  {viewCompleteKitSuffix}
                </p>
              </div>
            </div>
          </Link>

          <div className="flex-1" />
        </div>
      </div>
    </aside>
  );
}

export default IndividualProductPanel;