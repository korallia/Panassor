import OrnamentDivider from "../ui/OrnamentDivider";

function CartDrawerHeader({ copy, onClose }) {
  return (
    <header className="relative z-10 shrink-0 px-6 pb-6 pt-8 sm:px-8">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 z-30 flex h-10 w-10 items-center justify-center border border-[#6f5423]/80 bg-[#080504]/70 font-['IM_Fell_English_SC'] text-2xl leading-none text-[#c89b3c] transition hover:border-[#c89b3c] hover:bg-[#c89b3c] hover:text-[#080504] sm:right-8"
        aria-label={copy.closeLabel}
      >
        ×
      </button>

      <div className="mx-auto max-w-[26rem] text-center">
        <p className="font-['IM_Fell_English_SC'] text-[0.68rem] uppercase tracking-[0.34em] text-[#a47b36]">
          {copy.eyebrow}
        </p>

        <h2 className="mt-3 font-['Uncial_Antiqua'] text-4xl leading-none text-[#e7c97b] sm:text-5xl">
          {copy.title}
        </h2>

        <OrnamentDivider
          className="mx-auto mt-6"
          width={220}
          opacity={0.72}
        />
      </div>
    </header>
  );
}

export default CartDrawerHeader;