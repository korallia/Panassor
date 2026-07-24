import ProductColorSwatch from "./ProductColorSwatch";

function ProductColorOptions({
  colors = [],
  selectedIndex = 0,
  onSelectColor,
}) {
  console.log("Couleurs reçues dans ProductColorOptions :", colors);
  if (!colors.length) {
    return null;
  }

  return (
    <div className="mt-5 flex gap-4">
      {colors.map((color, index) => (
       <ProductColorSwatch
          key={color.id || color.name}
          color={color}
          isSelected={index === selectedIndex}
          onClick={() => onSelectColor?.(color, index)}
        />
      ))}
    </div>
  );
}

export default ProductColorOptions;