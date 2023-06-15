import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const i18n = new VueI18n({
  fallbackLocale: "en",
  locale: localStorage.getItem("locale") || "en",
  messages: {
    en: require("~/locales/en.json"),
    ru: require("~/locales/ru.json"),
  },
});

function init({app}) {
  app.i18n = i18n;
}

init.i18n = i18n;

export default init;
