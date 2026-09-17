import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { getPageText } from "../../utils/content";
import { cartContent } from "../../content/cartContent";

import CartDrawerHeader from "./CartDrawerHeader";
import CartDrawerItems from "./CartDrawerItems";
import CartDrawerFooter from "./CartDrawerFooter";
import CartOrderNote from "./CartOrderNote";
import CartEmptyState from "./CartEmptyState";
import ShippingEstimator from "./ShippingEstimator";

function CartDrawer() {
  const { language } = useLanguage();
  const copy = getPageText(cartContent, language);

  const {
    items,
    itemCount,
    subtotalCents,
    orderNote,
    setOrderNote,
    selectedShipping,
    setSelectedShipping,
    shippingCents,
    estimatedTotalCents,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[90] bg-[#080504]/72 backdrop-blur-[2px] transition-opacity duration-300 ${
          isCartOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[100] h-[100dvh] w-full max-w-full border-l border-[#6f5423]/75 bg-[#080504] text-[#f3e7cf] shadow-[-20px_0_70px_rgba(0,0,0,0.72)] transition-transform duration-300 ease-out sm:max-w-[34rem] lg:max-w-[39rem] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[linear-gradient(180deg,#100a06_0%,#080504_42%,#050302_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(200,155,60,0.08),transparent_28%),radial-gradient(circle_at_82%_36%,rgba(31,51,36,0.14),transparent_32%),radial-gradient(circle_at_28%_84%,rgba(31,51,36,0.08),transparent_28%)]" />

          <CartDrawerHeader copy={copy} onClose={closeCart} />

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-5 md:px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.length === 0 ? (
              <CartEmptyState copy={copy.empty} />
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <CartDrawerItems
                  items={items}
                  copy={copy}
                  language={language}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />

                <ShippingEstimator
                  copy={copy.shipping}
                  language={language}
                  selectedShipping={selectedShipping}
                  onSelect={setSelectedShipping}
                  items={items}
                />

                <CartOrderNote
                  value={orderNote}
                  onChange={setOrderNote}
                  copy={copy.orderNote}
                />
              </div>
            )}
          </div>

          <CartDrawerFooter
            subtotalCents={subtotalCents}
            shippingCents={shippingCents}
            estimatedTotalCents={estimatedTotalCents}
            hasSelectedShipping={Boolean(selectedShipping)}
            itemCount={itemCount}
            copy={copy.footer}
            language={language}
          />
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;