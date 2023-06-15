import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";

import init from "./i18n";

Vue.use(Vuetify, {
  iconfont: "md",
  lang: {
    t: (key, ...params) => init.i18n.t(key, params),
  },
});
