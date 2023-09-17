import { fa } from "./fa";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fa: {
    translation: fa,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fa",
  fallbackLng: "fa",
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});

export default i18n;
