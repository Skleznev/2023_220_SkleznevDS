<template lang="html">
  <v-tabs color="#DCDCDC" right>
    <v-tab>{{ $t("$.algorithms.algorithmsList") }}</v-tab>
    <v-tab>{{ $t("$.algorithms.hierarchy") }}</v-tab>

    <v-tab-item>
      <v-container fluid>
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
          <v-dialog
            v-model="newAlgorithmData.dialog"
            max-width="50%"
            persistent
          >
            <v-card>
              <v-card-title>
                <span class="headline">
                  {{ $t("$.algorithms.newAlgorithm_form.header") }}
                </span>
              </v-card-title>
              <v-card-text>
                <v-form ref="newAlgorithmForm">
                  <v-text-field
                    v-model="newAlgorithmData.name"
                    :label="$t('$.algorithms.newAlgorithm_form.name')"
                    :readonly="newAlgorithmData.loading"
                    :rules="rules.name"
                  />
                  <v-text-field
                    v-model="newAlgorithmData.description"
                    :label="$t('$.algorithms.newAlgorithm_form.description')"
                    :readonly="newAlgorithmData.loading"
                    :rules="rules.description"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :disabled="newAlgorithmData.loading"
                  flat
                  @click="newAlgorithmData.dialog = false"
                >
                  {{ $t("$.algorithms.newAlgorithm_form.cancel") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="editAlgorithmData.dialog"
            max-width="50%"
            persistent
          >
            <v-card>
              <v-card-title>
                <span class="headline">
                  {{
                    $t("$.algorithms.editAlgorithm_form.header", {
                      n: editAlgorithmData.origin
                        ? editAlgorithmData.origin.algorithmId
                        : "?",
                    })
                  }}
                </span>
              </v-card-title>
              <v-card-text>
                <v-form ref="editAlgorithmForm">
                  <v-text-field
                    v-model="editAlgorithmData.name"
                    :label="$t('$.algorithms.editAlgorithm_form.name')"
                    :readonly="editAlgorithmData.loading"
                    :rules="rules.name"
                  />
                  <v-text-field
                    v-model="editAlgorithmData.description"
                    :label="$t('$.algorithms.editAlgorithm_form.description')"
                    :readonly="editAlgorithmData.loading"
                    :rules="rules.description"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :disabled="editAlgorithmData.loading"
                  flat
                  @click="editAlgorithmData.dialog = false"
                >
                  {{ $t("$.algorithms.editAlgorithm_form.cancel") }}
                </v-btn>
                <v-btn
                  color="primary"
                  :loading="editAlgorithmData.loading"
                  @click="completeEditAlgorithm()"
                >
                  {{ $t("$.algorithms.editAlgorithm_form.submit") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-data-table
            color="#F0F8FF"
            class="elevation-1"
            :headers="algorithmHeaders"
            :hide-actions="true"
            :items="algorithmItems"
            :no-data-text="$t('$.algorithms.noResultText')"
          >
            <template v-slot:headers="props">
              <tr>
                <th>
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
              <td>
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
              <td>{{ props.item.nameEn }}</td>
              <td>{{ props.item.descriptionEn }}</td>
              <td>{{ props.item.determinantCount }}</td>
              <td>
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
      </v-container>
    </v-tab-item>

    <v-tab-item>
      <v-container fluid>
        <div>
          <v-dialog v-model="addFolders.dialog" max-width="75%">
            <v-card>
              <v-card-title>
                <span class="headline">
                  {{ $t("$.folders.addFolder_form.header") }}
                </span>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="addFolders.name_ru"
                  :label="$t('$.folders.editFolder_form.name_ru')"
                  :readonly="addFolders.loading"
                  :rules="rules.name_ru"
                />
                <v-text-field
                  v-model="addFolders.name_en"
                  :label="$t('$.folders.editFolder_form.name_en')"
                  :readonly="addFolders.loading"
                  :rules="rules.name_en"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :disabled="addFolders.loading"
                  flat
                  @click="addFolders.dialog = false"
                >
                  {{ $t("$.algorithms.newAlgorithm_form.cancel") }}
                </v-btn>
                <v-btn
                  color="primary"
                  :loading="addFolders.loading"
                  @click="addFolderData()"
                >
                  {{ $t("$.folders.addFolder_form.submit") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <div>
            <FolderRecursion
              v-for="(item, i) in folderItems"
              :key="i"
              :item="item"
              :algo-items="algorithmItems"
            />
          </div>
        </div>
      </v-container>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import axios from "axios";
import {Component, State, Vue, Watch} from "nuxt-property-decorator";
import FolderRecursion from "./foldersRecursion.vue";

@Component({
  async asyncData() {
    const resIdFolder = await axios.get("/folder/root", {
      baseURL: process.env.API_ENDPOINT,
    });

    return {
      algorithmItems: resIdFolder.data.algorithms,
      folderItems: resIdFolder.data.folders,
    };
  },
  components: {
    FolderRecursion: FolderRecursion,
  },
})
export default class IndexPage extends Vue {
  public algorithmItems!: any[];
  public folderItems!: any[];

  public algorithmData = {
    selected: [] as any[],
  };

  public newAlgorithmData = {
    description: "",
    dialog: false,
    loading: false,
    name: "",
  };

  public editAlgorithmData = {
    description: "",
    dialog: false,
    loading: false,
    name: "",
    origin: null as any,
  };

  public compareData = {
    dialog: false,
    items: [] as any[],
    loading: false,
  };

  public addFolders = {
    dialog: false,
    name_ru: "",
    name_en: "",
    loading: false,
  };

  public get rules() {
    return {
      description: [
        (v: string) => !!v || this.$t("$.rules.algorithmDescription.required"),
      ],
      name: [(v: string) => !!v || this.$t("$.rules.algorithmName.required")],
      name_ru: [(v: string) => !!v || this.$t("$.rules.folderName.required")],
      name_en: [(v: string) => !!v || this.$t("$.rules.folderName.required")],
    };
  }

  public get algorithmHeaders() {
    return [
      {},
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

  @Watch("newAlgorithmData.dialog")
  public onNewAlgorithmDialogChanged(): void {
    if (!this.newAlgorithmData.dialog) {
      (this.$refs.newAlgorithmForm as any).reset();
    }
  }

  @Watch("editAlgorithmData.dialog")
  public onEditAlgorithmDialogChanged(): void {
    if (!this.editAlgorithmData.dialog) {
      (this.$refs.editAlgorithmForm as any).reset();
    }
  }

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

  public async completeEditAlgorithm(): Promise<void> {
    if (!(this.$refs.editAlgorithmForm as any).validate()) {
      return;
    }

    const data = {
      description:
        this.editAlgorithmData.origin.description ===
        this.editAlgorithmData.description
          ? undefined
          : this.editAlgorithmData.description,
      name:
        this.editAlgorithmData.origin.name === this.editAlgorithmData.name
          ? undefined
          : this.editAlgorithmData.name,
    };

    if (Object.values(data).every((v) => v === undefined)) {
      this.editAlgorithmData.dialog = false;
      return;
    }

    this.editAlgorithmData.loading = true;
    try {
      await axios.patch(
        `/algorithms/${this.editAlgorithmData.origin.algorithmId}`,
        data,
        {
          baseURL: process.env.API_ENDPOINT,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      this.editAlgorithmData.origin.name = this.editAlgorithmData.name;
      this.editAlgorithmData.origin.description = this.editAlgorithmData.description;
      this.editAlgorithmData.dialog = false;
    } catch (error) {
      throw error;
    } finally {
      this.editAlgorithmData.loading = false;
    }
  }

  public openApproximaionPage(algorithm: any): void {
    (this as any).$router.push(
      `/algorithms/${algorithm.algorithmId}/determinants/approximation`,
    );
  }

  public async addFolderData() {
    this.addFolders.dialog = false;
    // eslint-disable-next-line no-console
    await axios.post(
      `/folder`,
      {
        isMain: true,
        malgorithm: [],
        name: {
          en: this.addFolders.name_en,
          ru: this.addFolders.name_ru,
        },
        subFolders: [],
      },
      {
        baseURL: process.env.API_ENDPOINT,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  }
}
</script>
