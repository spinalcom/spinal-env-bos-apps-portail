<!--
Copyright 2025 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Software license Agreement ("Agreement")
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
        <div class="_title">{{ title }}</div>
        <div class="searchDiv">
          <v-text-field
            class="textInput"
            solo
            prepend-inner-icon="mdi-magnify"
            flat
            dense
            label="rechercher"
            hide-details="auto"
            v-model.trim="searchQuery"
          ></v-text-field>
        </div>
      </div>

      <div class="right_side">
        <v-menu
          v-if="category.id === 'bos'"
          transition="slide-y-transition"
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="header-button"
              color="#14202c"
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon class="btnIcon"> mdi-file-upload-outline </v-icon>
              Importer un fichier
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="upload">
              <v-list-item-title>Applications du bâtiment</v-list-item-title>
            </v-list-item>
            <v-list-item @click="uploadSubApp">
              <v-list-item-title
                >Configurations d'applications</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn v-else class="header-button" color="#14202c" @click="upload">
          <v-icon class="btnIcon"> mdi-file-upload-outline </v-icon>
          Importer un fichier
        </v-btn>
        <v-btn class="header-button" color="#14202c" @click="create">
          <v-icon class="btnIcon"> mdi-plus </v-icon>
          Ajouter une application
        </v-btn>
      </div>
    </div>

    <div class="tableContent">
      <v-data-table
        dense
        hide-default-header
        disable-pagination
        hide-default-footer
        :single-expand="false"
        show-expand
        :expanded.sync="expanded"
        id="table"
        :items="searchedApps"
        item-key="name"
      >
        <template v-slot:header v-if="searchedApps.length > 0">
          <thead>
            <tr>
              <th class="firstHeader"> </th>
              <th class="tableHeader"> Nom de l'application </th>
              <th class="tableHeader"> Tags </th>

              <th class="tableHeader"> Categories/groupes </th>

              <th class="tableHeader tableHeader-action"> Actions </th>
              <th class="tableHeader" style="width: 1px; min-width: 1px"> </th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item }">
          <AppListRow
            :item="item"
            :isExpanded="isExpanded(item)"
            :canExpand="item.subApps && item.subApps.length > 0"
            @create-sub-app="createSubApp(item)"
            @edit-app="edit(item)"
            @delete-app="deleteApp(item)"
            @expand="expand"
          />
        </template>

        <template v-slot:expanded-item="{ item }">
          <AppListRow
            v-for="subApp in item.subApps"
            :key="subApp.id"
            :offset="1"
            :item="subApp"
            :parentItem="item"
            :canExpand="false"
            @edit-app="editSubApp(item, $event)"
            @delete-app="deleteSubApp"
            @expand="expand"
          />
        </template>

        <template slot="no-data">
          <h6 class="no-data"> Aucune Application à afficher </h6>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import type { ISpinalApp } from '../types/ISpinalApp';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import AppListRow from './AppListRow.vue';
import type { ISubApp } from '../types/ISubApp';

@Component({
  components: {
    AppListRow,
  },
})
class AppList extends Vue {
  @Prop({ required: true }) category: { name: string; id: string };
  @Prop({ required: true }) apps: ISpinalApp[];

  expanded: ISpinalApp[] = [];
  searchedApps: ISpinalApp[] = [];
  searchQuery: string = '';

  mounted() {
    if (this.apps) {
      this._filterData();
      this.expanded = this.apps.filter((el) => {
        return el.subApps && el.subApps.length > 0;
      });
    }
  }

  @Watch('apps', { deep: true })
  watchCategory() {
    this._filterData();
  }

  @Watch('searchQuery')
  watchSearchQuery() {
    this._filterData();
  }

  _filterData() {
    const val = this.searchQuery.trim().toLowerCase();
    if (!val) {
      this.searchedApps = this.apps;
      this.expanded = this.apps.filter((el) => {
        return el.subApps && el.subApps.length > 0;
      });
      return;
    }

    this.searchedApps = this.apps.reduce((liste: any[], item: any) => {
      if (item.name.toLowerCase().includes(val)) {
        liste.push(Object.assign({}, item));
      }

      return liste;
    }, []);
    this.expanded = this.apps.filter((el) => {
      return el.subApps && el.subApps.length > 0;
    });
  }

  expand(item: ISpinalApp) {
    if (!this.isExpanded(item)) this.expanded.push(item);
    else this.expanded = this.expanded.filter((el) => el.name !== item.name);
  }

  isExpanded(item: ISpinalApp) {
    return this.expanded.find((el: ISpinalApp) => el.name === item.name);
  }

  get title(): string {
    if (!this.category || !this.category.name) return "Liste d'applications";
    return "Liste d'" + this.category.name.toLowerCase();
  }

  @Emit() create() {}
  @Emit() upload() {}
  @Emit() edit(item: ISpinalApp) {
    return item;
  }
  @Emit('delete') deleteApp(item: ISpinalApp) {
    return item;
  }

  @Emit() createSubApp(item: ISpinalApp) {
    return item;
  }
  @Emit() uploadSubApp() {}
  @Emit() editSubApp(item: ISubApp, app: ISpinalApp) {
    return { item, app };
  }
  @Emit() deleteSubApp(item: ISubApp) {
    return item;
  }
}

export default AppList;
</script>
.

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
      height: 100%;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      .header-button {
        margin: 4px;
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
    .v-data-table--mobile > .v-data-table__wrapper tbody {
      display: table-row-group;
    }

    width: 100%;
    height: calc(100% - #{$toolbar-height});
    #table {
      background: transparent !important;
      .tableHeader-action {
        text-align: right;
      }
      .itemRow {
        td {
          vertical-align: middle !important;
        }

        .actions {
          text-align: right;
          // height: 70px;
          .actionBtn {
            min-width: unset;
            width: 30px !important;
            height: 30px;
            // margin-left: 10px;
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
