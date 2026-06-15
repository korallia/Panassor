function GreenButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-8 py-4 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2] ${className}`}
    >
      {children}
    </button>
  );
}

export default GreenButton;