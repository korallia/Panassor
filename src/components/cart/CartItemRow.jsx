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
      <div className="group relative overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#160e08_0%,#0b0603_100%)] text-left shadow-[0_18px_50px_rgba(0,0,0,0.42)] transition hover:border-[#c89b3c]/90">
        <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/10" />

        <div className="relative z-10 grid min-h-[178px] sm:grid-cols-[118px_1fr]">
          {/* IMAGE */}
          <div className="relative overflow-hidden border-b border-[#6f5423]/75 bg-[#080504] sm:border-r sm:border-b-0">
            {itemImage ? (
              <img
                src={itemImage}
                alt={itemName}
                className="h-40 w-full object-cover object-center brightness-[0.9] contrast-[1.08] saturate-[0.92] sm:h-full"
              />
            ) : (
              <div className="h-40 w-full bg-[#080504] sm:h-full" />
            )}

            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_28px_rgba(8,5,4,0.5)]" />
          </div>

          {/* CONTENT */}
          <div className="relative overflow-hidden bg-[#102417] px-5 py-5 sm:px-6">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(16,36,23,0.96),rgba(16,36,23,0.88)_58%,rgba(18,12,7,0.32))]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,rgba(200,155,60,0.08),transparent_26%)]" />

            <button
              type="button"
              onClick={() => onRemove(item.cartKey)}
              className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center border border-[#c89b3c]/70 bg-[#080504]/75 font-['IM_Fell_English_SC'] text-lg leading-none text-[#d8b56f] transition hover:bg-[#c89b3c] hover:text-[#100805]"
              aria-label={copy.remove}
              title={copy.remove}
            >
              ×
            </button>

            <div className="relative z-10 pr-10">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="min-w-0">
                  <h3 className="font-['EB_Garamond'] text-[1.55rem] leading-7 text-[#e7c97b] sm:text-[1.8rem] sm:leading-8">
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
                      className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#100805]"
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
                      className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#100805]"
                      aria-label={copy.quantity.increase}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.18em] text-[#d8b56f]">
                      {copy.item.lineTotal}
                    </p>

                    <p className="mt-1 font-['EB_Garamond'] text-[1.4rem] leading-none text-[#e7c97b]">
                      {formatPrice(lineTotalCents, language)}
                    </p>
                  </div>
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