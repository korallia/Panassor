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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6f5423]/32 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#6f5423]/24 to-transparent" />

      <div className="relative z-10 grid gap-5 sm:grid-cols-[96px_1fr] sm:gap-6">
        <div className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(18,12,7,0.82),rgba(10,16,12,0.72))]">
          <div className="pointer-events-none absolute inset-0 border border-[#6f5423]/38" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(31,51,36,0.26),transparent_46%),radial-gradient(circle_at_25%_80%,rgba(200,155,60,0.06),transparent_38%)]" />

          <div className="flex min-h-[132px] items-center justify-center p-3 sm:min-h-[144px]">
            {itemImage ? (
              <img
                src={itemImage}
                alt={itemName}
                className="max-h-[120px] w-full object-contain brightness-[0.96] contrast-[1.04] saturate-[0.96] sm:max-h-[132px]"
              />
            ) : (
              <div className="h-[120px] w-full bg-[#080504]/60 sm:h-[132px]" />
            )}
          </div>
        </div>

        <div className="relative overflow-hidden bg-[linear-gradient(90deg,rgba(16,10,6,0.66),rgba(20,34,24,0.34)_58%,rgba(16,10,6,0.14))] px-4 py-4 sm:px-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(31,51,36,0.18),transparent_34%)]" />

          <div className="relative z-10">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="min-w-0">
                <h3 className="font-['EB_Garamond'] text-[1.5rem] leading-7 text-[#f3e7cf] sm:text-[1.8rem] sm:leading-8">
                  {itemName}
                </h3>

                {itemMeta && (
                  <p className="mt-1 font-['EB_Garamond'] text-base leading-6 text-[#d7c8ad]/86">
                    {itemMeta}
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right">
                <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#a47b36]">
                  {copy.item.price}
                </p>

                <p className="mt-1 whitespace-nowrap font-['EB_Garamond'] text-[1.55rem] leading-none text-[#e7c97b]">
                  {formatPrice(unitPriceCents, language)}
                </p>
              </div>
            </div>

            {item.selectedItems?.length > 0 && (
              <div className="mt-4">
                <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#b08a43]">
                  {copy.item.selectedTools}
                </p>

                <div className="mt-3 grid gap-x-8 gap-y-1 font-['EB_Garamond'] text-[0.98rem] leading-5 text-[#d7c8ad]/78 sm:grid-cols-2 sm:text-base sm:leading-6">
                  {item.selectedItems.map((selectedItem) => (
                    <p key={selectedItem.productId}>{selectedItem.name}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 border-t border-[#6f5423]/28 pt-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
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
        </div>
      </div>
    </article>
  );
}

export default CartItemRow;