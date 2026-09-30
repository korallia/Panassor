import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

// =========================================
// L'ADRESSE SUIT LA LANGUE (et inversement à l'arrivée)
//
//  - En arrivant sur une page par un lien anglais (ex. /produits/lock-pick-thief),
//    le site passe en anglais : c'est l'adresse qui décide.
//  - Ensuite, changer de langue (bouton FR/EN) change l'adresse pour le
//    slug de l'autre langue, sans recharger la page.
// =========================================

/**
 * @param {string|number|null} pageKey  identifiant de ce qui est affiché
 *   (ex. l'id du produit) -- l'adresse n'est « lue » qu'une fois par page.
 * @param {string} currentPath          chemin actuel (sans ?query)
 * @param {{fr: string, en: string}|null} paths  chemin FR et chemin EN
 */
export function useLocalizedUrl(pageKey, currentPath, paths) {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const readFromUrlRef = useRef(null);

  const frPath = paths?.fr || "";
  const enPath = paths?.en || "";

  useEffect(() => {
    if (!pageKey || !frPath) return;

    // 1re fois sur cette page : la langue suit l'adresse.
    if (readFromUrlRef.current !== pageKey) {
      readFromUrlRef.current = pageKey;

      if (enPath && enPath !== frPath) {
        const urlLanguage =
          currentPath === enPath ? "en" : currentPath === frPath ? "fr" : null;

        if (urlLanguage && urlLanguage !== language) {
          setLanguage(urlLanguage);
          return;
        }
      }
    }

    // Ensuite : l'adresse suit la langue.
    const wantedPath = language === "en" ? enPath || frPath : frPath;

    if (wantedPath && wantedPath !== currentPath) {
      navigate(`${wantedPath}${location.search}${location.hash}`, { replace: true });
    }
  }, [pageKey, currentPath, frPath, enPath, language, setLanguage, navigate, location.search, location.hash]);
}
