import ProductColorSwatch from "./ProductColorSwatch";

function ProductColorOptions({
  colors = [],
  selectedIndex = 0,
  onSelectColor,
}) {
  if (!colors.length) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-wrap gap-4">
      {colors.map((color, index) => (
        <ProductColorSwatch
          key={color.id ?? color.name ?? index}
          color={color}
          isSelected={index === selectedIndex}
          onClick={() => onSelectColor?.(index)}
        />
      ))}
    </div>
  );
}

export default ProductColorOptions;