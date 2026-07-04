import CartMiniSectionTitle from "./CartMiniSectionTitle";

function CartDrawerHeader({ copy, onClose }) {
  return (
    <header className="relative z-10 shrink-0 overflow-hidden border-b border-[#6f5423]/55 px-5 pb-6 pt-6 sm:px-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(200,155,60,0.08),transparent_28%),radial-gradient(circle_at_88%_26%,rgba(31,51,36,0.14),transparent_32%)]" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center border border-[#6f5423]/75 bg-[#080504]/80 font-['IM_Fell_English_SC'] text-2xl leading-none text-[#c89b3c] transition hover:border-[#c89b3c] hover:bg-[#c89b3c] hover:text-[#080504] sm:right-7"
        aria-label={copy.closeLabel}
      >
        ×
      </button>

      <div className="relative z-10 max-w-[28rem] pr-14">
        <CartMiniSectionTitle
          eyebrow={copy.header.eyebrow}
          title={copy.header.title}
          description={copy.header.description}
          align="left"
          dividerWidth={132}
        />
      </div>
    </header>
  );
}

export default CartDrawerHeader;