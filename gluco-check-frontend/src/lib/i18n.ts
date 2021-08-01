/* istanbul ignore file */
import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { AvailableLanguage } from "./enums";
import { version } from "../../package.json";

i18n
  .use(
    new Backend(null, {
      queryStringParams: {
        v: String(version),
      },
    })
  )
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: (code) => {
      const fallback = process.env.REACT_APP_I18N_FALLBACK_LANGUAGE || "en";
      return [fallback];
    },
    detection: {
      order: ["path", "querystring", "localStorage", "navigator"],
      lookupFromPathIndex: 0,
    },
    debug: process.env.REACT_APP_I18N_DEBUG === "true" || false,
    interpolation: {
      escapeValue: false,
    },
    supportedLngs: Object.values(AvailableLanguage),
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.setAttribute("lang", lng);
});

export default i18n;
