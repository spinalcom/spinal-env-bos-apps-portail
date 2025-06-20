<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <div  style="width: 100%; height: calc(100% / 2); display: flex; gap: 16px; padding: 10px; margin-left: 20px; align-items: center;">
      <div style="display: flex; flex-direction: row; align-items: center; gap: 5px;">
        <v-icon v-if="cancelFilter" @click="SetCancelFilter(false)" style="cursor: pointer; font-size: 20px; color: #14202C;">mdi-cancel</v-icon>
      </div>
      <div v-if="headeLegend" @click="filterReverse(item)" v-for="(item, idx) in headeLegend" :key="idx" :style="{width: `max-content`, height: '100%', zIndex: idx, cursor: 'pointer', position: 'relative', userSelect: 'none'}" >
        <div v-if="item.isActive"  class="underline"></div>
        <SmallLegend v-if="item.data.length > 0"  :color="item.color" :text="`${item.name}: ${item.data.length}`" :size="16"  />
      </div>
    </div>
    <div class="main-stripe">
      <div v-for="(item, idx) in configLegend" :key="item.name" :style="{width: item.percent + '%', height: '100%'}">    
        <v-tooltip top :color="item.color" >
          <template v-slot:activator="{ on, attrs}">
            <div v-bind="attrs"
              @click.stop="filter(item)"
            v-on="on" style="width:100%; height: 100%; border-radius: 5px;" :style="{backgroundColor: item.color}"></div>
          </template>
          <span>{{ item.name }} : {{ item.data.length }} ({{ item.percent + '%'}}) </span>
        </v-tooltip>
      </div>
    
    </div>

  </div>
</template>

<script lang="ts">
;

import { setTimeout } from "timers";
import { MutationTypes } from "../services/store/appDataStore/mutations";
import SmallLegend from "./SmallLegend.vue";
import {memoize} from "lodash"




    



export default {
  name: "Stripe",
  components: {
    SmallLegend
  },
  data() {
    return {
      stripeList: [] as any[],
      configLegend: [] as { name: string; color: string; data: any[]; percent: number, isActive: boolean}[],
      headeLegend: [] as { name: string; color: string; data: any[]; percent: number, isActive: boolean}[],
      seen: new Map(),
      duplicate: [] as any[],
      warning: [] as any[],
      missing: [] as any[],
      filterData: [] as any[],
      worker: null as Worker | null,
      titles: [] as any[],
    };
  },
  computed: {
    data() {
      return this.$store.state.appDataStore.configLabel;
    },
    spaceSelected() {
      return this.$store.state.appDataStore.zoneSelected;
    },
    stripeData() {
      return this.$store.state.appDataStore.StripeDataList;
    },
    cancelFilter(){
      return this.$store.state.appDataStore.cancelFilter;
    },
    filteredData() {
      return this.$store.state.appDataStore.filteredDataConfig;
    }
  },


watch: {

 stripeData: {
  handler(newData) {
    console.log("StripeData changed", newData);
    if( newData) {
      if(newData.type === 'number') {
        this.headeLegend = newData.range;
        this.configLegend = newData.range;
      }
      else {
        this.headeLegend = newData.data;
        this.configLegend = newData.data;
      }
    }
    
  }
 },

  spaceSelected: {
    handler(newData) {
     this.headeLegend.map((el) => {
        el.isActive = false;
      });
      this.$store.commit(MutationTypes.SET_CANCEL_FILTER, false);
      this.stripeList = newData;
    }
  },

  },


created() {
  //




  // Gérer le message du Worker
  this.worker = new Worker(new URL('../workers/filterWorker.ts', import.meta.url), {
    type: "module"}
  );
  this.worker.onmessage = (e) => {
  const { type, showCanceled } = e.data;


  if (type === 'progress') {
    this.$store.commit(MutationTypes.SET_LOADER, true);
    this.$store.commit(MutationTypes.SET_LOADING, {
      completed: e.data.completed,
      total: e.data.total,
      percent: e.data.percent,
      message: e.data.message,
    });
  } else if (type === 'done') {
    if(showCanceled) {
      this.$store.commit(MutationTypes.SET_LOADER, false);
      this.$store.commit(MutationTypes.SET_CANCEL_FILTER, false);
    }
    else {
      this.$store.commit(MutationTypes.SET_LOADER, false);
      this.$store.commit(MutationTypes.SET_CANCEL_FILTER, true);
    }
    
  }
};

},


methods: {
    async retriveStripeData() {
      const stripe = this.$store.state.appDataStore.StripeDataList;
      if (stripe) {
        return stripe;
      }
    },
filterBysource (dataStore: any[], sourceName: string) {
  return new Promise((resolve) => {
    const result: any = [];
    let i = 0;
    const batchSize = 500;  
 

    const processBatch = () => {
      const end = Math.min(i + batchSize, dataStore.length);
      for(; i < end; i++) {
        const el = dataStore[i];
        if(!Array.isArray(el.sources)) continue;

        const stripe = el.sources.find((st) => st.name?.toLowerCase() === sourceName);
        if(stripe) result.push(stripe);
      }
      // Mettre à jour la progression
      this.$store.commit(MutationTypes.SET_LOADING, {
        completed: i,
        total: dataStore.length,
        message: "Réinitialisation des filtres",
        percent: (i / dataStore.length) * 100,
      });

      if(i < dataStore.length) {
        setTimeout(processBatch, 30); // executer le prochain batch
      } else {
 
        // Mettre à jour la progression finale
        this.$store.commit(MutationTypes.SET_LOADING, {
          completed: dataStore.length,
          total: dataStore.length,
          message: "Réinitialisation des filtres terminée",
          percent: 100,
        });
       resolve(result); // renvoyer le résultat final

      }
    };
    processBatch();
  });
},
    
   createFilterSet: memoize(
      (values: any[]) => new Set(values),
      (values: any[]) => JSON.stringify([...values].sort())
   ),

   async filterReverse(item: { name: string; color: string; data?: any[]; range?: any[], percent: number; isActive: boolean }) {
    this.$store.commit(MutationTypes.SET_LOADER, true);
    this.$store.commit(MutationTypes.SET_LOADING, {
      completed: 0,
      total: 0,
      percent: 0,
      message: "Filtrage des données...",
    });
    const totalDta = this.configLegend.flatMap((el) => el.data);
    if(item.isActive === false) {
      item.isActive = true;
      item.percent = 0;
      const dataFilter = this.configLegend.filter((el) => el.isActive === false );
      const totalDatafilter = dataFilter.flatMap((el) => el.data);
      this.configLegend.forEach((el: { name: string; color: string; data: any[]; percent: number; isActive: boolean }) => {
        this.$store.commit(MutationTypes.SET_LOADING, {
            total: totalDta.length,
            completed: totalDta.length - totalDatafilter.length,
            percent: parseFloat(((totalDta.length - totalDatafilter.length) / totalDta.length * 100).toFixed(2)),
        })
        if(el.isActive === false) {
          el.percent = parseFloat(((el.data.length / totalDatafilter.length ) * 100).toFixed(2));
        }
      });
      this.$store.commit(MutationTypes.SET_LOADING, {
        completed: totalDta.length - totalDatafilter.length,
        total: totalDta.length,
        percent: parseFloat(((totalDta.length - totalDatafilter.length) / totalDta.length * 100).toFixed(2)),
        message: "Filtrage terminé",
      });
      
      let updateDataFilter = this.configLegend.filter((el) => el.isActive === false);
      this.$store.commit(MutationTypes.SET_LOADING, {
        total: 0,
        message: "Mise à jour des données",
      });
      updateDataFilter = updateDataFilter.flatMap((el) => el.data);
      const data = {
        data: updateDataFilter,
        sources: this.$store.state.appDataStore.data.sources,
      }
      this.$store.commit(MutationTypes.SET_FILTER_DATA, data);
      this.$store.commit(MutationTypes.SET_CANCEL_FILTER, true);
      this.$store.commit(MutationTypes.SET_LOADER, false);
    }
    else {
      item.isActive = false;
    const dataFilter = this.configLegend.filter((el) => el.isActive !== true);
      const totalDatafilter = dataFilter.flatMap((el) => el.data);
      this.configLegend.forEach((el: { name: string; color: string; data: any[]; percent: number; isActive: boolean }) => {
        if(el.isActive === false) {
          el.percent = parseFloat(((el.data.length / totalDatafilter.length ) * 100).toFixed(2));
        }
      });
      let updateDataFilter = this.configLegend.filter((el) => el.isActive !== true);
      updateDataFilter = updateDataFilter.flatMap((el) => el.data);
      const data = {
        data: updateDataFilter,
        sources: this.$store.state.appDataStore.data.sources,
      }
      this.$store.commit(MutationTypes.SET_FILTER_DATA, data);
      this.$store.commit(MutationTypes.SET_LOADER, false);
      const isAllInactive = this.configLegend.every((el) => el.isActive === false);
      if(isAllInactive) {
        this.$store.commit(MutationTypes.SET_CANCEL_FILTER, false);
        this.$store.commit(MutationTypes.SET_LOADING, {
          completed: 0,
          total: 0,
          percent: 0,
          message: "Aucun filtre actif",
        });
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 2000);
        }).then(() => {
          this.$store.commit(MutationTypes.SET_LOADER, false);
        });
      }

    }
  },


  
  async filter(item : { name: string; color: string; data: any[]; percent: number; isActive: boolean }) {
    item.percent = 100;
    this.$store.commit(MutationTypes.SET_LOADER, true);
    this.$store.commit(MutationTypes.SET_LOADING, {
      completed: 0,
      total: 0,
      percent: 0,
      message: "Filtrage des données...",
    })
    this.configLegend.forEach(el => {
        if(el.name !== item.name){
          el.isActive = true;
          el.percent = 0;
        }
    });
    let dataFilter = this.configLegend.filter((el) => el.name === item.name);
     dataFilter = dataFilter.flatMap((el) => el.data);

     const dataUpdate = {
      data: dataFilter,
      sources: this.$store.state.appDataStore.data.sources,
     }
    this.$store.commit(MutationTypes.SET_FILTER_DATA, dataUpdate);
    this.$store.commit(MutationTypes.SET_CANCEL_FILTER, true);
    this.$store.commit(MutationTypes.SET_LOADING, {
      completed: 0,
      total: 0,
      percent: 0,
      message: "Filtrage terminé",
    });
    this.$store.commit(MutationTypes.SET_LOADER, false);

  },
  
  async SetCancelFilter(value: boolean) {
    this.$store.commit(MutationTypes.SET_CANCEL_FILTER, value);
    this.$store.commit(MutationTypes.SET_LOADER, true);
    //Loader
    this.$store.commit(MutationTypes.SET_LOADING, {
      completed: 0,
      total: 0,
      percent: 0,
      message: "Réinitialisation des filtres",
    });
    const dataupdate = this.configLegend.flatMap((el) => el.data);
    const data = {
      data: dataupdate,
      sources: this.$store.state.appDataStore.data.sources,
    }
    this.$store.commit(MutationTypes.SET_FILTER_DATA, data);
    this.configLegend.forEach((el: { name: string; color: string; data: any[]; percent: number; isActive: boolean }) => {
      el.isActive = false;
      el.percent = parseFloat(((el.data.length / dataupdate.length) * 100).toFixed(2));
    });
    this.$store.commit(MutationTypes.SET_LOADING, {
      completed: 0,
      total: 0,
      percent: 0,
      message: "Réinitialisation terminée",
    });
    setTimeout(() => {
    }, 2000);
    this.$store.commit(MutationTypes.SET_LOADER, false);
  }
},
  
}

</script>


<style scoped>
.main-stripe {
  width: 100%;
  height: calc(100% / 2);
  padding: 10px;
  color: #14202C;
  display: flex;
  flex-direction: row;
  justify-content:flex-start;
  padding: 5px;
  align-items: flex-start ;
  box-shadow: 0px 3px 10px rgba(73, 84, 92, 0.16);
  font-family: Charlevoix;
  font-size: 14px;
  overflow: auto;
  gap: 2px;
}

.main-stripe div {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
}


.main-stripe span {
  color: #14202C;
  font-size: 14px;
  font-weight: 500;
  height: 16px;
  opacity: 1;
  width: 100%;
  font: normal normal normal normal 11px/13px Charlevoix Pro;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.underline {
  width: 100%;
  height: 1px;
  position: absolute;
  background-color: #14202C;
  left: 4px;
  top: 40%;
  transform: translateY(-55%);
  transition: transform 0.3s ease;
}

</style>