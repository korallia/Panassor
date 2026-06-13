import CustomizableItemButton from "./CustomizableItemButton";

function CustomizableItemsList({ items = [], onSelectItem }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-8 space-y-3">
      {items.map((item) => (
        <CustomizableItemButton
          key={item.id}
          item={item}
          onClick={onSelectItem}
        />
      ))}
    </div>
  );
}

export default CustomizableItemsList;