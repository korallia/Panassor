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
  };

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-20 w-20",
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
    gold: "border-[#c89b3c]/85",
    paleGold: "border-[#f3d58b]/65",
  };

  const pos = insetClasses[inset] ?? insetClasses.default;
  const cornerSize = sizeClasses[size] ?? sizeClasses.md;
  const border = thicknessClasses[thickness] ?? thicknessClasses.strong;
  const borderColor = colorClasses[color] ?? colorClasses.gold;

  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${className}`}>
      <div
        className={`absolute ${pos.left} ${pos.top} ${cornerSize} ${border.left} ${border.top} ${borderColor}`}
      />

      <div
        className={`absolute ${pos.right} ${pos.top} ${cornerSize} ${border.right} ${border.top} ${borderColor}`}
      />

      <div
        className={`absolute ${pos.left} ${pos.bottom} ${cornerSize} ${border.bottom} ${border.left} ${borderColor}`}
      />

      <div
        className={`absolute ${pos.right} ${pos.bottom} ${cornerSize} ${border.bottom} ${border.right} ${borderColor}`}
      />
    </div>
  );
}

export default CornerFrame;