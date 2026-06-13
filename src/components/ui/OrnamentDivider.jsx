function OrnamentDivider({
  className = "",
  width = 112,
  opacity = 0.65,
  ornament = "✦",
}) {
  const lineStyle = {
    width: `${width}px`,
    height: "1px",
    flexShrink: 0,
    backgroundColor: `rgba(200, 155, 60, ${opacity})`,
  };

  return (
    <div
      className={`flex items-center justify-center gap-4 text-[#c89b3c] ${className}`}
    >
      <span style={lineStyle} />

      <span className="font-['IM_Fell_English_SC'] text-lg leading-none text-[#c89b3c]">
        {ornament}
      </span>

      <span style={lineStyle} />
    </div>
  );
}

export default OrnamentDivider;