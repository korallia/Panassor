function CartOrderNote({ value, onChange, copy }) {
  return (
    <div className="pt-4">
      <label
        htmlFor="cart-order-note"
        className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.26em] text-[#c89b3c]"
      >
        {copy.label}
      </label>

      <textarea
        id="cart-order-note"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 h-36 w-full resize-none border border-[#6f5423]/80 bg-[#080504]/80 px-4 py-3 font-['EB_Garamond'] text-lg leading-7 text-[#f3e7cf] outline-none transition placeholder:text-[#8c7650] focus:border-[#c89b3c]"
      />
    </div>
  );
}

export default CartOrderNote;