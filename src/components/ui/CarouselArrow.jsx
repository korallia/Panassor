function CarouselArrow({ direction = "next", onClick, label }) {
  const symbol = direction === "previous" ? "‹" : "›";

  return (
    <button
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center border border-[#c89b3c]/70 bg-[#120c07] font-['IM_Fell_English_SC'] text-3xl leading-none text-[#d8a24c] transition hover:bg-[#c89b3c] hover:text-[#100805]"
      aria-label={label}
    >
      {symbol}
    </button>
  );
}

export default CarouselArrow;