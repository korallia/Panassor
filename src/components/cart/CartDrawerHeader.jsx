import SectionAtmosphere from "../layout/SectionAtmosphere";
import SectionTitle from "../layout/SectionTitle";

function CartDrawerHeader({ copy, onClose }) {
  return (
    <header className="relative z-10 shrink-0 overflow-hidden border-b border-[#6f5423]/55 px-6 pb-7 pt-8 sm:px-8">
      <SectionAtmosphere />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 z-30 flex h-10 w-10 items-center justify-center border border-[#6f5423]/80 bg-[#080504]/70 font-['IM_Fell_English_SC'] text-2xl leading-none text-[#c89b3c] transition hover:border-[#c89b3c] hover:bg-[#c89b3c] hover:text-[#080504] sm:right-8"
        aria-label={copy.closeLabel}
      >
        ×
      </button>

      <div className="relative z-10 pr-12">
        <SectionTitle
          eyebrow={copy.header.eyebrow}
          title={copy.header.title}
          description={copy.header.description}
          align="left"
        />
      </div>
    </header>
  );
}

export default CartDrawerHeader;