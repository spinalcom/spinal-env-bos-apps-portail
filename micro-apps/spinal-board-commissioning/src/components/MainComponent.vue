<template>
  <div class="main-container" style="min-height: 480px">
    <div class="content">
      <div class="header">
        <div class="title">
          <div v-if="!sconfig.entryPoint" style="display: flex; align-items: center;">
            <span style="display: inline; width: 750px; display: flex; align-items: center;">Détails des éléments connectés sur </span>
            <SpinalbreadCrumb @loadData="loadDataContext" v-if="!sconfig.entryPoint"  :contextList="context" :categoryList="selectedZone.categoryList" :groupList="selectedZone.groupList" />
          </div>
          <div v-else>sconfig
            <span style="display: flex; align-items: center;">Détails des éléments connectés sur  {{ sconfig.entryPoint.context }} / {{  sconfig.entryPoint.category }} / {{ sconfig.entryPoint.group }}</span>
          </div>
          </div>
          <!-- <div class="legend">
            <SmallLegend :size="12" color="#14202C" text="Connecté et fonctionnel"/>
            <SmallLegend :size="12" color="#9830F2" text="Pas de convention de nommage"/>
            <SmallLegend :size="12" color="#EF8BC5" text="Convention de nommage incorrect"/>          
            <SmallLegend :size="12" color="#FF000B" text="Données incohérentes"/>
            <SmallLegend :size="12" color="#898F95" text="Données non remontées / champ indéfini"/>
          </div> -->
         
        </div>

        <div class="main">
          <div class="left-box" v-if="showLeftBox">
            <DotsGrid :dotsList="ItemList" />
          </div>
          <div class="right-box" :style="showLeftBox ? 'width: 70%' : 'width: 100%'">
            <div class="header-left">
              <div style="display: flex; align-items: center;">

                <FilterForm :column="dynamicHeaders" />
              
 
</div>



<div style="width: 400px; height: 50px; display: flex; align-items: center; justify-content: center; margin-left: 20px; border-radius: 5px; border: 1px solid #14202C; padding: 4px;">
  <SelectSource :label="'Sélectionner les sources'"  :items="sourceList" @updateSelectedItems="updateDataTable" />
</div>

            </div>
            <div class="stripe">
              <Stripe :stripeList="stripeData" />
            </div>

            <div class="table">
              <SpinalTable  :item="formateditems" :headers="dynamicHeaders" />
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue, Watch } from 'vue-property-decorator';
import SmallLegend from './SmallLegend.vue';
import SpinalTable from './SpinalTable.vue';
import { ActionTypes } from '../interfaces/vuexStoreTypes';
import Stripe from './Stripe.vue';
import DotsGrid from './DotsGrid.vue';
// import { config } from '../../config';
import { MutationTypes } from '../services/store/appDataStore/mutations';
import SpinalbreadCrumb from './SpinalbreadCrumb.vue';
import { getAllDataInContextSpatial, getContext, getDataInContextSpatial } from '../services';
import SelectSource from './SelectSource.vue';
import FilterForm from './FilterForm.vue';
@Component({
  components: {
    SmallLegend,
    SpinalTable,
    Stripe,
    DotsGrid,
    SpinalbreadCrumb,
    SelectSource,
    FilterForm
  }
})
class App extends Vue {

  @Prop({type: Array, default: () => [], required: true}) items: any[];

 selectedZone: any = {}
 ItemList: any[] = []
 formateditems: any[] = []
 dynamicHeaders: any[] = []
 stripeData: any[] = []
 showLeftBox: boolean = true
 editedregex: boolean = false
  statisticTimeline = this.config.bilan.timeline;
  sources = this.config.sources;
  itemSourcesSelected: any[] = [];
  sourcesList: any[] = [];
  statisticSource = this.sources.find((src) => src.id === this.config.bilan.timeline.sourceId);
  sconfig = this.config;
  context = [];
  showLoader = true;



  async mounted (){
    const buildingId = localStorage.getItem('idBuilding');
    const context = await getContext(buildingId!);
    this.context = context;
    this.selectedZone = this.$store.state.appDataStore.zoneSelected;
    this.showLeftBox = this.config.bilan.dotsGrid ? true : false;
  }

// Methods



updateDataTable(itemsSelected) {
  this.itemSourcesSelected = itemsSelected;
  // Supprimer les headers isNew qui ne sont plus dans itemsSelected
  this.dynamicHeaders = this.dynamicHeaders.filter((header: { text: string, value: string, isNew: boolean }) => {
    if (header.isNew) {
      return itemsSelected.includes(header.text);
    }
    return true; // garder les headers non marqués comme isNew
  });

  // Reformater les données
  const data = this.flattenSelectedFieldsArray(this.items, itemsSelected);
  // Ajouter les nouveaux headers
  data.headers.forEach((header: { text: string; value: string; align: string }) => {
    const alreadyExists = this.dynamicHeaders.some(
      (h: { text: string }) => h.text === header.text
    );
    if (!alreadyExists) {
      this.dynamicHeaders.push({ ...header, isNew: true });
    }
  });
  this.formateditems = data.data;
  const sources = this.$store.state.appDataStore.data.sources || [];
   const finalData = {
     data: this.formateditems,
     sources: sources,
   }

  this.$store.commit(MutationTypes.SET_FILTER_DATA_CONFIG, finalData);

}

 

 flattenSelectedFieldsArray(objectsArray, selectedFields) {
  let headers: {text: string, value: string, align: string}[] = [];

  const result = objectsArray.map((object: any) => {
    const result = { ...object };

    selectedFields.forEach(fieldGroup => {

      // Rechercher le groupe d'attributs
      const attrGroup = object.attributs?.find(a => a.name === fieldGroup.name);
      if (attrGroup && attrGroup.attributs) {
        fieldGroup.children.forEach((child: any) => {
          const key = child.name.replace(' ', '_');
          const attr = attrGroup.attributs.find((a: any) => a.name === child.name);
          const header = {
            text: child.name,
            value: key,
            align: 'start',
            isNew: true,
          }
          if (!headers.some(h => h.value === key)) {
            headers.push(header);
          }

          if (attr) {
            result[key] = attr.value;
          }
          else {
            result[key] = 'N/A';
          }
        });
      }
      else {
        // Si le groupe d'attributs n'existe pas, on ajoute les enfants avec une valeur par défaut
        fieldGroup.children.forEach((child: any) => {
          const key = child.name.replace(' ', '_');
          const header = {
            text: child.name,
            value: key,
            align: 'start',
            isNew: true,
          }
          if (!headers.some(h => h.value === key)) {
            headers.push(header);
          }
          result[key] = 'non défini';
        });
      }

      // Rechercher le groupe de contrôle des endpoints
      const matchProfileName = object.controlEndpoint?.find((pf) => pf.profileName === fieldGroup.name);
      
      if(matchProfileName && matchProfileName.endpoints) {
        fieldGroup.children.forEach((child) => {
          const key = child.name.replace(' ', '_')
          const endpoint = matchProfileName.endpoints.find((ep: any) => ep.name === child.name);
          const header = {
            text: child.name,
            value: key,
            align: 'start',
            isNew: true,
          }
          if (!headers.some(h => h.value === key)) {
            headers.push(header);
          }
          if(endpoint) {
            if(endpoint.value) {

              if (typeof endpoint.value === 'number') {
                result[key] = endpoint.value.toFixed(2);
              } else {
                result[key] = `${endpoint.value}`;
              }
            }
            else {
              result[key] = 'N/A';
            }
          }
        })
      } 
      
    });

    return result;
  });

  return {
    data: result,
    headers: headers,
  };
}











async getDataItem(newVal: any = this.items) {
  const buildingId: string = localStorage.getItem('idBuilding') as string;
  this.ItemList = newVal;
    const baseHeaders = [
    { text: 'Etage', value: 'floor', align: 'start' },
     {text: "Groupe", value: 'group', align: 'start'},
      { text: 'Nom', value: 'name', align: 'start' },
  ];
  if(this.ItemList.length > 0) {
    const endpoints = this.ItemList[0].sources || [];
    console.log("config: ", this.$store.state.appDataStore.appConfig);
    const sourceFiltered = this.sources.find((src) => src.id === this.statisticTimeline.sourceId) ;
    const endpointHeaders = endpoints.map((endpoint: any) => ({
      text: endpoint.name,
      value: endpoint.name.toLowerCase().replace(/ /g, ""),
      align: 'start',
      isEndpoint: true,
      filterable: endpoint.name.toLowerCase() === sourceFiltered?.name.toLocaleLowerCase() ? true: false
    }));
    this.dynamicHeaders = [...baseHeaders, ...endpointHeaders];
  } else {
    this.dynamicHeaders = baseHeaders;
  }

  // Ajouter les headers pour les endpoints
  // const endpointHeaders = this.ItemList.sources.map((endpoint: any) => ({
  //   text: endpoint.name,
  //   value: endpoint.name.toLowerCase().replace(/ /g, "-"),
  //   align: 'start',
  //   isEndpoint: true
  // }));

  // this.dynamicHeaders = [...baseHeaders, ...endpointHeaders];


  if (newVal.length > 0) {
    this.formateditems = newVal.map((item) => {
      const formated = { ...item };
      // Vérifier si endpoints existe avant de boucler
      (item.sources || []).forEach((endpoint: any) => {
        const key = endpoint.name.toLowerCase().replace(/ /g, "-");
        const type = typeof endpoint.value;
   
        if(type === 'number') {
          formated[key] = endpoint.value.toFixed(2);
        }
        else {
          formated[key] = `${endpoint.value}`;

        }
        
      });
      return formated;
    });
  } else {
    this.formateditems = [];
  }

      // this.$store.commit(MutationTypes.SET_STRIPE_DATA, this.stripeData);
      
}



changeRegex() {
  this.editedregex = false;

  
  this.getDataItem();
}

async loadDataContext(){
  const buildingId = localStorage.getItem('idBuilding');
  const context = this.$store.state.appDataStore.context;
  const categories = this.$store.state.appDataStore.categoriesContext;
  const groupEquipement = this.$store.state.appDataStore.groupEquipement;
  
  if(context && categories && groupEquipement.length > 0) {
    
  const data = await getAllDataInContextSpatial(buildingId!, this.selectedZone, groupEquipement);
  this.$emit('loadData', data);

  }
  if(context && categories && !groupEquipement) { 
    await getDataInContextSpatial(buildingId!, this.selectedZone.name, this.config)
  }
   
}






// Computed
  public get zoneSelected() {
    return this.$store.state.appDataStore.zoneSelected;
}

public get DataStore() {
    return this.$store.state.appDataStore.data;
  }


  public get sourceList() {
    return this.$store.state.appDataStore.data.sources || [];
  }

public get CancelFilter() {
  return this.$store.state.appDataStore.cancelFilter;
}

SetCancelFilter(value: boolean) {
  this.$store.commit(MutationTypes.SET_CANCEL_FILTER, value);
}
public get filterData() {
  return this.$store.state.appDataStore.filterData ;
}


 public get config() {
    return this.$store.state.appDataStore.appConfig;
  }

  public getSconfig() {
    return this.config;
  }






// Watchers



@Watch('items')
  async onItemsChange(newVal: any) {
    if(this.config && this.config.entryPoint === undefined) {
      console.log("entryPoint not defined")
      this.formateditems = newVal.map((item: any) => {
        return {
          ...item,
          floor: item.floor || 'N/A',
          group: item.group || 'N/A',
          name: item.name || 'N/A',
        };
      });
      this.dynamicHeaders = [
        { text: 'Etage', value: 'floor', align: 'start' },
        { text: 'Groupe', value: 'group', align: 'start' },
        { text: 'Nom', value: 'name', align: 'start' },
      ];
     this.updateDataTable(this.itemSourcesSelected);
     this.$store.commit(MutationTypes.SET_DOWNLOAD_DATA, {
        data: this.formateditems,
        sources: this.itemSourcesSelected,
      });
    
    }else {
      console.log("entryPoint defined")
      this.formateditems = newVal.map((item: any) => {
        return {
          ...item,
          floor: item.floor || 'N/A',
          group: item.group || 'N/A',
          name: item.name || 'N/A',
        };
      });
      this.dynamicHeaders = [
        { text: 'Etage', value: 'floor', align: 'start' },
        { text: 'Groupe', value: 'group', align: 'start' },
        { text: 'Nom', value: 'name', align: 'start' },
      ];
      this.updateDataTable(this.itemSourcesSelected);
      this.$store.commit(MutationTypes.SET_DOWNLOAD_DATA, {
        data: this.formateditems,
        sources: this.itemSourcesSelected,
      });
      // this.updateDataTable(this.itemSourcesSelected);
      // this.getDataItem(newVal);
    }
    // this.sourcesList = newVal.map((item: any) => {
    //   return item.attributs && item.controlEndpoint ? item.attributs  && item.controlEndpoint : [];
    // })
  }


  

  @Watch('sourceList')
  async onSourceListChange(newVal: any) {
    this.sources = newVal;
  }

  @Watch('zoneSelected')
  async onZoneSelectedChange() {
    this.selectedZone = this.zoneSelected;
    await this.getDataItem();
//  this.updateDataTable(this.itemSourcesSelected);
   this.dynamicHeaders = this.dynamicHeaders;
  }

//  Filter data to update the table
@Watch('filterData')
async onFilterDataChange(newVal: any) {
  this.formateditems = newVal.data;
  this.$store.commit(MutationTypes.SET_DOWNLOAD_DATA, newVal);
}



}
export default App;
</script>

<style scoped>
.main-container {
  font-family: Charlevoix;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 80px 10px 10px;
  gap: 10px;
  height: 100vh;
  width: 100%;
  background: linear-gradient(111.34deg, #F8FAFA 0%, #D6E2E6 100%);
}
/* main container */
.MC {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  /* background: #F9F9F9; */
  /* border: 1px solid #F7F7F7; */
  /* box-shadow: 0px 3px 10px rgba(73, 84, 92, 0.16); */
  border-radius: 10px;
  width: 100%;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  overflow-y: auto;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  background: #F9F9F9;
  border: 1px solid #F7F7F7;
  box-shadow: 0px 3px 10px rgba(73, 84, 92, 0.16);
  border-radius: 10px;
  width: 100%;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  overflow-y: hidden;
}
.header {
  width: 100%;
  min-height: 25px;
  padding: 10px;
  padding-left: 25px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;

}
.header .legend {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.header > .title {
text-align: left;
font: normal normal normal 11px/13px Charlevoix Pro;
letter-spacing: 1.1px;
color: #214353;
opacity: 1;
text-transform: uppercase;
padding-top: 10px;
display: flex;

}
.main {
  width: 100%;
  height: calc(100% - 45px);
  display: flex;
  flex-direction: row;
  align-items: start;
  padding: 10px;
  gap: 20px;
  overflow: hidden;
}
.main > .left-box {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 5px;
}
.main > .right-box {
  box-sizing: border-box;
  width: 70%;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 5px;
  border: 1px solid #F9F9F9;
  align-self: stretch;
  flex: none;
  flex-grow: 1;
}
.main > .right-box .header-left {
  width: 100%;
  min-height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-bottom: #F9F9F9 1px solid;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
  color: #214353;
  opacity: 1;
  padding: 10px;
  text-transform: uppercase;

}
.main > .right-box .table {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 400px;
  padding: 0 10px;
  gap: 1px;
  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 1;
  padding-top: 20px;
  background-color: #ffffff;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
}
.main .stripe {
  width: 100%;
  height: 100px;
  background-color: #F9F9F9;
  border-radius: 5px;
}
</style>