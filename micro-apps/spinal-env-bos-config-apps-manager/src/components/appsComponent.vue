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
  <!-- <div class="_content"> -->
  <v-card
    class="cardContent"
    elevation="4"
    :loading="isLoading"
    :disabled="isLoading"
  >
    <v-tabs
      class="tabsHeader"
      v-model="tab"
      background-color="transparent"
      color="primary"
      grow
    >
      <v-tab v-for="item in tabItems" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="tabsItems">
      <v-tab-item>
        <app-list-component
          :apps="buildingApps"
          :category="categories.bos"
          @create="create(categories.bos)"
          @upload="upload(categories.bos)"
          @edit="edit($event, categories.bos)"
          @delete="deleteApp($event, categories.bos)"
          @create-sub-app="createSubApp($event)"
          @upload-sub-app="upload(categories.bosConfig)"
          @edit-sub-app="editSubApp"
          @delete-sub-app="deleteApp($event, categories.bosConfig)"
        />
      </v-tab-item>

      <v-tab-item>
        <app-list-component
          :apps="adminApps"
          :category="categories.admin"
          @create="create(categories.admin)"
          @upload="upload(categories.admin)"
          @edit="edit($event, categories.admin)"
          @delete="deleteApp($event, categories.admin)"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
  <!-- </div> -->
</template>

<script lang="ts">
import type { ISpinalApp } from '../types/ISpinalApp';
import { Component, Emit, Vue } from 'vue-property-decorator';
import AppListComponent from '../components/appList.vue';
import { IAppCategories, IAppCategory, categories } from '../store/categories';
import { Action, State } from 'vuex-class';

@Component({
  components: {
    AppListComponent,
  },
})
class HomeView extends Vue {
  @State('buildingApps') buildingApps!: ISpinalApp[];
  @State('adminApps') adminApps!: ISpinalApp[];
  @Action('getAllBuildingApps') getAllBuildingApps!: () => Promise<void>;
  @Action('getAllAdminApps') getAllAdminApps!: () => Promise<void>;
  // @PropSync('loading', { required: true, type: Boolean }) isLoading!: boolean;

  isLoading: boolean = false;
  categories: IAppCategories = categories;
  categorySelected: IAppCategory = categories.bos;
  tabsObject = {
    Batiments: categories.bos.name,
    Adminstration: categories.admin.name,
  } as const;
  tabItems = Object.values(this.tabsObject);
  tab = this.tabsObject.Batiments;

  async mounted() {
    this.isLoading = true;
    await Promise.all([this.getAllBuildingApps(), this.getAllAdminApps()]);
    this.isLoading = false;
  }
  // @Watch('buildingApps', { deep: true })
  // onBuildingAppsChange() {
  //   console.log('buildingApps', this.buildingApps);
  // }

  @Emit()
  create(category: IAppCategory) {
    return { category };
  }

  @Emit()
  upload(category: IAppCategory) {
    return { category };
  }

  @Emit()
  edit(app: ISpinalApp, category: IAppCategory) {
    return { app, category };
  }

  @Emit()
  editSubApp({ app, item }) {
    return { app: item, subApp: app, category: this.categories.bosConfig };
  }

  @Emit('delete')
  deleteApp(app: ISpinalApp, category: IAppCategory) {
    return { app, category };
  }

  @Emit()
  createSubApp(app: ISpinalApp) {
    return {
      app,
      category: this.categories.bosConfig,
    };
  }
}

export default HomeView;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
// $header-height: 65px;
// $header-margin: 8px;
// $card-background: #f8f9f9;

//._content {
//  width: 100%;
// height: 100%;

// .app_header {
//   // height: $header-height;
//   // margin: $header-margin;
//   display: flex;
//   align-items: center;
//   justify-content: flex-end;
//   .head {
//     width: 500px;
//     height: 100%;
//   }
// }

.cardContent {
  // width: calc(100% - #{$header-margin * 2});
  // height: calc(100% - #{$header-height + ($header-margin * 2)});
  margin: auto;
  // margin-top: $header-height + $header-margin;
  // background: transparent !important;
  // padding: 10px;
  border-radius: 10px;
  width: 100%;
  height: 100%;

  .tabsHeader {
    width: 100%;
    height: 50px;
  }

  .tabsItems {
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
    background: transparent !important;
  }
}
//}
</style>
