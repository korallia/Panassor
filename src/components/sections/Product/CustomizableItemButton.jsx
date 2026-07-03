import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../utils/localization";

function CustomizableItemButton({ item, index, onClick, copy = {} }) {
  const { language } = useLanguage();

  if (!item) {
    return null;
  }

  const itemName = t(item, "name", language);
  const itemTitle = t(item, "title", language) || itemName;
  const modifyLabel =
    copy.modifyItem || (language === "en" ? "Change" : "Modifier");

  return (
    <button
      type="button"
      onClick={() => onClick?.(item, index)}
      className="group/item grid min-h-[68px] w-full grid-cols-[76px_1fr] overflow-hidden border border-[#b8964a] bg-[#1f3324]/95 text-left font-['IM_Fell_English_SC'] uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] hover:bg-[#2a4630] hover:text-[#f7ead2]"
    >
      <div className="h-full min-h-[68px] overflow-hidden border-r border-[#b8964a]/80 bg-[#080504]">
        <img
          src={item.image_url}
          alt={itemName}
          className="h-full w-full object-cover brightness-[0.86] contrast-[1.1] saturate-[0.9]"
        />
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <span className="text-sm tracking-[0.12em]">{itemTitle}</span>

        <span className="font-['IM_Fell_English_SC'] text-[0.6rem] uppercase tracking-[0.18em] text-[#d8b56f]/80 group-hover/item:text-[#f7ead2]/90">
          {modifyLabel}
        </span>
      </div>
    </button>
  );
}

export default CustomizableItemButton;