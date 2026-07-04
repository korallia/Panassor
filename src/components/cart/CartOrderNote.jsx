import { useState } from "react";

function CartOrderNote({ value, onChange, copy }) {
  const [isOpen, setIsOpen] = useState(Boolean(value));

  return (
    <section className="border-t border-[#6f5423]/35 pt-3 sm:pt-4">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.22em] text-[#c89b3c] transition hover:text-[#e7c97b] sm:text-[0.68rem]"
      >
        <span>{copy.label}</span>
        <span className="text-base leading-none">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={copy.placeholder}
          className="mt-3 h-20 w-full resize-none border border-[#6f5423]/55 bg-[#080504]/82 px-3 py-2 font-['EB_Garamond'] text-sm leading-5 text-[#f3e7cf] outline-none transition placeholder:text-[#8f7a58]/70 focus:border-[#c89b3c]/80 sm:h-24 sm:px-4 sm:py-3 sm:text-base sm:leading-6"
        />
      )}
    </section>
  );
}

export default CartOrderNote;