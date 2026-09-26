function SectionTitle({
  eyebrow,
  title,
  align = "left",
  className = "",
  showDivider = true,
  // Taille du titre (optionnel) : par defaut le grand titre de section.
  titleSizeClassName = "text-5xl md:text-7xl",
}) {
  const isCentered = align === "center";

  return (
    <div className={className}>
      <p
        className={`mb-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c] ${
          isCentered ? "text-center" : ""
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`font-['IM_Fell_English_SC'] uppercase leading-none text-[#fff1d2] ${titleSizeClassName} ${
          isCentered ? "text-center" : ""
        }`}
      >
        {title}
      </h2>

      {showDivider && (
        <div
          className={`mt-5 h-px w-52 ${
            isCentered
              ? "mx-auto bg-gradient-to-r from-transparent via-[#c89b3c] to-transparent"
              : "bg-gradient-to-r from-[#c89b3c] to-transparent"
          }`}
        />
      )}
    </div>
  );
}

export default SectionTitle;