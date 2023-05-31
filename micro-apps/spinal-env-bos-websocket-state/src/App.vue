<!--
Copyright 2023 SpinalCom - www.spinalcom.com

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
  <v-app class="appContainer">
    <v-main>
      <HomeView />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import HomeView from './views/HomeView.vue';

export default Vue.extend({
  name: 'App',
  components: {
    HomeView,
  },
  data: () => ({}),
});
</script>

<style lang="scss">
.appContainer {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(121deg, #f8fafa, #d6e2e6) !important;
}
</style>
