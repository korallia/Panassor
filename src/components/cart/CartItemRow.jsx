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
    <article className="relative py-5 sm:py-6">
      <div className="grid overflow-hidden border border-[#c89b3c]/75 bg-[#080504] shadow-[0_14px_34px_rgba(0,0,0,0.36)] sm:grid-cols-[118px_1fr]">
        {/* IMAGE */}
        <div className="flex min-h-[126px] items-center justify-center border-b border-[#c89b3c]/75 bg-[#f3eee4] p-2 sm:min-h-[156px] sm:border-b-0 sm:border-r">
          {itemImage ? (
            <img
              src={itemImage}
              alt={itemName}
              className="max-h-[116px] w-full object-contain sm:max-h-[144px]"
            />
          ) : (
            <div className="h-[116px] w-full bg-[#120c07] sm:h-[144px]" />
          )}
        </div>

        {/* CONTENT */}
        <div className="bg-[#102417] px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="min-w-0">
              <h3 className="font-['EB_Garamond'] text-[1.55rem] leading-7 text-[#f3e7cf] sm:text-[1.8rem] sm:leading-8">
                {itemName}
              </h3>

              {itemMeta && (
                <p className="mt-1 font-['EB_Garamond'] text-base leading-6 text-[#f3e7cf]/86">
                  {itemMeta}
                </p>
              )}
            </div>

            <div className="text-left sm:text-right">
              <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#d8b56f]">
                {copy.item.price}
              </p>

              <p className="mt-1 whitespace-nowrap font-['EB_Garamond'] text-[1.55rem] leading-none text-[#e7c97b]">
                {formatPrice(unitPriceCents, language)}
              </p>
            </div>
          </div>

          {item.selectedItems?.length > 0 && (
            <div className="mt-4">
              <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#d8b56f]">
                {copy.item.selectedTools}
              </p>

              <div className="mt-3 grid gap-x-8 gap-y-1 font-['EB_Garamond'] text-[0.98rem] leading-5 text-[#f3e7cf]/82 sm:grid-cols-2 sm:text-base sm:leading-6">
                {item.selectedItems.map((selectedItem) => (
                  <p key={selectedItem.productId}>{selectedItem.name}</p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 border-t border-[#c89b3c]/35 pt-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="inline-flex border border-[#c89b3c]/75 bg-[#080504] font-['IM_Fell_English_SC'] text-[#d8b56f]">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateQuantity(item.cartKey, item.quantity - 1)
                  }
                  className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#080504]"
                  aria-label={copy.quantity.decrease}
                >
                  −
                </button>

                <span className="flex h-9 min-w-10 items-center justify-center border-x border-[#c89b3c]/45 text-sm">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateQuantity(item.cartKey, item.quantity + 1)
                  }
                  className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#080504]"
                  aria-label={copy.quantity.increase}
                >
                  +
                </button>
              </div>

              <div className="flex items-end gap-5">
                <div className="text-right">
                  <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.18em] text-[#d8b56f]">
                    {copy.item.lineTotal}
                  </p>

                  <p className="mt-1 font-['EB_Garamond'] text-[1.35rem] leading-none text-[#e7c97b]">
                    {formatPrice(lineTotalCents, language)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(item.cartKey)}
                  className="pb-1 font-['IM_Fell_English_SC'] text-[0.66rem] uppercase tracking-[0.18em] text-[#d8b56f] transition hover:text-[#f3e7cf]"
                >
                  {copy.remove}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItemRow;