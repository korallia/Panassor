import OrnamentDivider from "../ui/OrnamentDivider";

function CartMiniSectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  dividerWidth = 132,
}) {
  const isCentered = align === "center";

  return (
    <div className={isCentered ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="font-['IM_Fell_English_SC'] text-[0.54rem] uppercase tracking-[0.22em] text-[#a47b36] sm:text-[0.62rem] sm:tracking-[0.28em] md:text-[0.66rem] md:tracking-[0.3em]">
          {eyebrow}
        </p>
      )}

      {title && (
        <h2 className="mt-1 font-['Uncial_Antiqua'] text-[1.7rem] leading-none text-[#f3e7cf] sm:text-[2.05rem] md:text-[2.45rem]">
          {title}
        </h2>
      )}

      {description && (
        <p
          className={`mt-2 font-['EB_Garamond'] text-sm leading-5 text-[#d7c8ad]/76 sm:text-base sm:leading-6 ${
            isCentered ? "mx-auto max-w-[25rem]" : "max-w-[25rem]"
          }`}
        >
          {description}
        </p>
      )}

      <OrnamentDivider
        className={`mt-3 sm:mt-5 ${
          isCentered ? "mx-auto" : "justify-start"
        }`}
        width={dividerWidth}
        opacity={0.55}
      />
    </div>
  );
}

export default CartMiniSectionTitle;