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
      <div className="group/item grid overflow-hidden border border-[#b8964a] bg-[#1f3324]/95 text-left shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#243c2a] sm:grid-cols-[118px_1fr]">
        {/* IMAGE */}
        <div className="h-full min-h-[150px] overflow-hidden border-b border-[#b8964a]/80 bg-[#080504] sm:border-r sm:border-b-0">
          {itemImage ? (
            <img
              src={itemImage}
              alt={itemName}
              className="h-full w-full object-cover brightness-[0.86] contrast-[1.1] saturate-[0.9]"
            />
          ) : (
            <div className="h-full min-h-[150px] w-full bg-[#080504]" />
          )}
        </div>

        {/* CONTENT */}
        <div className="relative px-5 py-5 sm:px-6">
          <button
            type="button"
            onClick={() => onRemove(item.cartKey)}
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center border border-[#b8964a]/80 bg-[#080504]/80 font-['IM_Fell_English_SC'] text-lg leading-none text-[#d8b56f] transition hover:bg-[#b8964a] hover:text-[#100805]"
            aria-label={copy.remove}
            title={copy.remove}
          >
            ×
          </button>

          <div className="pr-10">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="min-w-0">
                <h3 className="font-['EB_Garamond'] text-[1.55rem] leading-7 text-[#e4c36a] transition group-hover/item:text-[#f0d88d] sm:text-[1.8rem] sm:leading-8">
                  {itemName}
                </h3>

                {itemMeta && (
                  <p className="mt-1 font-['EB_Garamond'] text-base leading-6 text-[#e4c36a]/88 transition group-hover/item:text-[#e7c97b]/90">
                    {itemMeta}
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right">
                <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#d8b56f]/80 transition group-hover/item:text-[#e7c97b]/90">
                  {copy.item.price}
                </p>

                <p className="mt-1 whitespace-nowrap font-['EB_Garamond'] text-[1.55rem] leading-none text-[#e4c36a] transition group-hover/item:text-[#e7c97b]">
                  {formatPrice(unitPriceCents, language)}
                </p>
              </div>
            </div>

            {item.selectedItems?.length > 0 && (
              <div className="mt-4">
                <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#d8b56f]/80 transition group-hover/item:text-[#e7c97b]/90">
                  {copy.item.selectedTools}
                </p>

                <div className="mt-3 grid gap-x-8 gap-y-1 font-['EB_Garamond'] text-[0.98rem] leading-5 text-[#e4c36a]/88 transition group-hover/item:text-[#e7c97b]/90 sm:grid-cols-2 sm:text-base sm:leading-6">
                  {item.selectedItems.map((selectedItem) => (
                    <p key={selectedItem.productId}>{selectedItem.name}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 border-t border-[#b8964a]/45 pt-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="inline-flex border border-[#b8964a]/80 bg-[#080504] font-['IM_Fell_English_SC'] text-[#e4c36a]">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(item.cartKey, item.quantity - 1)
                    }
                    className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#b8964a] hover:text-[#100805]"
                    aria-label={copy.quantity.decrease}
                  >
                    −
                  </button>

                  <span className="flex h-9 min-w-10 items-center justify-center border-x border-[#b8964a]/80 text-sm">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(item.cartKey, item.quantity + 1)
                    }
                    className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#b8964a] hover:text-[#100805]"
                    aria-label={copy.quantity.increase}
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.18em] text-[#d8b56f]/80 transition group-hover/item:text-[#e7c97b]/90">
                    {copy.item.lineTotal}
                  </p>

                  <p className="mt-1 font-['EB_Garamond'] text-[1.4rem] leading-none text-[#e4c36a] transition group-hover/item:text-[#e7c97b]">
                    {formatPrice(lineTotalCents, language)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItemRow;