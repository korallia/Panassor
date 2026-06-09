function SectionTitle({ eyebrow, title, align = "left", className = "" }) {
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
        className={`font-['IM_Fell_English_SC'] text-5xl uppercase leading-none text-[#fff1d2] md:text-7xl ${
          isCentered ? "text-center" : ""
        }`}
      >
        {title}
      </h2>

      <div
        className={`mt-5 h-px w-52 ${
          isCentered
            ? "mx-auto bg-gradient-to-r from-transparent via-[#c89b3c] to-transparent"
            : "bg-gradient-to-r from-[#c89b3c] to-transparent"
        }`}
      />
    </div>
  );
}

export default SectionTitle;