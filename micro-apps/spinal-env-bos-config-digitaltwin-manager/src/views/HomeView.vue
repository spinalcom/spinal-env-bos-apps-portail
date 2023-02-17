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
  <v-container class="_container"
               fluid>

    <div class="digitaltwinInfo"
         v-if="page === pages.loaded">
      <DigitalTwinInfo :digitalTwins="digitalTwins"
                       :actualDigitalTwin="actualDigitalTwin" />
    </div>

    <div class="loading"
         v-else>
      <v-progress-circular :size="70"
                           color="primary"
                           indeterminate></v-progress-circular>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DigitalTwinInfo from "../components/DigitaltwinInfo.vue";

import { mapActions, mapState } from "vuex";

export default Vue.extend({
  name: "HomeComponent",
  components: { DigitalTwinInfo },
  data() {
    this.pages = Object.freeze({
      loading: 0,
      loaded: 1,
    });
    return {
      showError: false,
      page: this.pages.loading,
    };
  },
  async mounted() {
    Promise.allSettled([
      this.getAllDigitalTwin(),
      this.getActualDigitalTwin(),
    ]).then((result) => {
      this.page = this.pages.loaded;
    });
  },

  methods: {
    ...mapActions(["getAllDigitalTwin", "getActualDigitalTwin"]),

    createDigitalTwin() {},

    updateActualDigitalTwin(digitalTwinId) {},
  },
  computed: {
    ...mapState(["digitalTwins", "actualDigitalTwin"]),
  },
  watch: {},
});
</script>

<style lang="scss">
._container {
  width: 100%;
  height: 100%;
  padding: 0px;

  .loading,
  .digitaltwinInfo {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

<style>
.successBtn {
  width: 60px !important;
  height: 40px;
  border: 1px solid green;
  color: green !important;
  border-radius: 5px;
  margin: 5px;
}

.errorBtn {
  width: 75px !important;
  height: 40px;
  border: 1px solid #ff5252;
  color: #ff5252 !important;
  border-radius: 5px;
  margin: 5px;
}
</style>
