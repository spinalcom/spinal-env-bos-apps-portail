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
  <div class="headerSelect"
       v-if="portofolios">
    <!-- <space-selector ref="space-selector"
                    :open.sync="openSpaceSelector"
                    :maxDepth="0"
                    :GetChildrenFct="onSpaceSelectOpen"
                    @input="getSelectedItem"
                    :value="selectedZone"
                    :isMobile="isMobile">

    </space-selector> -->
  </div>
</template>

<script>
import { SELECT_PORTOFOLIO } from "../store/appDataStore";
import { mapState } from "vuex";
import { SpaceSelector } from "./SpaceSelector";

export default {
  components: {
    SpaceSelector,
  },
  props: {
    portofolios: {},
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // this.default = {
    //   name: "Patrimoine",
    //   id: "patrimoine",
    // };
    this.TYPES = {
      portofolio: "portofolio",
      building: "building",
    };
    return {
      // data: [this.default],
      // selected: this.default.id,
      openSpaceSelector: false,
      selected: null,
      selectedZone: {
        parents: [],
      },
    };
  },
  // mounted() {
  //   this.selected = this.default.id;
  // },
  methods: {
    selectedChanged(val) {
      // console.log(val);
    },

    async onSpaceSelectOpen(item) {
      if (item) {
        if (item.type === this.TYPES.portofolio) {
          return (item.categories || []).map((building) => {
            return {
              name: building.name,
              id: building.id,
              categories: [],
              staticId: building.id,
              dynamicId: 0,
              type: this.TYPES.building,
            };
          });
        }
        return [];
        // console.log(item.buildings);
        // return item.buildings.map((building) => {});
      }

      return this.portofolios.map((portofolio) => {
        return {
          name: portofolio.name,
          categories: portofolio.buildings,
          staticId: portofolio.id,
          dynamicId: 0,
          type: this.TYPES.portofolio,
        };
      });
    },

    getSelectedItem(item) {
      this.$store.commit(`appDataStore/${SELECT_PORTOFOLIO}`, item);
      this.selectedZone = item;
      let portofolioId;
      let buildingId;
      if (item.type === this.TYPES.portofolio) {
        portofolioId = item.staticId;
      } else if (item.type === this.TYPES.building) {
        localStorage.setItem("idBuilding", item.staticId);
        portofolioId = item.parents[0];
        buildingId = item.staticId;
      }

      this.$emit("selected", { portofolioId, buildingId });
    },

    close() {
      this.openSpaceSelector = false;
    },
  },
  computed: {
    ...mapState("appDataStore", ["selectedPortofolio"]),
  },
  watch: {
    selected() {
      this.$emit("selected", this.selected);
    },

    portofolios() {
      const element = this.selectedPortofolio || this.portofolios[0];
      if (Object.keys(this.selectedZone).length === 1 && element) {
        this.selectedZone = {
          platformId: "",
          name: element.name,
          staticId: element.id || element.staticId,
          categories: [],
          color: "#FFFFFF",
          dynamicId: 0,
          type: this.TYPES.portofolio,
          level: 0,
          isOpen: true,
          loading: false,
          patrimoineId: "",
          parents: [],
          isLastInGrp: true,
          drawLink: [],
          haveChildren: false,
        };
        this.getSelectedItem(this.selectedZone);
      }
    },
  },
};
</script>

<style lang="scss">
.headerSelect {
  width: 100%;
  height: 60px;
  // display: flex;
  // align-items: center;
  // border-radius: 10px;
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
