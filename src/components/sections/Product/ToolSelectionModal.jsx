import { useEffect } from "react";

import GreenButton from "../../ui/GreenButton";
import CornerFrame from "../../ui/CornerFrame";
import OrnamentDivider from "../../ui/OrnamentDivider";

function ToolSelectionModal({
  isOpen,
  tools = [],
  selectedItem,
  onSelectTool,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080504]/82 px-6 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-[68rem] overflow-y-auto border border-[#6f5423]/80 bg-[linear-gradient(180deg,#160e08_0%,#0b0603_100%)] p-7 shadow-[0_26px_90px_rgba(0,0,0,0.86)] [scrollbar-color:#c89b3c_#120c07] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#120c07] [&::-webkit-scrollbar-thumb]:bg-[#c89b3c] [&::-webkit-scrollbar-thumb]:rounded-none">
        <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/10" />

        <div className="relative z-10">
          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <OrnamentDivider
                className="mb-5 justify-start"
                width={144}
                opacity={0.7}
              />

              <p className="mb-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.32em] text-[#c89b3c]">
                Modifier l’outil
              </p>

              <h2 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-none text-[#fff1d2]">
                Choisir un outil
              </h2>

              <p className="mt-5 max-w-2xl font-['EB_Garamond'] text-2xl leading-8 text-[#d7c8ad]/84">
                Sélectionne l’outil qui remplacera{" "}
                {selectedItem?.shortName ?? selectedItem?.name}.
              </p>
            </div>

            <GreenButton
              onClick={onClose}
              className="px-5 py-3 text-sm tracking-[0.14em]"
            >
              Fermer
            </GreenButton>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelectTool(tool)}
                className="group/tool relative flex min-h-[360px] cursor-pointer flex-col overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#170f08_0%,#0d0805_100%)] text-left shadow-[0_18px_50px_rgba(0,0,0,0.62)] transition duration-300 hover:-translate-y-1 hover:border-[#c89b3c]/90 hover:shadow-[0_24px_70px_rgba(0,0,0,0.78),0_0_34px_rgba(200,155,60,0.08)]"
              >
                <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/10" />

                <div className="relative aspect-[5/4] overflow-hidden bg-[#0b0704]">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover brightness-[0.88] contrast-[1.1] saturate-[1.02] transition duration-500 group-hover/tool:scale-[1.08] group-hover/tool:-translate-y-1 group-hover/tool:brightness-[1]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/64 via-transparent to-[#080504]/8" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/14 via-transparent to-[#080504]/14" />
                  <div className="absolute inset-0 shadow-[inset_0_0_46px_rgba(8,5,4,0.5)]" />

                  <CornerFrame
                    inset="cardImage"
                    size="md"
                    thickness="subtle"
                    color="gold"
                  />
                </div>

                <div className="relative z-10 flex flex-1 flex-col p-4">
                  <div className="mb-4 h-px w-20 bg-[#c89b3c]/70" />

                  <h3 className="mb-4 min-h-[4.5rem] font-['IM_Fell_English_SC'] text-3xl uppercase leading-none text-[#fff1d2] transition group-hover/tool:text-[#e7c97b]">
                    {tool.shortName ?? tool.name}
                  </h3>

                  <p className="mb-5 min-h-[4.75rem] font-['EB_Garamond'] text-lg leading-6 text-[#d7c8ad]/86">
                    {tool.description}
                  </p>

                  <div className="mt-auto pt-2">
                    <span className="inline-flex w-fit items-center justify-center border border-[#c89b3c] bg-[#24170d] px-4 py-2 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.06em] text-[#e7c97b] transition group-hover/tool:bg-[#c89b3c] group-hover/tool:text-[#100805]">
                      Sélectionner
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolSelectionModal;