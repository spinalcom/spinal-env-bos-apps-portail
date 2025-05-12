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
  <div class="grid-component-container">
    <template v-if="categories && categories.length > 0">
      <div v-for="item in appsCompu" :key="item.id">
        <div class="grid-component-item-header"> {{ item.name }}</div>
        <hr class="grid-component-item-header-separator" />
        <div class="grid-component-item" :key="item.id + '_item'">
          <template v-for="applicationData in item.Applications">
            <div
              v-if="!applicationData.subApps"
              class="grid-component-item-card"
              :key="applicationData.id"
              :class="cardClass"
            >
              <ApplicationCard
                :data="applicationData"
                :isFavorite="isFavorite(applicationData)"
                @exploreApp="exploreApp"
                @addAppToFavoris="addAppToFavoris"
              />
            </div>
            <template v-else>
              <div
                class="grid-component-item-card"
                v-for="subApp in applicationData.subApps"
                :key="subApp.id"
                :class="cardClass"
              >
                <ApplicationConfigCard
                  :app="applicationData"
                  :appConfig="subApp"
                  :isFavorite="isFavorite(subApp)"
                  @exploreApp="exploreApp"
                  @addAppToFavoris="addAppConfigToFavoris"
                />
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import ApplicationCard from './applicationCard.vue';
import ApplicationConfigCard from './applicationConfigCard.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  IApplicationsItem,
  IGridCategoryApp,
  ISubAppsItem,
} from './IGridCategoryApp';
@Component({
  components: {
    ApplicationCard,
    ApplicationConfigCard,
  },
})
class GridComponent extends Vue {
  @Prop({ type: Boolean, default: false }) isMobile: boolean;
  @Prop({ type: Array, default: () => [] }) categories: IGridCategoryApp;
  appsCompu: IGridCategoryApp = [];

  @Watch('categories', { immediate: true, deep: true })
  onCategoriesChange(newVal: IGridCategoryApp) {
    this.appsCompu = newVal.filter(
      (category) => category.Applications?.length > 0
    );
  }

  get cardClass() {
    return {
      'grid-component-card-mobile': this.isMobile,
    };
  }
  isFavorite(applicationData: IApplicationsItem | ISubAppsItem) {
    if (this.favoriteCategory) {
      if (this.favoriteCategory.Applications) {
        for (const app of this.favoriteCategory.Applications) {
          if (app.id === applicationData.id) {
            return true;
          }
          if (app.subApps) {
            for (const subApp of app.subApps) {
              if (subApp.id === applicationData.id) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  get favoriteCategory() {
    return this.categories.find((cat) => cat.id === 'favoris');
  }
  exploreApp(item) {
    this.$emit('exploreApp', item);
  }

  addAppToFavoris(data) {
    this.$emit('addAppToFavoris', data);
  }
  addAppConfigToFavoris(data) {
    this.$emit('addAppToFavoris', data);
  }
}

export default GridComponent;
</script>

<style scoped>
.emptyApplication {
  width: 100%;
  display: flex;
  justify-content: center;
}
.grid-component-container {
  padding: 0 16px 16px 16px;
}
.grid-component-item-header {
  text-transform: uppercase;
  font-size: 0.8em;
  font-weight: bolder;
  color: #6aa0ad;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.grid-component-item-header-separator {
  width: 30%;
  min-width: 100px;
  border: none;
  border-top: 2px solid #6aa0ad; /* Adjust thickness and color */
}

.grid-component-item {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
}
.grid-component-item-card {
  padding: 5px;
  width: 33%;
  width: calc(100% / 3);
}
</style>
<style>
.grid-component-card-mobile {
  width: 100% !important;
}
</style>
