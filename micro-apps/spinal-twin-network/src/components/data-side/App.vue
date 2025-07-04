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
<!-- Ala -->
<template>
  <v-card elevation="4" class="cardContainer" style="padding: 0!important;">
    <div class="dataContainer" v-if="pageSate === PAGE_STATES.loaded && !isBuildingSelected">
      <button @click="() => {
        $emit('buttonClicked');
        resize();
      }
      " style="
          z-index: 10;
          position: absolute;
          top: 47.5%;
          left: -20px;
          background-color: white;
          border-radius: 10px;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: 5px;
          border-left: 2px solid gainsboro;
        " :style="{ left: DActive ? '-35px' : '-20px' }">
        <v-icon v-if="DActive"> mdi-chevron-double-left </v-icon>
        <v-icon v-else-if="ActiveData">mdi-chevron-right</v-icon>
        <v-icon v-else>mdi-chevron-left</v-icon>
      </button>
      <button @click="() => {
        $emit('buttonClicked3D');
        resize();
      }
      " style="
          z-index: 10;
          position: absolute;
          top: 52.5%;
          background-color: white;
          border-radius: 10px;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: 5px;
          border-left: 2px solid gainsboro;
        " :style="{ left: DActive ? '-35px' : '-20px' }">
        <v-icon v-if="ActiveData">mdi-chevron-double-right</v-icon>
        <v-icon v-else-if="DActive">mdi-chevron-left</v-icon>
        <v-icon v-else>mdi-chevron-right</v-icon>
      </button>
      <!-- <div class="detail_header">
        <div class="title_date">
          <div class="date" title="recharger"></div>
        </div>
      </div> -->
      <!-- //BACKHERE -->
      <div :style="{
        height: 'calc(100% )', display: DActive ? 'none' : 'flex',
      }" class="data-container">
        <NodeItem :data="myowndata" :DActive="DActive" :ActiveData="ActiveData"
          :hardwareContextData="hardwareContextData" :selectedHardwareContext="selectedHardwareContext"
          @updateSelectedHardwareContext="handleSelectedHardwareContextUpdate" :config="config"
          @node-click="callCard" />
        <!-- </div> -->

      </div>
    </div>

    <div class="centered" v-else-if="pageSate === PAGE_STATES.loaded && isBuildingSelected">
      Aucune donnée à afficher ! veuillez selectionner un étage ou une pièce.
    </div>

    <div class="centered" v-else-if="pageSate === PAGE_STATES.loading">
      <v-progress-circular style="margin-bottom: 15px;" :size="70" :width="3" color="#14202c"
        indeterminate></v-progress-circular>
      <p style="margin-top: 10px;">Veuillez patienter pendant le chargement des données !</p>
    </div>

    <div class="centered" v-else-if="pageSate === PAGE_STATES.error">
      <div>
        <v-icon color="red" style="font-size: 5em">mdi-alert-circle-outline</v-icon>
      </div>
      <div color="red">
        Quelque chose s'est mal passé ! Veuillez
        <v-btn small outlined color="red" @click="retry">réessayer </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Prop, Vue, Watch } from "vue-property-decorator";
import { PAGE_STATES } from "../../interfaces/pageStates";
import Component from "vue-class-component";
import { IConfig } from "../../interfaces/IConfig";
import { ISpaceSelectorItem } from "global-components";
import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import lodash from "lodash";
import { State } from "vuex-class";
import { MutationTypes } from "../../services/store/appDataStore/mutations";
import { mapState } from "vuex";
import SpriteComponent from "./SpriteComponent.vue";
import SpriteCardComponent from "./SpriteCardComponent.vue";
import NodeItem from "./NodeItem.vue";
import SpriteComponentLuminaire from "./SpriteComponentLuminaire.vue";
import { Console, warn } from "console";
import HardwareContext from "./HardwareContext.vue";
import { h } from "vue";
import { config } from "process";
import { gethildrenRelationContextNode } from "../../services/spinalAPI/GeographicContext/geographicContext";
import { color } from "chart.js/helpers";
import createAccentColorGenerator from "../../services/utils/colors";
@Component({
  components: { NodeItem, HardwareContext, SpriteComponent, SpriteCardComponent },
  filters: {},
})
class dataSideApp extends Vue {
  // @State data!: any[];

  @Prop() config!: IConfig;
  @Prop() selectedZone: ISpaceSelectorItem;
  @Prop() data: any[];
  @Prop() DActive: boolean;
  @Prop() ActiveData: boolean;
  PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
  pageSate: PAGE_STATES = PAGE_STATES.loading;
  isBuildingSelected: boolean = true;
  retry: Function;
  spriteIds: number[] = [];
  myowndata: any[]; // holds the Network data that will be displayed in the data side app
  groupes: any[]; //Bim object groupes from category and context

  hardwareContextData: any[] = [];
  // holds the data of the equipments to show in the 3D space for the sprite component
  equipementsXYZ: {
    name?: string;
    dynamicId: number;
    status?: string;
    self_status?: string;
    X: number;
    Y: number;
    Z: number;
    parent?: number;
    typologie?: string;
    endpoints?: any[];
    controlEndpoints?: any[];
    color?: string;
    position?: THREE.Vector3;
  }[] = [];
  mapColor: Map<number, string> = new Map(); // holds the color of the hardware context
  selectedHardwareContext: { contextId: number, nodeId: number, color: string }[] = [];  // holds the hardware context data that will be used to retrieve the children of the selected context

  resize() {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 1);
  }
  async mounted() {
    this.pageSate = PAGE_STATES.loaded;
    this.isBuildingSelected = true;
    const buildingId = localStorage.getItem("idBuilding") ;
    const patrimoineId = this.getPatrimoineId();
    // Recupération des hardware context
    await this.getHardwareContextByRelation(
      buildingId,
      patrimoineId,
      this.selectedZone.dynamicId
    );
  }

  handleSelectedHardwareContextUpdate(hardwareContext: { contextId: number, nodeId: number, color: string }[]) {
    this.selectedHardwareContext = hardwareContext;
    console.warn("selectedHardwareContext:", this.selectedHardwareContext);
  }


  async retriveData(selectehardware: { contextId: number, nodeId: number, color: string }[]) {
    console.warn("retriveData called with selectedIds: ", selectehardware);
    this.$store.commit(MutationTypes.SET_DATA, []);
    this.myowndata = [];
    try {
      this.pageSate = PAGE_STATES.loading;
      const buildingId = localStorage.getItem("idBuilding");
      const patrimoineId = this.getPatrimoineId();

      // Resets API store cache to prevent stale data when switching contexts.
      this.resetContext(buildingId);

      // Retrieve the groups of BIM objects based on the context and category from the configuration
      this.groupes = await this.getGroupes(
        buildingId,
        patrimoineId,
        this.config.typologiesSource.context,
        this.config.typologiesSource.category
      );


      // Retrieve the parent automates (children of the selected context)
      const childrenData = await this.getChildrenByRelation(
        buildingId,
        patrimoineId,
        selectehardware
      );
      // Retrieve the children based on the parent automates recusively
      let luminaireChildren = await this.getLuminaireChildren(
        buildingId,
        patrimoineId,
        childrenData
      );
      luminaireChildren = luminaireChildren.map((item) => {
         const matchedItem = childrenData.find(
          (child) => child.dynamicId === item.dynamicId
        );
        if (matchedItem) {
          item.color = matchedItem.color;
        }
        return item;
      })


      const Typologies = await this.getElementTypologie();


      const filteredTypologies = this.filterTypologiesByGroup(this.groupes, Typologies);
      this.equipementsXYZ = this.extractPositions(filteredTypologies);
      const parentRooms = await this.getParentRooms(buildingId, patrimoineId, luminaireChildren);

      // Update the luminaireChildren with the filtered typologies and parent rooms with the herarchy of the nodes
      this.updateLuminaireList(luminaireChildren, filteredTypologies, parentRooms);
      luminaireChildren.forEach((item) => {
        this.addParentToNodes([item]);
      });

      console.log("luminaireChildren after adding parent: ", luminaireChildren);

      this.$store.commit(MutationTypes.SET_DATA, luminaireChildren);
      this.myowndata = luminaireChildren;


      // Add the position endpoints and controlepoints
      const mergedList = this.mergeAttributesWithHierarchy(
        this.myowndata,
        this.equipementsXYZ
      );
      this.equipementsXYZ.map((el) => {
        if(el.parent) {
          const matchedItem = luminaireChildren.find(
            (item) => item.dynamicId === el.parent
          );
          if(matchedItem) {
            el.color = matchedItem.color;
          }
        }
        const matchingItem = luminaireChildren.find(
          (item) => item.dynamicId === el.dynamicId
        );

        if(matchingItem) {
          el.color = matchingItem.color;
        }
      })

      luminaireChildren.forEach((item) => {
        this.$store.commit(MutationTypes.SET_HARDWARE_EQUIPEMENT_COLOR, {
          contextId: item.dynamicId,
          color: item.color
        })
      })


      this.myowndata = mergedList;
      this.pageSate = PAGE_STATES.loaded;
    } catch (err) {
      console.log(err);
      this.pageSate = PAGE_STATES.error;
    }
  }
  filterTypologiesByGroup(groups, typologies) {
    return typologies.map((typology) => {
      // Find the matching group from the groups list based on dynamicId
      const matchingGroup = typology.group.find((item) =>
        groups.some((group) => group.dynamicId === item.dynamicId)
      );

      // If a match is found, replace the group array with the matching group
      return {
        ...typology,
        group: matchingGroup ? [matchingGroup] : [],
      };
    });
  }
  extractPositions(typologies) {
    return typologies.map((item) => {
      const { dynamicId, position } = item;

      // Check if position exists and is a THREE.Vector3 object
      let X, Y, Z;
      if (position instanceof THREE.Vector3) {
        X = position.x;
        Y = position.y;
        Z = position.z;
      } else {
        X = undefined;
        Y = undefined;
        Z = undefined;
      }

      return {
        dynamicId,
        X,
        Y,
        Z
      };
    });
  }

  getPatrimoineId() {
    const patrimoineString = localStorage.getItem("patrimoine");
    return patrimoineString ? JSON.parse(patrimoineString).id : null;
  }


  async getHardwareContextByRelation(
    buildingId: string | null,
    patrimoineId: any,
    selectedNodeId: number
  ) {
    if (selectedNodeId === 0) return;
    this.resetContext(buildingId);
    const relation2 = "hasNetworkTree";
    const automates2 = [
      this.$store.dispatch(ActionTypes.GET_CHILDREN_BY_RELATION, {
        buildingId,
        patrimoineId,
        nodeId: selectedNodeId,
        relation: relation2,
      }),
    ];
    let equivalentHardwareContext = await Promise.all(automates2);
    equivalentHardwareContext = equivalentHardwareContext.flat();
    await this.getHDcontexts(
      buildingId,
      patrimoineId,
      equivalentHardwareContext
    );
    if (equivalentHardwareContext.length === 0) {
      return selectedNodeId;
    }
    const mainNodeIdSelected = equivalentHardwareContext[0].dynamicId;


    const matchedContext = this.hardwareContextData.find(
      context => context.dynamicId === mainNodeIdSelected
    );
    const selected = {
      contextId: matchedContext.nodes[0].realid,
      nodeId: matchedContext.dynamicId,
      color: '#ffb30f',
    }
    this.selectedHardwareContext = [selected];

    return this.selectedHardwareContext;
  }

  async resetContext(buildingId: string | null) {
    this.$store.dispatch(ActionTypes.RESET_API_ITERATOR_STORE, {
      buildingId,
    });
    return;
  }
  async getGroupes(
    buildingId: string | null,
    patrimoineId: any,
    context: string,
    category: string
  ) {
    this.resetContext(buildingId);
    let groupes: any = [];
    groupes = [
      this.$store.dispatch(ActionTypes.GET_GROUPES_CATEGORY, {
        buildingId,
        patrimoineId,
        context: context,
        category: category,
      }),
    ];
    let items = await Promise.all(groupes);
    items = items.flat();
    const filteredItems = items.map((item) => ({
      name: item.name,
      dynamicId: item.dynamicId,
      type: item.type
    }));
    return filteredItems;
  }


  async getChildrenByRelation(
    buildingId: string | null,
    patrimoineId: any,
    selectedHardware: { contextId: number, nodeId: number, color: string }[]
  ) {

    this.resetContext(buildingId);
    const relation = "hasNetworkTreeBimObject";
    const automates: any[] = [];
    
    try {
      let i = 0;
      for (const hardware of selectedHardware) {
        const color = hardware.color
        let data: any[] = [];
        const contextId = hardware.contextId;
        const nodeId = hardware.nodeId;
        data = await gethildrenRelationContextNode(patrimoineId, buildingId!, contextId, nodeId, relation);
        if (data && data.length > 0) {
          data.forEach((item: any) => {
            if (!automates.some((automate: any) => automate.dynamicId === item.dynamicId)) {
              item.color = color;
              automates.push(item);
            }

          })
        }
        i++;
      }
    } catch (error) {
      console.error("Error retrieving children by relation: ", error);
    }

    return automates;
  }

  async getHDcontexts(
    buildingId: string | null,
    patrimoineId: any,
    hdNodes: any[]
  ) {
    //Hardware Contexts Names
    this.resetContext(buildingId);
    let childrenIds = hdNodes.map((r) => r.dynamicId).flat();
    let parentsIds = hdNodes.map((r) => r.dynamicId).flat();
    let relations = childrenIds.map((r) => ({
      dynamicId: r,
      relation: ["hasNetworkTreeGroup"],
    }));
    const luminaireChildren = [
      this.$store.dispatch(ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE, {
        buildingId,
        patrimoineId,
        relations: relations,
        size: 200,
      }),
    ];

    let contextParentByRelation = await Promise.all(luminaireChildren);
    contextParentByRelation = contextParentByRelation.flat();
    this.hardwareContextData = contextParentByRelation;
    return contextParentByRelation;
  }

  async getLuminaireChildren(
    buildingId: string | null,
    patrimoineId: any,
    childrenByRelation: any[]
  ) {
    this.resetContext(buildingId);
    let childrenIds = childrenByRelation.map((r) => r.dynamicId).flat();
    let parentsIds = childrenByRelation.map((r) => r.dynamicId).flat();
    let relations = childrenIds.map((r) => ({
      dynamicId: r,
      relation: ["hasNetworkTreeBimObject"],
    }));
    const luminaireChildren = [
      this.$store.dispatch(ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE_CONTEXT, {
        buildingId,
        patrimoineId,
        // contextId: this.mainHardwareContext,
        relations: relations,
        size: 200,
      }),
    ];
    let luminaireChildrenByRelation = await Promise.all(luminaireChildren);
    // luminaireChildrenByRelation = luminaireChildrenByRelation.map((item) => {
    //   const matchedItem = childrenByRelation.find(
    //     (child) => child.dynamic === item.dynamicId
    //   )
    //   if(matchedItem) {
    //     item.color = matchedItem.color;
    //     console.warn("matchedItem: ", item);
    //   }
    //   return item;
    // });
    luminaireChildrenByRelation = luminaireChildrenByRelation.flat();
    luminaireChildrenByRelation.forEach((item) => {
      if (Array.isArray(item.nodes)) {
        item.nodes = item.nodes.filter((node) => node.type === "BIMObject");
      } else {
      }
    });

    childrenIds = [];
    luminaireChildrenByRelation.forEach((lum) => {
      if (Array.isArray(lum.nodes)) {
        childrenIds = this.collectDynamicIds(lum.nodes, childrenIds);
      } else {
      }
    });

    this.spriteIds = [...parentsIds, ...childrenIds];
    const childrenMap = new Map(
      childrenByRelation.map((child) => [child.dynamicId, child])
    );
    luminaireChildrenByRelation.forEach((luminaire) => {
      const matchingChild = childrenMap.get(luminaire.dynamicId);
      if (matchingChild) {
        luminaire.name = matchingChild.name;
        luminaire.staticId = matchingChild.staticId;
        luminaire.type = matchingChild.type;
      }
    });

    return luminaireChildrenByRelation;
  }
  async getParentRooms(
    buildingId: string | null,
    patrimoineId: any,
    nodes: any[]
  ) {
    this.resetContext(buildingId);

    // Helper function to recursively collect dynamicIds
    const getAllDynamicIds = (nodes) => {
      let ids = [];

      nodes.forEach((node) => {
        // Collect the dynamicId of the current node
        if (node.dynamicId) {
          ids.push(node.dynamicId);
        }

        // If the node has children, recursively collect their ids
        if (node.nodes && Array.isArray(node.nodes)) {
          ids = ids.concat(getAllDynamicIds(node.nodes));
        }
      });

      return ids;
    };

    // Get all dynamic IDs recursively from the nodes and their children
    const ids = getAllDynamicIds(nodes);

    // Dispatch the action with the collected ids
    const parentRoomspromises = [
      this.$store.dispatch(ActionTypes.GET_POSITION_MULTIPLE, {
        buildingId,
        patrimoineId,
        ids: ids,
        size: 200,
      }),
    ];

    // Wait for all promises to resolve
    let parentRooms = await Promise.all(parentRoomspromises);

    // Flatten the result (since you're using Promise.all with arrays)
    parentRooms = parentRooms.flat();
    return parentRooms;
  }



  async getElementTypologie() {
    const buildingId = localStorage.getItem("idBuilding");
    this.resetContext(buildingId);
    const attributes = [
      this.$store.dispatch(ActionTypes.READ_STATIC_DETAILS_MULTIPLE, {
        buildingId: localStorage.getItem("idBuilding"),
        dynamicIds: this.spriteIds,
        size: 200,
      }),
    ];
    const attributesResult = await Promise.all(attributes);
    return attributesResult[0];
  }



  updateLuminaireList(
    luminaireChildrenByRelation: any[],
    typologiesList: any[],
    roomParentList: any[]
  ) {

    luminaireChildrenByRelation.forEach((luminaire) =>
      this.updateStatus(luminaire, typologiesList, roomParentList)
    );
  }

  addParentToNodes(nodes: any[], parentId?: number) {
    nodes.forEach((node) => {
      const equipItem = this.equipementsXYZ.find(
        (equip) => equip.dynamicId === node.dynamicId
      );
      if (equipItem) {
        
        equipItem.name = node.name;
        equipItem.status = node.status;
        equipItem.self_status = node.self_status;
        equipItem.parent = parentId;
        equipItem.typologie = node.typologie;
        equipItem.endpoints = node.endpoints;
        equipItem.controlEndpoints = node.controlEndpoints;
        equipItem.position = node.position;
      }

      if (node.nodes && node.nodes.length > 0) {
        this.addParentToNodes(node.nodes, node.dynamicId);
      }
    });
  }

  collectDynamicIds(nodes, collectedIds: number[]) {
    nodes.forEach((node) => {
      if (node.dynamicId !== undefined) {
        collectedIds.push(node.dynamicId);
      }
      if (Array.isArray(node.nodes) && node.nodes.length > 0) {
        this.collectDynamicIds(node.nodes, collectedIds);
      }
    });

    return collectedIds;
  }
  mergeAttributesWithHierarchy(statique, equipementsXYZ) {
    // Helper function to find an item in the statique list by dynamicId
    const findStatiqueItemById = (id) =>
      statique.find((item) => item.dynamicId === id);

    // Helper function to recursively merge attributes
    function mergeNode(node) {
      const { dynamicId } = node;
      const equip = equipementsXYZ.find((e) => e.dynamicId === dynamicId);

      // Merge attributes
      const mergedNode = {
        ...node,
        // position: equip
        //   ? new THREE.Vector3(equip.X, equip.Y, equip.Z)
        //   : undefined,
        endpoints: node.endpoints || [],
        controlEndpoints: node.controlEndpoints || [],
        //back
      };

      // Recursively merge children nodes
      if (mergedNode.nodes && Array.isArray(mergedNode.nodes)) {
        mergedNode.nodes = mergedNode.nodes.map(mergeNode);
      }

      return mergedNode;
    }

    // Start merging from the top-level nodes
    return statique.map(mergeNode);
  }

  updateStatus(node, typologiesList: any[], roomParentList: any[]) {
    if (node.nodes && node.nodes.length > 0) {
      // Recursively update children first
      node.nodes.forEach((child) => this.updateStatus(child, typologiesList, roomParentList));
      // Random Status //TODO: Remove this
      const statuses = [
        "active",
        "active",
        "active",
        "active",
        "active",
        "active",
        "active",
        "unknown",
        "inactive",
      ];
      const randomIndex = Math.floor(Math.random() * statuses.length);
      node.self_status = statuses[randomIndex];
      node.status = node.self_status;

      const matchingStatus = typologiesList.find(
        (typology) => typology.dynamicId === node.dynamicId
      );
      if (matchingStatus) {
        node.endpoints = matchingStatus.endpoints;
        node.controlEndpoints = matchingStatus.controlEndpoints;
        // let value = matchingStatus.endpoints[1].value;
        let value = true;
        if (value) {
          // node.self_status = "active";
        } else {
          // node.self_status = "inactive";
        }
        // node.self_status = matchingStatus.endpoints[1].value;
      }
    } else {
      // Random Status //TODO: Remove this
      const statuses = [
        "active",
        "active",
        "active",
        "active",
        "active",
        "active",
        "active",
        "unknown",
        "inactive",
      ];
      const randomIndex = Math.floor(Math.random() * statuses.length);
      node.self_status = statuses[randomIndex];
      node.status = node.self_status;
      // End Random Status//



      const matchingStatus = typologiesList.find(
        (typology) => typology.dynamicId === node.dynamicId
      );
      if (matchingStatus) {
        node.endpoints = matchingStatus.endpoints;
        node.controlEndpoints = matchingStatus.controlEndpoints;
        if (matchingStatus.endpoints.length > 0) {
          if (this.config.source[0].name === matchingStatus.endpoints[1]?.name) {
            // let value = matchingStatus.endpoints[1].value;
            let value = true;
            if (value) {
              // node.self_status = "active";
            } else {
              // node.self_status = "inactive";
            }
          } else {
            // node.self_status = "inactive";
          }
        } else {
          // node.self_status = "inactive";
        }
      }
      // node.status = node.self_status;
    }
    const matchingTypology = typologiesList.find(
      (typology) => typology.dynamicId === node.dynamicId
    );
    if (matchingTypology) {
      //const exists = this.groupes.includes(matchingTypology.group);
      const exists = matchingTypology.group.length > 0;
      if (!exists) {
        node.typologie = "Inconnue";
      } else {
        node.typologie = matchingTypology.group[0].name;
      }
      if (matchingTypology.position) {
        node.position = new THREE.Vector3(
          matchingTypology.position.x,
          matchingTypology.position.y,
          matchingTypology.position.z
        );
      }
    }
    else {
      node.position = new THREE.Vector3(
        0,
        0,
        0
      );
    }
    const matchingRoom = roomParentList.find(
      (room) => room.dynamicId === node.dynamicId
    );
    if (matchingRoom) {
      node.room = matchingRoom.room.room;
      node.roomname = matchingRoom.room.room.name;
    }
  }

  /**
   * Watch
   */

  @Watch("selectedHardwareContext")
  watchSelectedHardwareContext(newValue: { contextId: number, nodeId: number }[]) {
    if (this.selectedZone.type === "building") {
      this.isBuildingSelected = true;
      return;
    }
    this.isBuildingSelected = false;
    this.myowndata = [];

    this.retriveData(this.selectedHardwareContext);
  }

  @Watch("selectedZone")
  async watchSelectedZone() {
    this.$store.dispatch(ActionTypes.REMOVE_ALL_LINES);
    this.$store.dispatch(ActionTypes.REMOVE_ALL_SPRITES); 
    if (this.selectedZone.type === "building") {
      this.isBuildingSelected = true;
      return;
    }
    this.isBuildingSelected = false;
    this.myowndata = [];
    const buildingId = localStorage.getItem("idBuilding");
    const patrimoineId = this.getPatrimoineId();
    let hardwareContext: number | {
      contextId: number;
      nodeId: number;
    }[] | undefined = await this.getHardwareContextByRelation(
      buildingId,
      patrimoineId,
      this.selectedZone.dynamicId
    );

    console.warn("zone change: hardwareCOntext: ", hardwareContext);

    if (Array.isArray(hardwareContext) && hardwareContext.length > 0) {
      this.retriveData(hardwareContext);
    }
  }

  callCard(items: any[]) {
    this.$store.dispatch(ActionTypes.REMOVE_CARDS);
    this.$store.dispatch(ActionTypes.ADD_COMPONENT_NETWORK_AS_SPRITE, {
      items: items.flat(),
      buildingId: localStorage.getItem("idBuilding"),
      component: SpriteCardComponent,
    });
    // this.$store.dispatch(ActionTypes.REMOVE_ALL_LINES);
    return;
  }

  @Watch("data")
  async watchData(newdata: any[]) {
    this.$store.dispatch(ActionTypes.REMOVE_ALL_LINES);
    // // if (this.config.sprites) {
    this.$store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);
    // }
    if (this.isBuildingSelected) return;
    const items = new Array();
    for (const key of Object.keys(this.equipementsXYZ)) {
      // let color: string = '';
      // if(this.equipementsXYZ[key].parent) {

      //   color = this.$store.state.appDataStore.hardwareequipementColor.get(this.equipementsXYZ[key].parent);
      // }
      // else {
      //   console.error("No parent found for dynamicId: ", this.equipementsXYZ[key]);
      //   color = this.$store.state.appDataStore.hardwareequipementColor.get(this.equipementsXYZ[key].dynamicId);
      // }
      // console.warn("color: ", color);

      items.push({
        dynamicId: this.equipementsXYZ[key].dynamicId,
        buildingId: localStorage.getItem("idBuilding"),
        data: this.equipementsXYZ[key],
        parent: this.equipementsXYZ[key].parent,
        typologie: this.equipementsXYZ[key].typologie,
        endpoints: this.equipementsXYZ[key].endpoints,
        name: this.equipementsXYZ[key].name,
        // color: color,
        status: this.equipementsXYZ[key].status,
        self_status: this.equipementsXYZ[key].self_status,
        imageMapping: this.config.imageMapping,
        clignot: this.config.statusClignote,
        position: new THREE.Vector3(
          this.equipementsXYZ[key].X,
          this.equipementsXYZ[key].Y,
          this.equipementsXYZ[key].Z
        ),
      });
    }
 

    this.$store.dispatch(ActionTypes.ADD_COMPONENT_NETWORK_AS_SPRITE, {
      items: items.flat(),
      buildingId: localStorage.getItem("idBuilding"),
      component: SpriteComponent,
    });

    const buildingId = localStorage.getItem("idBuilding");
    this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
      items: [],
      buildingId: buildingId || this.selectedZone.staticId,
    });
    this.equipementsXYZ = [];
    return;
  }
}

export { dataSideApp };
export default dataSideApp;
</script>
<style lang="scss">
.dataContainer {
  height: 100%;
  width: 100%;
  font-family: charlevoix, sans-serif !important;
}

.data-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px 15px;
}

.graph-inspector {
  margin-top: 25px;
  width: 100%;
  height: 300px;
  background: #222222;
}

.logo-loader {
  background-color: aqua;
  width: 40%;
  height: 50px;
}

.centered {
  height: 100%;
  width: 100%;
  // background-color: #222222;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>