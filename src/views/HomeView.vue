<!--
Copyright 2022 SpinalCom - www.spinalcom.com
This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <v-container class="appContainer"
               fluid>
    <div class="my_header">
      <div class="description">
        <p>Consultez toutes les données de votre bâtiment connecté.</p>
        <p>
          Vous pouvez garder en favoris une visualisation en cliquant sur
          <v-btn outlined
                 small
                 disabled
                 class="favorisBtn">
            <!-- <v-icon>mdi-cards-diamond</v-icon> -->
            <v-icon>mdi-star</v-icon>
          </v-btn>
        </p>
      </div>

      <v-row class="search">
        <v-col cols="8"
               class="searchCol">
          <v-text-field solo
                        flat
                        placeholder="rechercher"
                        prepend-inner-icon="mdi-magnify"
                        v-model="filtersData.search">
          </v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select solo
                    flat
                    v-model="filtersData.category"
                    append-icon=""
                    prepend-inner-icon="mdi-chevron-down"
                    :items="selects"
                    item-text="name"
                    item-value="value"
                    label="Select"
                    persistent-hint
                    return-object
                    single-line></v-select>
        </v-col>
      </v-row>
    </div>

    <v-layout class="apps-container">
      <v-flex style="overflow: auto">
        <GridComponent :groups="groups"
                       :categories="categoriesDisplayed"
                       :isMobile="isMobile"
                       :favoriteApps="favoriteApps"
                       @goToApp="goToApp"
                       @exploreApp="exploreApp"
                       @addAppToFavoris="addAppToFavoris" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from "vue";
// import { groups, categories } from "./data";
import GridComponent from "../components/gridComponent.vue";
import * as lodash from "lodash";
import { mapState } from "vuex";
import { SET_SELECTED_APP } from "../store/appDataStore";

export default Vue.extend({
  name: "Home",
  components: {
    GridComponent,
  },
  props: {
    isMobile: {},
  },
  data() {
    this.defaultCategory = {
      name: "Toutes les categories",
      value: "",
    };
    return {
      filtersData: {
        category: this.defaultCategory,
        search: "",
      },
      groups: [],
      categories: [],
      categoriesDisplayed: [],
      selects: [],
    };
  },
  created() {
    this.debounceFilter = lodash.debounce(this.filterCategories, 400);
  },
  async mounted() {
    if (this.groups.length === 0) this.formatData(this.appsFormatted);

    this.$store.commit(`appDataStore/${SET_SELECTED_APP}`, undefined);
  },
  methods: {
    // ...mapActions("appDataStore", ["getApps", "getBos"]),

    // init() {
    //   return Promise.all([this.getApps(), this.getBos()]);
    // },
    formatData(info) {
      if (!info) return;
      const { groups, data } = info;
      this.groups = groups;
      this.categories = data;
      this.filterCategories();
      this.selects = [
        this.defaultCategory,
        ...data.map((el) => {
          el.name = el.name || el.name;
          el.value = el.id || el.name;
          return el;
        }),
      ];
    },

    filterCategories() {
      this.categoriesDisplayed = this.categories.reduce((liste, item) => {
        const categoryName = this.filtersData.category.value;
        if (categoryName && categoryName !== item.value) return liste;
        const searchData = this.filtersData.search.toLowerCase();
        let appsItem = !searchData ? item : this.filterApps(searchData, item);

        liste.push(appsItem);
        return liste;
      }, []);
    },

    filterApps(searchText, item) {
      let obj = {};
      for (const key in item) {
        if (Object.hasOwnProperty.call(item, key)) {
          const value = item[key];
          obj[key] =
            typeof value === "string"
              ? value
              : value.filter(
                  (el) =>
                    el.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    el.tags.find((tag) =>
                      tag.toLowerCase().includes(searchText.toLowerCase())
                    )
                );
        }
      }

      return obj;
    },

    goToApp({ item, event }) {
      if (item.isExternalApp) {
        window.open(item.link, "_blank");
        return;
      }

      if (event.ctrlKey) {
        let routeData = this.$router.resolve({
          name: "App",
          query: { app: btoa(JSON.stringify(item)) },
        });
        window.open(routeData.href, "_blank");
      } else {
        this.$router.push({
          name: "App",
          query: { app: btoa(JSON.stringify(item)) },
        });
      }
    },

    exploreApp(item) {},

    addAppToFavoris({ item, isFavorite }) {
      const ids = [item.id];
      if (isFavorite)
        return this.$store.dispatch(`appDataStore/deleteFavoriteApps`, ids);
      this.$store.dispatch(`appDataStore/addToFavoriteApps`, ids);
    },
  },
  computed: {
    ...mapState("appDataStore", ["appsFormatted", "favoriteApps"]),
  },
  watch: {
    // favoriteApps() {
    //   this.favoriteApps.forEach((el) => {
    //     this.favoriteAppsObj[el.id] = el;
    //   });
    // },
    appsFormatted({ data, groups }) {
      this.formatData({ data, groups });
    },

    "filtersData.category": function () {
      this.filterCategories();
    },

    "filtersData.search": function () {
      this.debounceFilter();
    },
  },
});
</script>

<style lang="scss">
$md-screen: 960px;

.appContainer {
  width: 100%;
  height: 100%;
  padding: 0px;

  .my_header {
    @media (max-width: $md-screen) {
      width: 100%;
    }
    width: 50%;
    display: flex;
    flex-direction: column;
    height: 150px;

    .description {
      margin-bottom: 20px;

      p {
        margin-bottom: 0px;
      }
    }

    .search {
      .searchCol {
        padding-right: 0px;
      }
    }
  }

  .favorisBtn {
    min-width: unset !important;
    width: 35px;
    height: 35px !important;
    border-radius: 10px;

    i {
      font-size: 15px;
    }
  }

  .apps-container {
    width: 100%;
    height: calc(100% - 210px);
    background: transparent;
  }
}
</style>

