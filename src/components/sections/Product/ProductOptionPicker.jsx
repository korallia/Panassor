// Choix d'option d'un produit (ex. aiguilles de suture) :
// « 1 aiguille / 2 aiguilles » en texte, puis des pastilles pour les
// options de cette quantité (1 : droite ou courbe; 2 : 2 droites,
// 2 courbes ou 1 de chaque). Sans pastilles quand la quantité n'a
// qu'une option (aiguilles de douleur). Le nom de l'option choisie
// s'affiche en sous-titre sous le nom du produit.

const LINE = "M5 19 L19 5";
const CURVE = "M5 19 Q7 6 19 5";

// Dessin de chaque pastille : un ou deux tracés, décalés quand il y en a 2.
const ICONS = {
  droite: [[LINE, 0]],
  courbe: [[CURVE, 0]],
  "droite-droite": [[LINE, -3], [LINE, 3]],
  "courbe-courbe": [[CURVE, -3], [CURVE, 3]],
  "droite-courbe": [[LINE, -3], [CURVE, 3]],
};

// Sans dessin précis (aiguilles de douleur) : 1 ou 2 aiguilles droites.
const ICON_BY_QUANTITY = { 1: "droite", 2: "droite-droite" };

function OptionIcon({ icon, isSelected }) {
  const strokes = ICONS[icon] || [];

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      {strokes.map(([path, shift], index) => (
        <path
          key={index}
          d={path}
          transform={`translate(${shift} ${shift})`}
          fill="none"
          stroke={isSelected ? "#e7c97b" : "#d7c8ad"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function ProductOptionPicker({ options, selectedOption, onSelect, language }) {
  const quantities = [...new Set(options.map((option) => option.quantity))].sort((a, b) => a - b);
  const currentQuantity = selectedOption?.quantity ?? quantities[0];
  const groupOptions = options.filter((option) => option.quantity === currentQuantity);
  const label = (option) => (language === "en" ? option.label_en : option.label_fr);
  const quantityLabel = (quantity) =>
    language === "en"
      ? `${quantity} ${quantity > 1 ? "needles" : "needle"}`
      : `${quantity} ${quantity > 1 ? "aiguilles" : "aiguille"}`;

  // Une seule option par quantité (aiguilles de douleur) : pas besoin du
  // choix « 1 aiguille / 2 aiguilles » en texte, les bulles suffisent.
  const isSimple = quantities.every(
    (quantity) => options.filter((option) => option.quantity === quantity).length === 1
  );
  const bubbleOptions = isSimple
    ? [...options].sort((a, b) => a.quantity - b.quantity)
    : groupOptions;

  // Changer de quantité choisit la première option de ce groupe.
  const selectQuantity = (quantity) => {
    const first = options.find((option) => option.quantity === quantity);
    if (first) onSelect(first.id);
  };

  return (
    <div className="mt-5 max-w-[300px]">
      {/* 1 ou 2 : du texte, l'option choisie en or et soulignée. */}
      {!isSimple && (
      <div
        className="flex gap-6"
        role="group"
        aria-label={language === "en" ? "Quantity" : "Quantité"}
      >
        {quantities.map((quantity) => {
          const isSelected = quantity === currentQuantity;

          return (
            <button
              key={quantity}
              type="button"
              aria-pressed={isSelected}
              onClick={() => selectQuantity(quantity)}
              className={`border-b pb-1 font-['EB_Garamond'] text-xl leading-none transition ${
                isSelected
                  ? "border-[#c89b3c] text-[#e7c97b]"
                  : "border-transparent text-[#d7c8ad]/50 hover:text-[#d7c8ad]/80"
              }`}
            >
              {quantityLabel(quantity)}
            </button>
          );
        })}
      </div>
      )}

      {bubbleOptions.length > 1 && (
        <div className={`${isSimple ? "-mt-px" : "mt-6"} flex flex-wrap gap-4`}>
          {bubbleOptions.map((option) => {
            const isSelected = option.id === selectedOption?.id;

            return (
              <button
                key={option.id}
                type="button"
                title={label(option)}
                aria-label={label(option)}
                aria-pressed={isSelected}
                onClick={() => onSelect(option.id)}
                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition ${
                  isSelected
                    ? "border-[#e3c17a] ring-2 ring-[#e3c17a]/40"
                    : "border-[#6f5423] hover:border-[#c89b3c]"
                }`}
              >
                <OptionIcon
                  icon={option.icon || ICON_BY_QUANTITY[option.quantity]}
                  isSelected={isSelected}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductOptionPicker;
