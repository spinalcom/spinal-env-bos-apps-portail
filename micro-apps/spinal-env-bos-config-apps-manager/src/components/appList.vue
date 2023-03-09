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
  <div class="_container">
    <div class="toolbar">
      <div class="left_side">
        <div class="_title">{{title}}</div>
        <div class="searchDiv">
          <v-text-field class="textInput"
                        solo
                        prepend-inner-icon="mdi-magnify"
                        flat
                        dense
                        label="rechercher"
                        hide-details="auto"
                        v-model.trim="searchQuery"></v-text-field>
        </div>
      </div>

      <div class="right_side">
        <v-btn class="button"
               color="#14202c"
               @click="uploadApps">
          <v-icon class="btnIcon">
            mdi-file-upload-outline
          </v-icon>
          importer un fichier .xls
        </v-btn>

        <v-btn class="button"
               color="#14202c"
               @click="addApp">
          <v-icon class="btnIcon">
            mdi-plus
          </v-icon>

          Ajouter une application
        </v-btn>

      </div>

    </div>

    <div class="tableContent">
      <v-data-table dense
                    hide-default-header
                    disable-pagination
                    hide-default-footer
                    id="table"
                    :items="searchedApps"
                    item-key="name">

        <template v-slot:header
                  v-if="searchedApps.length > 0">
          <thead>
            <tr>
              <th class="firstHeader">
                <v-card>
                  <!-- <v-icon small>home</v-icon> -->
                </v-card>
              </th>
              <th class="tableHeader">
                Nom de l'application
              </th>
              <th class="tableHeader">
                Tags
              </th>

              <th class="tableHeader">
                Categories/groupes
              </th>

              <th class="tableHeader">
                Actions
              </th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item }">
          <tr class="itemRow">
            <td class="iconsCell">
              <v-timeline>
                <v-timeline-item color="#fff"
                                 fill-dot
                                 small>
                  <template v-slot:icon>
                    <v-icon>{{item.icon | formatIcon}}</v-icon>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </td>
            <td>{{item.name}}</td>
            <td>{{item.tags | formatTags}}</td>
            <td>{{item.categoryName + "/" + item.groupName}}</td>
            <td class="actions">
              <v-btn class="actionBtn dark"
                     @click="editApp(item)">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>

              <v-btn class="actionBtn"
                     color="error"
                     outlined
                     @click="deleteApp(item)">
                <v-icon small>mdi-close</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>

        <template slot="no-data">
          <h6 class="no-data">
            Aucune Application à afficher
          </h6>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
  
  <script lang="ts">
import { IApp } from "../types/interfaces";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  filters: {
    formatTags(value: string | string[]) {
      if (Array.isArray(value)) {
        return value.join(", ").toUpperCase();
      }

      return value.toUpperCase();
    },

    formatIcon(iconName: string) {
      if (/^mdi-/.test(iconName)) return iconName;
      return `mdi-${iconName}`;
    },
  },
})
class AppList extends Vue {
  @Prop() category!: { name: string; id: string };
  @Prop() apps!: IApp[];

  searchedApps: IApp[] = [];
  searchQuery: string = "";

  mounted() {
    if (this.apps) {
      this._filterData();
    }
  }

  @Watch("apps")
  watchCategory() {
    this._filterData();
  }

  @Watch("searchQuery")
  watchSearchQuery() {
    this._filterData();
  }

  _filterData() {
    const val = this.searchQuery.trim().toLowerCase();
    if (!val) {
      this.searchedApps = Object.assign([], this.apps);
      return;
    }

    this.searchedApps = this.apps.reduce((liste: any[], item: any) => {
      if (item.name.toLowerCase().includes(val)) {
        liste.push(Object.assign({}, item));
      }

      return liste;
    }, []);
  }

  addApp() {
    this.$emit("create");
  }

  uploadApps() {
    this.$emit("upload");
  }

  editApp(item: IApp) {
    this.$emit("edit", item);
  }

  deleteApp(item: IApp) {
    this.$emit("delete", item);
  }

  get title(): string {
    if (!this.category || !this.category.name) return "Liste d'applications";
    return "Liste d'" + this.category.name.toLowerCase();
  }
}

export default AppList;
</script>
  
  <style lang="scss">
// .button {
//   color: #fff;

//   .btnIcon {
//     margin-right: 5px;
//   }
// }
._container {
  $toolbar-height: 120px;
  width: 100%;
  height: 100%;

  .toolbar {
    width: 100%;
    height: $toolbar-height;
    display: flex;
    justify-content: space-between;

    .left_side {
      width: 40%;

      ._title {
        width: 100%;
        height: 35%;
        display: flex;
        padding-left: 5px;
        align-items: center;
        font-size: 1.2em;
        color: #214353;
      }

      .searchDiv {
        width: 100%;
        height: 65%;
        .textInput {
          // border: 1px solid;
        }
      }
    }

    .right_side {
      width: 49%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      .button {
        color: #fff;
        max-width: 290px;
        margin-right: 5px;
        font-size: 0.8em;
        .btnIcon {
          width: 30px;
          margin-right: 5px;
        }
      }
    }
  }

  .tableContent {
    width: 100%;
    height: calc(100% - #{$toolbar-height});
    #table {
      background: transparent !important;
      .itemRow {
        td {
          vertical-align: middle !important;
        }

        .actions {
          // height: 70px;
          .actionBtn {
            min-width: unset;
            width: 30px !important;
            height: 30px;
            margin-left: 10px;
          }
          .actionBtn.dark {
            background: #14202c;
            color: white;
          }
        }

        .firstHeader,
        .iconsCell {
          width: 60px;
          padding: unset !important;
        }

        .iconsCell {
          .v-timeline {
            padding-top: 15px !important;
          }

          .v-timeline-item {
            display: block;
            padding-bottom: 15px !important;
          }

          .v-timeline::before {
            background: #000 !important;
          }

          .v-timeline-item__divider {
            min-width: unset !important;
          }
        }
      }
    }
  }
}
</style>
  