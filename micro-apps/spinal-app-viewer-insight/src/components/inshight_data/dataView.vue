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
  <div
    class="dataView"
    :id="item.dynamicId"
    :class="{ subItem: !isTitle, isSelected: isSelected() }"
    @click="clickEvent"
  >
    <div class="value_div">
      <div class="color" :style="{ background: color }"></div>
      <div class="value" style="margin-right: 1px">
        {{ item.displayValue | round }}
      </div>
      <div>{{ unit }}</div>
    </div>
    <div class="name">{{ item.name }}</div>
    <div v-if="isChartPossible">
      <v-btn
        icon
        x-small
        @click.stop="clickChart"
      >
        <v-icon v-if="!isItemSelectedInChart">mdi-chart-line</v-icon>
        <v-icon v-else>mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { isArray } from "lodash";
import {
  EmitterViewerHandler,
  VIEWER_AGGREGATE_SELECTION_CHANGED,
  VIEWER_SPRITE_CLICK,
} from "spinal-viewer-event-manager";
import { ITemporality } from "../../interfaces/IConfig";
import { MutationTypes } from "../../services/store/appDataStore/mutations";
import { ActionTypes } from "../../interfaces/vuexStoreTypes";

export default {
  name: "dataView",
  props: {
    item: {},
    isTitle: { type: Boolean, default: () => false },
    color: { type: String, default: () => "" },
    unit: { type: String, default: () => "" },
  },
  filters: {
    round(value) {
      try {
        if (typeof value === "string" && value.length === 0) return "";
        var num = Number(value);
        var rounded = num.toFixed(2);
        return Number(rounded);
      } catch (error) {
        console.error(error);
        return "";
      }
    },
  },
  computed: {
    isChartPossible() {
      return (
        this.$store.state.appDataStore.temporalitySelected.name !==
        ITemporality.currentValue
      );
    },
    isItemSelectedInChart() {
      return this.$store.state.appDataStore.selectedChartItems.some(
        (selectedItem) => selectedItem.dynamicId === this.item.dynamicId
      );
    },
  },
  methods: {
    clickEvent() {
      this.$emit("onClick");
    },

    isSelected() {
      const itemSelected = this.$store.state.appDataStore.itemSelected;
      return itemSelected && itemSelected.dynamicId == this.item.dynamicId;
    },

    inDbids(data, to_search) {
      to_search = isArray(to_search) ? to_search : [to_search];
      for (const id of to_search) if (data.dbIds.includes(id)) return true;
      return false;
    },

    clickChart() {
      this.$store.dispatch(ActionTypes.UPDATE_SELECTED_CHART_ITEMS, this.item);
      console.log(
        "store chart items",
        this.$store.state.appDataStore.selectedChartItems
      );
      //this.changeSelectedItem();
    },

    changeSelectedItem() {
      if (
        this.$store.state.appDataStore.itemSelected &&
        this.item.dynamicId ===
          this.$store.state.appDataStore.itemSelected.dynamicId
      ) {
        return;
      }
      this.$store.commit(MutationTypes.SET_ITEM_SELECTED, this.item);
    },
  },

  mounted() {
    const emitterHandler = EmitterViewerHandler.getInstance();
    const vm = this;
    // emitterHandler.on(VIEWER_AGGREGATE_SELECTION_CHANGED, (data) => {
    //   if (data[0] && this.inDbids(data[0], vm.item.dbid)) {
    //     console.log('dataView emit')
    //     vm.$emit("onClick");
    //     emitterHandler.emit(VIEWER_SPRITE_CLICK, { node: vm.item });
    //   }
    // });
  },
};
</script>

<style>
.dataView {
  width: 100%;
  height: 20px;
  margin-bottom: 3px;
  display: flex;
  align-items: flex-end;
  font-size: 12px;
  font-weight: 520;
  color: #798e98;
  border-radius: 5px;
}

.dataView.subItem {
  background-color: #eaeef0;
}

.dataView.subItem:hover {
  cursor: pointer;
}

.dataView.subItem.isSelected {
  border: 2px solid rgb(0, 116, 255);
  /* background-color: rgb(0, 116, 255) */
}

.dataView .value_div {
  width: 25%;
  height: 100%;
  display: flex;
  padding: 0 10px;
  align-items: center;
}

.dataView .value_div .color {
  width: 7px;
  height: 70%;
  margin-right: 4px;
  border-radius: 3px;
}

.dataView .name {
  width: 75%;
  max-width: 75%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.green-icon {
  background-color: green !important;
  color: white !important;
}
</style>