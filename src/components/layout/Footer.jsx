import { useNavigate } from "react-router-dom";
import { useCollections } from "../../context/CollectionsContext";

function Footer() {
  const navigate = useNavigate();
  const collections = useCollections();

  const footerLinkClass = "text-left transition hover:text-[#d8a24c]";

  const iconButtonClass =
    "flex h-10 w-10 items-center justify-center border border-[#6f5423] bg-[#120c07] text-[#d8a24c] transition hover:border-[#c89b3c] hover:bg-[#c89b3c] hover:text-[#100805]";

  return (
    <footer className="relative overflow-hidden border-t-2 border-[#c89b3c]/70 bg-[#070403] px-6 pt-20 pb-8 text-[#f3e7cf]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(200,155,60,0.12),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_35%,rgba(35,72,40,0.18),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="grid gap-12 border-b border-[#6f5423]/60 pb-14 md:grid-cols-[1.25fr_0.75fr_0.75fr_0.85fr]">
          <div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-5 flex items-center gap-4 text-left"
              aria-label="Retourner à l’accueil"
            >
              <img
                src="/images/IconPanassor.png"
                alt="Logo Panassor"
                className="h-16 w-16 object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]"
              />

              <div>
                <div className="font-['Uncial_Antiqua'] text-4xl leading-none text-[#fff1d2]">
                  Panassor
                </div>

                <div className="mt-1 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.14em] text-[#d8a24c]">
                  Kits médiévaux uniques
                </div>
              </div>
            </button>

            <p className="max-w-md font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/85">
              Accessoires immersifs faits main pour enrichir les scènes, les
              personnages et les univers de grandeur nature.
            </p>

            <div className="mt-7 h-px w-52 bg-gradient-to-r from-[#c89b3c] to-transparent" />
          </div>

          <div>
            <h3 className="mb-5 font-['IM_Fell_English_SC'] text-2xl uppercase tracking-[0.06em] text-[#fff1d2]">
              Navigation
            </h3>

            <ul className="space-y-3 font-['EB_Garamond'] text-xl text-[#d7c8ad]/85">
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={footerLinkClass}
                >
                  Accueil
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => navigate("/produits")}
                  className={footerLinkClass}
                >
                  Produits
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => navigate("/collections")}
                  className={footerLinkClass}
                >
                  Collections
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => navigate("/atelier")}
                  className={footerLinkClass}
                >
                  Atelier
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-['IM_Fell_English_SC'] text-2xl uppercase tracking-[0.06em] text-[#fff1d2]">
              Collections
            </h3>

            <ul className="space-y-3 font-['EB_Garamond'] text-xl text-[#d7c8ad]/85">
              {collections.map((collection) => (
                <li key={collection.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/collections/${collection.slug}`)}
                    className={footerLinkClass}
                  >
                    {collection.name_fr}
                  </button>
                </li>
              ))}

              <li>
                <button
                  type="button"
                  onClick={() => navigate("/atelier#sneak-peek")}
                  className={footerLinkClass}
                >
                  Collections à venir
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-['IM_Fell_English_SC'] text-2xl uppercase tracking-[0.06em] text-[#fff1d2]">
              Contact
            </h3>

            <p className="mb-6 font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/85">
              Pour une question, une collaboration ou une demande spéciale,
              écrivez-nous.
            </p>

            <a
              href="mailto:contact@panassor.com"
              className="inline-flex items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-3 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.06em] text-[#e7c97b] transition hover:bg-[#c89b3c] hover:text-[#100805]"
            >
              Nous contacter
            </a>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                className={iconButtonClass}
                aria-label="Instagram"
              >
                ✦
              </button>

              <button
                type="button"
                className={iconButtonClass}
                aria-label="Facebook"
              >
                f
              </button>

              <button
                type="button"
                onClick={() => navigate("/collections")}
                className={iconButtonClass}
                aria-label="Boutique"
              >
                ⌂
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 font-['EB_Garamond'] text-base text-[#d7c8ad]/65 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Panassor. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;