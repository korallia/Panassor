import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollections } from "../../context/CollectionsContext";

function Navbar() {
  const navigate = useNavigate();
  const collections = useCollections();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dropdownItems = [
    {
      id: "all-collections",
      title: "Toutes les collections",
      url: "/collections",
      image: "/images/hero-kit-chirurgien.jpg",
      eyebrow: "Explorer",
    },
    ...collections.map((collection) => ({
      id: collection.id,
      title: collection.title_fr || collection.name_fr,
      url: `/collections/${collection.slug}`,
      image: collection.thumbnail_image_url || collection.hero_image_url,
      eyebrow: collection.eyebrow_fr,
    })),
    {
      id: "coming-soon",
      title: "Collections à venir",
      url: "/atelier#sneak-peek",
      image: "/images/kit_de_voleur.jpg",
      eyebrow: "Prochainement",
    },
  ];

  const mobileItems = [
    {
      id: "products",
      title: "Produits",
      url: "/produits",
    },
    ...collections.map((collection) => ({
      id: collection.id,
      title: collection.title_fr || collection.name_fr,
      url: `/collections/${collection.slug}`,
    })),
  ];

  const navigateAndClose = (url) => {
    navigate(url);
    setIsMenuOpen(false);
  };

  const mobileCollectionLinkClass =
    "block w-full border-b border-[#6f5423]/30 py-3 text-left font-['EB_Garamond'] text-2xl leading-8 text-[#d7c8ad]/88 transition last:border-b-0 hover:text-[#d8a24c]";

  return (
    <header className="relative z-50 border-b-2 border-[#c89b3c]/75 bg-[#090604]/94 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 md:grid md:h-24 md:grid-cols-[1fr_auto_1fr] md:px-6">
        <button
          type="button"
          onClick={() => navigateAndClose("/")}
          className="flex min-w-0 items-center gap-3 text-left md:justify-self-start"
          aria-label="Retourner à l’accueil"
        >
          <img
            src="/images/IconPanassor.png"
            alt="Logo Panassor"
            className="h-12 w-12 shrink-0 object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)] md:h-14 md:w-14"
          />

          <div className="min-w-0">
            <div className="font-['Uncial_Antiqua'] text-3xl leading-none text-[#f7ead2] drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] sm:text-4xl md:text-5xl">
              Panassor
            </div>

            <div className="mt-1 max-w-[10rem] font-['IM_Fell_English_SC'] text-[0.62rem] uppercase leading-4 tracking-[0.14em] text-[#d8a24c] sm:max-w-none sm:text-[0.72rem] md:text-[0.8rem]">
              Kits médiévaux uniques
            </div>
          </div>
        </button>

        <nav className="hidden items-center gap-7 justify-self-center font-['IM_Fell_English_SC'] text-2xl tracking-[0.03em] text-[#f7ead2]/85 md:flex">
          <div className="group relative">
            <button
              type="button"
              onClick={() => navigate("/collections")}
              className="transition hover:text-[#d8a24c]"
            >
              Collections
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 w-[27rem] -translate-x-1/2 pt-5 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100">
              <div className="relative overflow-hidden border border-[#6f5423]/80 bg-[linear-gradient(180deg,#1b1008_0%,#0b0603_100%)] p-3 shadow-[0_22px_58px_rgba(0,0,0,0.82),0_0_34px_rgba(200,155,60,0.1)] backdrop-blur">
                <div className="pointer-events-none absolute inset-1 border border-[#c89b3c]/10" />
                <div className="pointer-events-none absolute left-1/2 top-[-0.45rem] h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-[#6f5423]/80 bg-[#1b1008]" />

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,155,60,0.13),transparent_42%)]" />

                <div className="relative z-10 mb-2 flex items-center justify-center gap-3 px-4 py-2 text-[#c89b3c]">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/45" />
                  <span className="text-sm">✦</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/45" />
                </div>

                {dropdownItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.url)}
                    className="group/item relative flex w-full items-center gap-4 border-b border-[#6f5423]/40 px-3 py-3 text-left transition last:border-b-0 hover:bg-[#c89b3c]/10"
                  >
                    <span className="absolute left-0 top-1/2 h-10 w-px -translate-y-1/2 bg-[#c89b3c]/0 transition group-hover/item:bg-[#c89b3c]/85" />

                    <span className="relative h-16 w-24 shrink-0 overflow-hidden border border-[#6f5423]/65 bg-[#080504]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover brightness-[0.72] contrast-[1.08] saturate-[0.95] transition duration-300 group-hover/item:scale-[1.04] group-hover/item:brightness-[0.9]"
                      />

                      <span className="absolute inset-0 bg-gradient-to-t from-[#080504]/55 via-transparent to-transparent" />
                      <span className="absolute inset-0 shadow-[inset_0_0_22px_rgba(8,5,4,0.55)]" />
                    </span>

                    <span className="relative z-10 min-w-0">
                      <span className="mb-1 block font-['IM_Fell_English_SC'] text-[0.68rem] uppercase tracking-[0.24em] text-[#c89b3c]/80">
                        {item.eyebrow}
                      </span>

                      <span className="block font-['IM_Fell_English_SC'] text-xl uppercase leading-none tracking-[0.06em] text-[#fff1d2] transition group-hover/item:text-[#e7c97b]">
                        {item.title}
                      </span>
                    </span>
                  </button>
                ))}

                <div className="relative z-10 mt-2 flex items-center justify-center gap-3 px-4 py-2 text-[#c89b3c]">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/35" />
                  <span className="text-xs">✦</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/35" />
                </div>
              </div>
            </div>
          </div>

          <span className="text-sm text-[#8a5a2b]">✦</span>

          <button
            type="button"
            onClick={() => navigate("/produits")}
            className="transition hover:text-[#d8a24c]"
          >
            Produits
          </button>

          <span className="text-sm text-[#8a5a2b]">✦</span>

          <button
            type="button"
            onClick={() => navigate("/atelier")}
            className="transition hover:text-[#d8a24c]"
          >
            Atelier
          </button>

          <span className="text-sm text-[#8a5a2b]">✦</span>

          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="transition hover:text-[#d8a24c]"
          >
            Contact
          </button>
        </nav>

        <div className="flex shrink-0 items-center justify-self-end text-[#d8a24c]">
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="border border-[#6f5423]/80 bg-[#120c07] px-3 py-2 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.14em] transition hover:border-[#c89b3c] hover:bg-[#c89b3c] hover:text-[#100805] md:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? "Fermer" : "Menu"}
          </button>

          <div className="hidden items-center gap-5 md:flex">
            <button
              type="button"
              className="text-xl transition hover:text-[#f7ead2]"
              aria-label="Compte"
            >
              ♙
            </button>

            <button
              type="button"
              className="text-xl transition hover:text-[#f7ead2]"
              aria-label="Recherche"
            >
              ⌕
            </button>

            <button
              type="button"
              className="text-xl transition hover:text-[#f7ead2]"
              aria-label="Panier"
            >
              ▢
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[#6f5423]/60 bg-[#080504]/98 px-5 pb-7 pt-5 shadow-[0_22px_58px_rgba(0,0,0,0.82)] md:hidden">
          <div className="mx-auto max-w-md">
            <div className="mb-5 flex items-center justify-center gap-3 text-[#c89b3c]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/45" />
              <span className="text-xs">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/45" />
            </div>

            <p className="mb-4 font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.28em] text-[#c89b3c]/80">
              Collections
            </p>

            <div className="border-y border-[#6f5423]/45 py-2">
              {mobileItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateAndClose(item.url)}
                  className={mobileCollectionLinkClass}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;