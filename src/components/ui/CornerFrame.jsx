function CornerFrame({
  inset = "default",
  size = "md",
  thickness = "strong",
  color = "gold",
  className = "",
}) {
  const insetClasses = {
    default: {
      top: "top-5",
      right: "right-5",
      bottom: "bottom-5",
      left: "left-5",
    },
    outside: {
      top: "-top-4",
      right: "-right-4",
      bottom: "-bottom-4",
      left: "-left-4",
    },
    hero: {
      top: "top-9",
      right: "right-9",
      bottom: "bottom-9",
      left: "left-9",
    },
    heroInner: {
      top: "top-14",
      right: "right-14",
      bottom: "bottom-14",
      left: "left-14",
    },
    collectionIntro: {
      top: "top-10",
      right: "right-14",
      bottom: "bottom-[4.5rem]",
      left: "left-14",
    },
    cardImage: {
      top: "top-4",
      right: "right-4",
      bottom: "bottom-4",
      left: "left-4",
    },
  };

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  const thicknessClasses = {
    subtle: {
      left: "border-l",
      right: "border-r",
      top: "border-t",
      bottom: "border-b",
    },
    strong: {
      left: "border-l-2",
      right: "border-r-2",
      top: "border-t-2",
      bottom: "border-b-2",
    },
  };

  const colorClasses = {
    gold:
      "border-[#e0b24f] drop-shadow-[0_2px_4px_rgba(8,5,4,0.95)]",
    paleGold:
      "border-[#f3d58b]/80 drop-shadow-[0_2px_4px_rgba(8,5,4,0.9)]",
    mutedGold:
      "border-[#c89b3c]/90 drop-shadow-[0_2px_4px_rgba(8,5,4,0.9)]",
  };

  const pos = insetClasses[inset] ?? insetClasses.default;
  const cornerSize = sizeClasses[size] ?? sizeClasses.md;
  const border = thicknessClasses[thickness] ?? thicknessClasses.strong;
  const borderColor = colorClasses[color] ?? colorClasses.gold;

  const cornerBaseClass = `
    absolute pointer-events-none opacity-95 transition duration-300
    group-hover:opacity-100 group-hover:drop-shadow-[0_0_7px_rgba(224,178,79,0.42)]
    group-hover/tool:opacity-100 group-hover/tool:drop-shadow-[0_0_7px_rgba(224,178,79,0.42)]
    ${cornerSize}
    ${borderColor}
  `;

  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${className}`}>
      <div
        className={`${cornerBaseClass} ${pos.left} ${pos.top} ${border.left} ${border.top}`}
      />

      <div
        className={`${cornerBaseClass} ${pos.right} ${pos.top} ${border.right} ${border.top}`}
      />

      <div
        className={`${cornerBaseClass} ${pos.left} ${pos.bottom} ${border.bottom} ${border.left}`}
      />

      <div
        className={`${cornerBaseClass} ${pos.right} ${pos.bottom} ${border.bottom} ${border.right}`}
      />
    </div>
  );
}

export default CornerFrame;