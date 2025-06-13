<template>  
  <v-app class="spinal-font">
    <div class="selectors">
      <div class="Hx1">
        <space-selector
          v-if="defaultSelected.name && defaultSelected.name !=''"
          ref="space-selector"
          :open="false"
          :maxDepth="-1"
          :GetChildrenFct="onSpaceSelectOpen"
          v-model="defaultSelected"
          label="ESPACE"
        />
      </div>
      <div class="Hx2">
        <space-selector
          :edge="false"
          v-if="defaultSelectedTime.name && defaultSelectedTime.name !=''"
          ref="space-selector2"
          :open.sync="openTimeSelector"
          :maxDepth="0"
          :GetChildrenFct="onTimeSelectOpen"
          v-model="selectedTime"
          label="TEMPORALITÉ"
        />
      </div>
    </div>
    <MicroApp :temporality="selectedTime"/>
  </v-app>
</template>

<script lang="ts">
import {
  ISpaceSelectorItem,
  SpaceSelector,
} from './components/SpaceSelector/index';
import { Vue } from 'vue-property-decorator';
import {
  ActionRecordTypes,
  ActionTypes,
} from './services/store/appDataStore/actions';
import Component from 'vue-class-component';
import type { Store } from './services/store';
import { MutationTypes } from './services/store/appDataStore/mutations';
import type {
  IZoneItem,
  TGeoItem,
} from './components/SpaceSelector/interfaces/IBuildingItem';
import MicroApp from './components/MaintenanceActivity.vue';
import { getBuilding } from './services/index.js';
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
  time = { name: "SEMAINE", value: 'week' }
  selectedFloor = '';
  $store!: Store;
  openSpaceSelector = false;
  openTimeSelector = false;
  dataTable: IZoneItem[] = [];
  $refs!: { spaceSelector: any };
  timedata = { name: 'SEMAINE', value: 'week' };
  defaultSelected = {
    platformId: '',
    name: '',
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
    name: 'Mois',
    loading: false,
    parents: [],
    haveChildren: false
  }

  selectedTime = {
      name: 'Semaine',
      staticId: 'Semaine',
      next: 'Semaine suivante',
      prev: 'Semaine précédente',
      dynamicId: 2,
      level: 0,
      isOpen: true,
      loading: false,
      patrimoineId: 'Semaine',
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
    let building = await getBuilding();
    this.defaultSelected.name = building.name;
    // let res = await getBuilding();
    // this.defaultSelected.dynamicId = res.dynamicId;
    this.selectedZone = this.defaultSelected;
  }
  onTimeSelectOpen(item?: any): { name: string; staticId: string; dynamicId: number; level: number; isOpen: boolean; loading: boolean; patrimoineId: string; parents: never[]; isLastInGrp: boolean; drawLink: never[]; haveChildren: boolean; }[] {
    if (item) {
      if (item.name == 'Semaine') {
        this.selectedTime.next = 'Semaine suivante';
        this.selectedTime.prev = 'Semaine précédente';
      }
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
      return [];
    }
    let timeOptions: any[] = [];
    timeOptions.push({
      name: 'Semaine',
      staticId: 'Semaine',
      dynamicId: 2,
      level: 0,
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
      dynamicId: 1,
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
      dynamicId: 3,
      level: 0,
      isOpen: true,
      loading: false,
      patrimoineId: 'Annee',
      parents: [],
      isLastInGrp: true,
      drawLink: [],
      haveChildren: false,
    });
    timeOptions.push({
      name: 'Décennie',
      staticId: 'Decennie',
      dynamicId: 4,
      level: 0,
      isOpen: true,
      loading: false,
      patrimoineId: 'Decennie',
      parents: [],
      isLastInGrp: true,
      drawLink: [],
      haveChildren: false,
    });
      return timeOptions;
  }
  onSpaceSelectOpen(item?: ISpaceSelectorItem): any {
    return [];
    console.log(item?.type);
    let d = {
    platformId: '',
    name: 'Patrimoine',
    staticId: '',
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
    switch (item?.type) {
      case undefined:
        const patrimoine = localStorage.getItem("patrimoine");
        let patrimoineObject = JSON.parse(patrimoine!);
        let buildings: any = [];
        for (let b in patrimoineObject.buildings) {
          buildings.push({
              name: patrimoineObject.buildings[b].name,
              staticId: patrimoineObject.buildings[b].id,
              dynamicId: 0,
              type: 'patrimoine',
              level: 0,
              isOpen: true,
              loading: false,
              patrimoineId: 'patrimoineId',
              parents: [],
              isLastInGrp: true,
              drawLink: [],
              haveChildren: false,
            })
        }
        return buildings;
      // case 'patrimoine':
      //   return [d,d,d,d,d];
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
  position:absolute;
  display: flex;
  top: 10px;
  right: 10px;
  height: 60px;
  width: 50%;
  background: #14202c;
  border: 1px solid #f5f5f5;
  border-radius: 12px;
}
html, body, .spinal-font, .v-application--wrap {
  font-family: 'Charlevoix Pro' !important;
  font-size: 16px;
  letter-spacing: 1.1px;
  color: #000000DE;
  overflow: hidden !important;
}

@font-face{font-family:'Charlevoix Pro';src:url('./assets/font/CharlevoixPro-Regular.woff2') format('woff2'),url('./assets/font/CharlevoixPro-Regular.woff') format('woff'),url('./assets/font/CharlevoixPro-Regular.ttf') format('truetype');font-weight:normal;font-style:normal}

</style>
