<template>
  <div>
    <v-expansion-panel accordion>
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>
            {{ item.nameRu }}
          </div>
        </template>

        <ul v-if="item.algorithms && item.algorithms.length > 0">
          <AlgorithmList
            :algorithm-items="item.algorithms"
            :folder-index="item.folderId"
          />
        </ul>

        <div class="flex items-center">
          <div>
            <ul
              v-if="item.subFolders && item.subFolders.length > 0"
              class="list-none"
            >
              <FolderRecursion
                v-for="(child, subIndex) in item.subFolders"
                :key="subIndex"
                :item="child"
                :parent-item="item"
                :algo-items="algoItems"
              />
            </ul>
          </div>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, State, Vue, Watch} from "nuxt-property-decorator";
import AlgorithmList from "./algorithmList.vue";

@Component({
  name: "FolderRecursion",
  components: {
    AlgorithmList,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    parentItem: {
      required: false,
    },
    algoItems: {
      required: true,
    },
  },
})
export default class FolderRecursion extends Vue {
  public editFolder = {
    dialog: false,
    name_ru: "",
    name_en: "",
    loading: false,
  };

  public addFolder = {
    dialog: false,
    name_ru: "",
    name_en: "",
    loading: false,
    selectedAlgorithm: null,
  };

  @State("user")
  public stateUser!: string;

  public async editFolderData(folder: any) {
    this.editFolder.dialog = false;
    await axios.patch(
      `/folder/${folder._id}`,
      {
        name: {
          en: this.editFolder.name_en,
          ru: this.editFolder.name_ru,
        },
      },
      {
        baseURL: process.env.API_ENDPOINT,
        headers: {
          type: "editFolder",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  }

  public get rules() {
    return {
      name_ru: [(v: string) => !!v || this.$t("$.rules.folderName.required")],
      name_en: [(v: string) => !!v || this.$t("$.rules.folderName.required")],
    };
  }
}
</script>
