import { useNavigate } from "react-router-dom";

function GreenButton({
  href = "/atelier",
  label = "Voir l’atelier",
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(href)}
      className="inline-flex items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
    >
      {label}
    </button>
  );
}

export default GreenButton;