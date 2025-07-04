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
      <div class="DButton">

      </div>
      <div class="customButton" @click="toggleCustomDiv">
        <!-- Your button content -->
        <div class="download-icon"></div>
        <div v-if="isCustomDivOpen" class="customDivContainer">
          <!-- Close button -->
          <button class="closeButton">X</button>

          <!-- Three divs with items -->
          <div class="customDivItem">
            <span>Données</span>
            <div class="icons-container">
              <div class="download-icons icon-csv">
                <ScDownloadButton :fileName="'insight_data'" :csv="true" :data="getDataFormatted()"
                  style="opacity: 0;" />
              </div>
              <div class="download-icons icon-json"></div>
            </div>
          </div>
          <div style="width: 100%; height: 2px; background-color: #14202c; margin: 10px 0px;"></div>
          <div class="customDivItem">
            <span>Graph</span>
            <div class="icons-container">
              <div class="download-icons icon-pdf"></div>
              <div class="download-icons icon-html"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="temporality">
        <space-selector :edge="false" ref="space-selector2" :open.sync="openTemporalitySelector"
          :GetChildrenFct="onTemporalitySelectOpen" :maxDepth="0" v-model="temporalitySelected" label="TEMPORALITÉ" />
      </div>

      <div class="space">
        <space-selector ref="space-selector" :open.sync="openSpaceSelector" :maxDepth="2"
          :GetChildrenFct="onSpaceSelectOpen" v-model="selectedZone" label="ESPACE"
          :spaceSelectorItemButtons="spaceSelectorButtons" :viewButtonsType="config.viewButtons"
          @onActionClick="onActionClick" />
      </div>
    </div>

    <div class="dataBody">
      <viewerApp :class="{ active3D: isActive3D }" class="viewerContainer"></viewerApp>
      <div class="bottom-container">
        <LegendVue :listItem="legendSpaceAssignation"></LegendVue>
      </div>
      <dataSideApp :DActive="isActive3D" :ActiveData="isActive" :class="{ active: isActive, inactive: isActive3D }"
        class="appContainer" :config="config" :selectedZone="selectedZone" :data="displayedData"
        @changeRoute="changeApp" @clickOnDataView="onDataViewClicked" @buttonClicked="toggleActive"
        @buttonClicked3D="toggleActive3D"></dataSideApp>
    </div>
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
import { Vue, Watch } from "vue-property-decorator";
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
import ScDownloadButton from "spinal-components/src/components/DownloadButton.vue";
import { ViewerButtons } from "./components/SpaceSelector/spaceSelectorButtons";
// import { config } from "./config";
import { IConfig } from "./interfaces/IConfig";
import { PAGE_STATES } from "./interfaces/pageStates";
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
} from "spinal-viewer-event-manager";

import "spinal-components/dist/spinal-components.css";

import dataSideApp from "./components/data-side/App.vue";
import { Legend } from "./interfaces/ILegend";
import LegendVue from "./components/data-side/Legend.vue";
import { EventBus } from "./components/data-side/EventBus";
import jsPDF from "jspdf";

interface IItemData {
  platformId: string;
  id: number | number[];
}

interface IItemDatatmp {
  platformId: string;
  id: Set<number>;
}
const imageMapping = {
  Default: require("./components/viewer/assets/typologie-icons/default.png"),
  Luminaire: require("./components/viewer/assets/typologie-icons/luminaire.png"),
  Store: require("./components/viewer/assets/typologie-icons/store.png"),
  Automate: require("./components/viewer/assets/typologie-icons/automate.png"),
  Multicapteurs: require("./components/viewer/assets/typologie-icons/multicapteurs.png"),
  "Ventilo-Convecteur": require("./components/viewer/assets/typologie-icons/ventilo-convecteur.png"),
  "Contact feuillure": require("./components/viewer/assets/typologie-icons/contact-feuillure.png"),
  "Position de travail": require("./components/viewer/assets/typologie-icons/position-travail.png"),
};


@Component({
  components: {
    SpaceSelector,
    viewerApp,
    ScDownloadButton,
    dataSideApp,
    LegendVue,
  },
})
class App extends Vue {
  PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
  pageSate: PAGE_STATES = PAGE_STATES.loading;
  $store: Store;
  openSpaceSelector: boolean = false;
  openTemporalitySelector: boolean = false;
  config: IConfig = {
    ...this.configStore,
    imageMapping
  };

  spaceSelectorButtons: IButton[] = ViewerButtons[this.config.viewButtons];

  dataTable: IZoneItem[] = [];
  $refs: { spaceSelector };
  isActive: boolean = false;
  isActive3D: boolean = false;
  query: {
    app: string;
    mode: string;
    name: string;
    spaceSelectedId: string;
    buildingId: string;
    config: string
  } = {
      app: "",
      mode: "null",
      name: "",
      spaceSelectedId: "",
      buildingId: "",
      config: ''
    };
  floor: any = null;
  legendSpaceAssignation: Legend[] = [
    // {
    //   title: "Automate 'Noeud parent'",
    //   color: "#00c2d1",
    //   type: "Not-assigned",
    // },
    {
      title: "Equipement Inactif",
      color: "#d7270c",
      type: "border",
    },
    {
      title: "Lien vers le fils 'selectionné'",
      color: "#00ff00",
      type: "line",
    },
    {
      title: "Lien vers le père 'selectionné'",
      color: "#0000FF",
      type: "line",
    },
  ];
  isCustomDivOpen: boolean = false;
  toggleCustomDiv() {
    this.isCustomDivOpen = !this.isCustomDivOpen;
  }
  async mounted() {
    try {
      this.pageSate = PAGE_STATES.loading;
      this.listenSpritesEvent();
      this.pageSate = PAGE_STATES.loaded;
    } catch (error) {
      this.pageSate = PAGE_STATES.error;
    }
    this.$nextTick(() => {
      this.query.app =
        "eyJuYW1lIjoiRGVzY3JpcHRpb24iLCJ0eXBlIjoiQnVpbGRpbmdBcHAiLCJpZCI6ImRhZGUtYTljYi1lMzc5LTE4ZjBmZGExZTI1IiwiZGlyZWN0TW9kaWZpY2F0aW9uRGF0ZSI6MTcxMzk1NzkyMTg4NiwiaW5kaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzEzOTU3OTAzOTA5LCJpY29uIjoibWRpLWJvb2staW5mb3JtYXRpb24tdmFyaWFudCIsImRlc2NyaXB0aW9uIjoic3BpbmFsLWVudi1wYW0tdmlld2VyLWFwcC1kZXNjcmlwdGlvbiIsInRhZ3MiOlsiRGVzY3JpcHRpb24iXSwiY2F0ZWdvcnlOYW1lIjoiIiwiZ3JvdXBOYW1lIjoiIiwiaGFzVmlld2VyIjpmYWxzZSwicGFja2FnZU5hbWUiOiJzcGluYWwtZW52LXBhbS12aWV3ZXItYXBwLWRlc2NyaXB0aW9uIiwiaXNFeHRlcm5hbEFwcCI6ZmFsc2UsImxpbmsiOiIiLCJyZWZlcmVuY2VzIjp7fSwicGFyZW50Ijp7InBvcnRvZm9saW9JZCI6IjM3ZGUtMDJiOC1lMThiLTE4NTA2NDNiNjhhIiwiYnVpbGRpbmdJZCI6IjU5MzItNjA4Ni05ZTFhLTE4NTA2NDc4NDYwIn19";
      const currentQuery = {
        ...window.parent.routerFontion.apps[0]._route.query,
      };
      this.applyURLParam(currentQuery);
    });
  }
  getPatrimoineId() {
    const patrimoineString = localStorage.getItem("patrimoine");
    return patrimoineString ? JSON.parse(patrimoineString).id : null;
  }

  // navigation

  changeApp(e) {
    this.query.app = e;
    // console.log("changeApp", e);
    this.changeRoute();
  }

  public get selectedZone(): ISpaceSelectorItem {
    return this.$store.state.appDataStore.zoneSelected;
  }

  // public set selectedZone(v: ISpaceSelectorItem) {
  //   this.$store.commit(MutationTypes.SET_SELECTED_ZONE, v);

  //   // if (v.type.includes("geographic")) {
  //   //   this.$store.dispatch(ActionTypes.OPEN_VIEWER, v);
  //   // }
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

  public get temporalitySelected(): ISpaceSelectorItem {
    return this.$store.state.appDataStore.temporalitySelected;
  }
  public get hardwareList() {
    return this.$store.state.appDataStore.hardwareList;
  }

  public set temporalitySelected(v: ISpaceSelectorItem) {
    this.$store.commit(MutationTypes.SET_TEMPORALITY, v);
  }
  applyURLParam(query) {
    this.query.mode = query.mode;
    this.query.buildingId = query.buildingId;
    this.query.spaceSelectedId = query.spaceSelectedId;
    this.query.name = query.name;
    this.query.app = query.app;
    this.query.config = query.config;

    if (query.mode == "3d") {
      this.isActive3D = true;
    } else if (query.mode == "data") {
      this.isActive = true;
    }
    // console.warn(query.spaceSelectedId);

    if (query.spaceSelectedId) {
      const item = {
        buildingId: query.buildingId,
        dynamicId: query.spaceSelectedId,
      };
      const button = {
        title: "charger",
        icon: "mdi-video-3d",
        onclickEvent: "OPEN_VIEWER",
        isShownTypes: ["geographicFloor"],
      };
      this.onActionClick({ button, item });

      // const itemToSelect = {
      //   isOpen: false,
      //   loading: false,
      //   dynamicId: parseInt(query.spaceSelectedId),
      //   name: query.name,
      //   buildingId: query.buildingId,
      //   parents: ["5932-6086-9e1a-18506478460"],
      //   type: "geographicFloor",
      //   staticId: "SpinalNode-6cd64ff8-a126-1aa3-80b7-f9d4fc5690bf-186df7cd2a5", //nan
      // };

      const itemToSelect = {
        isOpen: false,
        loading: false,
        dynamicId: parseInt(query.spaceSelectedId),
        name: query.name,
        buildingId: query.buildingId,
        type: "geographicFloor",
      };

      if (this.$refs["space-selector"]) {
        this.$refs["space-selector"].select(itemToSelect);
      }
    }
    this.openSpaceSelector = false;
  }
  replaceRoute() {
    window.parent.routerFontion.customReplace(
      window.parent.router.path,
      this.query
    );
  }
  changeRoute() {
    window.parent.routerFontion.customPush(
      window.parent.router.path,
      this.query
    );
  }
  toggleActive() {
    if (this.isActive3D) {

      this.isActive3D = false;
    }
    this.isActive = !this.isActive;
    if (!this.isActive) {
      EventBus.$emit('deactivate-fullscreen');
    }
    this.handleRouteChange();
  }

  toggleActive3D() {
    if (this.isActive) this.isActive = false;
    this.isActive3D = !this.isActive3D;
    this.handleRouteChange();
  }
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

  async onSpaceSelectOpen(item?: ISpaceSelectorItem): Promise<IZoneItem[]> {
    switch (item?.type) {
      case undefined:
        const buildingId = localStorage.getItem("idBuilding");
        const playload = {
        config:  this.config,
          item: { buildingId, type: "building" },
        };

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
      case "building":
        return await this.$store.dispatch(ActionTypes.GET_FLOORS, {
          buildingId: item.staticId,
          patrimoineId: item.patrimoineId,
        });
      case "geographicFloor":
        //@ts-ignore
        return await this.$store.dispatch(ActionTypes.GET_ROOMS, {
          floorId: item.dynamicId,
          buildingId: item.buildingId,
          patrimoineId: item.patrimoineId,
          id: item.dynamicId,
        });
      default:
        return [];
    }
  }

  onTemporalitySelectOpen(item?: any) {
    switch (item?.type) {
      case undefined:
        return this.config.temporality.map((temp, index) => ({
          name: temp,
          staticId: index,
          dynamicId: index,
          level: 0,
          isOpen: true,
          loading: false,
          parents: [],
          drawLink: [],
          haveChildren: false,
          type: "time",
        }));

      default:
        return [];
    }
  }

  onGoBack() {
    const parent = this.$refs["space-selector"].getParentOfSelected();
    if (parent) this.selectedZone = parent;
  }

  private getItemData(item: TGeoItem | TGeoItem[]): IItemData {
    const res: IItemDatatmp = {
      platformId: this.selectedZone.platformId,
      id: new Set(),
    };
    const datas = Array.isArray(item) ? item : [item];
    for (const data of datas) {
      res.id.add(data.dynamicId!);
    }
    return {
      platformId: res.platformId,
      id: res.id.size > 0 ? Array.from(res.id) : res.id.values().next().value,
    };
  }

  async onDataViewClicked(item: TGeoItem | TGeoItem[]) {
    if (!item) return;
    this.$store.commit(MutationTypes.SET_ITEM_SELECTED, item);
    this.$store.dispatch(ActionTypes.SELECT_SPRITES, [item.dynamicId]);
    console.log("onDataViewClicked", item);
  }

  async onColor(item: TGeoItem | TGeoItem[]) {
    // TBD
  }

  onActionClick({ button, item }) {
    // TOBACK
    const data = {
      buildingId: item.buildingId,
      staticId: item.staticId,
      id: item.dynamicId,
      dynamicId: item.dynamicId,
      floorId: item.floorId,
      roomId: item.roomId,
      type: item.type,
    };

    switch (button.onclickEvent) {
      case ActionTypes.OPEN_VIEWER:
        this.$store.dispatch(button.onclickEvent, {
          onlyThisModel: true,
          config: this.config,
          item: data,
        });
        break;
      // case "OPEN_VIEWER_PLUS":
      //   this.$store.dispatch(ActionTypes.OPEN_VIEWER, {
      //     onlyThisModel: false,
      //     config: this.config,
      //     item: data,
      //   });
      //   break;
      // default:
      //   this.$store.dispatch(button.onclickEvent, data);
      //   break;
    }
  }

  listenSpritesEvent() {
    const emitterHandler = EmitterViewerHandler.getInstance();
    emitterHandler.on(VIEWER_SPRITE_CLICK, (result: any) => {
      // this.$store.commit(MutationTypes.SET_ITEM_SELECTED, result.node);
      if (result.navigate) {
        this.query.spaceSelectedId = result.node.dynamicId;
        this.query.name = result.node.name;
        this.query.buildingId = result.node.buildingId;

        const item = {
          buildingId: result.node.buildingId,
          dynamicId: result.node.dynamicId,
          name: result.node.name,
        };
        const button = {
          title: "charger",
          icon: "mdi-video-3d",
          onclickEvent: "OPEN_VIEWER",
          isShownTypes: ["geographicFloor"],
        };
        this.onActionClick({ button, item });

        const itemToSelect = {
          isOpen: false,
          loading: false,
          dynamicId: result.node.dynamicId,
          name: result.node.name,
          buildingId: result.node.buildingId,
          type: "geographicFloor",
        };

        if (this.$refs["space-selector"]) {
          this.$refs["space-selector"].select(itemToSelect);
        }

        // // this.replaceRoute();

        // const item = {
        //   buildingId: result.node.buildingId,
        //   dynamicId:  result.node.dynamicId,
        // };
        // const button = {
        //   "title": "charger",
        //   "icon": "mdi-video-3d",
        //   "onclickEvent": "OPEN_VIEWER",
        //   "isShownTypes": [
        //     "geographicFloor"
        //   ]
        // }
        // this.onActionClick({ button, item })
      } else if (result.node?.dynamicId) {
        const a = document.createElement("a");
        a.setAttribute("href", `#${result.node.dynamicId}`);
        a.click();
      }
    });
  }

  public get displayedData() {
    return this.$store.state.appDataStore.data;
  }


  public get configStore() {
    return this.$store.state.appDataStore.appConfig;
  }

  public getDataFormatted() {
    // color displayedValue name staticId type
    const d = [this._getHeader(), ...this._getRows(this.displayedData)];
    return d;
  }

  private _getHeader() {
    return {
      id: "id",
      name: "name",
      type: "type",
      value: "Réseaux",
      status: "status",
    };
  }

  private _getRows(list: any[]) {
    if (!list) return [];

    return list.map(
      ({ color, displayValue, name, staticId, type, status }) => ({
        name,
        type,
        value: Number.parseFloat(displayValue).toFixed(2),
        staticId,
        status,
      })
    );
  }

  @Watch("hardwareList", { immediate: true })
onHardwareListChange(newList: Array<{ title: string; color: string; type: string }>) {
  if (!Array.isArray(newList)) return;
  // recupérer la liste actuelle de la légende
  const currentLegend = this.legendSpaceAssignation.filter((legend) =>  legend.new !== true);

  // Créer une nouvelle version propre et synchronisée de la légende
  const updatedLegend: typeof this.legendSpaceAssignation = [];

  newList.forEach((item) => {
    const existing = this.legendSpaceAssignation.find(
      (legend) => legend.title === item.title && legend.type === item.type
    );

    if (!existing) {
      // ➕ Nouvel item
      updatedLegend.push({
        title: item.title,
        color: item.color,
        type: item.type,
        new: true,
      });
    } else {
      // ✏️ Item existant : mise à jour de la couleur si elle a changé
      updatedLegend.push({
        title: item.title,
        color: item.color,
        type: item.type,
      });
    }
  });

  // Ajouter les items existants qui ne sont pas dans la nouvelle liste
  currentLegend.forEach((legend) => {
    if (!updatedLegend.some((item) => item.title === legend.title && item.type === legend.type)) {
      updatedLegend.push({
        title: legend.title,
        color: legend.color,
        type: legend.type,
      });
    }
  });
  // 🔄 Remplace l’ancienne légende par la nouvelle synchronisée
  this.legendSpaceAssignation = updatedLegend;
}


}

export default App;
</script>


<style scoped lang="scss">
.app {
  width: 100%;
  height: 100%;

  $selectorHeight: 60px;

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
      z-index: 1;
    }

    .temporality {
      position: relative;
      width: 200px;
      height: $selectorHeight;
    }

    .space {
      position: relative;
      width: 43%;
      height: $selectorHeight;
    }
  }

  .dataBody {
    height: calc(100% - #{$selectorHeight + 30px});
    margin: 80px 8px 0 8px;
    overflow: hidden;

    .viewerContainer {
      width: 57%;
      height: 100%;
      float: left;
    }

    .appContainer {
      width: 43%;
      height: 100%;
      float: right;
      transition: 0.5s;
      position: absolute;
      margin-right: 6px;
      height: 92%;
      right: 0px;
      z-index: 3;
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

    .inactive {
      // display: none;
      position: absolute;
      width: 0%;
      // display: none;
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

.customButton {
  width: 60px;
  height: 60px;
  background-color: #14202c;
  display: flex;
  align-items: center;
  justify-content: center;
  // font-size: 14px;
  // margin-left: 10px;
  cursor: pointer;
  border-radius: 10px;
  position: relative;
}

.customDivContainer {
  z-index: 11;
  background-color: #f1f1f1;
  // border: 1px solid #ddd;
  border-radius: 8px;
  border: 1px solid gray;
  width: 250px;
  color: #14202c;
  font-size: 1rem;
  padding: 10px;
  position: absolute;
  top: 20px;
  left: 50px;
  box-shadow: 0 4px 6px #0000001a;
}

.customDivItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 15px;
}

.customDivItem span {
  font-size: 16px;
  font-weight: 500;
}

.download-icons {
  height: 34px;
  width: 34px;
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2px;
  border: #14202c 1px solid;
  border-radius: 4px;
  margin-left: 5px;
}

.download-icons:hover {
  background-color: #14202c;
}

.closeButton {
  position: absolute;
  top: -10px;
  right: -10px;
  color: white;
  border: 1px solid gray;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  background-color: #14202c;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  font-size: 13px;
  font-weight: bold;
  display: flex;
}

.download-icon {
  background-image: url("./components/data-side/assets/download-white.svg");
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
  width: 70%;
  height: 70%;
  border: 1px solid white;
  border-radius: 6px;
}

.icons-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 30%;
  height: 34px;
}



.icon-csv {
  background-image: url("./components/data-side/assets/csv.svg");
}

.icon-pdf {
  background-image: url("./components/data-side/assets/pdf.svg");
}

.icon-json {
  background-image: url("./components/data-side/assets/json.svg");
}

.icon-html {
  background-image: url("./components/data-side/assets/html.svg");
}
</style>

<style>
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

.bottom-container {
  position: absolute;
  bottom: 0em;
  left: 0em;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  /* width: 100%;
  height: 100%; */
}
</style>
