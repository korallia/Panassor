import CartMiniSectionTitle from "./CartMiniSectionTitle";

function CartDrawerHeader({ copy, onClose }) {
  return (
    <header className="relative z-10 shrink-0 overflow-hidden border-b border-[#6f5423]/55 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5 md:px-7 md:pb-6 md:pt-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(200,155,60,0.08),transparent_28%),radial-gradient(circle_at_88%_26%,rgba(31,51,36,0.14),transparent_32%)]" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center border border-[#6f5423]/75 bg-[#080504]/80 font-['IM_Fell_English_SC'] text-xl leading-none text-[#c89b3c] transition hover:border-[#c89b3c] hover:bg-[#c89b3c] hover:text-[#080504] md:right-7 md:top-5 md:h-10 md:w-10 md:text-2xl"
        aria-label={copy.closeLabel}
      >
        ×
      </button>

      <div className="relative z-10 pr-12 md:pr-14">
        {/* MOBILE COMPACT */}
        <div className="sm:hidden">
          <CartMiniSectionTitle
            eyebrow={copy.header.eyebrow}
            title={copy.header.title}
            description={null}
            align="left"
            dividerWidth={112}
          />
        </div>

        {/* TABLET / DESKTOP */}
        <div className="hidden sm:block">
          <CartMiniSectionTitle
            eyebrow={copy.header.eyebrow}
            title={copy.header.title}
            description={copy.header.description}
            align="left"
            dividerWidth={132}
          />
        </div>
      </div>
    </header>
  );
}

export default CartDrawerHeader;