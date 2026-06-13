function SectionAtmosphere({ variant = "collection" }) {
  const variants = {
    collection: (
      <>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#120c07] via-[#080504] to-transparent" />

        <div className="pointer-events-none absolute left-1/2 top-24 h-[30rem] w-[64rem] -translate-x-1/2 rounded-full bg-[#c89b3c]/9 blur-3xl" />
        <div className="pointer-events-none absolute left-[12%] top-[38rem] h-[34rem] w-[34rem] rounded-full bg-[#15361f]/16 blur-3xl" />
        <div className="pointer-events-none absolute right-[10%] top-[52rem] h-[30rem] w-[30rem] rounded-full bg-[#234828]/12 blur-3xl" />
      </>
    ),

    featured: (
      <>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#120c07] via-[#080504] to-transparent" />

        <div className="pointer-events-none absolute left-1/2 top-24 h-[30rem] w-[64rem] -translate-x-1/2 rounded-full bg-[#c89b3c]/9 blur-3xl" />
        <div className="pointer-events-none absolute left-[12%] top-[38rem] h-[34rem] w-[34rem] rounded-full bg-[#15361f]/16 blur-3xl" />
        <div className="pointer-events-none absolute right-[10%] top-[52rem] h-[30rem] w-[30rem] rounded-full bg-[#234828]/12 blur-3xl" />
      </>
    ),

    subtleGold: (
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,155,60,0.12),transparent_38%)]" />
    ),
  };

  return variants[variant] ?? variants.collection;
}

export default SectionAtmosphere;