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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6f5423]/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#6f5423]/25 to-transparent" />

      <div className="relative z-10 grid gap-5 sm:grid-cols-[96px_1fr] sm:gap-0">
        {/* IMAGE */}
        <div className="relative overflow-hidden border border-[#6f5423]/55 bg-[#120c07]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(31,51,36,0.22),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_28px_rgba(0,0,0,0.35)]" />

          <div className="flex min-h-[140px] items-center justify-center p-3 sm:min-h-[154px]">
            {itemImage ? (
              <img
                src={itemImage}
                alt={itemName}
                className="max-h-[124px] w-full object-contain brightness-[0.96] contrast-[1.04] saturate-[0.94] sm:max-h-[138px]"
              />
            ) : (
              <div className="h-[124px] w-full bg-[#080504]/60 sm:h-[138px]" />
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative overflow-hidden border border-l-0 border-[#6f5423]/55 bg-[#120c07]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(31,51,36,0.96)_0%,rgba(31,51,36,0.88)_52%,rgba(18,12,7,0.96)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(200,155,60,0.07),transparent_24%),radial-gradient(circle_at_18%_80%,rgba(31,51,36,0.35),transparent_28%)]" />
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_32px_rgba(0,0,0,0.28)]" />

          <div className="relative z-10 px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="min-w-0">
                <h3 className="font-['EB_Garamond'] text-[1.55rem] leading-7 text-[#f3e7cf] sm:text-[1.85rem] sm:leading-8">
                  {itemName}
                </h3>

                {itemMeta && (
                  <p className="mt-1 font-['EB_Garamond'] text-[1.05rem] leading-6 text-[#f1dfb5]">
                    {itemMeta}
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right">
                <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#c89b3c]">
                  {copy.item.price}
                </p>

                <p className="mt-1 whitespace-nowrap font-['EB_Garamond'] text-[1.6rem] leading-none text-[#e7c97b]">
                  {formatPrice(unitPriceCents, language)}
                </p>
              </div>
            </div>

            {item.selectedItems?.length > 0 && (
              <div className="mt-4">
                <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#c89b3c]">
                  {copy.item.selectedTools}
                </p>

                <div className="mt-3 grid gap-x-10 gap-y-1 font-['EB_Garamond'] text-[1rem] leading-6 text-[#f0dfb7] sm:grid-cols-2">
                  {item.selectedItems.map((selectedItem) => (
                    <p key={selectedItem.productId}>{selectedItem.name}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 border-t border-[#b8964a]/30 pt-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="inline-flex border border-[#c89b3c]/65 bg-[#120c07]/92 font-['IM_Fell_English_SC'] text-[#e4c36a] shadow-[0_0_16px_rgba(0,0,0,0.24)]">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.cartKey, item.quantity - 1)}
                    className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#100805]"
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
                    className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#100805]"
                    aria-label={copy.quantity.increase}
                  >
                    +
                  </button>
                </div>

                <div className="flex items-end gap-5">
                  <div className="text-right">
                    <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.18em] text-[#c89b3c]">
                      {copy.item.lineTotal}
                    </p>

                    <p className="mt-1 font-['EB_Garamond'] text-[1.4rem] leading-none text-[#e7c97b]">
                      {formatPrice(lineTotalCents, language)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(item.cartKey)}
                    className="pb-1 font-['IM_Fell_English_SC'] text-[0.66rem] uppercase tracking-[0.18em] text-[#c89b3c] transition hover:text-[#f3e7cf]"
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