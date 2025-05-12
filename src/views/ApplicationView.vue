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
  <v-container class="appLoadContainer" fluid>
    <NavBar class="navbar" :isMobile="isMobile" />

    <!-- <iframe viewer  -->
    <ViewerIFrame
      v-if="showViewer"
      class="iframeViewerContainer"
      :inDrag="inDrag"
      v-on:update:inDrag="inDrag = $event"
    ></ViewerIFrame>

    <!-- <iframe  -->
    <iframe
      v-if="appPath"
      class="iframeContainer"
      :class="{ 'disabled-event': inDrag }"
      :src="appPath"
    ></iframe>

    <div v-else class="iframeContainer notFoundDiv">
      <h1 class="code">404</h1>
      <h1>No app found</h1>
    </div>
  </v-container>
</template>

<script lang="ts">
import NavBar from '../components/nav.vue';
// import { getAppById } from '../requests/userData';
import { SET_SELECTED_APP } from '../store/appDataStore';
import { Vue, Component, Watch } from 'vue-property-decorator';
import ViewerIFrame from './ViewerIframe.vue';

@Component({
  components: {
    NavBar,
    ViewerIFrame,
  },
})
class ApplicationView extends Vue {
  appSelected: string = '';
  showViewer = false;
  appPath: any = null;
  inDrag = false;

  async mounted() {
    // window.router = this.$route;
    await this.initApp();
  }

  test() {
    console.log('test');
  }

  async initApp() {
    this.appSelected = this.getAppInfo();

    if (!this.appSelected) return;

    await this.$store.dispatch(`appDataStore/selectSpace`);
    this.$store.commit(`appDataStore/${SET_SELECTED_APP}`, this.appSelected);
    this.appPath = this.getAppPath();
  }

  getAppInfo() {
    try {
      const { query } = this.$route;
      const appId: any = query.app;
      return appId;
    } catch (error) {}
  }

  getAppPath() {
    if (!this.appSelected) return;
    // if (this.appSelected.hasViewer) {
    //   this.showViewer = true;
    //   return `/micro-apps/spinal-env-pam-dataview`;
    // }
    for (const item of this.$store.state.appDataStore.portofolios) {
      if (item.name === 'Applications') {
        for (const app of item.apps) {
          if (app.name === this.appSelected) {
            return '/micro-apps/' + app.packageName;
          }
        }
      }
    }
    return `/micro-apps/${this.appSelected}`;
  }

  @Watch('$route')
  watchRoute() {
    this.initApp();
  }

  get isMobile() {
    const breakpoint = this.$vuetify.breakpoint.name;
    if (['xs', 'sm'].indexOf(breakpoint) !== -1) return true;
    return false;
  }
}

export default ApplicationView;
</script>

<style lang="scss">
.appLoadContainer {
  width: 100%;
  height: 100%;
  padding: 0 !important;
  display: flex;

  .navbar {
    // width: 450px;
    // height: 60px;
    position: absolute;
    // top: 5px;
    left: 0px;
  }

  // .navbar.active {
  //   width: 100vw;
  //   height: 100vh;
  // }

  .iframeViewerContainer {
    width: 100%;
    height: 100%;
  }
  .iframeContainer {
    width: 100%;
    height: 100%;
  }
  .iframeViewerContainer + .iframeContainer {
    position: absolute;
    right: 0;
    width: 33%;
    height: 100%;
  }
  .disabled-event {
    pointer-events: none;
  }

  .iframeContainer.notFoundDiv {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .code {
      font-size: 5em;
    }
  }
}
</style>
