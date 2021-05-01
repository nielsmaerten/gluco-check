/* istanbul ignore file */
import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: (code) => {
      const fallback = process.env.REACT_APP_I18N_FALLBACK_LANGUAGE || "en-US";
      return [fallback];
    },
    detection: {
      order: ["path", "querystring", "navigator"],
      lookupFromPathIndex: 0,
    },
    debug: process.env.REACT_APP_I18N_DEBUG === "true" || false,
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.setAttribute("lang", lng);
});

export default i18n;
