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
  <v-card class="app-card-config-container" :href="appHref">
    <div class="app-card-config-content">
      <div class="app-card-config-content-left">
        <v-card class="iconDiv">
          <v-icon color="#000000">{{ icon }}</v-icon>
        </v-card>
      </div>

      <div class="app-card-config-content-right">
        <div class="app-card-config-app-config-name" :title="title">
          {{ title }}
        </div>
        <div class="app-card-config-description" :title="shortDescription">
          {{ shortDescription }}
        </div>

        <div class="app-card-config-tags" ref="tagsscroll" :title="tagsTitle">
          <div :style="tagsScrollStyle">
            <v-chip
              class="app-card-config-tag-chip"
              label
              color="#6699cc"
              v-for="(tag, index) in tags"
              :key="index"
              small
            >
              <v-icon left :color="tag.color"> mdi-circle-small </v-icon
              >{{ tag.name }}
            </v-chip>
          </div>
        </div>

        <div class="app-card-config-actions">
          <div>
            <v-btn
              icon
              class="app-card-config-action-btn"
              outlined
              title="ajouter aux favoris"
              @click.stop.prevent="addAppToFavoris"
            >
              <v-icon :color="isFavorite ? '#ffd700' : 'inherit'"
                >mdi-star</v-icon
              >
            </v-btn>
            <v-btn
              class="app-card-config-action-btn"
              icon
              outlined
              :title="'Aller à la documentation de ' + app.name"
              v-if="
                app.documentationLink &&
                appConfig.documentationLink !== app.documentationLink
              "
              :href="app.documentationLink"
              target="_blank"
            >
              <v-icon color="#f2951f">mdi-information-variant</v-icon>
            </v-btn>
            <v-btn
              class="app-card-config-action-btn"
              icon
              outlined
              :title="'Aller à la documentation de ' + appConfig.name"
              v-if="appConfig.documentationLink"
              :href="appConfig.documentationLink"
              target="_blank"
            >
              <v-icon>mdi-information-variant</v-icon>
            </v-btn>
            <v-btn icon small @click.stop.prevent="show = !show">
              <v-icon
                >{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
          <pre :title="app.name + ' description'">{{ appDescription }}</pre>
          <hr
            v-if="haveDescription"
            class="app-card-config-full-description-separator"
          />
          <pre :title="appConfig.name + ' description'">{{
            configDescription
          }}</pre>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IApplicationsItem, ISubAppsItem } from './IGridCategoryApp';
import { State } from 'vuex-class';
@Component({
  name: 'ApplicationConfigCard',
})
class ApplicationConfigCard extends Vue {
  @Prop({ required: true, type: Boolean }) isFavorite!: boolean;
  @Prop({ required: true, type: Object }) app!: IApplicationsItem;
  @Prop({ required: true, type: Object }) appConfig!: ISubAppsItem;
  show: boolean = false;
  tagsScrollStyle = {
    display: 'inline-block',
    animation: '',
  };
  @State('viewportSize', {
    namespace: 'appDataStore',
  })
  viewportSize!: number;

  mounted() {
    if (this.appConfig && this.app) this.getTagsScrollStyle();
  }

  @Watch('viewportSize.width', { immediate: true })
  onViewportChange() {
    if (this.appConfig && this.app) this.getTagsScrollStyle();
  }

  getTagsScrollStyle() {
    const refObj = <Element>this.$refs['tagsscroll'];
    if (!refObj || refObj.scrollWidth > refObj.clientWidth) {
      const nbTags = this.tagsTitle.length;
      const size = this.tagsTitle.length * 10 + nbTags * 10;
      this.tagsScrollStyle.animation = `scroll-text ${
        size / 50
      }s linear infinite paused`;
      return;
    }
    this.tagsScrollStyle.animation = '';
  }
  get title() {
    return `${this.app.name} - ${this.appConfig.name}`;
  }
  get tagsTitle() {
    const res = new Set();
    if (this.appConfig.tags)
      this.appConfig.tags.forEach((tag) => res.add(tag.toUpperCase()));
    this.app.tags.forEach((tag) => res.add(tag.toUpperCase()));
    return Array.from(res).join(', ');
  }
  get tags() {
    const subAppColor = '#ffffff';
    const appColor = '#f2951f';
    const res = [];
    if (this.appConfig.tags)
      this.appConfig.tags.forEach((tag) =>
        res.push({ name: tag.toUpperCase(), color: subAppColor })
      );
    this.app.tags.forEach((tag) => {
      const name = tag.toUpperCase();
      if (res.find((t) => t.name === name)) return;
      res.push({ name, color: appColor });
    });
    return res;
  }
  get icon() {
    if (this.appConfig.icon) return this.appConfig.icon;
    return this.app.icon;
  }
  get shortDescription() {
    if (this.appConfig.description)
      return this.appConfig.description.split('\n', 1)[0] || '';
    return this.app.description.split('\n', 1)[0] || '';
  }
  get configDescription() {
    if (this.appConfig.description) return this.appConfig.description;
    return '';
  }
  get appDescription() {
    return this.app.description;
  }
  get haveDescription() {
    return this.appConfig.description && this.app.description;
  }
  get appHref() {
    let routeData = this.$router.resolve({
      name: 'App',
      query: { app: this.app.name, config: this.appConfig.name },
    });
    return routeData.href;
  }
  addAppToFavoris() {
    this.$emit('addAppToFavoris', {
      item: this.appConfig,
      isFavorite: this.isFavorite,
    });
  }
}

export default ApplicationConfigCard;
</script>

<style scoped>
.app-card-config-container {
  height: 100%;
  width: 100%;
  min-height: 113px;
  background: #ffffff;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
}
.app-card-config-content {
  width: 100%;
  height: 100%;
  display: flex;
}
.app-card-config-content-left {
  width: 40px;
  background: #f7f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.app-card-config-content-left .iconDiv {
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
  margin-top: 5px;
}
.app-card-config-content-right {
  width: calc(100% - 40px);
  height: 100%;
  padding: 5px;
}
.app-card-config-content-right .app-card-config-app-config-name,
.app-card-config-content-right .app-card-config-description,
.app-card-config-content-right .app-card-config-tags,
.app-card-config-content-right .app-card-config-actions {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.app-card-config-content-right .app-card-config-app-config-name {
  height: 30px;
  font-size: 0.9em;
  color: #000000;
  text-transform: uppercase;
  font-weight: 900;
  display: flex;
  align-items: center;
}
.app-card-config-content-right .app-card-config-description {
  height: 20px;
  font-size: 0.7em;
  display: flex;
  align-items: center;
}
.app-card-config-content-right .app-card-config-tags {
  position: relative;
  height: 25px;
}

.app-card-config-content-right .app-card-config-tags > div {
  display: inline-block;
}
.app-card-config-container:hover
  .app-card-config-content-right
  .app-card-config-tags
  > div {
  animation-play-state: running !important;
}

/* .app-card-config-container:hover
  .app-card-config-content-right
  .app-card-config-tags
  .scroll-text {
  animation: scroll-text 8s linear infinite running;
} */

@keyframes scroll-text {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
.app-card-config-content-right .app-card-config-tags .app-card-config-tag-chip {
  height: 16px;
  color: #ffffff;
  font-size: 0.7em;
  margin-right: 4px;
}
.app-card-config-content-right .app-card-config-actions {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.app-card-config-content-right
  .app-card-config-actions
  .app-card-config-action-btn {
  min-width: unset !important;
  width: 25px;
  height: 25px !important;
  border-radius: 5px;
  color: #bdbdbd;
}
.app-card-config-full-description-separator {
  width: 80%;
  min-width: 100px;
  border: none;
  border-top: 2px solid #6aa0ad;
  margin: 5px auto;
}
</style>

<style>
.app-card-config-content-right
  .app-card-config-tags
  .app-card-config-tag-chip
  i {
  min-width: none !important;
  width: 5px;
}
.app-card-config-content-right
  .app-card-config-actions
  .app-card-config-favoris
  i {
  font-size: 23px;
}
.app-card-config-content-right
  .app-card-config-actions
  .app-card-config-favoris.isFavorite
  i {
  color: #ffd700 !important;
}
</style>
