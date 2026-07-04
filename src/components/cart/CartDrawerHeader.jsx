import OrnamentDivider from "../ui/OrnamentDivider";

function CartDrawerHeader({ copy, onClose }) {
  return (
    <header className="relative z-10 shrink-0 border-b border-[#6f5423]/55 px-5 pb-5 pt-6 sm:px-7">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center border border-[#6f5423]/75 bg-[#080504]/80 font-['IM_Fell_English_SC'] text-2xl leading-none text-[#c89b3c] transition hover:border-[#c89b3c] hover:bg-[#c89b3c] hover:text-[#080504] sm:right-7"
        aria-label={copy.closeLabel}
      >
        ×
      </button>

      <div className="pr-14">
        <p className="font-['IM_Fell_English_SC'] text-[0.66rem] uppercase tracking-[0.3em] text-[#a47b36]">
          {copy.header.eyebrow}
        </p>

        <h2 className="mt-2 font-['Uncial_Antiqua'] text-[2.05rem] leading-none text-[#f3e7cf] sm:text-[2.45rem]">
          {copy.header.title}
        </h2>

        <p className="mt-3 max-w-[25rem] font-['EB_Garamond'] text-base leading-6 text-[#d7c8ad]/72">
          {copy.header.description}
        </p>

        <OrnamentDivider
          className="mt-5 justify-start"
          width={132}
          opacity={0.5}
        />
      </div>
    </header>
  );
}

export default CartDrawerHeader;