function formatPrice(priceCents, language = "fr", currency = "CAD") {
  if (priceCents == null) return "";

  const locale = language === "en" ? "en-CA" : "fr-CA";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

function CartItemRow({
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
    <article className="relative py-6 sm:py-7">
      <div className="grid gap-5 sm:grid-cols-[108px_1fr] sm:gap-5">
        <div className="relative flex min-h-[132px] items-center justify-center bg-[#120c07]/55 p-2 sm:min-h-[148px]">
          <div className="pointer-events-none absolute inset-y-3 left-0 w-px bg-[#6f5423]/45" />
          <div className="pointer-events-none absolute inset-y-3 right-0 w-px bg-[#6f5423]/25" />

          {itemImage ? (
            <img
              src={itemImage}
              alt={itemName}
              className="max-h-[136px] w-full object-contain brightness-[0.94] contrast-[1.04] saturate-[0.96] sm:max-h-[152px]"
            />
          ) : (
            <div className="h-[132px] w-full bg-[#080504]/70 sm:h-[148px]" />
          )}
        </div>

        <div className="min-w-0">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="min-w-0">
              <h3 className="font-['EB_Garamond'] text-[1.6rem] leading-7 text-[#f3e7cf] sm:text-[1.8rem] sm:leading-8">
                {itemName}
              </h3>

              {itemMeta && (
                <p className="mt-1 font-['EB_Garamond'] text-base leading-6 text-[#d7c8ad]/78">
                  {itemMeta}
                </p>
              )}
            </div>

            <div className="text-left sm:text-right">
              <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#a47b36]">
                {copy.item.price}
              </p>

              <p className="mt-1 whitespace-nowrap font-['EB_Garamond'] text-[1.55rem] leading-none text-[#d8b56f]">
                {formatPrice(unitPriceCents, language)}
              </p>
            </div>
          </div>

          {item.selectedItems?.length > 0 && (
            <div className="mt-4">
              <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#a47b36]">
                {copy.item.selectedTools}
              </p>

              <div className="mt-2 grid gap-x-5 gap-y-1 font-['EB_Garamond'] text-[0.98rem] leading-5 text-[#d7c8ad]/70 sm:grid-cols-2 sm:text-base sm:leading-6">
                {item.selectedItems.map((selectedItem) => (
                  <p key={selectedItem.productId}>{selectedItem.name}</p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div className="inline-flex border border-[#c89b3c]/62 bg-[#080504]/82 font-['IM_Fell_English_SC'] text-[#d8b56f]">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.cartKey, item.quantity - 1)}
                className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#080504]"
                aria-label={copy.quantity.decrease}
              >
                −
              </button>

              <span className="flex h-9 min-w-10 items-center justify-center border-x border-[#c89b3c]/35 text-sm">
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

                <p className="mt-1 font-['EB_Garamond'] text-[1.35rem] leading-none text-[#e7c97b]">
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

export default CartItemRow;