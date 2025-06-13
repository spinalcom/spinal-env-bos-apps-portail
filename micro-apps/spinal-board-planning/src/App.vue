
<template>
  <v-app id="application" class="v-app">
    <div class="selectors">
      <div class="Hx1">
        <space-selector ref="space-selector" :open.sync="openSpaceSelector" :maxDepth="2"
          :GetChildrenFct="onSpaceSelectOpen" v-model="defaultSelected" label="ESPACE" />
      </div>
      <div class="Hx2">
        <space-selector :edge="false" v-if="defaultSelectedTime.name && defaultSelectedTime.name != ''"
          ref="space-selector2" :open.sync="openTimeSelector" :maxDepth="0" :GetChildrenFct="onTimeSelectOpen"
          v-model="selectedTime" />
      </div>
    </div>
    <MicroApp :temporality="selectedTime" :space="defaultSelected" style="margin-top: 80px !important" />
  </v-app>
</template>

<script lang="ts">
import { getBuildingName } from "./services/getBuilding";
import {
  ISpaceSelectorItem,
  SpaceSelector,
} from './components/SpaceSelector/index';
import { Vue } from 'vue-property-decorator';
import {
  ActionTypes,
} from './services/store/appDataStore/actions';
import Component from 'vue-class-component';
import type { Store } from './services/store';
import { MutationTypes } from './services/store/appDataStore/mutations';
import type {
  IZoneItem,
  TGeoItem,
} from './components/SpaceSelector/interfaces/IBuildingItem';
import MicroApp from './components/Main.vue';
import { getBuilding, getFloors, getRooms } from './services/getBuilding.js';
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
    MicroApp
  },
})

class App extends Vue {
  building !: any;
  selectedFloor = '';
  $store!: Store;
  openSpaceSelector = false;
  openTimeSelector = false;
  dataTable: IZoneItem[] = [];
  $refs!: { spaceSelector: any };
  defaultSelected = {
    platformId: '',
    name: 'Building',
    staticId: '1',
    color: '',
    dynamicId: 0,
    type: 'geographicBuilding',
    level: 0,
    isOpen: true,
    loading: false,
    patrimoineId: 'patrimoineId',
    parents: [],
    isLastInGrp: true,
    drawLink: [],
    haveChildren: true,
  } as ISpaceSelectorItem;
  defaultSelectedTime = {
    name: 'Jour',
    loading: false,
    parents: [],
    haveChildren: false
  }

  selectedTime = {
    name: 'Jour',
    staticId: 'Mois',
    dynamicId: 2,
    level: 1,
    isOpen: true,
    loading: false,
    patrimoineId: 'Mois',
    parents: [],
    isLastInGrp: true,
    drawLink: [],
    haveChildren: false,
  };

  public get selectedZone(): ISpaceSelectorItem {
    return this.$store.state.appDataStore.zoneSelected;
  }

  public set selectedZone(v: ISpaceSelectorItem) {
    this.selectedFloor = v.name;
    this.$store.commit(MutationTypes.SET_SELECTED_ZONE, v);
  }

  async mounted() {
    this.building = await getBuilding();

    const patrimoine = localStorage.getItem("patrimoine");
    let patrimoineObject = JSON.parse(patrimoine!);
    const idBuilding = localStorage.getItem("idBuilding");
    const buildingName = await getBuildingName(idBuilding)

    this.defaultSelected.name = buildingName;
    this.selectedZone = this.defaultSelected;
  }

  onTimeSelectOpen(item?: any): { name: string; staticId: string; dynamicId: number; level: number; isOpen: boolean; loading: boolean; patrimoineId: string; parents: never[]; isLastInGrp: boolean; drawLink: never[]; haveChildren: boolean; }[] {
    if (item) {
      if (item.name == 'Mois') {
        this.selectedTime.next = 'Mois suivant';
        this.selectedTime.prev = 'Mois précédent';
      }
      else if (item.name == '3 mois') {
        this.selectedTime.next = '3 mois suivants';
        this.selectedTime.prev = '3 mois précédents';
      }
      else if (item.name == 'Année') {
        this.selectedTime.next = 'Année suivante';
        this.selectedTime.prev = 'Année précédente';
      }
      else if (item.name == 'Semaine') {
        this.selectedTime.next = 'Semaine suivante';
        this.selectedTime.prev = 'Semaine précédente';
      }
      else if (item.name == 'Jour') {
        this.selectedTime.next = 'Jour suivant';
        this.selectedTime.prev = 'Jour précédent';
      }
      return [];
    }
    let timeOptions = [];
    timeOptions.push({
      name: 'Jour',
      next: 'Jour suivant',
      prev: 'Jour précédent',
      staticId: 'Jour',
      dynamicId: 0,
      level: 0,
      isOpen: true,
      loading: false,
      patrimoineId: 'Jour',
      parents: [],
      isLastInGrp: true,
      drawLink: [],
      haveChildren: false,
    });
    timeOptions.push({
      name: 'Semaine',
      next: 'Semaine suivante',
      prev: 'Semaine précédente',
      staticId: 'Semaine',
      dynamicId: 1,
      level: 1,
      isOpen: true,
      loading: false,
      patrimoineId: 'Semaine',
      parents: [],
      isLastInGrp: true,
      drawLink: [],
      haveChildren: false,
    });
    timeOptions.push({
      name: 'Mois',
      next: 'Mois suivant',
      prev: 'Mois précédent',
      staticId: 'Mois',
      dynamicId: 2,
      level: 1,
      isOpen: true,
      loading: false,
      patrimoineId: 'Mois',
      parents: [],
      isLastInGrp: true,
      drawLink: [],
      haveChildren: false,
    });
    timeOptions.push({
      name: 'Année',
      next: 'Année suivante',
      prev: 'Année précédente',
      staticId: 'Annee',
      dynamicId: 4,
      level: 0,
      isOpen: true,
      loading: false,
      patrimoineId: 'Annee',
      parents: [],
      isLastInGrp: true,
      drawLink: [],
      haveChildren: false,
    });
    return timeOptions;
  }

  async onSpaceSelectOpen(item?: ISpaceSelectorItem): Promise<any> {
    var floorList: any[] = [];
    switch (item?.type) {
      case undefined:
        this.building = await getBuilding();
        const building = this.building;

        return [{
          name: building.name,
          staticId: building.staticId,
          dynamicId: building.dynamicId,
          type: 'building',
          level: 0,
          isOpen: true,
          loading: false,
          patrimoineId: 'patrimoineId',
          parents: [],
          isLastInGrp: true,
          drawLink: [],
          haveChildren: false,
          area: building.area,
          cp: '',
        }];
      case 'building':
        const floors = await getFloors();

        for (let floor of floors) {
          floorList.push({
            name: floor.name,
            staticId: floor.staticId,
            dynamicId: floor.dynamicId,
            type: 'floor',
            level: 0,
            isOpen: true,
            loading: false,
            patrimoineId: 'patrimoineId',
            parents: [],
            isLastInGrp: true,
            drawLink: [],
            haveChildren: true,
            area: floor.area,
            cp: floor.cp,
          })
        }

        return floorList;
      case 'floor':
        const rooms = await getRooms(item);
        const listOfRooms = [];

        for (let room of rooms) {
          listOfRooms.push({
            name: room.name,
            staticId: room.staticId,
            dynamicId: room.dynamicId,
            type: 'room',
            level: 0,
            isOpen: true,
            loading: false,
            patrimoineId: 'patrimoineId',
            parents: [],
            isLastInGrp: true,
            drawLink: [],
            haveChildren: false,
            color: room.color,
          })
        }

        return listOfRooms;
      default:
        return [];
    }
  }

  onGoBack() {
    const parent = this.$refs['spaceSelector'].getParentOfSelected();
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

  async onSelect(item: TGeoItem | TGeoItem[]) {
    if (!item) return;
    const it = this.getItemData(item);
    await this.$store.dispatch(ActionTypes.SELECT_ITEMS, it);
  }

}

export default App;
</script>

<style>
.Hx1 {
  position: absolute;
  width: 66%;
  right: 0px;
  top: -1px;
  height: 60px;
}

.Hx2 {
  position: absolute;
  width: 34%;
  right: calc(66%);
  top: -1px;
  height: 60px;
}

.selectors {
  position: absolute;
  display: flex;
  top: 10px;
  right: 10px;
  height: 60px;
  width: 50%;
  background: #14202c;
  border: 1px solid #f5f5f5;
  border-radius: 12px;
}

html {
  font-family: 'charlevoix' !important;
  overflow: hidden !important;
  user-select: none;
}

@font-face {
  font-family: 'charlevoix';
  src: url('./assets/font/CharlevoixPro-Regular.woff2');
  font-weight: normal;
  font-style: normal
}

.v-app {
  background: linear-gradient(111.34deg, #F8FAFA 0%, #D6E2E6 100%) !important;
  font-family: 'charlevoix' !important;
}
</style>

