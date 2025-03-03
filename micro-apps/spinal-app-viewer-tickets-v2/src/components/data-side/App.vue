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

  <!-- pmmmmmmmmmmmmmmmmmmmmmmmmmmmm -->
  <!-- <v-select color="#14202c" background-color="#fff" style="max-width: calc(100%)" solo flat @click.stop
          v-model="step_filter" label="Toutes les étapes" placeholder="Toutes les étapes" :items="steps()"
          append-icon="mdi-chevron-down" clearable clear-icon="mdi-close-circle-outline" multiple menu-props="offset-y">
          <template v-slot:selection="{ item, index }">
            <v-chip @click:close="step_filter = step_filter.filter((s) => s !== item)" close
              :close-icon="'mdi-close-circle'" style="
                font-size: 11px;
                height: 24px;
                max-width: calc(100% - 50px);
              " v-if="index < 1">
              <span style="max-width: 90%; overflow: hidden">{{ item }}</span>
            </v-chip>

            <span v-if="index === 1" class="text-grey text-caption align-self-center">
              (+{{ step_filter.length - 1 }})
            </span>
          </template>
</v-select> -->
  <!-- pmmmmmmmmmmmmmmmmmmmmmmmmm -->
  <v-card elevation="4" class="card-container d-flex align-center justify-center">
    <div class=" dataContainer d-flex flex-column noMargin" style="height: 100%; width: 100%"
      v-if="pageSate === PAGE_STATES.loaded && !isBuildingSelected">

      <!-- <div class="profil-selec-container">
        <ProfileSelector style="margin-bottom: 10px;" @profileSelected="handleProfileSelected" />
      </div> -->

      <div class="d-flex flex-row justify-space-between" style="align-items: center;">

        <div class="d-flex flex-column justify-space-between" style="align-items: start;">
          <div class="app-title">Liste des tickets</div>
          <div class="app-description">{{ sortedTickets().length }} demande en cours</div>
        </div>
        <div class="d-flex flex-column justify-space-between" style="align-items: end;">
          <div class="app-title">{{ flooritemsnumber }} Tickets</div>
          <div class="app-description">sur RDC</div>
        </div>

      </div>
      <div class="d-flex flex-row justify-space-between" style="align-items: center;">
        <div v-if="selectedProfile === 'Admin'" class="add-ticket-button">
          <div class="add-ticket-icon"></div>
          <div class="add-ticket-text-holder">
            <div class="add-ticket-text">Déclaration d’un</div>
            <div class="add-ticket-text-bold">TICKET DE MAINTENANCE</div>
          </div>
        </div>
        <div class="reload-container">
          <!-- <div @click="reloadData('building')">reload</div> -->
          <div class="reload-btn" @click="startReload" :style="{ background: progressGradient }">
            <div class="reload-btn-inner">
              <v-icon>mdi-refresh</v-icon>
            </div>
          </div>
          <div v-if="noDataChangedMessage" class="no-data-message">
            Nouveaux tickets reçus
          </div>
        </div>
      </div>

      <div class="hide" @click="() => {
        $emit('full3D');
        resize();
        changeIcon()
      }"
        style="background-color: white;width: 50px;height: 50px;position: absolute;bottom: 20px;right: 20px;z-index: 9999;border-radius: 5px;border: 2px solid #14202c;justify-content: center;align-items: center;display: flex;">
        <v-icon v-if="modefull">mdi-text-box</v-icon>
        <v-icon v-else>mdi-video-3d</v-icon>
      </div>
      <div class="hide_inverse">
        <!-- affichage scindé ou coùmplet (dataapp viewer)-->
        <button cla @click="() => {
          $emit('buttonClicked');
          resize();
        }
          " style="
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
          z-index: 2;
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
          z-index: 2;
        " :style="{ left: DActive ? '-35px' : '-20px' }">
          <v-icon v-if="ActiveData">mdi-chevron-double-right</v-icon>
          <v-icon v-else-if="DActive">mdi-chevron-left</v-icon>
          <v-icon v-else>mdi-chevron-right</v-icon>
        </button>
      </div>

      <div class="d-flex flex-row justify-space-between filtres-container" style="width: 100%;">
        <div class="d-flex flex-column justify-space-between filtre-half-holder" style="height: 150px;">
          <div>
            <div class="filtre-title">
              Status
            </div>
            <div style="height: 50px;width: 100%;display:flex;font-weight: bold;margin: auto;color: azure;">
              <StatusFiltre :list="steps2()" v-model="step_filter" @update:modelValue="handleStepFilterUpdate" />

            </div>
          </div>
          <div>
            <div class="filtre-title">
              Priorité
            </div>
            <div style="width: 100%; height: 50px; display: flex; flex-direction: row; justify-content: space-between;">

              <div v-for="priority in priorities" :key="priority.value" class="d-flex flex-row row-style align-center"
                style="align-items: center;">
                <v-checkbox v-model="priority.selected" @change="applyPriorityFilter"
                  style="margin-right: 0px!important;" />
                <div class="d-flex flex-row align-center">
                  <div class="priority-indicator" :style="{ background: getPriorityColor(priority.value) }">
                  </div>
                  <div class="prio-filtre-text"
                    :style="{ textDecoration: priority.selected ? 'none' : 'line-through', opacity: priority.selected ? '1' : '0.5' }">
                    {{ priority.label }}
                  </div>
                </div>
              </div>


              <!-- <v-checkbox v-for="priority in priorities" :key="priority.value" v-model="priority.selected"
                :label="priority.label" @change="applyPriorityFilter"
                style="margin-right: 10px; display: inline-block;" /> -->
            </div>
          </div>
        </div>
        <div style="width: 1px; background-color: #14202c20; margin: 0 10px;height: 150px;"></div>

        <div class="d-flex flex-column justify-space-between filtre-half-holder">
          <div>
            <div class="filtre-title">
              Workflow
            </div>
            <div class="dropdown-holder">

              <v-select color="#14202c" background-color="#fff" style="max-width: calc(100%)" solo flat @click.stop
                v-model="workflow_filter" label="Tous les workflows" placeholder="Tous les workflows"
                :items="workflows()" append-icon="mdi-chevron-down" clearable clear-icon="mdi-close-circle-outline"
                multiple menu-props="offset-y">
                <template v-slot:selection="{ item, index }">
                  <v-chip @click:close="
                    domain_filter = workflow_filter.filter((w) => w !== item)
                    " close :close-icon="'mdi-close-circle'" style="
                font-size: 11px;
                height: 24px;
                max-width: calc(100% - 50px);
              " v-if="index < 1">
                    <span style="max-width: 90%; overflow: hidden">{{ item }}</span>
                  </v-chip>

                  <span v-if="index === 1" class="text-grey text-caption align-self-center">
                    (+{{ workflow_filter.length - 1 }})
                  </span>
                </template>
              </v-select>
            </div>

          </div>
          <div>
            <div class="filtre-title">
              Domaine
            </div>
            <div class="dropdown-holder">
              <v-select color="#14202C" background-color="#fff" style="max-width: calc(100% );" solo flat @click.stop
                v-model="domain_filter" label="Tous les domaines" placeholder="Tous les domaines" :items="domains()"
                append-icon="mdi-chevron-down" clearable clear-icon="mdi-close-circle-outline" multiple
                menu-props="offset-y">
                <template v-slot:selection="{ item, index }">
                  <v-chip @click:close="
                    domain_filter = domain_filter.filter((d) => d !== item)
                    " close :close-icon="'mdi-close-circle'" style="
                  font-size: 11px;
                  height: 24px;
                  max-width: calc(100% - 50px);
                " v-if="index < 1">
                    <span style="max-width: 90%; overflow: hidden">{{ item }}</span>
                  </v-chip>

                  <span v-if="index === 1" class="text-grey text-caption align-self-center">
                    (+{{ domain_filter.length - 1 }})
                  </span>
                </template>
              </v-select>
            </div>
          </div>
        </div>
      </div>
      <!-- <div style="height: 1px; background-color: #14202c20; margin: 10px 0;"></div> -->
      <!-- SAMPLE -->
      <div class="d-flex flex-column flex-fill overflow-y-auto">
        <!-- <TicketComponent v-for="(d, i) in sortedTickets()" :key="i" :data="d" @locate="locateTicket"
          @display="showDetails" /> -->
        <TicketTable :data="sortedTickets()" :config="selectedProfile" @locate="locateTicket" @display="showDetails" />

      </div>
      <!-- \SAMPLE -->
      <div class="legend-full-container">
        <LegendVue :legendItems="legendItems"></LegendVue>
      </div>
    </div>

    <div class="centered" v-else-if="pageSate === PAGE_STATES.loaded && isBuildingSelected">
      Aucune donnée à afficher ! veuillez selectionner un étage ou une pièce.
    </div>

    <div class="centered" v-else-if="pageSate === PAGE_STATES.loading">
      <v-progress-circular :size="70" :width="3" color="purple" indeterminate></v-progress-circular>
    </div>

    <div class="centered" v-else-if="pageSate === PAGE_STATES.error">
      <div>
        <v-icon color="red" style="font-size: 5em">mdi-alert-circle-outline</v-icon>
      </div>
      <div color="red">
        Quelque chose s'est mal passé ! Veuillez
        <v-btn small outlined color="red" @click="retriveData('building')">réessayer
        </v-btn>
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
import { MutationTypes } from "../../services/store/appDataStore/mutations";
import { regroupTicketByRoom } from "../../services/store/appDataStore/utils/ticketUtils";
import { regroupTicketsByFloor } from "../../services/store/appDataStore/utils/ticketUtils";

import SpriteComponent from "./SpriteComponent.vue";
import TicketComponent from "./TicketComponent.vue";
import TicketTable from "./components/DataTable.vue";
import StatusFiltre from "./components/StatusFiltre.vue";
import SpriteCardComponent from "./SpriteCardComponent.vue";
import ProfileSelector from "./components/ProfileSelector.vue";
import { Legend } from "../../interfaces/ILegend";
import LegendVue from "./components/LegendVue.vue";
import { on } from "events";

@Component({
  components: { TicketComponent, TicketTable, StatusFiltre, SpriteCardComponent, ProfileSelector, LegendVue },
  filters: {},
})
class dataSideApp extends Vue {
  @Prop() config!: IConfig;
  @Prop() selectedZone: ISpaceSelectorItem;
  @Prop() data: any[];
  @Prop() selectedId: number;
  @Prop() DActive: boolean;
  @Prop() ActiveData: boolean;

  reloadInterval: number;
  progress = 0;
  timer: ReturnType<typeof setInterval> | undefined;
  noDataChangedMessage: boolean = false;
  messageTimeout: ReturnType<typeof setTimeout> | null = null;
  isFirstLoad: boolean = true;

  tickets_with_positions: any[];
  floor_tickets_with_positions: any[];
  PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
  pageSate: PAGE_STATES = PAGE_STATES.loading;
  isBuildingSelected: boolean = true;
  retry: Function;
  domain_filter = <string[]>[];
  step_filter = <string[]>[];
  workflow_filter = <string[]>[];
  selectedProfile: string;
  flooritemsnumber: number = 0;
  roomitemsnumber: number = 0;
  equipementitemsnumber: number = 0;
  modefull: boolean = false
  priorities = [
    { value: 0, label: "Élevée", selected: true },
    { value: 1, label: "Moyenne", selected: true },
    { value: 2, label: "Faible", selected: true },
  ];
  legendItems: Legend[] = [];
  getPriorityColor(priority: number) {
    switch (priority) {
      case 0:
        return "red";
      case 1:
        return "orange";
      case 2:
        return "green";
      default:
        return "gray";
    }
  }
  stepsAla = [
    {
      staticId: "step1",
      name: "Step 1",
      color: "#ff0000", // Red
      order: 0,
    },
    {
      staticId: "step2",
      name: "Step 2",
      color: "#00ff00", // Green
      order: 1,
    },
    {
      staticId: "step3",
      name: "Step 3",
      color: "#0000ff", // Blue
      order: 2,
    },
    {
      staticId: "step4",
      name: "Step 4",
      color: "#ffff00", // Yellow
      order: 3,
    },
    {
      staticId: "step5",
      name: "Step 5",
      color: "#ff00ff", // Magenta
      order: 4,
    },
    {
      staticId: "step6",
      name: "Step 6",
      color: "#00ffff", // Cyan
      order: 5,
    },
  ];


  tickets() {
    return this.data.map((t) =>
      this.selectedId == t.elementSelected.dynamicId
        ? { ...t, rank: 0 }
        : { ...t, rank: 1 }
    );
  }

  workflows() {
    return [...new Set(this.tickets().map((t) => t.workflowName))];
  }

  workflowsFilteredTickets() {
    if (this.workflow_filter.length === 0 || this.tickets().length === 0)
      return this.tickets();
    return this.tickets().filter((t) =>
      this.workflow_filter.includes(t.workflowName)
    );
  }

  domains() {
    return [
      ...new Set(this.workflowsFilteredTickets().map((t) => t.process.name)),
    ];
  }
  handleProfileSelected(selectedProfile) {
    this.selectedProfile = selectedProfile;
  }

  domainFilteredTickets() {
    if (this.domain_filter.length === 0 || this.data.length === 0)
      return this.workflowsFilteredTickets();

    const filtered = this.workflowsFilteredTickets().filter((d) =>
      this.domain_filter.includes(d.process.name)
    );
    return filtered;
  }
  steps() {
    return [...new Set(this.domainFilteredTickets().map((t) => t.step.name))];
  }
  steps2() {
    const uniqueSteps = new Map();
    this.domainFilteredTickets().forEach((t) => {
      if (!uniqueSteps.has(t.step.name)) {
        uniqueSteps.set(t.step.name, t.step);
      }
    });

    // Convert the map values to an array and sort by order
    return [...uniqueSteps.values()].sort((a, b) => a.order - b.order);
  }


  stepFilteredTickets() {
    if (this.step_filter.length === 0 || this.data.length === 0)
      return this.domainFilteredTickets();
    return this.domainFilteredTickets().filter((d) =>
      this.step_filter.includes(d.step.name)
    );
  }

  resize() {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 1);
  }

  changeIcon() {
    this.modefull = !this.modefull
  }

  sortedTickets() {
    const filteredTickets = this.stepFilteredTickets().filter((ticket) =>
      this.priorities.find(
        (priority) => priority.value === ticket.priority && priority.selected
      )
    );
    this.$emit("download", filteredTickets);
    this.$emit("floorData", filteredTickets);
    return [...filteredTickets].sort(
      (a, b) =>
        b.creationDate - a.creationDate ||  // Sort by newest first
        b.priority - a.priority ||          // Higher priority first
        a.rank - b.rank                      // Lower rank first
    );
  }
  callCard(items: any | any[]) {
    this.$store.dispatch(ActionTypes.REMOVE_CARDS);
    // Ensure items is always an array
    const itemsArray = Array.isArray(items) ? items : [items];

    // Filter out any undefined or null items
    const validItems = itemsArray.filter(item => item != null);

    // Add steps to valid items
    validItems.forEach(item => {
      item.steps = this.steps2();
    });

    this.$store.dispatch(ActionTypes.ADD_CARD_COMPONENT, {
      items: validItems,
      buildingId: localStorage.getItem("idBuilding"),
      component: SpriteCardComponent,
    });
    // this.$store.dispatch(ActionTypes.REMOVE_ALL_LINES);
    return;
  }



  async mounted() {
    this.selectedProfile = this.config.profilType;
    console.log("config", this.selectedProfile);
    this.startTimer();
    this.reloadInterval = this.config.reloadInterval || 60000;
    await this.retriveData("building");

  }
  beforeDestroy() {
    clearInterval(this.timer);
  }

  async retriveData(type: "building" | "geographicFloor" | "geographicRoom") {
    try {
      this.pageSate = PAGE_STATES.loading;
      const buildingId = localStorage.getItem("idBuilding");
      if (type == "building") {
        const promises = [
          this.$store.dispatch(ActionTypes.LOAD_TICKETS, {
            buildingId,
            config: this.config,
          }),
        ];
        const result = await Promise.all(promises);
        result[0].forEach((item) => {
          if (item.priority === "") {
            item.priority = 0;
          }
        });
        result[0].forEach((item) => {
          if (item.elementSelected.type === "geographicFloor") {
            item.elementSelected["XYZ center"] = "0;0;0";
          }
        });
        this.$store.commit(MutationTypes.SET_DATA, result[0]);
      } else if (type == "geographicFloor" || type == "geographicRoom") {
        const promises = [
          this.$store.dispatch(ActionTypes.FILTER_TICKETS, {
            buildingId,
            dynamicId: this.selectedZone.dynamicId,
          }),
        ];
        const result = await Promise.all(promises);
        result[0].forEach((item) => {
          if (item.priority === "") {
            item.priority = 0;
          }
        });
        this.$store.commit(MutationTypes.SET_DATA, result[0]);
        this.updateSprites(result[0]);
        result[0].forEach((item) => {
          if (item.elementSelected.type === "geographicFloor") {
            this.flooritemsnumber++;
          }
          else if (item.elementSelected.type === "geographicRoom") {
            this.roomitemsnumber++;
          }
          else {
            this.equipementitemsnumber++;
          }
        });
      }
      this.legendItems = [
        {
          title: "Étage",
          color: "red",
          type: "square",
          number: this.flooritemsnumber,
        },
        {
          title: "Salle",
          color: "orange",
          type: "circle",
          number: this.roomitemsnumber,
        },
        {
          title: "Equipement",
          color: "green",
          type: "triangle",
          number: this.equipementitemsnumber,
        },
      ]

      this.pageSate = PAGE_STATES.loaded;
    } catch (err) {
      this.retry = this.retriveData;
      this.pageSate = PAGE_STATES.error;
    }
  }


  startReload() {
    this.reloadData("building");  // Call reloadData initially
    this.startTimer();
  }

  startTimer() {
    clearInterval(this.timer);
    this.progress = 0;

    this.timer = setInterval(() => {
      this.progress += 100 / (this.reloadInterval / 100);
      if (this.progress >= 100) {
        this.reloadData("building");
        this.progress = 0; // Reset the progress after calling reload
      }
    }, 100);
  }
  showNoDataChangedMessage() {
    this.noDataChangedMessage = true;

    // Clear any previous timeout to avoid multiple triggers
    if (this.messageTimeout) clearTimeout(this.messageTimeout);

    this.messageTimeout = setTimeout(() => {
      this.noDataChangedMessage = false;
    }, 3000);
  }

  get progressGradient() {
    return `conic-gradient(#14202c ${this.progress}%, #e0e0e0 ${this.progress}% 100%)`;
  }

  async reloadData(type: "building" | "geographicFloor" | "geographicRoom") {
    // console.log("reload triggered");
    this.$store.dispatch(ActionTypes.REMOVE_CARDS);
    try {
      const buildingId = localStorage.getItem("idBuilding");
      let newData = [];

      if (type === "building") {
        const promises = [
          this.$store.dispatch(ActionTypes.LOAD_TICKETS, {
            buildingId,
            config: this.config,
          }),
        ];
        const result = await Promise.all(promises);
        newData = result[0];
      } else if (type === "geographicFloor" || type === "geographicRoom") {
        const promises = [
          this.$store.dispatch(ActionTypes.FILTER_TICKETS, {
            buildingId,
            dynamicId: this.selectedZone.dynamicId,
          }),
        ];
        const result = await Promise.all(promises);
        newData = result[0];
      }

      // Normalize new data for comparison
      newData.forEach((item) => {
        if (item.priority === "") {
          item.priority = 0;
        }
      });

      // Compare new data with existing data
      if (JSON.stringify(this.data) === JSON.stringify(newData)) {
        console.log("no data changed");
        // this.showNoDataChangedMessage();
      } else {
        this.$store.commit(MutationTypes.SET_DATA, newData);
        this.updateSprites(newData);
        if (!this.isFirstLoad) {
          this.showNoDataChangedMessage();
        }
        // this.showNoDataChangedMessage();
        console.log("data updated successfully");
      }
      this.isFirstLoad = false;
    } catch (err) {
      this.retry = this.retriveData;
      this.pageSate = PAGE_STATES.error;
      console.error("Error during data reload:", err);
    }
  }


  selectDataView(item) {
    this.$emit("clickOnDataView", item);
  }

  showDetails(ticket) {
    this.$emit("display", ticket);
  }
  // regroupTicketsByFloor(to_update) {
  //   const grouped = {};

  //   to_update.forEach((ticket) => {
  //     const elementSelected = ticket.elementSelected;
  //     if (elementSelected && elementSelected.type === "geographicFloor") {
  //       const dynamicId = ticket.dynamicId || "defaultFloorGroup";

  //       if (!grouped[dynamicId]) {
  //         grouped[dynamicId] = {
  //           ticketList: [],
  //         };
  //       }

  //       grouped[dynamicId].ticketList.push(ticket);
  //     }
  //   });

  //   return grouped;
  // }
  unifyData(list) {
    // Extract buildingId and position from the first element
    const buildingId = list[0]?.buildingId || "";
    const position = list[0]?.position || { x: 0, y: 0, z: 0 };
    const dynamicId = list[0]?.dynamicId || 0;

    // Extract all data items into a single list
    const data = list.reduce((accumulator, current) => {
      return accumulator.concat(current.data || []);
    }, []);

    // Return the unified object
    return {
      buildingId,
      position,
      dynamicId, // Set the dynamicId to 4444
      data
    };
  }

  locateTicket(ticket) {
    function findGroupIndexByDynamicId(groups, dynamicId) {
      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const found = group.data.some(ticket => ticket.dynamicId === dynamicId);
        if (found) {
          return i;
        }
      }
      return -1; // Return -1 if not found
    }

    function reorderItems(array, dynamicId) {
      // Find the index of the item with the matching dynamicId
      const index = array.findIndex(item => item.dynamicId === dynamicId);
      if (index > -1) {
        // Move the matching item to the beginning of the array
        const [item] = array.splice(index, 1);
        array.unshift(item);
      }
      return array;
    }

    const dynamicIdToFind = ticket.dynamicId;
    const result = findGroupIndexByDynamicId(this.tickets_with_positions, dynamicIdToFind);

    if (result !== -1) {
      // Reorder the items in the found group
      const group = this.tickets_with_positions[result];
      group.data = reorderItems(group.data, dynamicIdToFind);
      this.callCard(group);
    } else if (result === -1) {
      // Unify and reorder the floor tickets
      const floorItemsCard = this.unifyData(this.floor_tickets_with_positions);
      floorItemsCard.data = reorderItems(floorItemsCard.data, dynamicIdToFind);
      this.callCard(floorItemsCard);
    }

    const buildingId = localStorage.getItem("idBuilding");
    this.$store.commit(MutationTypes.SET_SELECTED_TICKETS, [ticket.dynamicId]);
    this.$store.dispatch(ActionTypes.SELECT_ITEMS, {
      ...ticket.elementSelected,
      buildingId,
    });
    this.$store.dispatch(ActionTypes.SELECT_SPRITES, [
      String(ticket.elementSelected.dynamicId),
    ]);
    const floor = document.querySelector("#floor-sprite");
    floor?.dispatchEvent(new Event("clickExteriorSprite"));
  }

  updateSprites(to_update) {
    const buildingId = localStorage.getItem("idBuilding");
    // console.log("Sprites to_update", to_update);
    // if (this.config.sprites)
    this.$store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);

    if (this.isBuildingSelected) return;

    if (this.config.sprites && !this.isBuildingSelected) {
      const regrouped_tickets = regroupTicketByRoom(to_update);
      const floor_tickets = regroupTicketsByFloor(to_update);
      const items = new Array();
      const floorItems = [];
      for (const key of Object.keys(regrouped_tickets)) {
        if (regrouped_tickets[key]["XYZ center"]) {
          const [X, Y, Z] = regrouped_tickets[key]["XYZ center"].split(";");
          items.push({
            buildingId,
            dynamicId: key,
            data: regrouped_tickets[key].ticketList,
            position: new THREE.Vector3(Number(X), Number(Y), Number(Z)),
          });
        } else {
          items.push({
            buildingId,
            dynamicId: key,
            data: regrouped_tickets[key].ticketList,
            position: new THREE.Vector3(0, 0, 0),
          });
        }
      }
      for (const key of Object.keys(floor_tickets)) {
        floorItems.push({
          buildingId,
          dynamicId: key,
          data: floor_tickets[key].ticketList,
          position: new THREE.Vector3(0, 0, 0),
        });
      }
      this.resetContext(buildingId);
      this.tickets_with_positions = items;
      this.floor_tickets_with_positions = floorItems;
      // console.log("items to ADD SPRITE AS compo", items);
      setTimeout(() => {
        this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
          items: items,
          buildingId: buildingId,
          component: SpriteComponent,
        });
      }, 1000);
      return;
    }
  }
  async resetContext(buildingId: string | null) {
    this.$store.dispatch(ActionTypes.RESET_API_ITERATOR_STORE, {
      buildingId,
    });
    return;
  }
  applyPriorityFilter() {
    this.$store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);
    // console.log("priorities changed", this.sortedTickets());
    this.updateSprites(this.sortedTickets());
    // this.updateSprites(this.stepFilteredTickets());
  }

  handleStepFilterUpdate(newSteps) {
    this.step_filter = newSteps;
  }


  @Watch("selectedZone")
  watchSelectedZone() {
    this.selectedZone.type == "building"
      ? (this.isBuildingSelected = true)
      : (this.isBuildingSelected = false);
    this.retriveData(this.selectedZone.type);
  }

  @Watch("data")
  watchData(newData) {
    // this.updateSprites(newData);
  }

  @Watch("workflow_filter")
  watchWorkflow() {
    this.updateSprites(this.stepFilteredTickets());
  }

  @Watch("domain_filter")
  watchDomain() {
    this.updateSprites(this.stepFilteredTickets());
  }

  @Watch("step_filter")
  watchStep() {
    // console.log('Steps changed', this.stepFilteredTickets());
    this.updateSprites(this.stepFilteredTickets());
  }
  // @Watch("priorities", { deep: true })
  // watchPriorities() {

  // }
}

export { dataSideApp };
export default dataSideApp;
</script>
<style lang="scss">
.noMargin {
  margin: 0 !important;
  padding: 0 !important;
}

.filtres-container {
  border: #14202c20 1px solid;
  padding: 15px 10px;
  margin: 15px 0;
  border-radius: 5px;
}

.filtre-half-holder {
  margin: 0 !important;
  width: 48%;
}

.prio-filtre-text {
  font-size: 13px !important;
}

.dropdown-holder {
  width: calc(100%);
  box-shadow: 0 4px 14px 0 #00000020;
  height: 50px;
  overflow: hidden !important;
  border-radius: 8px;
}

.filtre-title {
  font-size: 12px;
  color: #14202c;
  opacity: 0.8;
  margin-bottom: 5px;
  font-weight: 600;
}

.priority-indicator {
  border-radius: 3px;
  width: 9px;
  height: 24px;
  margin-right: 5px;
  display: inline-block;
}

.row-style {
  align-items: center;
}

.row-style:hover {
  background-color: #f5f5f5;
}

.v-application--is-ltr .v-input--selection-controls__input {
  margin-right: 3px !important;
}

.app-title {
  font-size: 17px;
  font-weight: bold;
  color: #14202c;
}

.app-description {
  font-size: 13px;
  color: #14202c;
  opacity: 0.6;
  margin-top: 5px;
}

.add-ticket-button {
  cursor: pointer;
  background-color: #eaeef0;
  border-radius: 2px;
  justify-content: start;
  align-items: center;
  width: 35%;
  max-height: 60px;
  margin-top: 10px;
  padding: 8px;
  display: flex;
}


.add-ticket-icon {
  background-color: #fff;
  background-image: url(./assets/ticket-key.svg);
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  // margin-left: 10px;
  box-shadow: 0 4px 14px 0 #00000020;

}

.add-ticket-icon:hover {
  height: 44px;
  width: 44px;
}

.add-ticket-text-holder {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  height: 100%;
  padding: 6px 0;
}

.add-ticket-text {
  color: #14202c70;
  font-size: 13px;
  margin-left: 5px;
}

.add-ticket-text-bold {
  color: #14202c;
  font-size: 13px;
  font-weight: bold;
  margin-left: 5px;
}

.card-container {
  font: normal normal normal 11px/13px Charlevoix Pro;
  font-size: 15px !important;
  padding: 20px;
}


@media (max-width: 960px) {
  .inventory-item {
    width: 100%;
  }

  .area {
    transform: translate(10px, -15px);
  }

  .el3d {
    display: none;
  }
}

@media (max-width: 970px) {
  .cardDescription {
    width: 100vw;
  }
}

@media (min-width: 970px) {
  .hide {
    display: none;
    visibility: hidden;
  }
}

@media (max-width: 970px) {
  .hide_inverse {
    display: none !important;
    visibility: hidden !important;
  }

  #floor-sprite {
    display: none !important;
    visibility: hidden !important;
  }
}

html .v-application .primary--text {
  color: #14202c !important;
  caret-color: #14202c !important;
}

// .v-input input::placeholder { 
//   font-size: 14px;
//   /* Adjust the font size */
// }
.v-text-field input::placeholder {
  color: green;
  // font-size: 10px !important;
}

.v-text-field input {
  color: green;
  // font-size: 10px !important;
}

.profil-selec-container {
  position: absolute;
  top: 30px;
  left: -145%;
  z-index: 10;
}

.legend-full-container {
  position: absolute;
  bottom: 0px;
  left: -145%;
  z-index: 10;
}

.reload-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px 0 #00000020;
  cursor: pointer;
  // border: 2px solid #14202c;
  position: relative;

}

.reload-btn-inner {
  background: #fff;
  border-radius: 50%;
  width: 85%;
  height: 85%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.reload-btn-inner:hover {
  transform: rotate(180deg);
}

.v-icon {
  font-size: 24px;
  color: #14202c;
}

.no-data-message {
  position: absolute;
  top: 70px;
  left: 75%;
  transform: translateX(-50%);
  background: orange;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: opacity 0.5s ease-in-out;
}
</style>
