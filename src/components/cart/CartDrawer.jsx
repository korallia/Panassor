import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { getPageText } from "../../utils/content";
import { cartContent } from "../../content/cartContent";

import CartDrawerHeader from "./CartDrawerHeader";
import CartDrawerItem from "./CartDrawerItem";
import CartDrawerFooter from "./CartDrawerFooter";
import CartOrderNote from "./CartOrderNote";
import CartEmptyState from "./CartEmptyState";

function CartDrawer() {
  const { language } = useLanguage();
  const copy = getPageText(cartContent, language);

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

          <CartDrawerHeader copy={copy} onClose={closeCart} />

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-6 pb-7 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.length === 0 ? (
              <CartEmptyState copy={copy.empty} />
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <CartDrawerItem
                    key={item.cartKey}
                    item={item}
                    copy={copy}
                    language={language}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}

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
            itemCount={items.length}
            copy={copy.footer}
            language={language}
          />
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;