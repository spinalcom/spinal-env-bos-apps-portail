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
  <div class="div_container">
    <div class="_title">
      <DataView
        :item="data"
        :isTitle="true"
      />
    </div>

    <div class="_container">
      <DataView
        v-for="(item, index) of data.children"
        :key="index"
        :item="item"
        @onClick="() => selectDataView(item)"
      />
      <DataView
        v-if="!data.children || data.children.length === 0"
        :item="noDataItem"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";
import Component from "vue-class-component";
import DataView from "./dataView.vue";
import { getColor } from "../../services/calcul/calculItems";

@Component({
  components: { DataView },
})
class GroupDataView extends Vue {
  @Prop({}) data;
  // @Prop({}) config;
  // @Prop({}) unit;
  // @Prop({}) legend;
  @Prop({ default: false }) percent;

  noDataItem = { name: "Aucune donnée", displayValue: "" };


  selectDataView(item) {
    console.log('stape3',item , this.data);
    
    this.$emit("onClick", item);
  }
}

export default GroupDataView;
export { GroupDataView };
</script>

<style>
.div_container {
  width: calc(100% - 10px);
  min-height: 50px;
  border: 3px dashed #dbe7ed;
  border-radius: 10px;
  padding: 10px;
  margin: auto;
  margin-bottom: 10px;
}
</style>
