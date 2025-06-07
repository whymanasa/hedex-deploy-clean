import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // loads translations from public/locales
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    detection: {
      order: ["sessionStorage", "navigator"],
      caches: ["sessionStorage"],
    },
  });

export default i18n;
