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
  <div class="headerSelect">
    <space-selector ref="space-selector"
                    :open.sync="openSpaceSelector"
                    :maxDepth="0"
                    :GetChildrenFct="onSpaceSelectOpen"
                    @input="getSelectedItem"
                    :value="selectedZone" />

    <!-- <v-select class="selectBar"
                v-model="selected"
                prepend-icon="mdi-chevron-down"
                append-icon=""
                height="100%"
                color="#fff"
                :items="Object.keys(categories)"
                label="Category"
                dense>
  
      </v-select> -->
  </div>
</template>
  
<script lang="ts">
import categories from "../store/categories";
import { SpaceSelector } from "./SpaceSelector/index";
import type { IZoneItem } from "./SpaceSelector/interfaces/IBuildingItem";

const SelectComponent = {
  components: {
    SpaceSelector,
  },
  data() {
    // categories = categories;
    return {
      openSpaceSelector: false,
      selected: null,
      selectedZone: {
        platformId: "",
        name: categories.building.name,
        staticId: categories.building.id,
        categories: [],
        color: "#FFFFFF",
        dynamicId: 0,
        type: "patrimoine",
        level: 0,
        isOpen: true,
        loading: false,
        patrimoineId: categories.building.id,
        parents: [],
        isLastInGrp: true,
        drawLink: [],
        haveChildren: true,
      },
    };
  },
  mounted() {
    this.selected = categories.building.id;
  },
  methods: {
    // selectedChanged(val) {
    //   this.se
    // },
    async onSpaceSelectOpen(item: any): Promise<IZoneItem[]> {
      if (item) {
        return [];
      }
      return Object.keys(categories).map((id) => {
        return {
          name: categories[id].name,
          id: categories[id].id,
          categories: [],
          staticId: categories[id].id,
          dynamicId: 0,
          type: "patrimoine",
        };
      });
    },

    getSelectedItem(item: any) {
      this.$emit("selected", categories[item.staticId]);
      this.selectedZone = item;
    },
  },
  watch: {
    // selected() {
    //   this.$emit("selected", categories[this.selected]);
    // },
  },
};

export default SelectComponent;
</script>
  
  <style lang="scss">
.headerSelect {
  width: 100%;
  height: 100%;
  // display: flex;
  // align-items: center;
  // border-radius: 10px;
  // background: #14202c;
  // padding: 10px;
  // .selectBar {
  //   height: 100%;
  //   display: flex;
  //   align-items: center;
  //   color: white;
  // }
}
</style>
  
  <style>
.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border: none !important;
}

.v-text-field > .v-input__control > .v-input__slot:after {
  border: none !important;
}

.headerSelect .selectBar .v-input__control {
  height: 100%;
}

.headerSelect .v-text-field .v-label {
  text-transform: uppercase;
  color: #7c8389 !important;
  font-size: 1em;
}

.headerSelect .selectBar .v-input__append-outer .v-icon,
.v-input__prepend-outer .v-icon {
  color: #fff !important;
  font-size: 2.5em !important;
}

.headerSelect .selectBar .v-select__selection {
  color: white;
  font-size: 1.5em;
}
</style>