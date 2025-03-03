<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
  <v-app v-if="pageSate === PAGE_STATES.loaded" class="app">
    <div class="selectors">
      <sc-download-button fileName="ticket_data" :data="to_download" csv class="mr-2 DButton"></sc-download-button>
      <div class="space">
        <space-selector ref="space-selector" :open.sync="openSpaceSelector" :maxDepth="2"
          :GetChildrenFct="onSpaceSelectOpen" v-model="selectedZone" label="ESPACE"
          :spaceSelectorItemButtons="spaceSelectorButtons" :viewButtonsType="config.viewButtons"
          @onActionClick="onActionClick" />
      </div>
    </div>

    <div class="dataBody">
      <viewerApp :class="{ 'active3D': isActive3D }" class="viewerContainer"></viewerApp>
      <!-- <div class="legend-full-container">
        <LegendVue :legendItems="legendItems"></LegendVue>
      </div> -->
      <dataSideApp class="appContainer" :DActive="isActive3D" :ActiveData="isActive" :config="config"
        :selectedZone="selectedZone" :data="displayedData" @changeRoute="changeApp" :selectedId="selectedId"
        @clickOnDataView="onDataViewClicked" @display="showDetails" @download="downloadList"
        @buttonClicked="toggleActive" @buttonClicked3D="toggleActive3D" @full3D="full3D()"
        :class="{ 'active': isActive, 'inactive': isActive3D }" @floorData="updateSpriteData">
      </dataSideApp>
    </div>

    <sprite-component v-if="selectedZone && selectedZone.type === 'geographicFloor'" :data="spriteData" style="
        position: absolute;
        z-index: 9;
        left: calc(55%);
        top: 50%;
        width: 35px;
      "></sprite-component>

    <ticketDetails v-if="detailedTicket" style="z-index: 99" v-model="showDialog" @changeRoute="handleRouteChange"
      :detailed-ticket="detailedTicket" :token="token" :baseURL="baseUrl"></ticketDetails>
  </v-app>

  <v-container class="loading" v-else-if="pageSate === PAGE_STATES.loading" fluid>
    <v-progress-circular :size="70" :width="3" color="purple" indeterminate></v-progress-circular>
  </v-container>
</template>

<script lang="ts">
import {
  ISpaceSelectorItem,
  SpaceSelector,
} from "./components/SpaceSelector/index";
import { Vue } from "vue-property-decorator";
import { ActionTypes } from "./interfaces/vuexStoreTypes";
import Component from "vue-class-component";
import type { Store } from "./services/store";
import { MutationTypes } from "./services/store/appDataStore/mutations";
import type {
  IButton,
  IZoneItem,
  TGeoItem,
} from "./components/SpaceSelector/interfaces/IBuildingItem";
import viewerApp from "../../../global-components/viewer/viewer.vue";
import { ViewerButtons } from "./components/SpaceSelector/spaceSelectorButtons";
import { config } from "./config";
import { IConfig } from "./interfaces/IConfig";
import { PAGE_STATES } from "./interfaces/pageStates";
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
} from "spinal-viewer-event-manager";
import { Legend } from "./interfaces/ILegend";

import dataSideApp from "./components/data-side/App.vue";
import ticketDetails from "./components/data-side/TicketDetails.vue";
import LegendVue from "./components/data-side/components/LegendVue.vue";
import SpriteComponent from "./components/data-side/FloorSpriteComponent.vue";
import { SpinalAPI } from "./services/spinalAPI/SpinalAPI";
import { log } from "console";
import { EventBus } from './components/SpaceSelector/eventBus';
const COLORS = ["#FF0000", "#FFA500", "#008000"];
const buildingId = localStorage.getItem("idBuilding") || "";
const token = localStorage.getItem("token") || "";

@Component({
  components: {
    SpaceSelector,
    viewerApp,
    dataSideApp,
    SpriteComponent,
    ticketDetails,
    LegendVue,
  },
})
class App extends Vue {
  PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
  pageSate: PAGE_STATES = PAGE_STATES.loading;
  $store: Store;
  openSpaceSelector: boolean = false;
  openTemporalitySelector: boolean = false;
  config: IConfig = config;
  spaceSelectorButtons: IButton[] = ViewerButtons[config.viewButtons];
  reloadInterval: number;
  dataTable: IZoneItem[] = [];
  $refs: { spaceSelector };
  isActive: boolean = false;
  isActive3D: boolean = false;
  detailedTicket = null;
  showDialog = false;
  token: String = token;
  baseUrl: String = "";
  spriteData: any = {};
  to_download = <any[]>[];
  query: { app: string; mode: string; name: string; spaceSelectedId: string; buildingId: string } = {
    app: '',
    mode: 'null',
    name: '',
    spaceSelectedId: '',
    buildingId: ''
  };
  floor: any = null;
  legendItems: Legend[] = [
    {
      title: "Equipement",
      color: "green",
      type: "triangle",
    },
    {
      title: "Salle",
      color: "orange",
      type: "circle",
    },
    {
      title: "Étage",
      color: "red",
      type: "square",
    },
  ];

  showDetails(ticket) {
    this.detailedTicket = ticket;
    this.showDialog = true;
  }

  async mounted() {

    localStorage.setItem("viewer_loaded", 'initialize');
    if (window.innerWidth < 900) {

      this.isActive = true;
      this.isActive3D = false;
    }


    EventBus.$on('colorRoom', (dynamicId) => {
      const buildingId = localStorage.getItem("idBuilding");
      const itemsToColor = [{
        buildingId: buildingId,
        color: "#24CBD9",
        dynamicId: dynamicId,
        floorId: this.$store.state.appDataStore.zoneSelected.dynamicId,
      }]

      const statviewer = localStorage.getItem("viewer_loaded");
      if (statviewer == "loaded") {
        this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
          items: itemsToColor,
          buildingId: buildingId,
        });
      }
    });


    EventBus.$on('descolorRoom', (dynamicId) => {
      const buildingId = localStorage.getItem("idBuilding");
      const itemsToColor = [{
        buildingId: buildingId,
        color: null,
        dynamicId: dynamicId,
        floorId: this.$store.state.appDataStore.zoneSelected.dynamicId,
      }]

      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: buildingId,
      });

    });


    try {
      this.pageSate = PAGE_STATES.loading;
      this.listenSpritesEvent();
      this.pageSate = PAGE_STATES.loaded;
      this.baseUrl = SpinalAPI.getInstance().createUrlWithPlatformId(
        buildingId,
        "node"
      );
    } catch (error) {
      this.pageSate = PAGE_STATES.error;
    }

    this.$nextTick(() => {
      // this.query.app = "eyJuYW1lIjoidGlja2V0cy1WMiIsInR5cGUiOiJCdWlsZGluZ0FwcCIsImlkIjoiMDc2Ni1jMmVjLTE1NDYtMTk0YTgwYTQ0NjIiLCJkaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzM3OTg2MDU4ODAwLCJpbmRpcmVjdE1vZGlmaWNhdGlvbkRhdGUiOjE3Mzc5ODYwMzI3MzgsImljb24iOiJtZGktYmxhY2stbWVzYSIsImRlc2NyaXB0aW9uIjoiIiwidGFncyI6W10sImNhdGVnb3J5TmFtZSI6IiIsImdyb3VwTmFtZSI6IiIsImhhc1ZpZXdlciI6ZmFsc2UsInBhY2thZ2VOYW1lIjoic3BpbmFsLWFwcC12aWV3ZXItdGlja2V0cy12MiIsImlzRXh0ZXJuYWxBcHAiOmZhbHNlLCJsaW5rIjoiIiwiZG9jdW1lbnRhdGlvbkxpbmsiOiIiLCJyZWZlcmVuY2VzIjp7fSwicGFyZW50Ijp7InBvcnRvZm9saW9JZCI6IjM3ZGUtMDJiOC1lMThiLTE4NTA2NDNiNjhhIiwiYnVpbGRpbmdJZCI6IjU5MzItNjA4Ni05ZTFhLTE4NTA2NDc4NDYwIn19"
      // window.parent.router.query.app = this.query.app
      const currentQuery = { ...window.parent.routerFontion.apps[0]._route.query }
      this.applyURLParam(currentQuery);
    });

  }

  changeApp(e) {
    this.query.app = e
    this.changeRoute();
  }

  applyURLParam(query) {
    this.query.mode = query.mode
    this.query.buildingId = query.buildingId
    this.query.spaceSelectedId = query.spaceSelectedId
    this.query.name = query.name
    this.query.app = query.app

    if (query.mode == "3d") {
      this.isActive3D = true
    } else if (query.mode == "data") {
      this.isActive = true
    }

    if (query.spaceSelectedId) {

      const item = {
        buildingId: query.buildingId,
        dynamicId: query.spaceSelectedId,
      };
      const button = {
        "title": "charger",
        "icon": "mdi-video-3d",
        "onclickEvent": "OPEN_VIEWER",
        "isShownTypes": [
          "geographicFloor"
        ]
      }
      this.onActionClick({ button, item })


      // const itemToSelect = {
      //   "isOpen": false,
      //   "loading": false,
      //   "dynamicId": parseInt(query.spaceSelectedId),
      //   "name": query.name,
      //   "buildingId": query.buildingId,
      //   "parents": [
      //     "5932-6086-9e1a-18506478460"
      //   ],
      //   "type": "geographicFloor",
      //   "staticId": "SpinalNode-6cd64ff8-a126-1aa3-80b7-f9d4fc5690bf-186df7cd2a5"//nan

      // }
      const itemToSelect = {
        isOpen: false,
        loading: false,
        dynamicId: parseInt(query.spaceSelectedId),
        name: query.name,
        buildingId: query.buildingId,
        type: "geographicFloor",
      };


      if (this.$refs['space-selector']) {
        this.$refs['space-selector'].select(itemToSelect);
      }
    }
    this.openSpaceSelector = false;

  }
  changeRoute() {
    window.parent.routerFontion.customPush(
      window.parent.router.path,
      this.query
    );
  }
  replaceRoute() {
    window.parent.routerFontion.customReplace(
      window.parent.router.path,
      this.query
    );
  }
  // handleRouteChange(route) {
  //   this.query.spaceSelectedId = route.dynamicId
  //   this.query.name = route.name
  //   this.changeRoute()
  // }
  handleRouteChange() {
    if (this.isActive3D && !this.isActive) {
      this.query.mode = "3d";
    } else if (!this.isActive3D && this.isActive) {
      this.query.mode = "data";
    } else {
      this.query.mode = "none";
    }
    this.replaceRoute();
  }

  // changeRoute() {
  //   window.parent.routerFontion.customPush(window.parent.router.path, this.query);
  // }

  public get selectedId(): number {
    return this.$store.state.appDataStore.itemSelected?.dynamicId || 0;
  }

  public get selectedZone(): ISpaceSelectorItem {
    return this.$store.state.appDataStore.zoneSelected;
  }

  // public set selectedZone(v: ISpaceSelectorItem) {
  //   this.$store.commit(MutationTypes.SET_SELECTED_ZONE, v);
  // }
  public set selectedZone(v: ISpaceSelectorItem) {
    if (this.query.spaceSelectedId != v.dynamicId.toString()) {
      this.query.name = v.name;
      this.query.buildingId = v.buildingId;
      this.query.spaceSelectedId = v.dynamicId.toString();
      this.replaceRoute();
    }

    if (v.type == "geographicFloor") this.floor = this.query.spaceSelectedId;

    this.$store.commit(MutationTypes.SET_SELECTED_ZONE, v);
  }



  toggleActive() {
    if (this.isActive3D) {
      this.isActive3D = false
    }
    this.isActive = !this.isActive;
    this.handleRouteChange();
  }


  toggleActive3D() {
    if (this.isActive)
      this.isActive = false
    this.isActive3D = !this.isActive3D;
    this.handleRouteChange();
  }

  full3D() {
    if (this.isActive) {
      this.isActive = false
      this.isActive3D = true;
    } else {
      this.isActive = true
      this.isActive3D = false
    }


    this.handleRouteChange();
  }





  downloadList(tickets) {
    this.to_download = tickets.map((t) => {
      return {
        Nom: t.name,
        "Date de création": new Date(t.creationDate).toLocaleDateString("fr"),
        Étape: t.step.name,
        Domaine: t.process.name,
        Déclarant: t.userName || "Unknown",
        bosId: t.staticId,
        gmaoId: t.gmaoId,
        description: t.description,
        targetName: t.elementSelected?.name || "",
        targetId: t.elementSelected?.staticId || 0,
      };
    });
  }

  async onSpaceSelectOpen(item?: ISpaceSelectorItem): Promise<IZoneItem[]> {
    const data = this.$store.state.appDataStore.data || [];
    switch (item?.type) {
      case undefined:
        const buildingId = localStorage.getItem("idBuilding");

        if (buildingId) {
          const playload = {
            config,
            item: { buildingId, type: "building" },
          };
          console.log('il entre cici ??');
          
          const promises = [
            this.$store.dispatch(ActionTypes.GET_BUILDING_BY_ID, { buildingId }),
          ];

          const [building, items] = await Promise.all(promises);

          return [
            {
              name: building.name,
              staticId: building.id,
              categories: [],
              color: "#35CAE5",
              dynamicId: 0,
              type: "building",
            },
          ];
        } else {
          const building = await this.$store.dispatch(
            ActionTypes.GET_BUILDING_INFO,
            {
              buildingId: null,
            }
          );
          return [
            {
              name: building.name,
              staticId: building.id,
              categories: [],
              color: '#35CAE5',
              dynamicId: building.dynamicId,
              type: 'building',
            },
          ];
        }

      case "building":
        return (
          await this.$store.dispatch(ActionTypes.GET_FLOORS, {
            buildingId: item.staticId,
            patrimoineId: item.patrimoineId,
          })
        )
          .map((floor) => {
            const ticket = data.filter(
              (t) =>
                t.elementSelected.position.floor.dynamicId === floor.dynamicId
            );
            return {
              ...floor,
              counts: ticket.length
                ? [0, 1, 2].map((c) => {
                  return {
                    color: COLORS[c],
                    value: ticket.filter((t) => t.priority == c).length,
                  };
                })
                : [],
            };
          })
          .filter((r) => r.counts.length);
      case "geographicFloor":
        return (
          await this.$store.dispatch(ActionTypes.GET_ROOMS, {
            floorId: item.dynamicId,
            buildingId: item.buildingId,
            patrimoineId: item.patrimoineId,
            id: item.dynamicId,
          })
        )
          .map((room) => {
            const ticket = data.filter(
              (t) =>
                t.elementSelected.dynamicId === room.dynamicId ||
                t.elementSelected.position?.room?.dynamicId === room.dynamicId
            );
            return {
              ...room,
              counts: ticket.length
                ? [0, 1, 2].map((c) => {
                  return {
                    color: COLORS[c],
                    value: ticket.filter((t) => t.priority == c).length,
                  };
                })
                : [],
            };
          })
          .filter((r) => r.counts.length);
      default:
        return [];
    }
  }

  async onDataViewClicked(item: TGeoItem | TGeoItem[]) {
    if (!item) return;
    this.$store.commit(MutationTypes.SET_ITEM_SELECTED, item);
    this.$store.dispatch(ActionTypes.SELECT_SPRITES, [item.dynamicId]);
  }

  onActionClick({ button, item }) {

    const data = {
      buildingId: item.buildingId, //important viewer
      // staticId: item.staticId,//can
      // id: item.dynamicId,
      dynamicId: item.dynamicId,//important viewer
      // floorId: item.floorId,//can
      // roomId: item.roomId,//can
      // type: item.type,//can
    };

    switch (button.onclickEvent) {
      case ActionTypes.OPEN_VIEWER:
        this.$store.dispatch(button.onclickEvent, {
          onlyThisModel: true,
          config: this.config,
          item: data,
        });
        break;
      case ActionTypes.ISOLATE_ITEMS:
        this.$store.dispatch(button.onclickEvent, {
          onlyThisModel: true,
          config: this.config,
          item: data,
        });
        break;
      case "OPEN_VIEWER_PLUS":
        this.$store.dispatch(ActionTypes.OPEN_VIEWER, {
          onlyThisModel: false,
          config: this.config,
          item: data,
        });
        break;
      default:
        this.$store.dispatch(button.onclickEvent, data);
        break;
    }
  }

  listenSpritesEvent() {
    const emitterHandler = EmitterViewerHandler.getInstance();
    emitterHandler.on(VIEWER_SPRITE_CLICK, (result: any) => {
      this.$store.commit(MutationTypes.SET_ITEM_SELECTED, result.node);
      if (result.node.dynamicId) {
        const a = document.createElement("a");
        a.setAttribute("href", `#${result.node.dynamicId}`);
        a.click();
      }
    });
  }

  public get displayedData() {
    return this.$store.state.appDataStore.data;
  }

  updateSpriteData(data) {
    this.spriteData = {
      buildingId: this.selectedZone.buildingId,
      dynamicId: this.selectedZone.dynamicId,
      data: data.filter(
        (d) => d.elementSelected.dynamicId === this.selectedZone.dynamicId
      ),
    };
  }

  public getDataFormatted() {
    const d = [this._getHeader(), ...this._getRows(this.displayedData)];
    return d;
  }

  private _getHeader() {
    return {
      id: "id",
      name: "name",
      type: "type",
      value: "value",
    };
  }

  private _getRows(list: any[]) {
    if (!list) return [];

    return list.map(({ color, displayValue, name, staticId, type }) => ({
      name,
      type,
      value: Number.parseFloat(displayValue).toFixed(2),
      id: staticId,
    }));
  }
}

export default App;
</script>

<style scoped lang="scss">
.app {
  width: 100%;
  height: 100%;
  $selectorHeight: 60px;
  overflow: hidden;

  ::v-deep .card-colored {
    background-color: #14202c !important;
    border-radius: 8px !important;
  }

  .selectors {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    top: 5px;
    right: 5px;
    height: $selectorHeight;
    width: 100%;
    border: 1px solid #f5f5f5;
    border-radius: 12px;

    .DButton {
      width: 60px;
      height: 60px;
    }

    @media (max-width: 960px) {
      .DButton {
        display: none;
      }

    }




    .temporality {
      position: relative;
      width: 200px;
      height: $selectorHeight;
    }

    .space {
      position: relative;
      width: 40%;
      height: $selectorHeight;
    }




    @media (max-width: 960px) {
      .space {
        position: relative;
        width: 80%;
        height: $selectorHeight;
        margin-top: 2px;
      }

    }



  }



  .dataBody {
    height: calc(100% - #{$selectorHeight + 30px});
    margin: 75px 8px 0 8px;

    .viewerContainer {
      width: 60%;
      height: 100%;
      float: left;
    }



    .appContainer {
      width: 40%;
      z-index: 7;
      float: right;
      transition: 0.5s;
      position: absolute;
      margin-right: 6px;
      height: 90%;
      right: 0px;
    }

    .active {
      width: 98.5%;
      // height: 100%;
      position: absolute;
      z-index: 7;
      right: 0px;
      margin-right: 6px;
      height: 92%;
    }

    @media (max-width: 960px) {
      .active {
        height: 83vh;
      }

      .inactive {
        height: 83vh !important;
      }
    }

    .inactive {
      // display: none;
      position: absolute;
      width: 0%;
      height: 92%;
      right: 0px;
      transition: 0.1;
    }

    .active3D {
      width: 99vw;
      height: 100%;
      float: left;
      position: absolute;
    }

  }
}

.loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style>
.forge-spinner {
  /* background-color: rgba(146, 70, 70, 0.63) !important; */
  width: 800px !important;
}

.forge-spinner img {
  display: none !important;
}

#app>div>div.dataBody>div.viewer-div-container.viewerContainer>div>div.forge-spinner {
  width: 800px !important;
}

.forge-spinner {
  background: url('./assets/spinalcore.png') center/contain no-repeat !important;
  width: 1500px;
  height: 800px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: transparent;
  height: 100%;
  width: 100%;
}

html {
  overflow-y: hidden !important;
  background: transparent;
}

body {
  margin: 0;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  background: transparent;
}

.app-content {
  width: calc(100% - 16px);
  height: calc(100% - 80px);
  overflow-y: hidden;
  display: flex;
  position: relative;
  margin: 80px 8px 8px 8px;
}

.list-container {
  overflow-y: auto;
  height: calc(100% - 51px);
  padding: 8px;
}

.spinal-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.spinal-scrollbar::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background: rgba(169, 169, 169, 0.9);
}

.spinal-scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

.appContainer .dataContainer .calcul_content .calcul .select .v-text-field.v-text-field--solo .v-input__control {
  min-height: unset !important;
}
</style>
