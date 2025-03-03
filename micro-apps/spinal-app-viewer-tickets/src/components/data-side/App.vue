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


  <v-card elevation="4" class="cardContainer d-flex align-center justify-center">
    <div class="dataContainer d-flex flex-column py-4" style="height: 100%; width: 100%"
      v-if="pageSate === PAGE_STATES.loaded && !isBuildingSelected">
      <div class="d-flex flex-row justify-space-between mt-5 mx-4">
        <v-select color="#14202C" background-color="#eaeef0" style="width: calc(100%)" solo flat @click.stop
          v-model="workflow_filter" label="Tous les workflows" placeholder="Tous les workflows" :items="workflows()"
          append-icon="mdi-chevron-down" clearable clear-icon="mdi-close-circle-outline" multiple menu-props="offset-y">
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


      <div class="d-flex flex-row justify-space-between mx-4">
        <v-select color="#14202C" background-color="#eaeef0" style="max-width: calc(50% - 4px)" solo flat @click.stop
          v-model="domain_filter" label="Tous les domaines" placeholder="Tous les domaines" :items="domains()"
          append-icon="mdi-chevron-down" clearable clear-icon="mdi-close-circle-outline" multiple menu-props="offset-y">
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
        <v-select color="#14202C" background-color="#eaeef0" style="max-width: calc(50% - 4px)" solo flat @click.stop
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
        </v-select>
      </div>
      <!-- SAMPLE -->
      <div class="d-flex flex-column flex-fill overflow-y-auto mx-2">
        <TicketComponent v-for="(d, i) in sortedTickets()" :key="i" :data="d" @locate="locateTicket"
          @display="showDetails" />
      </div>
      <!-- \SAMPLE -->
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

import SpriteComponent from "./SpriteComponent.vue";
import TicketComponent from "./TicketComponent.vue";

@Component({
  components: { TicketComponent },
  filters: {},
})
class dataSideApp extends Vue {
  @Prop() config!: IConfig;
  @Prop() selectedZone: ISpaceSelectorItem;
  @Prop() data: any[];
  @Prop() selectedId: number;
  @Prop() DActive: boolean;
  @Prop() ActiveData: boolean;

  PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
  pageSate: PAGE_STATES = PAGE_STATES.loading;
  isBuildingSelected: boolean = true;
  retry: Function;
  domain_filter = <string[]>[];
  step_filter = <string[]>[];
  workflow_filter = <string[]>[];
  modefull: boolean = false

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

  domainFilteredTickets() {
    if (this.domain_filter.length === 0 || this.data.length === 0)
      return this.workflowsFilteredTickets();
    return this.workflowsFilteredTickets().filter((d) =>
      this.domain_filter.includes(d.process.name)
    );
  }
  steps() {
    return [...new Set(this.domainFilteredTickets().map((t) => t.step.name))];
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
    this.$emit("download", this.stepFilteredTickets());
    this.$emit("floorData", this.stepFilteredTickets());
    return [...this.stepFilteredTickets()].sort(
      (a, b) =>
        a.rank - b.rank ||
        a.priority - b.priority ||
        a.creationDate - b.creationDate
    );
  }

  async mounted() {
    await this.retriveData("building");
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
        this.$store.commit(MutationTypes.SET_DATA, result[0]);
      } else if (type == "geographicFloor" || type == "geographicRoom") {
        const promises = [
          this.$store.dispatch(ActionTypes.FILTER_TICKETS, {
            buildingId,
            dynamicId: this.selectedZone.dynamicId,
          }),
        ];
        const result = await Promise.all(promises);
        this.$store.commit(MutationTypes.SET_DATA, result[0]);
      }
      this.pageSate = PAGE_STATES.loaded;
    } catch (err) {
      this.retry = this.retriveData;
      this.pageSate = PAGE_STATES.error;
    }
  }

  selectDataView(item) {
    this.$emit("clickOnDataView", item);
  }

  showDetails(ticket) {
    this.$emit("display", ticket);
  }

  locateTicket(ticket) {
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

    if (this.config.sprites)
      this.$store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);

    if (this.isBuildingSelected) return;

    if (this.config.sprites && !this.isBuildingSelected) {
      const regrouped_tickets = regroupTicketByRoom(to_update);
      const items = new Array();
      for (const key of Object.keys(regrouped_tickets)) {
        if (regrouped_tickets[key]["XYZ center"]) { // Vérifie si "XYZ center" existe
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

  @Watch("selectedZone")
  watchSelectedZone() {
    this.selectedZone.type == "building"
      ? (this.isBuildingSelected = true)
      : (this.isBuildingSelected = false);
    this.retriveData(this.selectedZone.type);
  }

  @Watch("data")
  watchData(newData) {
    this.updateSprites(newData);
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
    this.updateSprites(this.stepFilteredTickets());
  }
}

export { dataSideApp };
export default dataSideApp;
</script>
<style lang="scss">

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

  #floor-sprite{
    display: none !important;
    visibility: hidden !important; 
  }
}

</style>
