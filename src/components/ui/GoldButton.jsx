import { useNavigate } from "react-router-dom";

function GoldButton({collection_url}) {
  const navigate = useNavigate();
  return (
      <button
                type="button"
                onClick={() => navigate(collection_url)}
                className="group relative inline-flex items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
              >
                <span className="mr-3 text-[#f8edd3] group-hover:text-[#120904]">
                  ✦
                </span>
                Découvrir la collection
              </button>
  );
}

export default GoldButton;