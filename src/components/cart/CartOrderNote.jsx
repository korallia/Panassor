function CartOrderNote({ value, onChange, copy }) {
  return (
    <section className="relative overflow-hidden border-t border-[#6f5423]/35 pt-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,rgba(31,51,36,0.16),transparent_30%)]" />

      <div className="relative z-10">
        <label
          htmlFor="cart-order-note"
          className="font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.24em] text-[#c89b3c]"
        >
          {copy.label}
        </label>

        <textarea
          id="cart-order-note"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={copy.placeholder}
          className="mt-4 min-h-[130px] w-full resize-none border border-[#6f5423]/55 bg-[linear-gradient(180deg,rgba(8,5,4,0.88),rgba(12,18,14,0.72))] px-4 py-4 font-['EB_Garamond'] text-lg leading-7 text-[#f3e7cf] outline-none transition placeholder:text-[#8f7a58]/70 focus:border-[#c89b3c]/80"
        />
      </div>
    </section>
  );
}

export default CartOrderNote;