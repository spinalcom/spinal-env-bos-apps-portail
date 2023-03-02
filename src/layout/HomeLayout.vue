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
  <v-container class="homeContainer"
               fluid
               @click.stop="closeSelect">
    <div class="header">
      <div class="nav">
        <NavBar :isMobile="isMobile" />
      </div>

      <div class="select">
        <select-component ref="select-component"
                          :isMobile="isMobile"
                          @selected="changeApps"
                          :portofolios="portofolios"></select-component>
      </div>
    </div>

    <router-view class="content"
                 :isMobile="isMobile"></router-view>
  </v-container>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";
import NavBar from "../components/nav.vue";
import SelectComponent from "../components/select.vue";
export default {
  components: {
    NavBar,
    SelectComponent,
  },
  async mounted() {
    await this.init();
  },
  methods: {
    ...mapActions("appDataStore", [
      "getPortofolios",
      "getApps",
      "getBos",
      "getUserInfo",
      "selectSpace",
      "getFavoriteApps",
    ]),

    init() {
      return Promise.all([
        this.getPortofolios(),
        this.getUserInfo(),
        this.getFavoriteApps(),
      ]);
    },

    closeSelect() {
      const ref = this.$refs["select-component"];
      if (ref) ref.close();
    },

    changeApps(data) {
      this.selectSpace(data);
    },
  },
  computed: {
    ...mapState("appDataStore", ["appsDisplayed", "userInfo", "portofolios"]),
    isMobile() {
      const breakpoint = this.$vuetify.breakpoint.name;
      if (["xs", "sm"].indexOf(breakpoint) !== -1) return true;
      return false;
    },
  },
};
</script>

<style lang="scss">
.homeContainer {
  width: 100%;
  height: 100%;
  padding: 0px;

  .header {
    width: 100%;
    height: 70px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;

    .nav {
      width: 40%;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .select {
      width: 500px;
      height: 100%;
      display: flex;
      margin: 5px;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .content {
    width: 100%;
    padding: 0 10px;
    height: calc(100vh - 80px);
    max-height: calc(100vh - 80px);
  }
}
</style>
