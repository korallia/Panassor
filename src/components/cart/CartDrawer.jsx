import { useCart } from "../../context/CartContext";

import OrnamentDivider from "../ui/OrnamentDivider";

function formatPrice(price, currency = "CAD", locale = "fr-CA") {
  if (price == null) return "";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(price);
}

function CartDrawer() {
  const {
    items,
    subtotalCents,
    orderNote,
    setOrderNote,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[90] bg-[#080504]/78 backdrop-blur-[2px] transition-opacity duration-300 ${
          isCartOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[100] h-svh w-full max-w-full border-l border-[#6f5423]/80 bg-[#080504] text-[#f3e7cf] shadow-[-20px_0_70px_rgba(0,0,0,0.75)] transition-transform duration-300 ease-out sm:max-w-[34rem] lg:max-w-[39rem] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        <div className="relative flex h-full flex-col overflow-hidden bg-[linear-gradient(180deg,#120c07_0%,#080504_42%,#050302_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(200,155,60,0.11),transparent_30%),radial-gradient(circle_at_88%_38%,rgba(7,38,23,0.24),transparent_35%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(200,155,60,0.06),transparent_16%,transparent_84%,rgba(200,155,60,0.05))]" />

          <div className="pointer-events-none absolute inset-3 z-20 border border-[#c89b3c]/12" />
          <div className="pointer-events-none absolute inset-x-3 top-3 z-20 border-t border-[#c89b3c]/20" />
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 border-b border-[#c89b3c]/16" />

          <header className="relative z-10 shrink-0 px-6 pb-6 pt-8 sm:px-8">
            <button
              type="button"
              onClick={closeCart}
              className="absolute right-6 top-6 z-30 flex h-10 w-10 items-center justify-center border border-[#6f5423]/80 bg-[#080504]/70 font-['IM_Fell_English_SC'] text-2xl leading-none text-[#c89b3c] transition hover:border-[#c89b3c] hover:bg-[#c89b3c] hover:text-[#080504] sm:right-8"
              aria-label="Fermer le panier"
            >
              ×
            </button>

            <div className="mx-auto max-w-[22rem] text-center">
              <p className="font-['IM_Fell_English_SC'] text-[0.68rem] uppercase tracking-[0.34em] text-[#a47b36]">
                Panassor
              </p>

              <h2 className="mt-3 font-['Uncial_Antiqua'] text-4xl leading-none text-[#e7c97b] sm:text-5xl">
                Panier
              </h2>

              <OrnamentDivider
                className="mx-auto mt-6"
                width={220}
                opacity={0.72}
              />
            </div>
          </header>

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-6 pb-7 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.length === 0 ? (
              <div className="flex min-h-[26rem] flex-col items-center justify-center text-center">
                <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.24em] text-[#c89b3c]">
                  Votre panier est vide
                </p>

                <OrnamentDivider className="my-5" width={96} opacity={0.5} />

                <p className="max-w-sm font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/82">
                  Ajoutez une pièce ou un kit pour préparer votre commande.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => {
                  const snapshot = item.displaySnapshot || {};
                  const itemName = snapshot.name || item.productSlug || "Produit";
                  const itemImage = snapshot.imageUrl;
                  const itemMeta = snapshot.meta;
                  const itemPriceCents = snapshot.priceCents || 0;

                  return (
                    <article
                      key={item.cartKey}
                      className="relative overflow-hidden border border-[#6f5423]/75 bg-[#0b0705]/82 p-4 shadow-[0_16px_38px_rgba(0,0,0,0.4)] sm:p-5"
                    >
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
                                    <p key={selectedItem.productId}>
                                      {selectedItem.name}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>

                            <p className="shrink-0 font-['EB_Garamond'] text-2xl leading-none text-[#d8b56f] sm:text-[1.7rem]">
                              {formatPrice(
                                (itemPriceCents * item.quantity) / 100
                              )}
                            </p>
                          </div>

                          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                            <div className="inline-flex border border-[#c89b3c]/75 bg-[#080504] font-['IM_Fell_English_SC'] text-[#d8b56f]">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.cartKey,
                                    item.quantity - 1
                                  )
                                }
                                className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#080504]"
                                aria-label="Diminuer la quantité"
                              >
                                −
                              </button>

                              <span className="flex h-9 min-w-10 items-center justify-center text-sm">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.cartKey,
                                    item.quantity + 1
                                  )
                                }
                                className="flex h-9 w-10 items-center justify-center text-lg transition hover:bg-[#c89b3c] hover:text-[#080504]"
                                aria-label="Augmenter la quantité"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.cartKey)}
                              className="font-['IM_Fell_English_SC'] text-[0.68rem] uppercase tracking-[0.2em] text-[#a47b36] transition hover:text-[#e7c97b]"
                            >
                              Retirer
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <div className="pt-4">
                  <label
                    htmlFor="cart-order-note"
                    className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.26em] text-[#c89b3c]"
                  >
                    Note de commande
                  </label>

                  <textarea
                    id="cart-order-note"
                    value={orderNote}
                    onChange={(event) => setOrderNote(event.target.value)}
                    className="mt-4 h-36 w-full resize-none border border-[#6f5423]/80 bg-[#080504]/80 px-4 py-3 font-['EB_Garamond'] text-lg leading-7 text-[#f3e7cf] outline-none transition placeholder:text-[#8c7650] focus:border-[#c89b3c]"
                  />
                </div>
              </div>
            )}
          </div>

          <footer className="relative z-10 shrink-0 border-t border-[#6f5423]/75 bg-[#070403]/92 px-6 pb-6 pt-5 sm:px-8">
            <div className="flex items-end justify-between gap-4">
              <p className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.26em] text-[#c89b3c]">
                Sous-total
              </p>

              <p className="font-['EB_Garamond'] text-4xl leading-none text-[#e7c97b]">
                {formatPrice(subtotalCents / 100)}
              </p>
            </div>

            <p className="mt-4 font-['EB_Garamond'] text-base leading-6 text-[#d7c8ad]/74">
              Livraison, taxes et codes promo calculés à l’étape suivante.
            </p>

            <button
              type="button"
              disabled={items.length === 0}
              className="mt-5 inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#e7c97b] transition hover:bg-[#c89b3c] hover:text-[#080504] disabled:cursor-not-allowed disabled:border-[#6f5423]/50 disabled:bg-[#120c07]/70 disabled:text-[#8c7650]"
            >
              Passer à la caisse
            </button>
          </footer>
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;