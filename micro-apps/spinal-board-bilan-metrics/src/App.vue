<template>
  <v-app class="spinal-font">
    <div class="selectors">
      <div class="Hx1">
        <space-selector
          v-if="defaultSelected.name && defaultSelected.name != '' && defaultSelected.dynamicId && defaultSelected.dynamicId !== 0"
          ref="space-selector" :open.sync="openSpaceSelector" :maxDepth="1" :GetChildrenFct="onSpaceSelectOpen"
          v-model="defaultSelected" label="ESPACE" @input="getSelected" />
      </div>
      <div class="Hx2">
        <space-selector :edge="false" v-if="defaultSelectedTime.name && defaultSelectedTime.name != ''"
          ref="space-selector2" :open.sync="openTimeSelector" :maxDepth="0" :GetChildrenFct="onTimeSelectOpen"
          v-model="selectedTime" label="TEMPORALITÉ" />
      </div>
      <div class="DB">

        <DownloadButton :fileName="fileName" :data="table" />
      </div>
    </div>
    <MicroApp @chart-sent="handleChart" :temporality="selectedTime" :space="defaultSelected"
      v-if="defaultSelected.dynamicId !== 0" />
    <LoadinComponent v-else />
  </v-app>
</template>

<script lang="ts">

// import env from '../config';
import {
  ISpaceSelectorItem,
  SpaceSelector,
} from './components/SpaceSelector/index';
import { Vue } from 'vue-property-decorator';
import Component from 'vue-class-component';
import LoadinComponent from './components/LoadinComponent.vue';
import MicroApp from './components/MainComponent.vue';
import DownloadButton from './components/DownloadButton.vue';
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
    DownloadButton,
    MicroApp,
    LoadinComponent
  },
})
class App extends Vue {
  // fileName = env.fileName;
  building !: any;
  table: any[] = [];
  // controlEndpoint = env.controlEndpoint;
  // source = env.source;
  time = { name: "SEMAINE", value: 'week' }
  selectedFloor = '';
  openSpaceSelector = false;
  openTimeSelector = false;
  $refs!: { spaceSelector: any };
  defaultSelected = {
    platformId: '',
    name: '',
    staticId: '1',
    color: '',
    dynamicId: 0,
    type: 'building',
    level: 0,
    isOpen: true,
    loading: false,
    patrimoineId: 'patrimoineId',
    parents: [],
    isLastInGrp: true,
    drawLink: [],
    haveChildren: true,
    area: 0,
    cp: 0,
    source: [],
  } as ISpaceSelectorItem;
  defaultSelectedTime = {
    name: 'Mois',
    loading: false,
    parents: [],
    haveChildren: false
  }

  // selectedTime = {
  //     name: 'Trimestre',
  //     next: 'Trimestre suivant',
  //     prev: 'Trimestre précédent',
  //     staticId: 'Annee',
  //     dynamicId: 3,
  //     level: 0,
  //     isOpen: true,
  //     loading: false,
  //     patrimoineId: 'Annee',
  //     parents: [],
  //     isLastInGrp: true,
  //     drawLink: [],
  //     haveChildren: false,
  //   };

  selectedTime = {
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
  };

  get appConfig() {
    return this.$store.state.appDataStore.appConfig;
  }

  get fileName(): string {
    return this.appConfig?.fileName || '';
  }

  get controlEndpoint(): string {
    return this.appConfig?.controlEndpoint || '';
  }

  get source(): string {
    return this.appConfig?.source || '';
  }

  async mounted() {
    this.building = await getBuilding(this.source);

    this.defaultSelected.name = this.building.name;
    this.defaultSelected.source = this.building.source;
    this.defaultSelected.dynamicId = this.building.dynamicId;
  }
  onTimeSelectOpen(item?: any): { name: string; staticId: string; dynamicId: number; level: number; isOpen: boolean; loading: boolean; patrimoineId: string; parents: never[]; isLastInGrp: boolean; drawLink: never[]; haveChildren: boolean; }[] {
    // return [];
    if (item) {
      console.log('item: ', item)
      // if (item.name == 'Journée') {
      //   this.selectedTime.next = 'Jour suivant';
      //   this.selectedTime.prev = 'Jour précédent';
      // }
      // if (item.name == 'Semaine') {
      //   this.selectedTime.next = 'Semaine suivante';
      //   this.selectedTime.prev = 'Semaine précédente';
      // }
      // if (item.name == 'Mois') {
      //   this.selectedTime.next = 'Mois suivant';
      //   this.selectedTime.prev = 'Mois précédent';
      // }
      // else 
      if (item.name == 'Trimestre') {
        this.selectedTime.next = 'Trimestre suivant';
        this.selectedTime.prev = 'Trimestre précédent';
      }
      else if (item.name == 'Année') {
        this.selectedTime.next = 'Année suivante';
        this.selectedTime.prev = 'Année précédente';
      }
      return [];
    }
    let timeOptions: any[] = [];
    // timeOptions.push({
    //   name: 'Journée',
    //   next: 'Jour suivant',
    //   prev: 'Jour précédent',
    //   staticId: 'Jour',
    //   dynamicId: 2,
    //   level: 0,
    //   isOpen: true,
    //   loading: false,
    //   patrimoineId: 'Jour',
    //   parents: [],
    //   isLastInGrp: true,
    //   drawLink: [],
    //   haveChildren: false,
    // });
    // timeOptions.push({
    //   name: 'Semaine',
    //   next: 'Semaine suivante',
    //   prev: 'Semaine précédente',
    //   staticId: 'Semaine',
    //   dynamicId: 2,
    //   level: 0,
    //   isOpen: true,
    //   loading: false,
    //   patrimoineId: 'Semaine',
    //   parents: [],
    //   isLastInGrp: true,
    //   drawLink: [],
    //   haveChildren: false,
    // });
    // timeOptions.push({
    //   name: 'Mois',
    //   next: 'Mois suivant',
    //   prev: 'Mois précédent',
    //   staticId: 'Mois',
    //   dynamicId: 1,
    //   level: 1,
    //   isOpen: true,
    //   loading: false,
    //   patrimoineId: 'Mois',
    //   parents: [],
    //   isLastInGrp: true,
    //   drawLink: [],
    //   haveChildren: false,
    // });
    timeOptions.push({
      name: 'Trimestre',
      staticId: 'Trimestre',
      dynamicId: 2,
      level: 0,
      isOpen: true,
      loading: false,
      patrimoineId: '3derniersmois',
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
    // timeOptions.push({
    //   name: 'Décennie',
    //   staticId: 'Decennie',
    //   dynamicId: 4,
    //   level: 0,
    //   isOpen: true,
    //   loading: false,
    //   patrimoineId: 'Decennie',
    //   parents: [],
    //   isLastInGrp: true,
    //   drawLink: [],
    //   haveChildren: false,
    // });
    console.log('timeOptions: ', timeOptions)
    return timeOptions;
  }
  async onSpaceSelectOpen(item?: ISpaceSelectorItem): Promise<any> {
    var floorList: any[] = [];
    switch (item?.type) {
      case undefined:
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
          source: building.source
        }];
      case 'building':
        const floors = await getFloors(this.source);

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
            area: floor.area,
            cp: floor.cp,
            source: floor.sources
          })
        }
        return floorList;
      default:
        return [];
    }
  }


  handleChart(chart) {
    this.table = chart;
  }


  getSelected(v): void {
    // console.log(v)
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

html,
body,
.spinal-font,
.v-application--wrap {
  font-family: 'Charlevoix Pro' !important;
  font-size: 16px;
  letter-spacing: 1.1px;
  color: #000000DE;
  overflow: hidden !important;
}

.DB {
  position: absolute;
  left: -70px;
}

@font-face {
  font-family: 'Charlevoix Pro';
  src: url('./assets/font/CharlevoixPro-Regular.woff2') format('woff2'), url('./assets/font/CharlevoixPro-Regular.woff') format('woff'), url('./assets/font/CharlevoixPro-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal
}
</style>
