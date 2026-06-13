function ProductColorSwatch({ color, isSelected = false, onClick }) {
  return (
    <button
      type="button"
      title={color.name}
      aria-label={color.name}
      aria-pressed={isSelected}
      onClick={() => onClick?.(color)}
      className={`h-10 w-10 rounded-full border ${
        isSelected
          ? "border-[#e3c17a]"
          : "border-[#6f5423] hover:border-[#c89b3c]"
      }`}
      style={{ backgroundColor: color.value }}
    />
  );
}

export default ProductColorSwatch;