<template>  
  <v-app class="spinal-font">
    <div class="selectors">
      <div class="Hx1">
        <space-selector
          v-if="defaultSelected.name && defaultSelected.name != '' && defaultSelected.dynamicId && defaultSelected.dynamicId !== 0"
          ref="space-selector"
          :open.sync="openSpaceSelector"
          :maxDepth="1"
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
    <MicroApp :temporality="selectedTime" :space="defaultSelected" v-if="defaultSelected.dynamicId !== 0"/>
  </v-app>
</template>

<script lang="ts">
import {
  ISpaceSelectorItem,
  SpaceSelector,
} from './components/SpaceSelector/index';
import { Vue } from 'vue-property-decorator';
import Component from 'vue-class-component';
import MicroApp from './components/MainComponent.vue';
import { getBuilding, getFloors } from './services/index.js';
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
  openSpaceSelector = false;
  openTimeSelector = false;
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
    };

  async mounted() {
    let building = await getBuilding();
    this.defaultSelected.name = building.name;
    this.defaultSelected.dynamicId = building.dynamicId;
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
      next: 'Semaine suivante',
      prev: 'Semaine précédente',
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
  async onSpaceSelectOpen(item?: ISpaceSelectorItem): Promise<any> {
    var floorList: any[] = [];
    switch (item?.type) {
      case undefined:
        const building = await getBuilding();
        return[{
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
              haveChildren: false,
            })
        }
        return floorList;
      default:
        return [];
    }
  }





}

export default App;
</script>

<style>
@import './assets/css/styles.css';
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
