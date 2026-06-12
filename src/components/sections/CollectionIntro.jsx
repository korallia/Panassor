function CollectionIntro({ collection }) {
  return (
    <section className="relative h-[430px] overflow-hidden bg-[#120c07] text-[#f3e7cf]">
      <img
        src={collection.heroImage}
        alt={collection.title}
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.72] contrast-[1.1] saturate-[0.95]"
      />

      <div className="absolute inset-0 bg-[#080504]/18" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/92 via-[#080504]/62 to-[#080504]/22" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/72 via-transparent to-[#080504]/28" />

      <div className="pointer-events-none absolute left-0 top-0 h-full w-36 bg-gradient-to-r from-[#080504] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-36 bg-gradient-to-l from-[#080504] to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent via-[#080504]/70 to-[#080504]" />

      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="absolute left-14 top-10 h-10 w-10 border-l border-t border-[#f3d58b]/65" />
        <div className="absolute right-14 top-10 h-10 w-10 border-r border-t border-[#f3d58b]/65" />

        <div className="absolute bottom-18 left-14 h-10 w-10 border-b border-l border-[#f3d58b]/65" />
        <div className="absolute bottom-18 right-14 h-10 w-10 border-b border-r border-[#f3d58b]/65" />
      </div>

      <div className="relative z-30 mx-auto grid h-full max-w-[88rem] items-center px-6 lg:grid-cols-2">
        <div className="-translate-y-6 flex flex-col items-start text-left">
          <div className="mb-6 flex items-center justify-start gap-4 text-[#d8a24c]">
            <div className="h-px w-24 bg-[#d8a24c]/70" />
            <span className="text-xl">✦</span>
            <div className="h-px w-24 bg-[#d8a24c]/70" />
          </div>

          <h1 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-[0.88] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-7xl xl:text-8xl">
            {collection.title}
          </h1>

          <div className="mt-6 flex items-center justify-start gap-4 text-[#d8a24c]">
            <div className="h-px w-24 bg-[#d8a24c]/70" />
            <span className="text-xl">✦</span>
            <div className="h-px w-24 bg-[#d8a24c]/70" />
          </div>
        </div>

        <div className="hidden lg:block" />
      </div>
    </section>
  );
}

export default CollectionIntro;