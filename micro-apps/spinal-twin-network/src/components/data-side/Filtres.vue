<!--
Copyright 2024 SpinalCom - www.spinalcom.com

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
  <div class="filters">
    <v-select
      v-model="selectedType"
      :items="uniqueTypes"
      label="Filter by Type"
      class="mr-4"
    ></v-select>
    <v-select
      v-model="selectedStatus"
      :items="uniqueStatuses"
      label="Filter by Status"
    ></v-select>
  </div>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";
import Component from "vue-class-component";

@Component({
  name: "Filtre",
})
class Filtre extends Vue {
  @Prop() data: any;

  @Prop() selectedType: string | null = null;
  @Prop() selectedStatus: string | null = null;
  get filteredData() {
    let result = this.data;
    if (this.selectedType) {
      if (this.selectedType != "All") {
        result = result.filter((item) => item.type === this.selectedType);
      }
    }
    if (this.selectedStatus) {
      if (this.selectedStatus != "All") {
        result = result.filter((item) => item.status === this.selectedStatus);
      }
    }
    return result;
  }

  get uniqueTypes() {
    return ["All", ...new Set(this.data.map((item) => item.type))];
  }

  get uniqueStatuses() {
    return ["All", ...new Set(this.data.map((item) => item.status))];
  }
}

export { Filtre };
export default Filtre;
</script>

<style lang="scss">
</style>