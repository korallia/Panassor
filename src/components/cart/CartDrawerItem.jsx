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
  const unitPriceCents = snapshot.priceCents || 0;
  const lineTotalCents = unitPriceCents * item.quantity;

  return (
    <article className="relative overflow-hidden border border-[#6f5423]/75 bg-[#0b0705]/78 p-3 shadow-[0_18px_44px_rgba(0,0,0,0.42)] sm:p-4">
      <div className="pointer-events-none absolute inset-1 border border-[#c89b3c]/10" />

      <div className="relative grid gap-4 sm:grid-cols-[112px_1fr] sm:gap-5">
        <div className="overflow-hidden border border-[#6f5423]/75 bg-[#120c07]">
          {itemImage ? (
            <img
              src={itemImage}
              alt={itemName}
              className="aspect-[4/3] w-full object-cover brightness-[0.82] contrast-[1.08] sm:aspect-auto sm:h-full sm:min-h-[132px]"
            />
          ) : (
            <div className="aspect-[4/3] w-full bg-[#080504] sm:h-full sm:min-h-[132px]" />
          )}
        </div>

        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="min-w-0">
              <h3 className="font-['EB_Garamond'] text-[1.55rem] leading-7 text-[#e7c97b] sm:text-[1.7rem] sm:leading-8">
                {itemName}
              </h3>

              {itemMeta && (
                <p className="mt-1 font-['EB_Garamond'] text-base leading-6 text-[#d7c8ad]/84">
                  {itemMeta}
                </p>
              )}

              {item.selectedItems?.length > 0 && (
                <div className="mt-3 border-l border-[#6f5423]/70 pl-3 font-['EB_Garamond'] text-sm leading-5 text-[#d7c8ad]/72 sm:text-base sm:leading-6">
                  {item.selectedItems.map((selectedItem) => (
                    <p key={selectedItem.productId}>{selectedItem.name}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="text-left sm:text-right">
              <p className="font-['IM_Fell_English_SC'] text-[0.64rem] uppercase tracking-[0.2em] text-[#a47b36]">
                Prix
              </p>

              <p className="mt-1 whitespace-nowrap font-['EB_Garamond'] text-2xl leading-none text-[#d8b56f]">
                {formatPrice(unitPriceCents, language)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[#6f5423]/45 pt-4">
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

            <div className="flex items-end gap-5">
              <div className="text-right">
                <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.18em] text-[#a47b36]">
                  Total
                </p>

                <p className="mt-1 font-['EB_Garamond'] text-xl leading-none text-[#e7c97b]">
                  {formatPrice(lineTotalCents, language)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.cartKey)}
                className="pb-1 font-['IM_Fell_English_SC'] text-[0.68rem] uppercase tracking-[0.2em] text-[#a47b36] transition hover:text-[#e7c97b]"
              >
                {copy.remove}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartDrawerItem;