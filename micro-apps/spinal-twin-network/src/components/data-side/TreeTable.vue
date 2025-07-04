<template>
  <div style="height: 100%;">
    <div class="header" style="height: 8%;">
      <div class="header-equipement">
        Equipement

        <div class="search-bar">
          <div class="search-image"></div>
          <input type="text" v-model="searchQuery" placeholder="Rechercher" @input="filterNodes" />
        </div>
      </div>
      <div class="header-typologie" @click="toggleTypologieDropdown">{{ typologieFilter || 'Typologie' }}
        <div class="status-icon" style="margin-left: 5px;"></div>
        <div v-if="isTypologieDropdownOpen" class="status-dropdown">
          <div v-for="typologie in availableTypologies" :key="typologie" @click="setTypologieFilter(typologie)">
            <span :class="{ 'status-selected': typologie === typologieFilter }">{{ typologie || 'typologie' }}</span>
          </div>
        </div>
      </div>
      <div class="header-room" @click="toggleSort('reseau')">Espace</div>
      <div class="header-reseau" @click="toggleSort('reseau')">Réseaux<div class="reseau-icon"
          :class="isAscending ? 'rotate-up' : 'rotate-down'"></div>
      </div>
      <div class="header-status" @click="toggleStatusDropdown">
        {{ statusFilter || 'Status' }}
        <div class="status-icon"></div>
        <div v-if="isStatusDropdownOpen" class="status-dropdown">
          <div v-for="status in availableStatuses" :key="status" @click="setStatusFilter(status)">
            <span :class="{ 'status-selected': status === statusFilter }">{{ status || 'status' }}</span>
          </div>
        </div>
      </div>

    </div>
    <div style="height:92%">
      <div class="tree-container table-scroll">
        <div v-for="node in flattenedData" :key="node.dynamicId" @click="handleNodeClick(node, 0)"
          :ref="`node-${node.dynamicId}`">
          <div class="node-container">
            <div v-if="(statusFilter && statusFilter !== 'status' && node.status != statusFilter) ||
              (typologieFilter && typologieFilter !== 'typologie' && node.typologie != typologieFilter)"
              class="hidden-node-message">
              <span style="    font-size: 0.8rem;
    color: red;">Ce nœud contient des éléments
                correspondants au filtre. Cliquez pour les afficher</span>
            </div>
            <div class="node" :class="{
              node_clicked: node.dynamicId == lastClickedNodeDynamicId,
              displayNone: !shouldDisplayNode(node),
              node_clicked_pack:
                node.parentDynamicId == lastClickedNodeDynamicId ||
                node.dynamicId == lastClickedNodeDynamicId,
            }">
              <div class="node-name">
                <div class="name-image" :class="{
                  'name-image-selected': shouldDisplayArrow(node),
                  'name-image-deselected': !shouldDisplayArrow(node),
                  hide_arrow: !node.hasNodes,
                }" :style="{ marginLeft: `${node.level * 12}px` }"></div>
                <div class="node-name-text">
                  {{ node.name }}
                </div>
              </div>
              <div class="node-type">
                <div class="typologie" :style="{
                  backgroundImage: `url(${getImageUrl(String(node.typologie))})`,
                }"></div>
                {{ node.typologie }}
              </div>
              <div class="node-room">
                <span @click="getZoomPoints(node.room.dynamicId, node.room.staticId)"
                  v-tooltip="{ content: `Zoomer sur ${node.roomname || '---'}`, placement: 'right' }">{{ node.roomname
                  }} </span><span v-if="node.roomname === '' || !node.roomname">---</span>
                <div @click="getZoomPoints(node.room.dynamicId, node.room.staticId)"
                  v-tooltip="{ content: 'Voir sur description', placement: 'right' }" class="goto-icon"></div>
              </div>
              <div class="node-num">
                <div class="num-nodes">
                  <span>{{ node.numNodes }}</span>
                  <span class="elems-unit">Éléms</span>
                </div>
              </div>
              <div class="node-status">
                <div class="status-circle-container">
                  <div class="status-circle" :class="{
                    'circle-status-active': node.self_status === 'active',
                    'circle-status-inactive': node.self_status === 'inactive',
                    'circle-status-unknown': node.self_status === 'unknown',
                  }"></div>
                  <div class="circle-container">
                    <div class="outer-circle" :class="{
                      'status-active': node.self_status === 'active',
                      'status-inactive': node.self_status === 'inactive',
                      'status-unknown': node.self_status === 'unknown',
                    }">
                      <div class="inner-circle" :class="{
                        'status-active': node.self_status === 'active',
                        'status-inactive': node.self_status === 'inactive',
                        'status-unknown': node.self_status === 'unknown',
                      }">
                        {{ node.self_status }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component } from "vue-property-decorator";
import { IConfig } from "../../interfaces/IConfig";

import { EventBus } from "./EventBus";

import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import { SpriteCardComponent } from "./SpriteCardComponent";
import { IPlayload } from "../viewer";
import { EmitterViewerHandler } from "spinal-viewer-event-manager";

interface Node {
  dynamicId: number | null;
  level: number;
  name: string;
  parentDynamicId: number | null;
  self_status: string;
  staticId: string;
  status: string;
  type: string;
  typologie: string;
  nodes?: Node[];
  position?: THREE.Vector3;
  endpoints?: any[];
  controlEndpoints?: any[];
  room: any;
  roomname: string;
}

interface FlattenedNode {
  dynamicId: number | null;
  level: number;
  name: string;
  parentDynamicId: number | null;
  self_status: string;
  staticId: string;
  status: string;
  type: string;
  typologie: string;
  hasNodes?: boolean;
  numNodes?: number;
  position?: THREE.Vector3;
  endpoints?: any[];
  controlEndpoints?: any[];
  room: any;
  roomname: string;
}

@Component({
  name: "TreeTable",
  components: { SpriteCardComponent },
})
class TreeTable extends Vue {
  @Prop() data!: any[];
  @Prop() config!: IConfig;
  flattenedData: FlattenedNode[] = []; // Flattened data for the tree structure dispayed (might be filtered)
  flattenedDataBackup: FlattenedNode[] = []; // Backup of the original flattened data for filtering

  expandedNodes: number[] = []; // Store the expanded nodes' dynamic IDs so we show its children
  lastClickedNodeDynamicId: number = 0; // Store the last clicked node's dynamic ID so we can close it
  displayNode: number | null = null;  // Store the currently displayed node's dynamic ID for highlighting
  searchQuery: string = ""; // Search query for filtering nodes
  isAscending: boolean = true; // Sort order for the 'reseau' column
  payload: IPlayload[] = []; // Payload for zooming into a room
  selectedRoom: number | null = null; // Store the selected room's dynamic ID for zooming
  statusFilter: string | null = null;  // Store selected status
  isStatusDropdownOpen: boolean = false; // Dropdown state for status filter
  availableStatuses: string[] = []; // Available statuses for filtering

  typologieFilter: string | null = null;  // Store selected status
  isTypologieDropdownOpen: boolean = false; // Dropdown state for typologie filter
  availableTypologies: string[] = []; // Available typologies for filtering

  async mounted() {
    // Initialize the component by adding levels to the display logic (0, 1, 2, etc.)
    this.addLevels(this.data);
    this.flattenedData = this.flattenData(this.data); // initialize flattened data
    this.flattenedDataBackup = [...this.flattenedData]; // Backup the original flattened data
    EventBus.$on("table-node-click", this.handleNodeClick);
    this.availableStatuses = this.getAvailableStatuses(this.data);
    this.availableTypologies = this.getAvailableTypologies(this.data);
  }
  beforeDestroy() {
    EventBus.$off("table-node-click", this.handleNodeClick);
  }
  toggleSort(column: string) {
    if (column === 'reseau') {
      this.isAscending = !this.isAscending;
      this.sortData();
    }
  }
  // Function to sort the data based on numNodes for level 0 nodes
  sortData() {
    // Get level 0 nodes
    const levelZeroNodes = this.flattenedDataBackup.filter(node => node.level === 0);

    // Sort only level 0 nodes based on numNodes, ascending or descending
    const sortedLevelZeroNodes = levelZeroNodes.sort((a, b) => {
      return this.isAscending ? a.numNodes - b.numNodes : b.numNodes - a.numNodes;
    });

    // Rebuild flattenedData by replacing the sorted level 0 nodes in the correct order
    this.flattenedData = [];
    sortedLevelZeroNodes.forEach(levelZeroNode => {
      // Add the level 0 node
      this.flattenedData.push(levelZeroNode);

      // Find and add its children (nodes with parentDynamicId equal to this node's dynamicId)
      const children = this.flattenedDataBackup.filter(
        node => node.parentDynamicId === levelZeroNode.dynamicId
      );
      this.flattenedData.push(...children);
    });
  }
  toggleStatusDropdown() {
    this.isTypologieDropdownOpen = false;
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }
  toggleTypologieDropdown() {
    this.isStatusDropdownOpen = false;
    this.isTypologieDropdownOpen = !this.isTypologieDropdownOpen;
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.filterNodes();  // Re-apply filtering
    this.isStatusDropdownOpen = false;  // Close dropdown
  }
  setTypologieFilter(typologie: string) {
    this.typologieFilter = typologie;
    this.filterNodes();  // Re-apply filtering
    this.isTypologieDropdownOpen = false;  // Close dropdown
  }
  // Function to get available statuses from the data for the filter dropdown
  getAvailableStatuses(data: Node[]): string[] {
    const statuses = new Set<string>();
    function traverse(node: Node) {
      statuses.add(node.self_status);
      if (Array.isArray(node.nodes)) {
        node.nodes.forEach((childNode) => traverse(childNode));
      }
    }
    data.forEach((item) => traverse(item));
    return ['status', ...statuses];  // Include "All" option
  }
  // Function to get available typologies from the data for the filter dropdown
  getAvailableTypologies(data: Node[]): string[] {
    const typologies = new Set<string>();
    function traverse(node: Node) {
      typologies.add(node.typologie);
      if (Array.isArray(node.nodes)) {
        node.nodes.forEach((childNode) => traverse(childNode));
      }
    }
    data.forEach((item) => traverse(item));
    return ['typologie', ...typologies];  // Include "All" option
  }
  // Function to filter nodes based on search query, status, and typologie
  filterNodes() {
    const query = this.searchQuery.toLowerCase();
    const statusFilter = this.statusFilter === 'status' ? null : this.statusFilter;
    const typologieFilter = this.typologieFilter === 'typologie' ? null : this.typologieFilter;

    // Reset flattenedData to its backup
    this.flattenedData = [...this.flattenedDataBackup];

    // Find all matching nodes
    const matchedNodes = this.flattenedDataBackup.filter((node) => {
      const matchesQuery = node.name.toLowerCase().includes(query);
      const matchesStatus = !statusFilter || node.self_status === statusFilter;
      const matchesTypologie = !typologieFilter || node.typologie === typologieFilter;
      return matchesQuery && matchesStatus && matchesTypologie;
    });

    // Find all parent nodes for each matched node
    const nodesToShow = new Set<number | null>();
    matchedNodes.forEach((matchedNode) => {
      let currentNode: FlattenedNode | undefined = matchedNode;
      while (currentNode) {
        nodesToShow.add(currentNode.dynamicId);
        currentNode = this.flattenedDataBackup.find(
          (node) => node.dynamicId === currentNode?.parentDynamicId
        );
      }
    });

    // Filter the flattenedData to only include the nodes that should be shown
    this.flattenedData = this.flattenedDataBackup.filter((node) =>
      nodesToShow.has(node.dynamicId)
    );
  }

  watch: {
    searchQuery: "filterNodes";
  };
  // Function to add levels to the nodes for display purposes
  // This function recursively traverses the data and assigns levels and parentDynamicId
  addLevels(data, currentLevel = 0, parentDynamicId = null) {
    data.forEach((item) => {
      item.level = currentLevel;
      item.parentDynamicId = parentDynamicId;

      if (item.nodes && Array.isArray(item.nodes)) {
        this.addLevels(item.nodes, currentLevel + 1, item.dynamicId);
      }
    });
  }

  // Function to flatten the hierarchical data structure into a flat array for easier display with levels
  flattenData(data: Node[]): FlattenedNode[] {
    const result: FlattenedNode[] = [];
    // console.log("Flattening data", data);
    function traverse(node: Node) {
      result.push({
        dynamicId: node.dynamicId,
        level: node.level,
        name: node.name,
        parentDynamicId: node.parentDynamicId,
        self_status: node.self_status,
        staticId: node.staticId,
        status: node.status,
        type: node.type,
        typologie: node.typologie,
        hasNodes: node.nodes && node.nodes.length > 0,
        numNodes: node.nodes ? node.nodes.length : 0,
        position: node.position,
        endpoints: node.endpoints,
        controlEndpoints: node.controlEndpoints,
        room: node.room,
        roomname: node.roomname,
      });

      if (Array.isArray(node.nodes)) {
        node.nodes.forEach((childNode) => traverse(childNode));
      }
    }

    data.forEach((item) => traverse(item));

    return result;
  }

  // Function to handle node click events, which will select the node and show its details and scroll to it and emit event of opening the node in data full view
  handleNodeClick(node: FlattenedNode, type: number) {
    if (type === 0) {
      this.$store.dispatch(ActionTypes.SELECT_SPRITES, [
        String(node.dynamicId),
      ]);
      EventBus.$emit("on-node-click", node.dynamicId);
      this.showCard(node);
    }
    if (type === 1) {
      this.$store.dispatch(ActionTypes.SELECT_SPRITES, [
        String(node.dynamicId),
      ]);
      this.showCard(node);
    } else if (type === 2) {
      this.$store.dispatch(ActionTypes.SELECT_SPRITES, [
        String(node.dynamicId),
      ]);
      EventBus.$emit("on-node-click", node.dynamicId);
      this.showCard(node);
    }

    const nodeElement = this.$refs[`node-${node.dynamicId}`] as HTMLElement | HTMLElement[];
    if (Array.isArray(nodeElement)) {
      nodeElement[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (nodeElement) {
      nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    this.lastClickedNodeDynamicId = node.dynamicId ?? 0;
    this.displayNode = node.dynamicId;
    this.expandedNodes = this.pathToNode(node.dynamicId);
  }

  // Function to determine if a node should be displayed based on the current filters and expanded nodes
  shouldDisplayNode(node: FlattenedNode): boolean {
    // Always show level 0 nodes
    if (node.level === 0) {
      return true;
    }

    for (const nodeId of Array.isArray(this.expandedNodes)
      ? this.expandedNodes
      : []) {
      if (node.dynamicId === nodeId) {
        if (
          node.dynamicId === this.expandedNodes[this.expandedNodes.length - 1]
        ) {
          // console.log("recmiclecd");
          return true;
        }
        return true;
      }
    }
    //Showing siblings of previous opened nodes
    const isInList = this.expandedNodes.includes(node.parentDynamicId ?? -1);

    if (node.level === this.getNodeLevel(this.displayNode) && isInList) {
      return true;
    }
    // Show children of the clicked node and the clicked node itself
    if (this.displayNode !== null) {
      return (
        node.level === this.getNodeLevel(this.displayNode) + 1 &&
        node.parentDynamicId === this.displayNode
      );
    }
    // Hide all other nodes if no node is clicked
    return false;
  }
  // Function to zoom into a room based on its dynamic ID and static ID
  getZoomPoints(dynamimcId: number, staticId: string) {
    if (dynamimcId === this.selectedRoom) {
      this.selectedRoom = null;
      this.$store.dispatch(ActionTypes.FIT_TO_VIEW_ITEMS);
      return;
    }
    else {
      this.payload = [];
      this.payload.push({
        id: dynamimcId.toString(),
        dynamicId: dynamimcId,
        staticId: staticId,
        buildingId: "6676-3aa5-f152-18506750e67",
        floorId: "33591136",
      });
      this.$store.dispatch(ActionTypes.FIT_TO_VIEW_ITEMS, this.payload);
      this.selectedRoom = dynamimcId;

    }
  }
  // Function to get the level of a node based on its dynamicid and chidren
  getNodeLevel(nodeId: number | null): number {
    // Find the level of the node with the given ID
    const node = this.flattenedData.find((n) => n.dynamicId === nodeId);
    return node ? node.level : -1;
  }
  // Function to get the path to a node when we select it from the 3d viewer to open its tree in the table
  pathToNode(nodeId: number | null): number[] {
    const path: number[] = [];
    let currentNodeId = nodeId;
    while (currentNodeId !== null) {
      path.unshift(currentNodeId);
      const node = this.flattenedData.find(
        (n) => n.dynamicId === currentNodeId
      );
      currentNodeId = node ? node.parentDynamicId : null;
    }
    return path;
  }
  // Function to determine if an arrow should be displayed for a node (open or closed)
  shouldDisplayArrow(node: FlattenedNode): boolean {
    for (const nodeId of Array.isArray(this.expandedNodes)
      ? this.expandedNodes
      : []) {
      if (node.dynamicId === nodeId && node.hasNodes) {
        return true;
      }
    }
    return false;
  }
  // Function to get the image URL for a typology, falling back to a default image if not found
  getImageUrl(typologie: string): string {
    const imageMapping = this.config.imageMapping;
    const defaultImagePath = require("../viewer/assets/typologie-icons/default.png");
    if (imageMapping?.hasOwnProperty(typologie)) {
      return imageMapping[typologie];
    }
    // If not found in mapping, return default
    console.warn(
      `Image not found for typology ${typologie}, using default image.`
    );
    return defaultImagePath;
  }
  // Function to show the details card for a node when clicked in the 3d viewer
  showCard(node: FlattenedNode) {
    // console.log("showCard", node);
    const items = new Array();
    items.push({
      dynamicId: node.dynamicId,
      buildingId: localStorage.getItem("idBuilding"),
      data: node,
      parent: node.parentDynamicId,
      typologie: node.typologie,
      name: node.name,
      status: node.status,
      self_status: node.self_status,
      position: node.position,
      endpoints: node.endpoints,
      controlEndpoints: node.controlEndpoints,
    });
    const item = items[0];

    //console.log("showCard", items);
    this.$emit("node-click", items);
  }

}

export default TreeTable;
</script>


<style scoped>
.tree-container {
  font-family: Arial, sans-serif;
  border: #14202c18 1px solid;
  overflow-y: auto;
}

/* Scroll & Scroller */
.table-scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}

::-webkit-scrollbar {
  width: 8px;
  /* Width of the scrollbar */
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* Track background */
  border-radius: 10px;
  /* Rounded corners on the track */
}

::-webkit-scrollbar-thumb {
  background: #14202c;
  /* Scrollbar color */
  border-radius: 10px;
  /* Rounded corners on the scrollbar */
}

::-webkit-scrollbar-thumb:hover {
  background: #181d49;
  /* Scrollbar color on hover */
}

* {
  /*scrollbar-width: thin;*/
  /* scrollbar-color: #888 #f1f1f1;  */
}

/* Header Style */
.node-container {
  position: relative;
  width: 100%;
  height: auto;
}

.hidden-node-message {
  width: 100%;
  height: 100%;
  background-color: #e0e0e060;
  /* Gray background */
  color: #333;
  display: flex;
  align-items: end;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 13px 10px;
  font-size: 0.9rem;
  background: #14202c;
  color: white;
  font-weight: bold;
  font-family: charlevoix, sans-serif !important;
  margin-bottom: -1px;
}

.header-equipement {
  width: 41%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.header-typologie {
  width: 16%;
  display: flex;
  justify-content: start;
  align-items: center;
}

.header-room {
  width: 20%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  cursor: pointer;
}

.header-reseau {
  width: 12%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.header-status {
  width: 11%;
  display: flex;
  justify-content: end;
  align-items: center;
}

.node {
  display: flex;
  flex-direction: row;
  justify-content: start;
  padding: 11px 5px;
  border-bottom: 1px solid #14202c20;
  cursor: pointer;
  font-size: 0.82rem;
}

.node_clicked {
  border: 1px solid #14202c;
  background: #14202c10;
  /* border-radius: 0px 1px 1px 0px; */
}

.node_clicked_pack {
  border-left: 3px solid #14202c;
}

.node-content {
  padding: 5px;
  background-color: #f9f9f9;
  /* border-radius: 4px; */
}

.node-content {
  transition: height 0.3s ease-out, opacity 0.3s ease-out;
  overflow: hidden;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease, height 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active in <2.1.8 */
  {
  opacity: 0;
  height: 0;
}

.node:hover {
  background-color: #eaeaea;
}

.children {
  padding-left: 20px;
}

.name-image {
  width: 18px;
  height: 18px;
  background-image: url("./assets/right-blue.svg");
  margin-right: 5px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  /* background: red; */
}

.name-image-selected {
  transform: rotate(90deg);
}

.name-image-deselected {
  transform: rotate(0deg);
}

.hide_arrow {
  opacity: 0;
  transform: rotate(0deg);
}

.node-name {
  width: 42%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.node-name-text {
  width: 95%;
}

.node-type {
  padding-left: 1px;
  width: 16%;
  display: flex;
  align-items: center;
  justify-content: start;
}

.typologie {
  width: 15px;
  height: 15px;
  /* margin-top: 5px; */
  /* border-radius: 50%; */
  display: inline-block;
  margin-right: 5px;
  /* background-color: #325e4b; */
  background-size: contain;
}

.node-room {
  padding-left: 1px;
  width: 23%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
}

.node-num {
  width: 12%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.num-nodes {
  background-color: #346ea870;
  color: #14202c;
  padding: 2px 5px;
  width: auto;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.elems-unit {
  font-size: 0.6rem;
  /* Smaller font size for 'Éléms' */
  margin-left: 3px;
  margin-top: 2px;
  /* Optional: Add some space between the number and the text */
}

.node-status {
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-status-active {
  border-color: #325e4b;
  background-color: #325e4b;
}

.circle-status-inactive {
  border-color: #d7270c;
  background-color: #d7270c;
}

.circle-status-unknown {
  border-color: #f49700;
  background-color: #f49700;
}

.status-circle {
  height: 25px;
  width: 9px;
  border-radius: 1rem;
}

.status-circle-container {
  position: relative;
  display: inline-block;
}

.circle-container {
  display: none;
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  margin-right: 2px;
  /* border-radius: 5px; */
  z-index: 10;
  /* Ensure it appears above other elements */
}

.status-circle:hover+.circle-container {
  display: block;
}

.displayNone {
  display: none;
}

.search-bar {
  /* padding: 10px; */
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
}

.search-bar input {
  width: 75%;
  padding: 6px;
  font-size: 0.9rem;
  color: white;
  border-radius: 4px;
}

.search-image {
  width: 25px;
  height: 25px;
  background-image: url("./assets/magnify.svg");
  margin-right: 0px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  /* background: #325e4b; */
}

.reseau-icon {
  background-image: url("./assets/down.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
  margin-left: 5px;
}

.room-icon {
  background-image: url("./assets/down.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
  margin-left: 5px;
}

.goto-icon {
  background-image: url("./assets/open-new-blue.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 12px;
  height: 12px;
  margin-left: 5px;
}

.goto-icon:hover {
  width: 14px;
  height: 14px;
}

.status-dropdown {
  z-index: 100;
  background-color: #14202c;
  border: 1px solid #ddd;
  padding: 5px;
  position: absolute;
  margin-top: 160px;
}

.status-dropdown div {
  padding: 5px;
  cursor: pointer;
}

.status-dropdown div:hover {
  background-color: #eee;
  color: #14202c;
}

.status-selected {
  font-weight: bold;
}

.status-icon {
  width: 14px;
  height: 14px;
  background-image: url("./assets/down.svg");
  background-size: contain;
  background-repeat: no-repeat;
  transition: transform 0.3s ease;
}

.status-icon.rotate-up {
  transform: rotate(180deg);
}

.status-icon.rotate-down {
  transform: rotate(0deg);
}

.rotate-up {
  transform: rotate(180deg);
}

.rotate-down {
  transform: rotate(0deg);
}
</style>
