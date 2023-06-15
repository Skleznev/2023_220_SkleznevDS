<template lang="html">
  <div>
    <v-breadcrumbs class="remove-top-padding" :items="breadcrumbItems">
      <template v-slot:divider>
        <v-icon>>/v-icon>
      </template>
    </v-breadcrumbs>
    <v-data-table
      class="elevation-1"
      :headers="determinantHeaders"
      :hide-actions="true"
      :items="determinantItems"
      :loading="uploadExpressionData.loading"
      :no-data-text="$t('$.determinants.noResultText')"
    >
      <template v-slot:headers="props">
        <tr>
          <th
            v-for="header in props.headers.filter((h) => h.text)"
            :key="header.text"
            class="text-xs-left"
          >
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <td>{{ props.item.dimensions }}</td>
        <td>{{ props.item.iterations }}</td>
        <td>{{ props.item.ticks === null ? "?" : props.item.ticks }}</td>
        <td>
          {{ props.item.processors === null ? "?" : props.item.processors }}
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import axios, {AxiosError} from "axios";
import _isEqual from "lodash.isequal";
import {Component, Mutation, State, Vue, Watch} from "nuxt-property-decorator";

@Component({
  async asyncData(context) {
    const [resAlgorithm, resDeterminants] = await Promise.all([
      axios.get(`/algorithm/${context.params.algorithmId}`, {
        baseURL: process.env.API_ENDPOINT,
      }),
      axios.get(`/algorithm/${context.params.algorithmId}/determinants`, {
        baseURL: process.env.API_ENDPOINT,
      }),
    ]);

    return {
      algorithmData: resAlgorithm.data,
      determinantItems: resDeterminants.data,
    };
  },
})
export default class DeterminantsPage extends Vue {
  public algorithmData!: any;

  public determinantItems!: any[];

  public newDeterminantData = {
    dialog: false,
    dimensions: "",
    iterations: "" as any,
    loading: false,
  };

  public editDeterminantData = {
    dialog: false,
    dimensions: "",
    iterations: "" as any,
    loading: false,
    origin: null as any,
  };

  public uploadExpressionData = {
    loading: false,
    origin: null as any,
  };

  @State("user")
  public stateUser!: string;

  @Mutation("SET_ERROR")
  public setStateError!: (payload: {
    errorMessage?: string;
    showError?: boolean;
  }) => void;

  public get determinantHeaders() {
    return [
      {
        text: this.$t("$.determinants.headers.dimensions"),
      },
      {
        text: this.$t("$.determinants.headers.iterations"),
      },
      {
        text: this.$t("$.determinants.headers.ticks"),
      },
      {
        text: this.$t("$.determinants.headers.processors"),
      },
      {},
    ];
  }

  public get breadcrumbItems() {
    return [
      {
        exact: true,
        nuxt: true,
        text: this.$t("$.determinants.breadcrumbs.prev"),
        to: "/",
      },
      {
        exact: true,
        nuxt: true,
        text: this.$t("$.determinants.breadcrumbs.cur", {
          name: this.algorithmData.nameEn,
        }),
        to: `/algorithms/${this.algorithmData.algorithmId}/determinants`,
      },
    ];
  }

  public get rules() {
    return {
      dimensions: [
        (v: string) => {
          const digits = (v || "")
            .split(/[ ,]/)
            .filter((x) => !!x)
            .map((x) => parseInt(x, 10));
          if (digits.length === 0) {
            return this.$t("$.rules.dimensions.required");
          }
          return true;
        },
      ],
      iterations: [
        (v: string) => v !== "" || this.$t("$.rules.iterations.required"),
        (v: number) => v >= 0 || this.$t("$.rules.iterations.>=0"),
        (v: number) =>
          v === parseInt(String(v), 10) || this.$t("$.rules.iterations.int"),
      ],
    };
  }

  public generateExpressionDownloadLink({algorithmId, id}: any): string {
    return `${
      process.env.API_ENDPOINT
    }/algorithms/${algorithmId}/determinants/${id}/expression/${algorithmId}-${id}.json`;
  }
}
</script>

<style lang="css" scoped>
.remove-top-padding {
  padding-top: 0 !important;
}
</style>
