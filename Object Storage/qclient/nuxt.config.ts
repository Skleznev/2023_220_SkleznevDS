import * as path from "path";
import {URL} from "url";

import NuxtConfiguration from "@nuxt/config";
import * as dotenv from "dotenv";

const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const config: NuxtConfiguration = {
  build: {
    babel: {
      plugins: ["@babel/plugin-syntax-dynamic-import"],
      presets: ["@babel/preset-env"],
    },
    plugins: [new VuetifyLoaderPlugin()],
  },
  css: [
    "material-design-icons-iconfont/dist/material-design-icons.css",
    "katex/dist/katex.min.css",
  ],
  env: {
    API_COPROXIMATION_ENDPOINT: new URL("/api/v1", process.env
      .API_COPROXIMATION_SERVER as string).toString(),
    API_COPROXIMATION_SERVER: process.env.API_COPROXIMATION_SERVER as string,
    API_ENDPOINT: new URL("/api/v1", process.env
      .API_SERVER as string).toString(),
    API_SERVER: process.env.API_SERVER as string,
  },
  generate: {
    dir: "dist",
  },
  head: {
    link: [{rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon"}],
    meta: [{charset: "utf-8"}],
    titleTemplate: "Q-system",
  },
  loading: {
    color: "#FF8C00",
  },
  mode: "spa",
  plugins: ["~/plugins/i18n.js", "~/plugins/katex.js", "~/plugins/vuetify.js"],
  router: {
    mode: "hash",
  },
  server: {
    host: process.env.NUXT_HOST || "0.0.0.0",
    port: parseInt(process.env.NUXT_PORT || "3000", 10),
  },
};

export default config;
