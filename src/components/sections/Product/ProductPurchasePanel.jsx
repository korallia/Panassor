import { useState } from "react";

import OrnamentDivider from "../../ui/OrnamentDivider";

import { formatPrice } from "../../../data/panassorCollections";

import ProductPanelTitle from "./ProductPanelTitle";
import ProductColorOptions from "./ProductColorOptions";
import CustomizableItemsList from "./CustomizableItemsList";
import ToolSelectionModal from "./ToolSelectionModal";

const toolOptions = [
  {
    id: "spatule",
    slug: "spatule",
    name: "Spatule",
    shortName: "Spatule",
    price: 40.0,
    currency: "CAD",
    image: "/images/spatule.jpg",
    url: "/produits/spatule",
    description:
      "Un outil de manipulation simple pour enrichir les examens et les interventions en scène.",
    featured: false,
    customizable: true,
  },
  {
    id: "curette",
    slug: "curette",
    name: "Curette",
    shortName: "Curette",
    price: 40.0,
    currency: "CAD",
    image: "/images/curette.jpg",
    url: "/produits/curette",
    description:
      "Une pièce spécialisée pour donner plus de réalisme aux scènes de soin et d’intervention.",
    featured: false,
    customizable: true,
  },
  {
    id: "crochet",
    slug: "crochet",
    name: "Crochet",
    shortName: "Crochet",
    price: 40.0,
    currency: "CAD",
    image: "/images/crochet.jpg",
    url: "/produits/crochet",
    description:
      "Un outil fin pour appuyer les manipulations délicates et les scènes médicales tendues.",
    featured: false,
    customizable: true,
  },
  {
    id: "scalpel",
    slug: "scalpel",
    name: "Scalpel",
    shortName: "Scalpel",
    price: 40.0,
    currency: "CAD",
    image: "/images/scalpel.jpg",
    url: "/produits/scalpel",
    description:
      "Un accessoire immersif pour les interventions délicates et les scènes chirurgicales.",
    featured: false,
    customizable: true,
  },
  {
    id: "redresseur",
    slug: "redresseur",
    name: "Le Redresseur",
    shortName: "Redresseur",
    price: 40.0,
    currency: "CAD",
    image: "/images/Redresseur.png",
    url: "/produits/redresseur",
    description:
      "Un outil de scène au nom évocateur, pensé pour imposer une présence froide et inquiétante.",
    featured: false,
    customizable: true,
  },
  {
    id: "correcteur",
    slug: "correcteur",
    name: "Le Correcteur",
    shortName: "Correcteur",
    price: 40.0,
    currency: "CAD",
    image: "/images/Correcteur.png",
    url: "/produits/correcteur",
    description:
      "Un accessoire théâtral pour appuyer les scènes de discipline, de menace et de confrontation.",
    featured: false,
    customizable: true,
  },
  {
    id: "dernier-argument",
    slug: "dernier-argument",
    name: "Le Dernier Argument",
    shortName: "Dernier Argument",
    price: 40.0,
    currency: "CAD",
    image: "/images/Dernier_Argument.png",
    url: "/produits/dernier-argument",
    description:
      "Un outil narratif au nom dramatique, parfait pour faire monter la tension avant une décision finale.",
    featured: false,
    customizable: true,
  },
  {
    id: "pacificateur",
    slug: "pacificateur",
    name: "Le Pacificateur",
    shortName: "Pacificateur",
    price: 40.0,
    currency: "CAD",
    image: "/images/Pacificateur.png",
    url: "/produits/pacificateur",
    description:
      "Un accessoire sombre et ironique pour les personnages qui imposent le silence par leur seule présence.",
    featured: false,
    customizable: true,
  },
];

function ProductPurchasePanel({
  product,
  collection,
  leatherColors = [],
  customizableItems = [],
   selectedColorIndex = 0,
  onSelectColor,
}) {
  const [selectedItems, setSelectedItems] = useState(customizableItems);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  const activeItem =
    activeItemIndex !== null ? selectedItems[activeItemIndex] : null;

  const openToolModal = (item, index) => {
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