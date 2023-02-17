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

<script lang="ts">
import viewerApp from './components/viewer.vue';
import contextMenu from './components/contextMenu/contextMenu.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    viewerApp,
    contextMenu,
  },
})
class forgeViewer extends Vue {}
export default forgeViewer;
</script>

<template>
  <v-app>
    <v-main class="main-container">
      <viewerApp class="viewerContainer"></viewerApp>
    </v-main>
    <contextMenu></contextMenu>
  </v-app>
</template>

<style>
.main-container > div {
  height: 100%;
  width: 100%;
}
</style>
<style scoped>
.viewerContainer {
  width: 67%;
  height: 100%;
  position: relative;
}
</style>
