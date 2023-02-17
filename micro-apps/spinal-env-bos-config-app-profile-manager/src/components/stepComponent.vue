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

<template >
  <div class="tabsContent">
    <v-stepper v-model="stepSelected"
               elevation="0"
               vertical
               non-linear
               class="stepperDiv">

      <v-stepper-step editable
                      :step="stepObject.contexts"
                      class="stepperNames">
        Autoriser des contextes
      </v-stepper-step>
      <v-stepper-content :step="stepObject.contexts"
                         class="stepperContent"
                         :class="{'selected' : stepSelected == stepObject.contexts}">
        <simple-table-component :edit="edit"
                                :title="'selectionnez les contextes à autoriser'"
                                :items="contexts"
                                :headers="contextHeaders"
                                :itemToSelect="getItemToSelect('contexts')">
        </simple-table-component>
      </v-stepper-content>

      <!-- -------------------------------------- -->

      <v-stepper-step editable
                      :step="stepObject.apis"
                      class="stepperNames">
        Autoriser des routes d'api
      </v-stepper-step>
      <v-stepper-content :step="stepObject.apis"
                         class="stepperContent"
                         :class="{'selected' : stepSelected == stepObject.apis}">
        <double-table-component :edit="edit"
                                :title="'selectionnez les routes de portefolio à autoriser'"
                                :items="apis"
                                :headers="headers"
                                :childrenKey="'children'"
                                :itemToSelect="getItemToSelect('apis')">
        </double-table-component>
      </v-stepper-content>

    </v-stepper>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import DoubleTableComponent from "./tableComponent.vue";
import SimpleTableComponent from "./simpleTable.vue";

@Component({
  components: {
    DoubleTableComponent,
    SimpleTableComponent,
  },
})
class TabsComponent {
  @Prop() contexts!: any[];
  @Prop() contextSelected!: any;

  @Prop() apis!: any[];
  @Prop() apiSelected!: any;

  @Prop() edit!: boolean;
  @Prop() profileSelected!: any;

  stepObject = Object.freeze({
    contexts: "1",
    apis: "2",
  });

  stepSelected = this.stepObject.contexts;

  contextHeaders: any = [
    {
      text: "Nom",
      sortable: false,
      value: "name",
    },
  ];

  headers: any = [
    {
      text: "Route",
      sortable: false,
      value: "route",
    },
  ];

  getItemToSelect(type: string) {
    if (!this.edit) return [];

    switch (type) {
      case "contexts":
        return this.profileSelected.contexts;
      case "apis":
        return this.profileSelected.apis;
    }
  }
}

export default TabsComponent;
</script>


<style scoped lang="scss">
.tabsContent {
  width: 100%;
  height: 100%;

  .stepperDiv {
    width: 100%;
    height: 100%;
    background: transparent !important;
    padding: 0px !important;

    .stepperNames {
      height: 60px;
    }

    .stepperContent.selected {
      height: calc(100% - 100px);
    }
  }
}
</style>

<style>
.stepperContent.selected .v-stepper__wrapper {
  height: 100% !important;
}
</style>