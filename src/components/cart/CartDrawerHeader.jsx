import OrnamentDivider from "../ui/OrnamentDivider";

function CartDrawerHeader({ copy, onClose }) {
  return (
    <header className="relative z-10 shrink-0 overflow-hidden border-b border-[#6f5423]/55 px-5 pb-6 pt-6 sm:px-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(200,155,60,0.09),transparent_28%),radial-gradient(circle_at_88%_26%,rgba(31,51,36,0.16),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c89b3c]/35 to-transparent sm:inset-x-7" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center border border-[#6f5423]/75 bg-[#080504]/80 font-['IM_Fell_English_SC'] text-2xl leading-none text-[#c89b3c] transition hover:border-[#c89b3c] hover:bg-[#c89b3c] hover:text-[#080504] sm:right-7"
        aria-label={copy.closeLabel}
      >
        ×
      </button>

      <div className="relative z-10 max-w-[28rem] pr-14">
        <div className="relative pl-5">
          <div className="pointer-events-none absolute left-0 top-1 h-[calc(100%-0.25rem)] w-px bg-gradient-to-b from-[#c89b3c]/80 via-[#6f5423]/60 to-transparent" />
          <div className="pointer-events-none absolute left-[-3px] top-1 h-2 w-2 border border-[#c89b3c]/70 bg-[#080504]" />

          <p className="font-['IM_Fell_English_SC'] text-[0.66rem] uppercase tracking-[0.3em] text-[#a47b36]">
            {copy.header.eyebrow}
          </p>

          <h2 className="mt-2 font-['Uncial_Antiqua'] text-[2.05rem] leading-none text-[#f3e7cf] sm:text-[2.45rem]">
            {copy.header.title}
          </h2>

          <p className="mt-3 max-w-[25rem] font-['EB_Garamond'] text-base leading-6 text-[#d7c8ad]/76">
            {copy.header.description}
          </p>

          <OrnamentDivider
            className="mt-5 justify-start"
            width={132}
            opacity={0.55}
          />
        </div>
      </div>
    </header>
  );
}

export default CartDrawerHeader;