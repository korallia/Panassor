import CustomizableItemButton from "./CustomizableItemButton";

function CustomizableItemsList({ items = [], onSelectItem }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-8 space-y-3">
      {items.map((item, index) => (
        <CustomizableItemButton
          key={`${item.id}-${index}`}
          item={item}
          index={index}
          onClick={onSelectItem}
        />
      ))}
    </div>
  );
}

export default CustomizableItemsList;