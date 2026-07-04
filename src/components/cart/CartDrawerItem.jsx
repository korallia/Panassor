function formatPrice(priceCents, language = "fr", currency = "CAD") {
  if (priceCents == null) return "";

  const locale = language === "en" ? "en-CA" : "fr-CA";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

function CartDrawerItem({
  item,
  copy,
  language,
  onUpdateQuantity,
  onRemove,
}) {
  const snapshot = item.displaySnapshot || {};

  const itemName = snapshot.name || item.productSlug || copy.fallbackProductName;
  const itemImage = snapshot.imageUrl;
  const itemMeta = snapshot.meta;
  const itemPriceCents = snapshot.priceCents || 0;

  return (
    <article className="relative overflow-hidden border border-[#6f5423]/75 bg-[#0b0705]/82 p-4 shadow-[0_16px_38px_rgba(0,0,0,0.4)] sm:p-5">
      <div className="pointer-events-none absolute inset-1 border border-[#c89b3c]/10" />

      <div className="relative grid grid-cols-[104px_1fr] gap-4 sm:grid-cols-[124px_1fr] sm:gap-5">
        <div className="overflow-hidden border border-[#6f5423]/75 bg-[#120c07]">
          {itemImage ? (
            <img
              src={itemImage}
              alt={itemName}
              className="h-[122px] w-full object-cover brightness-[0.82] contrast-[1.08] sm:h-[142px]"
            />
          ) : (
            <div className="h-[122px] w-full bg-[#080504] sm:h-[142px]" />
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 pr-2">
              <h3 className="font-['EB_Garamond'] text-2xl leading-7 text-[#e7c97b] sm:text-[1.75rem] sm:leading-8">
                {itemName}
              </h3>

              {itemMeta && (
                <p className="mt-2 font-['EB_Garamond'] text-base leading-6 text-[#d7c8ad]/82 sm:text-lg">
                  {itemMeta}
                </p>
              )}

              {item.selectedItems?.length > 0 && (
                <div className="mt-3 space-y-1 font-['EB_Garamond'] text-sm leading-5 text-[#d7c8ad]/70 sm:text-base">
                  {item.selectedItems.map((selectedItem) => (
                    <p key={selectedItem.productId}>{selectedItem.name}</p>
                  ))}
                </div>
              )}
            </div>

            <p className="shrink-0 font-['EB_Garamond'] text-2xl leading-none text-[#d8b56f] sm:text-[1.7rem]">
              {formatPrice(itemPriceCents * item.quantity, language)}
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <div className="inline-flex border border-[#c89b3c]/75 bg-[#080504] font-['IM_Fell_English_SC'] text-[#d8b56f]">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.cartKey, item.quantity - 1)}
                className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#080504]"
                aria-label={copy.quantity.decrease}
              >
                −
              </button>

              <span className="flex h-9 min-w-10 items-center justify-center text-sm">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => onUpdateQuantity(item.cartKey, item.quantity + 1)}
                className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#080504]"
                aria-label={copy.quantity.increase}
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.cartKey)}
              className="font-['IM_Fell_English_SC'] text-[0.68rem] uppercase tracking-[0.2em] text-[#a47b36] transition hover:text-[#e7c97b]"
            >
              {copy.remove}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartDrawerItem;