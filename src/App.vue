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
  <v-app class="application">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SET_VIEWPORT } from './store/appDataStore';
import { debounce } from 'lodash';

@Component
class App extends Vue {
  resizeHandler = debounce(this.handleResize, 100);

  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.resizeHandler);
  }

  beforeDestroy() {
    // Clean up any resources or listeners if needed
    window.removeEventListener('resize', this.resizeHandler);
  }

  handleResize() {
    // Handle the resize event here
    this.$store.commit(`appDataStore/${SET_VIEWPORT}`, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
}
export default App;
</script>

<style scoped>
.application {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(121deg, #f8fafa, #d6e2e6) !important;
  overflow-y: auto;
}
</style>

<style>
html {
  overflow-y: hidden !important;
}

body {
  overflow-y: hidden;
}
</style>
