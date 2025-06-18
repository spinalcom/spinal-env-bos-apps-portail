<template> 
  <v-app class="spinal-font">
    <Loader />
    <div class="selectors">
      <div class="Hx2">
        <DownloadButton
          :fileName="selectedZone.name"
          :data="dataStore"
          :csv="true"
        />
      </div>
      <div class="Hx1">
        <space-selector
          ref="space-selector"
          :open.sync="openSpaceSelector"
          :maxDepth="1"
          :GetChildrenFct="onSpaceSelectOpen"
          v-model="selectedZone"
          label="ESPACE"
        />
      </div>
    </div>
    <MicroApp :items="dataStore" :space="selectedZone" v-if="selectedZone.dynamicId !== 0" @loadData="loadData"/>
  </v-app>
</template>

<script lang="ts">
import {
  ISpaceSelectorItem,
  SpaceSelector,
} from './components/SpaceSelector/index';
import { Vue, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import MicroApp from './components/MainComponent.vue';
import { ActionTypes } from './interfaces/vuexStoreTypes';
import { MutationTypes } from './services/store/appDataStore/mutations';
import { getAllDataInContextSpatial, getData, getDataInContextSpatial } from './services';
import Loader from './components/Loader.vue'
import DownloadButton from './components/DownloadButton.vue'
import { IConfig } from './interfaces/IConfig';
// import {config} from '../config'
import { ILoading } from './interfaces/ILoading';
import { get } from 'http';
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
    MicroApp,
    Loader,
    DownloadButton
  },
})
class App extends Vue {
  time = { name: "SEMAINE", value: 'week' }
  selectedFloor = '';
  openSpaceSelector = false;
  openTimeSelector = false;
  $refs!: { spaceSelector: any };
  timedata = { name: 'SEMAINE', value: 'week' };
  showLoader = false; 
  query: {
    app: string;
    mode: string;
    name: string;
    spaceSelectedId: string;
    spaceSelectedType: string;
    buildingId: string;
    config: string
  } = {
    app: '',
    mode: 'null',
    name: '',
    spaceSelectedId: '',
    buildingId: '',
    spaceSelectedType: '',
    config: ''
  };

  //  config : IConfig = config

  defaultSelectedTime = {
    name: 'Mois',
    loading: false,
    parents: [],
    haveChildren: false
  }


  showMessage = false;
  


 
    get dataStore() {
      return this.$store.state.appDataStore.data.data;
    }

    get progressLoader (): ILoading {
      return this.$store.state.appDataStore.progressLoader;
    }

    
   



    @Watch('progressLoader')
    onProgressLoaderChange(newValue: ILoading) {
     this.showLoader = newValue.isLoading;
         }


    // Methods
    loadData(data) { 
     
      this.$store.commit(MutationTypes.SET_DATA, data);

    }




    applyURLParam(query) {
    this.query.mode = query.mode;
    this.query.buildingId = query.buildingId;
    this.query.spaceSelectedId = query.spaceSelectedId;
    this.query.spaceSelectedType = query.spaceSelectedType;
    this.query.name = query.name;
    this.query.app = query.app;
    this.query.config = query.config

    if (query.spaceSelectedId) {
      const item = {
        buildingId: query.buildingId,
        dynamicId: query.spaceSelectedId,
        type: query.spaceSelectedType,
      };
      const button = {
        title: 'charger',
        icon: 'mdi-video-3d',
        onclickEvent: ActionTypes.GET_BOS_BUILDING,
        isOpen: false,
        loading: false,
        
        isShownTypes: ['geographicFloor'],
      };
      this.onActionClick({ button, item });
      const itemToSelect = {
        isOpen: false,
        loading: false,
        dynamicId: parseInt(query.spaceSelectedId),
        name: query.name,
        buildingId: query.buildingId,
        type: query.spaceSelectedType,
      };
      // this.$refs['space-selector'].getButton();
      if (this.$refs['space-selector']) {
        this.$refs['space-selector'].select(itemToSelect);
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


  onActionClick({ button, item }) {
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
      default:
        this.$store.dispatch(button.onclickEvent, data);
        break;
    }
  }
  

  async mounted() {
    const buildingId = localStorage.getItem('idBuilding');
    const realBuilding = await this.$store.dispatch(ActionTypes.GET_BOS_BUILDING, {buildingId})
    const item = {
      buildingId: buildingId,
      dynamicId: realBuilding.dynamicId,
      isOpen: false,
      loading: false,
      name: realBuilding.name,
      type: 'geographicBuilding',
    }
   
    this.$store.commit(MutationTypes.SET_SELECTED_ZONE, item);
    this.$nextTick(() => {
      const currentQuery = window.parent.routerFontion.apps[0]._route.query;
      this.applyURLParam(currentQuery);
    });

    if(this.config && this.config.entryPoint) {
      
      const result = await getDataInContextSpatial(buildingId!,  this.selectedZone, this.config);
            console.log('result', result);
            this.$store.commit(MutationTypes.SET_DATA, result);
    }
    else {
        console.log('no config');
    }

    this.$store.commit(MutationTypes.SET_SELECTED_ZONE, item);

  }
  
  async onSpaceSelectOpen(item?: ISpaceSelectorItem): Promise<any> {
    var floorList: any[] = [];
    const buildingId = localStorage.getItem('idBuilding');
    switch (item?.type) {
      case undefined:
      if(buildingId) {
        const payload = {
          item: { buildingId, type: "geographicBuilding" },

        }
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
              type: 'geographicBuilding',
            },
          ];
      }
      else {
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
              type: 'geographicBuilding',
            },
          ];
      }
      case 'geographicBuilding':
      return await this.$store.dispatch(ActionTypes.GET_FLOORS, {
          buildingId: item.staticId,
          patrimoineId: item.patrimoineId,
        });

      case 'geographicFloor':
      return await this.$store.dispatch(ActionTypes.GET_ROOMS, {
          floorId: item.dynamicId,
          buildingId: item.dynamicId,
          patrimoineId: item.patrimoineId,
          id: item.dynamicId,
        });
      default:
        return [];
    }
  }

  public get selectedZone() {    
    return this.$store.state.appDataStore.zoneSelected;
  }
  public set selectedZone(v: ISpaceSelectorItem) {
      this.$store.commit(MutationTypes.SET_LOADER, true);
      this.$nextTick();
      this.$store.commit(MutationTypes.SET_LOADING, {
        message: 'Chargement des données',
        isSuccess: false,
        total: 0,
        percent: 0,


      })
    new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    

      const buildingId = localStorage.getItem('idBuilding');
      if(this.query.spaceSelectedId != v.dynamicId.toString()) {
        this.query.name = v.name;
        this.query.spaceSelectedId = v.dynamicId.toString();
        this.query.spaceSelectedType = v.type;
        this.query.buildingId = localStorage.getItem('idBuilding')!;
        this.replaceRoute();
      }
      
      this.$store.commit(MutationTypes.SET_SELECTED_ZONE, v);
      const zoneSelected = this.$store.state.appDataStore.zoneSelected;
      this.updateDataInContextSpatial(buildingId);
      this.$store.commit(MutationTypes.SET_LOADER, false);
    }
  
  private async updateDataInContextSpatial(buildingId: string | null) {
    await new Promise((reslove) => (
        setTimeout(() => {
          reslove(true);
        }, 1000)
      ));
    const zoneSelected = this.$store.state.appDataStore.zoneSelected;
    const groups = this.$store.state.appDataStore.groupEquipement;
    if (this.config && this.config.entryPoint) {
      const data = await getDataInContextSpatial(buildingId!, zoneSelected, this.config);
      this.$store.commit(MutationTypes.SET_DATA, data);
      this.$store.commit(MutationTypes.SET_LOADING, {
        message: 'Terminé',
        total: 0,
        percent: 0,
        isSuccess: true,
      })
      
    }
    else {
        if(Object.keys(this.sconfig).length > 0) {
          const result = await getAllDataInContextSpatial(
            buildingId!,
            zoneSelected,    
            groups        
          );
          this.$store.commit(MutationTypes.SET_DATA, result);
  
        }
    }
    // return;
      }
  



  // Watchers
public get sconfig() {
  return this.$store.state.appDataStore.context;
}


public get config() {
  return this.$store.state.appDataStore.appConfig;
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
  width: max-content;
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
  width: 45%;
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
