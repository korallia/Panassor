function Navbar() {
  return (
    <header className="relative z-20 border-b-2 border-[#c89b3c]/75 bg-[#090604]/85 backdrop-blur-sm">
      <div className="mx-auto grid h-24 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <div className="flex items-center gap-3 justify-self-start">
          <img
            src="/images/IconPanassor.png"
            alt="Logo Panassor"
            className="h-14 w-14 object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]"
          />

          <div>
            <div className="font-['Uncial_Antiqua'] text-4xl leading-none text-[#f7ead2] drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] md:text-5xl">
              Panassor
            </div>

            <div className="mt-1 font-['IM_Fell_English_SC'] text-[0.8rem] uppercase tracking-[0.14em] text-[#d8a24c]">
              Kits médiévaux uniques
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-7 justify-self-center font-['IM_Fell_English_SC'] text-2xl tracking-[0.03em] text-[#f7ead2]/85 md:flex">
          <a href="#" className="transition hover:text-[#d8a24c]">
            Collections
          </a>
          <span className="text-sm text-[#8a5a2b]">✦</span>
          <a href="#" className="transition hover:text-[#d8a24c]">
            Produits
          </a>
          <span className="text-sm text-[#8a5a2b]">✦</span>
          <a href="#" className="transition hover:text-[#d8a24c]">
            Atelier
          </a>
          <span className="text-sm text-[#8a5a2b]">✦</span>
          <a href="#" className="transition hover:text-[#d8a24c]">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-5 justify-self-end text-[#d8a24c]">
          <button className="font-['IM_Fell_English_SC'] text-2xl tracking-[0.03em] md:hidden">
            Menu
          </button>

          <div className="hidden items-center gap-5 md:flex">
            <button className="text-xl transition hover:text-[#f7ead2]">
              ♙
            </button>
            <button className="text-xl transition hover:text-[#f7ead2]">
              ⌕
            </button>
            <button className="text-xl transition hover:text-[#f7ead2]">
              ▢
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;