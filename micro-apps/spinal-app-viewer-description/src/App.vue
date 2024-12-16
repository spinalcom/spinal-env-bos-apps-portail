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
        <ScDownloadButton :fileName="'insight_data'" :csv="true" :data="getDataFormatted()" />
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
      <viewerApp :class="{ 'active3D': isActive3D }" class="viewerContainer"></viewerApp>
      <dataSideApp :floor="floor" :DActive="isActive3D" :ActiveData="isActive"
        :class="{ 'active': isActive, 'inactive': isActive3D }" class="appContainer" :config="config"
        :selectedZone="selectedZone" :data="displayedData" @changeRoute="changeApp" @clickOnDataView="onDataViewClicked"
        @buttonClicked="toggleActive" @buttonClicked3D="toggleActive3D" @full3D="full3D()">
      </dataSideApp>
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
} from "../../../global-components/SpaceSelector/index";
import { Vue, Watch } from "vue-property-decorator";
import { ActionTypes } from "./interfaces/vuexStoreTypes";
import Component from "vue-class-component";
import type { Store } from "./services/store";
import { MutationTypes } from "./services/store/appDataStore/mutations";
import type {
  IButton,
  IZoneItem,
  TGeoItem,
} from "../../../global-components/SpaceSelector/interfaces/IBuildingItem";
import viewerApp from "../../../global-components/viewer/viewer.vue";
import ScDownloadButton from "spinal-components/src/components/DownloadButton.vue";
import { ViewerButtons } from "../../../global-components/SpaceSelector/spaceSelectorButtons";
import { config } from "./config";
import { IConfig } from "./interfaces/IConfig";
import { PAGE_STATES } from "./interfaces/pageStates";
import { EventBus } from '../../../global-components/SpaceSelector/eventBus';
import { ViewerManager } from '../../../global-components/viewer';
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
  VIEWER_AGGREGATE_SELECTION_CHANGED,
} from "spinal-viewer-event-manager";
// import { EventBus } from './bus';

import {
  VIEWER_REM_SPHERE,

} from "spinal-viewer-event-manager";

import "spinal-components/dist/spinal-components.css";

import dataSideApp from "./components/data-side/App.vue";


interface IItemData {
  platformId: string;
  id: number | number[];
}

interface IItemDatatmp {
  platformId: string;
  id: Set<number>;
}

@Component({
  components: {
    SpaceSelector,
    viewerApp,
    ScDownloadButton,
    dataSideApp
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
  isActive: boolean = false;
  isActive3D: boolean = false;
  dataTable: IZoneItem[] = [];
  viewerManager: ViewerManager | undefined = undefined;
  $refs: { spaceSelector };
  query: { app: string; mode: string; name: string; spaceSelectedId: string;spaceSelectedType: string; buildingId: string } = {
    app: '',
    mode: 'null',
    name: '',
    spaceSelectedId: '',
    buildingId: ''
  };
  firstCOlor: boolean = false;
  coloredRoom: null
  floor: any = null
  async mounted() {
    localStorage.setItem("viewer_loaded", 'initialize');
    this.viewerManager = ViewerManager.getInstance();
    this.RemoveEventHandlers();

    EventBus.$on('colorRoom', (dynamicId) => {

      const buildingId = localStorage.getItem("idBuilding");
      const itemsToColor = [{
        buildingId: buildingId,
        color: "#24CBD9",
        dynamicId: dynamicId,
        floorId: this.$store.state.appDataStore.zoneSelected.dynamicId,
      }]

      if (this.firstCOlor == false) {
        this.firstCOlor = true
      } else {

        const statviewer = localStorage.getItem("viewer_loaded");
        if (statviewer == "loaded") {
          this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
            items: itemsToColor,
            buildingId: buildingId,
          });
        }
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


    if (window.innerWidth < 900) {
      this.isActive = true;
      this.isActive3D = false;
    }

    try {
      this.pageSate = PAGE_STATES.loading;
      this.listenSpritesEvent();
      this.pageSate = PAGE_STATES.loaded;
    } catch (error) {
      this.pageSate = PAGE_STATES.error;
    }

    this.$nextTick(() => {

      // this.query.app = this.config.idAppDescription

      // window.parent.router.query.app = this.query.app

      const currentQuery = { ...window.parent.routerFontion.apps[0]._route.query }
      this.applyURLParam(currentQuery);
    });
  }

  RemoveEventHandlers() {
    const emitterHandler = EmitterViewerHandler.getInstance();
    emitterHandler.off(VIEWER_REM_SPHERE);
    emitterHandler.off(VIEWER_SPRITE_CLICK);
  }



  changeApp(e) {
    this.query.app = e
    this.changeRoute();
  }

  public get selectedZone(): ISpaceSelectorItem {
    return this.$store.state.appDataStore.zoneSelected;
  }

  public set selectedZone(v: ISpaceSelectorItem) {
    if (this.query.spaceSelectedId != v.dynamicId.toString()) {
      this.query.name = v.name
      this.query.buildingId = v.buildingId
      this.query.spaceSelectedId = v.dynamicId.toString()
      this.query.spaceSelectedType = v.type;
      this.replaceRoute();
    }

    // if (v.dynamicId == 0) {
    //   this.query.spaceSelectedId = '24063840'
    //   this.replaceRoute();
    // }
    if (v.type == "geographicFloor")
      this.floor = this.query.spaceSelectedId

    this.$store.commit(MutationTypes.SET_SELECTED_ZONE, v);
  }

  public get temporalitySelected(): ISpaceSelectorItem {
    return this.$store.state.appDataStore.temporalitySelected;
  }

  public set temporalitySelected(v: ISpaceSelectorItem) {
    this.$store.commit(MutationTypes.SET_TEMPORALITY, v);
  }

  applyURLParam(query) {

    this.query.mode = query.mode
    this.query.buildingId = query.buildingId
    this.query.spaceSelectedId = query.spaceSelectedId
    this.query.spaceSelectedType = query.spaceSelectedType;
    this.query.name = query.name
    this.query.app = query.app

    if (query.mode == "3d") {
      this.isActive3D = true
    } else if (query.mode == "data") {
      this.isActive = true
    }
    // console.warn(query.spaceSelectedId);


    if (query.spaceSelectedId) {

      const item = {
        buildingId: query.buildingId,
        dynamicId: query.spaceSelectedId,
        type: query.spaceSelectedType,
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

      const itemToSelect = {
        "isOpen": false,
        "loading": false,
        "dynamicId": parseInt(query.spaceSelectedId),
        "name": query.name,
        "buildingId": query.buildingId,
        type: query.spaceSelectedType,
      }
      // this.$refs['space-selector'].getButton();

      if (this.$refs['space-selector']) {
        this.$refs['space-selector'].select(itemToSelect);
      }
    }
    this.openSpaceSelector = false
  }

  replaceRoute() {
    window.parent.routerFontion.customReplace(window.parent.router.path, this.query);
  }
  changeRoute() {
    window.parent.routerFontion.customPush(window.parent.router.path, this.query);
  }


  toggleActive(value) {
    if (this.isActive3D) {
      this.isActive3D = false
    }
    this.isActive = !this.isActive;
    if (value === 'vueDoc') {
      this.isActive = true
      this.isActive3D = false
      this.query.mode = 'data'
    } else if (value === 'vueDocClose') {
      this.isActive = false
      this.isActive3D = false
      this.query.mode = 'none'
    }
    else {
      this.handleRouteChange();
    }

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

  async onSpaceSelectOpen(item?: ISpaceSelectorItem): Promise<IZoneItem[]> {

    switch (item?.type) {
      case undefined:

        const buildingId = localStorage.getItem("idBuilding");
        if (buildingId) {
          const playload = {
            config,
            item: { buildingId, type: "building" },
          };

          const promises = [
            this.$store.dispatch(ActionTypes.GET_BUILDING_BY_ID, { buildingId }),
          ];

          const [building, items] = await Promise.all(promises);

          const realBuilding = await this.$store.dispatch(
            ActionTypes.GET_BOS_BUILDING,
            { buildingId }
          )
          return [
            {
              name: realBuilding.name,
              staticId: building.id,
              categories: [],
              color: realBuilding.color,
              dynamicId: realBuilding.dynamicId,
              type: 'building',
            },
          ];
        } else {
          const building = await this.$store.dispatch(
            ActionTypes.GET_BUILDING_INFO,
            {
              buildingId: null,
            }
          );
          console.log(building);
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
        return config.temporality.map((temp, index) => ({
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
  }


  async onColor(item: TGeoItem | TGeoItem[]) {
    // TBD
  }



  onActionClick({ button, item }) {
    // const data = {
    //   "isOpen": false,
    //   "loading": false,
    //   "dynamicId": 44035200,
    //   "name": "194-Hall d'accueil",
    //   "buildingId": "5932-6086-9e1a-18506478460",
    //   "type": "geographicFloor"
    // }

    const buildingId = localStorage.getItem("idBuilding");


    const data = {
      "isOpen": false,
      "loading": false,
      buildingId: buildingId, //important viewer
      // staticId: item.staticId,//can
      // id: item.dynamicId,
      dynamicId: item.dynamicId,//important viewer
      parents: item.parents,
      // floorId: item.floorId,//can
      // roomId: item.roomId,//can
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
      if (result.navigate) {

        this.query.spaceSelectedId = result.node.dynamicId
        this.query.name = result.node.name
        this.query.buildingId = result.node.buildingId


        const item = {
          buildingId: result.node.buildingId,
          dynamicId: result.node.dynamicId,
          name: result.node.name
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

        const itemToSelect = {
          "isOpen": false,
          "loading": false,
          "dynamicId": result.node.dynamicId,
          "name": result.node.name,
          "buildingId": result.node.buildingId,
          "type": "geographicFloor",
        }

        if (this.$refs['space-selector']) {
          this.$refs['space-selector'].select(itemToSelect);
          // this.$refs['space-selector'].closeItem(itemToSelect);
        }
        this.openSpaceSelector = false
      }
      else if (result.node?.dynamicId) {
        const a = document.createElement("a");
        a.setAttribute("href", `#${result.node.dynamicId}`);
        a.click();
      }

    });
  }

  public get displayedData() {
    return this.$store.state.appDataStore.data;
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

  handleRouteChange() {
    if (this.isActive3D && !this.isActive) {
      this.query.mode = '3d'
    } else if (!this.isActive3D && this.isActive) {
      this.query.mode = 'data'
    } else {
      this.query.mode = 'none'
    }
    this.replaceRoute();
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
      transform: translate(-50px, 0px);
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
    margin: 80px 8px 0 8px;

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
      height: 91%;
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
