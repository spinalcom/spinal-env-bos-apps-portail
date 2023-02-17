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
  <div class="_content">
    <div class="title">Portefolios</div>

    <v-list rounded
            class="listContent">
      <v-list-item-group v-model="indexInList"
                         color="primary">
        <v-list-item v-for="portofolio in portofolios"
                     :key="portofolio.id"
                     @click="selectPortofolio(portofolio)">
          <v-list-item-icon>
            <v-icon>mdi-office-building-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="portofolio.name">
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";

@Component({})
class PortofolioList {
  @Prop() portofolios!: any;

  indexInList: any = null;

  selectPortofolio(portofolio: any) {
    this.$emit("select", portofolio);
  }
}

export default PortofolioList;
</script>

<style lang="scss" scoped>
._content {
  width: 100%;
  height: 100%;
  .title {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .listContent {
    width: 100%;
    height: calc(100% - 30px);
    background: transparent !important;
  }
}
</style>