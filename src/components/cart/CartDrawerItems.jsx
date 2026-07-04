import CartItemRow from "./CartItemRow";

function CartDrawerItems({
  items = [],
  copy,
  language,
  onUpdateQuantity,
  onRemove,
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="relative">
      <div className="border-y border-[#6f5423]/45">
        {items.map((item, index) => (
          <div
            key={item.cartKey}
            className={index > 0 ? "border-t border-[#6f5423]/28" : ""}
          >
            <CartItemRow
              item={item}
              copy={copy}
              language={language}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default CartDrawerItems;