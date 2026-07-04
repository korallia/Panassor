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
    <article className="relative border border-[#6f5423]/70 bg-[#0b0705]/72 p-4 shadow-[0_14px_36px_rgba(0,0,0,0.34)]">
      <div className="grid gap-4 sm:grid-cols-[118px_1fr] sm:gap-5">
        <div className="flex min-h-[138px] items-center justify-center border border-[#6f5423]/55 bg-[#120c07]/80 p-2">
          {itemImage ? (
            <img
              src={itemImage}
              alt={itemName}
              className="max-h-[136px] w-full object-contain brightness-[0.92] contrast-[1.04] saturate-[0.96]"
            />
          ) : (
            <div className="h-[136px] w-full bg-[#080504]" />
          )}
        </div>

        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="min-w-0">
              <h3 className="font-['EB_Garamond'] text-[1.45rem] leading-7 text-[#e7c97b] sm:text-[1.6rem]">
                {itemName}
              </h3>

              {itemMeta && (
                <p className="mt-1 font-['EB_Garamond'] text-base leading-6 text-[#d7c8ad]/82">
                  {itemMeta}
                </p>
              )}
            </div>

            <div className="text-left sm:text-right">
              <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#a47b36]">
                {copy.item.price}
              </p>

              <p className="mt-1 whitespace-nowrap font-['EB_Garamond'] text-xl leading-none text-[#d8b56f]">
                {formatPrice(unitPriceCents, language)}
              </p>
            </div>
          </div>

          {item.selectedItems?.length > 0 && (
            <div className="mt-3 font-['EB_Garamond'] text-sm leading-5 text-[#d7c8ad]/70 sm:text-base sm:leading-6">
              <p className="mb-1 font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.18em] text-[#a47b36]">
                {copy.item.selectedTools}
              </p>

              <div className="grid gap-x-4 sm:grid-cols-2">
                {item.selectedItems.map((selectedItem) => (
                  <p key={selectedItem.productId}>{selectedItem.name}</p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[#6f5423]/40 pt-4">
            <div className="inline-flex border border-[#c89b3c]/70 bg-[#080504] font-['IM_Fell_English_SC'] text-[#d8b56f]">
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
                  {copy.item.lineTotal}
                </p>

                <p className="mt-1 font-['EB_Garamond'] text-xl leading-none text-[#e7c97b]">
                  {formatPrice(lineTotalCents, language)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.cartKey)}
                className="pb-1 font-['IM_Fell_English_SC'] text-[0.66rem] uppercase tracking-[0.18em] text-[#a47b36] transition hover:text-[#e7c97b]"
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