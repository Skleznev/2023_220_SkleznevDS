<template lang="html">
  <div>
    <v-dialog v-model="compareData.dialog" max-width="75%">
      <v-card>
        <v-card-text>
          <v-data-table
            class="elevation-1"
            :headers="compareHeaders"
            :hide-actions="true"
            :items="compareData.items"
            :no-data-text="$t('$.algorithms.compare_form.noResultText')"
          >
            <template v-slot:items="props">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.description }}</td>
              <td>{{ props.item.ticks }}</td>
              <td>{{ props.item.processors }}</td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-data-table
      class="elevation-1"
      :headers="algorithmHeaders"
      :hide-actions="true"
      :items="algorithmItems"
      :no-data-text="$t('$.algorithms.noResultText')"
      :folder="folderIndex"
    >
      <template v-slot:headers="props">
        <tr>
          <th width="5" class="text-xs-left">
            <v-btn
              :disabled="algorithmData.selected.length !== 2"
              flat
              :loading="compareData.loading"
              small
              @click="compareAlgorithms()"
            >
              {{ $t("$.algorithms.compare") }}
            </v-btn>
          </th>
          <th width="200" class="text-xs-left">
            {{ $t("$.algorithms.headers.name") }}
          </th>
          <th width="420" class="text-xs-left">
            {{ $t("$.algorithms.headers.description") }}
          </th>
          <th width="10" class="text-xs-left">
            {{ $t("$.algorithms.headers.determinantsCount") }}
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <td width="5">
          <v-layout align-center fill-height justify-center row>
            <v-switch
              :disabled="compareData.loading"
              hide-details
              :loading="
                compareData.loading &&
                  algorithmData.selected.includes(props.item)
              "
              :value="algorithmData.selected.includes(props.item)"
              @change="selectAlgorithm(props.item)"
            />
          </v-layout>
        </td>
        <td width="200">
          {{ props.item.nameEn }}
        </td>
        <td width="420">
          {{ props.item.descriptionEn }}
        </td>
        <td width="10">
          {{ props.item.determinantCount }}
        </td>
        <td width="10">
          <v-layout align-center fill-height justify-center row>
            <v-icon
              class="ml-2"
              small
              @click="openApproximaionPage(props.item)"
            >
              +
            </v-icon>
            <nuxt-link
              class="ml-2"
              :to="`/algorithms/${props.item.algorithmId}/determinants`"
            >
              <v-icon small>
                -
              </v-icon>
            </nuxt-link>
          </v-layout>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, State, Vue, Watch} from "nuxt-property-decorator";

@Component({
  props: {
    algorithmItems: {
      required: true,
    },
    folderIndex: {
      type: Object,
      required: true,
    },
  },
})
export default class AlgorithmList extends Vue {
  public algorithmData = {
    selected: [] as any[],
  };

  public compareData = {
    dialog: false,
    items: [] as any[],
    loading: false,
  };

  public get rules() {
    return {
      description: [
        (v: string) => !!v || this.$t("$.rules.algorithmDescription.required"),
      ],
      name: [(v: string) => !!v || this.$t("$.rules.algorithmName.required")],
    };
  }

  public get algorithmHeaders() {
    return [
      {
        text: this.$t("$.algorithms.headers.name"),
      },
      {
        text: this.$t("$.algorithms.headers.description"),
      },
      {
        text: this.$t("$.algorithms.headers.determinantsCount"),
      },
      {},
    ];
  }

  public get compareHeaders() {
    return [
      {
        sortable: false,
        text: this.$t("$.algorithms.headers.name"),
      },
      {
        sortable: false,
        text: this.$t("$.algorithms.headers.description"),
      },
      {
        sortable: false,
        text: this.$t("$.algorithms.headers.ticksCompare"),
      },
      {
        sortable: false,
        text: this.$t("$.algorithms.headers.processorsCompare"),
      },
    ];
  }

  @State("user")
  public stateUser!: string;

  public async compareAlgorithms(): Promise<void> {
    this.compareData.loading = true;
    try {
      const res = await axios.get(
        `/algorithm/${this.algorithmData.selected[1].algorithmId}/compare/${
          this.algorithmData.selected[0].algorithmId
        }`,
        {
          baseURL: process.env.API_ENDPOINT,
        },
      );
      const {processors, ticks} = res.data;

      this.compareData.items =
        processors === null || ticks === null
          ? []
          : [
              {
                description: this.algorithmData.selected[1].descriptionEn,
                name: this.algorithmData.selected[1].nameEn,
                processors:
                  processors > 0
                    ? this.$t("$.algorithms.compare_form.processors>")
                    : processors < 0
                    ? this.$t("$.algorithms.compare_form.processors<")
                    : this.$t("$.algorithms.compare_form.processors="),
                ticks:
                  ticks > 0
                    ? this.$t("$.algorithms.compare_form.ticks<")
                    : ticks < 0
                    ? this.$t("$.algorithms.compare_form.ticks>")
                    : this.$t("$.algorithms.compare_form.ticks="),
              },
              {
                description: this.algorithmData.selected[0].descriptionEn,
                name: this.algorithmData.selected[0].nameEn,
                processors:
                  processors > 0
                    ? this.$t("$.algorithms.compare_form.processors<")
                    : processors < 0
                    ? this.$t("$.algorithms.compare_form.processors>")
                    : this.$t("$.algorithms.compare_form.processors="),
                ticks:
                  ticks > 0
                    ? this.$t("$.algorithms.compare_form.ticks>")
                    : ticks < 0
                    ? this.$t("$.algorithms.compare_form.ticks<")
                    : this.$t("$.algorithms.compare_form.ticks="),
              },
            ];

      this.compareData.dialog = true;
    } catch (error) {
      throw error;
    } finally {
      this.compareData.loading = false;
    }
  }

  public selectAlgorithm(algorithm: any): void {
    const index = this.algorithmData.selected.indexOf(algorithm);
    if (index >= 0) {
      this.algorithmData.selected.splice(index, 1);
    } else {
      this.algorithmData.selected.unshift(algorithm);
      if (this.algorithmData.selected.length > 2) {
        this.algorithmData.selected.pop();
      }
    }
  }

  public openApproximaionPage(algorithm: any): void {
    (this as any).$router.push(
      `/algorithms/${algorithm.algorithmId}/determinants/approximation`,
    );
  }
}
</script>
