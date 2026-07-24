function ProductColorSwatch({
  color,
  isSelected = false,
  onClick,
}) {
  const colorName = color?.name || "Couleur";

  return (
    <button
      type="button"
      title={colorName}
      aria-label={colorName}
      aria-pressed={isSelected}
      onClick={onClick}
      className={`h-10 w-10 cursor-pointer rounded-full border transition ${
        isSelected
          ? "border-[#e3c17a] ring-2 ring-[#e3c17a]/40"
          : "border-[#6f5423] hover:border-[#c89b3c]"
      }`}
      style={{
        backgroundColor: color?.value || "transparent",
      }}
    />
  );
}

export default ProductColorSwatch;