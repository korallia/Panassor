import { useNavigate } from "react-router-dom";

function GoldButton({
  children,
  href = "/collections/chirurgien",
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(href)}
      className={`inline-flex items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-8 py-4 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904] ${className}`}
    >
      {children}
    </button>
  );
}

export default GoldButton;