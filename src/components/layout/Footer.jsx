import { useNavigate } from "react-router-dom";

import { useCollections } from "../../context/CollectionsContext";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { getCollectionUrl, t } from "../../utils/localization";
import { getPageText } from "../../utils/content";
import { footerContent } from "../../content/footerContent";

const contactEmail = "contact@panassor.ca";
const facebookUrl = "https://www.facebook.com/profile.php?id=61587079943525";

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 6h15l-2 8H7L5 6Z" />
      <path d="M5 6 4 3H2" />
      <path d="M8 18.5h.01" />
      <path d="M17 18.5h.01" />
    </svg>
  );
}

function Footer() {
  const navigate = useNavigate();
  const collections = useCollections();
  const { language, toggleLanguage } = useLanguage();
  const { openCart, itemCount } = useCart();

  const copy = getPageText(footerContent, language);

  const footerLinkClass = "text-left transition hover:text-[#d8a24c]";

  const iconButtonClass =
    "relative flex h-10 w-10 items-center justify-center border border-[#6f5423] bg-[#120c07] font-['IM_Fell_English_SC'] text-lg text-[#d8a24c] transition hover:border-[#c89b3c] hover:bg-[#c89b3c] hover:text-[#100805]";

  const contactButtonClass =
    "inline-flex items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-3 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.06em] text-[#e7c97b] transition hover:bg-[#c89b3c] hover:text-[#100805]";

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
              aria-label={copy.brand.homeAriaLabel}
            >
              <img
                src="/images/IconPanassor.png"
                alt={copy.brand.logoAlt}
                className="h-16 w-16 object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]"
              />

              <div>
                <div className="font-['Uncial_Antiqua'] text-4xl leading-none text-[#fff1d2]">
                  Panassor
                </div>

                <div className="mt-1 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.14em] text-[#d8a24c]">
                  {copy.brand.tagline}
                </div>
              </div>
            </button>

            <p className="max-w-md font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/85">
              {copy.brand.description}
            </p>

            <div className="mt-7 h-px w-52 bg-gradient-to-r from-[#c89b3c] to-transparent" />
          </div>

          <div>
            <h3 className="mb-5 font-['IM_Fell_English_SC'] text-2xl uppercase tracking-[0.06em] text-[#fff1d2]">
              {copy.navigation.title}
            </h3>

            <ul className="space-y-3 font-['EB_Garamond'] text-xl text-[#d7c8ad]/85">
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={footerLinkClass}
                >
                  {copy.navigation.links.home}
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => navigate("/produits")}
                  className={footerLinkClass}
                >
                  {copy.navigation.links.products}
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => navigate("/collections")}
                  className={footerLinkClass}
                >
                  {copy.navigation.links.collections}
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => navigate("/atelier")}
                  className={footerLinkClass}
                >
                  {copy.navigation.links.workshop}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-['IM_Fell_English_SC'] text-2xl uppercase tracking-[0.06em] text-[#fff1d2]">
              {copy.collections.title}
            </h3>

            <ul className="space-y-3 font-['EB_Garamond'] text-xl text-[#d7c8ad]/85">
              {collections.map((collection) => (
                <li key={collection.id}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(getCollectionUrl(collection, language))
                    }
                    className={footerLinkClass}
                  >
                    {t(collection, "name", language)}
                  </button>
                </li>
              ))}

              <li>
                <button
                  type="button"
                  onClick={() => navigate("/atelier#sneak-peek")}
                  className={footerLinkClass}
                >
                  {copy.collections.comingSoon}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-['IM_Fell_English_SC'] text-2xl uppercase tracking-[0.06em] text-[#fff1d2]">
              {copy.contact.title}
            </h3>

            <p className="mb-6 font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/85">
              {copy.contact.description}
            </p>

            <a href={`mailto:${contactEmail}`} className={contactButtonClass}>
              <span className="mr-3">✦</span>
              {copy.contact.button}
            </a>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`mailto:${contactEmail}`}
                className={iconButtonClass}
                aria-label={copy.contact.emailAriaLabel}
                title={copy.contact.emailTitle}
              >
                ✉
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className={iconButtonClass}
                aria-label={copy.contact.facebookAriaLabel}
                title={copy.contact.facebookTitle}
              >
                f
              </a>

              <button
                type="button"
                onClick={openCart}
                className={iconButtonClass}
                aria-label={language === "en" ? "Open cart" : "Ouvrir le panier"}
                title={language === "en" ? "Cart" : "Panier"}
              >
                <CartIcon />

                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center border border-[#c89b3c] bg-[#1f3324] px-1 font-['IM_Fell_English_SC'] text-[0.62rem] leading-none text-[#e7c97b]">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={toggleLanguage}
                className={`${iconButtonClass} text-sm uppercase tracking-[0.08em]`}
                aria-label={
                  language === "en" ? "Switch to French" : "Passer en anglais"
                }
                title={language === "en" ? "Français" : "English"}
              >
                {language === "fr" ? "EN" : "FR"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 font-['EB_Garamond'] text-base text-[#d7c8ad]/65 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Panassor. {copy.legal.rights}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href={`mailto:${contactEmail}`}
              className="transition hover:text-[#d8a24c]"
            >
              {contactEmail}
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#d8a24c]"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;