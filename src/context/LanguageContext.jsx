import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("fr");

  const toggleLanguage = () => {
    setLanguage((current) => (current === "fr" ? "en" : "fr"));
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}