<template lang="html">
  <div>
    <h2>{{ $t("$.about.description.header") }}</h2>
    <p>{{ $t("$.about.description.content") }}</p>
    <h2>{{ $t("$.about.help.header") }}</h2>
    <ul>
      <li>
        <a :href="helpUrl" target="_blank">
          {{ $t("$.about.help.content") }}
        </a>
      </li>
    </ul>
    <h2>
      API
    </h2>
    <ul>
      <li>
        <a :href="apiServer" target="_blank">Q-system</a>
      </li>
      <li>
        <a :href="apiCoproximationServer" target="_blank">{{
          $t("$.about.api.coproximation")
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "nuxt-property-decorator";

@Component
export default class AboutPage extends Vue {
  public get apiServer() {
    return process.env.API_SERVER;
  }

  public get apiCoproximationServer() {
    return process.env.API_COPROXIMATION_SERVER;
  }

  public get helpUrl() {
    switch (this.$i18n.locale) {
      case "en":
        return "https://cloud-cube.s3.amazonaws.com/z5912omvte2f/public/help/en/Help_Q-system.pdf";
      case "ru":
        return "https://cloud-cube.s3.amazonaws.com/z5912omvte2f/public/help/ru/Spravka_Q-system.pdf";
      default:
        return "https://youtu.be/dQw4w9WgXcQ";
    }
  }
}
</script>
