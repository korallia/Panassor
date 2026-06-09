function CornerFrame({ inset = "default", size = "md", className = "" }) {
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
      top: "top-28",
      right: "right-4",
      bottom: "bottom-4",
      left: "left-4",
    },
  };

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  };

  const pos = insetClasses[inset] ?? insetClasses.default;
  const cornerSize = sizeClasses[size] ?? sizeClasses.md;

  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${className}`}>
      <div
        className={`absolute ${pos.left} ${pos.top} ${cornerSize} border-l-2 border-t-2 border-[#c89b3c]/85`}
      />
      <div
        className={`absolute ${pos.right} ${pos.top} ${cornerSize} border-r-2 border-t-2 border-[#c89b3c]/85`}
      />
      <div
        className={`absolute ${pos.left} ${pos.bottom} ${cornerSize} border-b-2 border-l-2 border-[#c89b3c]/85`}
      />
      <div
        className={`absolute ${pos.right} ${pos.bottom} ${cornerSize} border-b-2 border-r-2 border-[#c89b3c]/85`}
      />
    </div>
  );
}

export default CornerFrame;