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
  <div :class="fullContainerClass" style="height: 100%;">
    <div class="displayn" :class="nodeInspectorClass">
      <NodeVisualization ref="nodeVisualization" :dataprop="data" :config="config" @toggle-full-view="toggleFullView"
        :is-active="!DActive && ActiveData" />
    </div>
    <div :class="fullDataClass" :style="{ display: DActive ? 'none' : 'block' }"
      style="height: 100%;display: flex; flex-direction: column;justify-content: start;align-items: center;">
      <div style="width: 100%;height: 7%;">
        <div class="header" style="height: 100%;">
          <div class="header-left">
            <div v-if="selectedNodeName == null" class="header-title">
              Réseau du
            </div>
            <div class="description-text">
              Les contextes hardware disponible sur l'étage
            </div>
          </div>
          <div class="header-right">
            <HardwareContext :data="hardwareContextData" :selectedDynamicId="selectedHardwareContext"
              @update-selected="updateSelectedContext" />
          </div>
        </div>
        <div style="
          background-color: #14202c;
          width: 100%;
          height: 1px;
          opacity: 0.2;
          margin-bottom: 10px;
        "></div>

      </div>
      <div style="width: 100%;margin-top: 1%;display: flex;flex-direction: column;"
        :style="{ height: statsVisible ? (showDetailsProp ? '48%' : '48%') : '7%', transition: 'height 0.7s' }">
        <div class="stat-hide-container" :style="{ height: statsVisible ? '10%' : '80%', transition: 'height 0.7s' }">
          <div class="header-title" style="margin-bottom: 5px;">Analyse Statistique</div>
          <div @click="toggleStats" style="display: flex; flex-direction: row">
            <div :title="statsVisible
              ? 'Masquer les statistiques'
              : 'Afficher les statistiques'
              " class="toggle-img" :class="{ rotated: statsVisible }">
            </div>
          </div>
        </div>
        <div class="stat" :style="{ height: statsVisible ? '88%' : '0%', transition: 'height 0.7s' }">
          <div class="stat-card" :style="{ height: '100%' }">
            <StatCard :dataprop="data" @changeRoute="changeApp" :config="config"
              :showDetailsProp.sync="showDetailsProp">
            </StatCard>
          </div>
        </div>
        <div style="
            background-color: #14202c;
            width: 100%;
            height: 1px;
            opacity: 0.2;
            margin-bottom: 5px;
            margin-top: 5px;
          "></div>
      </div>
      <div style="width: 100%;"
        :style="{ height: statsVisible ? (showDetailsProp ? '43%' : '43%') : '84%', transition: 'height 0.7s' }">
        <TreeTable :data="data" :config="config" @node-click="handleNodeClickofCard" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";
import Component from "vue-class-component";
import TreeTable from "./TreeTable.vue";

import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import { Watch } from "vue-property-decorator";
import { log } from "console";
import NodeVisualization from "./NodeVisualtion.vue";
import StatCard from "./statistique-components/StatCard.vue";
import HardwareContext from "./HardwareContext.vue";
import { IConfig } from "../../interfaces/IConfig";

@Component({
  name: "NodeItem",
  components: {
    NodeVisualization,
    StatCard,
    HardwareContext,
    TreeTable,
  },
})
class NodeItem extends Vue {
  @Prop() data: any[]; // Data to display in the node visualization and tables
  @Prop() DActive: boolean;
  @Prop() ActiveData: boolean;
  @Prop() config: IConfig;
  @Prop() hardwareContextData: any[]; // Receive hardware context data
  @Prop() selectedHardwareContext: number; // Receive selected hardware context
  showDetailsProp: boolean = false; // Prop to control the visibility of details in the StatCard and table
  datatoShow: any = [];
  filteredData: any = []; // Filtered data based on status and type
  selectedNodeIndex: number | null = null;
  selectedNodeName: string | null = null;
  dynamicId: number = 0;
  selectedStatus: string = "all";
  statsVisible: boolean = false;

  selectedType: string = "all";
  // Query parameters for routing
  query: {
    app: string;
    mode: string;
    name: string;
    spaceSelectedId: string;
    buildingId: string;
  } = {
      app: "",
      mode: "null",
      name: "",
      spaceSelectedId: "",
      buildingId: "",
    };

  isFullViewActive: boolean = false;
  isNormalViewActive: boolean = true;


  updateSelectedContext(hardwarecontext: {contextId: number, nodeId: number}[]) {
    this.$emit("updateSelectedHardwareContext", hardwarecontext);
    // this.$store.dispatch(ActionTypes.REMOVE_ALL_LINES);
  }
  toggleStats(show: boolean) {
    this.statsVisible = !this.statsVisible;
  }
  toggleFullView() {
    if (!this.isFullViewActive && this.isNormalViewActive) {
      this.isFullViewActive = true;
      this.isNormalViewActive = false;
    } else {
      this.isFullViewActive = false;
      this.isNormalViewActive = true;
    }
  }
  toggleNode(index: number) {
    this.selectedNodeIndex = index; // Set the selected node index
    this.selectedNodeName = this.datatoShow[index].name;
    this.dynamicId = this.datatoShow[index].dynamicId;
    this.$store.dispatch(ActionTypes.SELECT_SPRITES, [
      String(this.datatoShow[index].dynamicId),
    ]);
    if (this.datatoShow[index].nodes) {
      this.datatoShow = this.datatoShow[index].nodes || [];
      this.selectedNodeIndex = null;
    }
    this.filterData();
  }
  filterData() {
    this.filteredData = this.datatoShow.filter((d) => {
      const statusMatch =
        this.selectedStatus === "all" || d.status === this.selectedStatus;
      const typeMatch =
        this.selectedType === "all" || d.type === this.selectedType;
      return statusMatch && typeMatch;
    });
  }
  async mounted() {
    this.datatoShow = this.data;
    this.filterData();
  }
  handleNodeClickofCard(node: any) {
    this.$emit("node-click", node);
  }

  changeApp(e) {
    this.query.app = e;
    this.changeRoute();
  }
  changeRoute() {
    window.parent.routerFontion.customPush(
      window.parent.router.path,
      this.query
    );
  }


  get fullDataClass() {
    return {
      "Full-data": !this.DActive && this.ActiveData,
      "normal-inspector": !this.isNormalViewActive,
    };
  }
  get nodeInspectorClass() {
    return {
      dod: !this.DActive && this.ActiveData,
      "full-inspector": this.isFullViewActive,
    };
  }
  get fullContainerClass() {
    return {
      fullContainer: !this.DActive && this.ActiveData,
    };
  }
}

export { NodeItem };
export default NodeItem;
</script>

<style lang="scss">
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  width: 58%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: end;
}

.header-left {
  width: 42%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}

.header-title {
  font-size: 1.3rem;
  font-weight: bold;
}

.description-text {
  font-size: 0.9rem;
  color: #8a8a8a;
  margin-top: -5px;
}

@media (max-width: 1850px) {
  .header-title {
    font-size: 1rem;
  }

  .description-text {
    font-size: 0.74rem !important;

  }
}

.list {
  list-style-type: none;
  padding-left: 0 !important;
  margin: 0;
}

.listChildren {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.v-application ol,
.v-application ul {
  padding-left: 0px;
}

.childrenButton {
  background-image: url("../viewer/assets/down-arrow.svg");
  background-size: contain;
  width: 15px;
  height: 15px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.nodeItem {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0px;
  border-bottom: 1px solid #f1f1f1;
  cursor: pointer;
}

.nodeItem:hover {
  background: #f1f1f1;
}

.nodeItem>span,
.nodeItem>div,
.nodeItem>button {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nodeItem.selected {
  background-color: #e0e0e0;
}

.dataHeader {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 25px;
  margin-bottom: 10px;
}

.inner-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 65px;
  padding: 1px;
  font-family: charlevoix, sans-serif !important;
  font-weight: 600;
  font-size: 13px;
}

// .inner-circle {
//   width: 9px;
//   height: 9px;
//   border-radius: 50%;
// }

.status-active {
  border-color: #d2fece;
  background-color: #d2fece;
  color: #325e4b;
  border-radius: 10px;
}

.status-inactive {
  border-color: #ffe3eb;
  background-color: #ffe3eb;
  color: #d7270c;
  border-radius: 8px;
}

.status-unknown {
  border-color: #ffebd4;
  background-color: #ffebd4;
  color: #f49700;
  border-radius: 8px;
}

.backButton {
  margin-bottom: 8px;
}

.stat {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.stat-card {
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 10px;
  margin-top: 2px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  transition: height 0.5s ease;
  overflow: hidden;
  /* Ensures content doesn't overflow when height is 0 */
  // height: 200px !important; /* Default height */
  margin-bottom: 10px;
}

.Full-data {
  width: 42%;
  transition: width 0.5s ease;
  opacity: 1;
}

.displayn {
  display: none;
}

.dod {
  width: 56%;
  // margin-right: 2%;
  height: 100%;
  // background: red;
  display: block;
  transition: width 0.5s ease;
}

.normal-inspector {
  width: 0%;

  opacity: 0;
  transition: width 0.5s ease;
}

.full-inspector {
  width: 100%;
  transition: width 0.5s ease;
}

.fullContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
  height: 100% !important;
}

.hardware {
  height: 80px;
  width: 100%;
  margin-bottom: 10px;
}

.stat-hide-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// Hide the "Show Stats" or "Hide Stats" buttons
.stat-hide-container p {
  display: inline-block;
  cursor: pointer;
}

.stat-hide-container p:nth-child(2) {
  display: none;
}

.stat-hide-container p:first-child {
  display: none;
}

.stat-hide-container p:last-child {
  display: inline-block;
}

// .show-img {
//   height: 15px;
//   width: 15px;
//   background-image: url("./assets/right-blue.svg");
//   background-size: contain;
//   background-position: center;
//   cursor: pointer;
//   transform: rotate(90deg);
// }
// .hide-img {
//   height: 15px;
//   width: 15px;
//   background-image: url("./assets/right-blue.svg");
//   background-size: contain;
//   background-position: center;
//   cursor: pointer;
//   transform: rotate(270deg);
// }
.toggle-img {
  height: 15px;
  width: 15px;
  background-image: url("./assets/right-blue.svg");
  background-size: contain;
  background-position: center;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.toggle-img.rotated {
  transform: rotate(270deg);
}

.toggle-img:not(.rotated) {
  transform: rotate(90deg);
}
</style>