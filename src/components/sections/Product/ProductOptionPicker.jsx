// Choix d'option d'un produit (ex. aiguilles de suture) :
// un menu « 1 ou 2 », puis des pastilles pour les options de cette
// quantité (1 : droite ou courbe; 2 : 2 droites, 2 courbes ou 1 de chaque).
// Sans pastilles quand la quantité n'a qu'une option (aiguilles de douleur).

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

function OptionIcon({ icon, isSelected }) {
  const strokes = ICONS[icon] || [];

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      {strokes.map(([path, shift], index) => (
        <path
          key={index}
          d={path}
          transform={`translate(${shift} ${shift})`}
          fill="none"
          stroke={isSelected ? "#e7c97b" : "#d7c8ad"}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function ProductOptionPicker({ options, selectedOption, onSelect, language }) {
  const quantities = [...new Set(options.map((option) => option.quantity))];
  const currentQuantity = selectedOption?.quantity ?? quantities[0];
  const groupOptions = options.filter((option) => option.quantity === currentQuantity);
  const label = (option) => (language === "en" ? option.label_en : option.label_fr);
  const quantityLabel = (quantity) =>
    language === "en"
      ? `${quantity} ${quantity > 1 ? "needles" : "needle"}`
      : `${quantity} ${quantity > 1 ? "aiguilles" : "aiguille"}`;

  const handleQuantityChange = (event) => {
    const quantity = Number(event.target.value);
    const first = options.find((option) => option.quantity === quantity);
    if (first) onSelect(first.id);
  };

  return (
    <div className="mt-7 max-w-[300px]">
      <div className="relative w-52 border-b border-[#c89b3c]/50">
        <select
          value={currentQuantity}
          onChange={handleQuantityChange}
          aria-label={language === "en" ? "Quantity" : "Quantité"}
          className="w-full cursor-pointer appearance-none bg-transparent py-1 pr-8 font-['EB_Garamond'] text-lg text-[#e7c97b] outline-none"
        >
          {quantities.map((quantity) => (
            <option key={quantity} value={quantity} className="bg-[#120b06] text-[#e7c97b]">
              {quantityLabel(quantity)}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#c89b3c]">
          ⌄
        </span>
      </div>

      {groupOptions.length > 1 && (
        <>
          <div className="mt-5 flex gap-3">
            {groupOptions.map((option) => {
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
                  <OptionIcon icon={option.icon} isSelected={isSelected} />
                </button>
              );
            })}
          </div>

          <p className="mt-2 font-['EB_Garamond'] text-base italic text-[#d7c8ad]/75">
            {label(selectedOption)}
          </p>
        </>
      )}
    </div>
  );
}

export default ProductOptionPicker;
