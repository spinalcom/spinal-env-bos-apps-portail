<template>
  <div style="width: 100%; height: 100%;" >
    <div  v-show="showLoader" class="flex-column" style="width: 100%; height: 100%; position: absolute; top: 0; left:0; background-color: red; z-index: 9999;"></div>
    <v-data-table
    style="height: 100% !important; overflow: hidden; overflow-y: auto;"
    mobile-breakpoint="0"
    :headers="headers"
    :items="item"
    :items-per-page="15"
    fixed-header
    :footer-props="{
    'items-per-page-text':'Lignes par page',
    'page-text': '$vuetify.dataFooter.pageText',
    'items-per-page-all-text': 'Toutes',
    firstIcon: 'mdi-arrow-left',
    lastIcon: 'mdi-arrow-right',
  }"
  >
    
  <template v-for="header in headers" v-slot:[`header.${header.value}`]="{ header }">
      <div @click="headershow(header)" :class="{ 'selected-class': selected_header === header.text }"
        style="display: flex;flex-direction: row;justify-content: space-between; align-items: center ; height: 40px;">
        <span id="headerName">{{ header.text }}</span>
        <div style="width: 39px;  transform: translate(-14px,3px); ">
          <v-select v-model="selections['filter']" :menu-props="{ offsetY: true }" :label="''" multiple
            append-icon="mdi-chevron-down" color="#14202C" item-color="#14202C" class="d-flex justify-center align-center"
            @click.stop=""

            style="width:25px;min-width: 25px;font-size: 14px !important;transform: translate(10%,10%); border: none; outline: none; "
            @change="handleFilter(selections)"
            v-if="header.filterable" :items="getUniqueColumnValues(stripeData)">
            <template v-slot:selection="{ item, index }">
              <div v-if="index == 0"
                style="position: absolute;background-color: #14202c;color: white;border-radius: 10px;width: 14px;height: 14px;font-size: 11px;display: flex;justify-content: center;align-items: center;transform: translate(15px,-8px);">
                {{ selections['filter'].length }} </div>
            </template>
          </v-select>
        </div>
        <div  title="Cliquez pour ordonner" style=" width: 30px;display: flex;justify-content: center;align-items: center;">
        </div>
        <div
          style="height: 100%;background-color: white;position: absolute;transform: translate(-16px);">
        </div>
      </div>
    </template>


   <template  v-for="header in headers"  v-slot:[`item.${header.value}`]="{value }" >
        <template v-if="columsIsSelected(header)" style="max-width: 400px; width: 400px;">
            <SmallLegend class="ml-3" :size="11" :color="getColor(value, header.text)" :text="`${value}`"/>
        </template>
        <template v-else-if="header.isEndpoint">
            <SmallLegend class="ml-3" :size="11" :color="'#14202C'" :text="`${value}`"/>
        </template>
        <template v-else>
            <div class="font-table
            ">{{value}}</div>
        </template> 

   </template>
  </v-data-table>
  </div>
</template>

<script lang="ts">
import SmallLegend from './SmallLegend.vue';
// import { config } from '../../config';
import { get } from 'http';
import { MutationTypes } from '../services/store/appDataStore/mutations';
import { parseRegex } from '../services';
import Loader from './Loader.vue';
export default {
    name: 'SpinalTable',
    components: {
        SmallLegend,
        Loader
    },
    props: {
        item: {
            type: [] as any[],
            required: true
        },
        headers: {
            type: [] as any[],
            required: true
        }
    },
    data() {
        return {
          itemData: this.item,
          stripeData: [] as  any[],
          duplicate: [] as any[],
          warning: [] as any[],
          missing: [] as any[],
          seen: new Map(),
          selected_id: null,
          selected_header: null,
          arrow: false, 
          selections: {} as any,
          showLoader: false,

        };
        },


   watch: {
      
      dataStripe: {
        handler(newData) {
          this.getUniqueColumnValues(newData);
          this.filterOnStripeComponent(newData);

        }
      },
      selections : {
        handler(newData) {
          this.selections = newData;
        }
      }
    },
    
   
    methods: {
      columsIsSelected(header: any) {
        const dataFilter = this.$store.state.appDataStore.configLabel;
        const columnFilter = dataFilter.find((el) => el.column === header.text);
        if (columnFilter) return true; // Si la colonne est trouvée dans le filtre, on retourne true
        return false;
        
      },







   async handleFilter(val: { filter?: any[] }) {
  
  // Afficher le loader au début
  this.showLoader = true;

  // Log pour vérifier que showLoader est vrai

      this.filtredData(val);

     // Masquer le loader après le filtrage
  this.showLoader = false;

    },


      async getStripeData(data: any) {
    const stripLegend = this.config.bilan.timeline;
    const source = this.config.sources.find((src) => src.id === stripLegend.sourceId);
    this.stripeData = this.item.map((el) => {
      if (el.sources) {
        const stripe = el.sources.find(
          (st) => st.name.toLowerCase() === source?.name?.toLowerCase()
        );
        return stripe || null; 
      }
      return null; 
    }).filter(Boolean); 

    const configL = stripLegend.setup.legend;
    const type = stripLegend.setup.type;
     this.seen = new Map();
     this.duplicate = [];
     this.warning = [];
     this.missing = [];
    if(data.length > 0) {
      for (const stripe of data) {
         const value = stripe?.value;    
      
        if (type === "regex") {
          const regex = parseRegex(stripLegend.setup.value);
          
          // Vérifie si la regex existe et fonctionne correctement
          
          
          if (value === 'undefined' || value === "") {
            this.missing.push(value);
            
          } else {
                if (regex.test(value)) {
                    if(this.seen.has(value)) {
                      const count = this.seen.get(value);
                      this.seen.set(value, count + 1);
                    } else {
                      this.seen.set(value, 1);
                    }
                  } else {
                    this.warning.push(value);
                  }
            }
          }          
    }
    this.seen.forEach((value, key) => {
      if(value > 1) {
        this.seen.delete(key);
        this.duplicate.push(key);
      }
    })
  }
},
 
getColor(value: any, header: string) {
  const dataFilter = this.$store.state.appDataStore.configLabel;
  const DataColumn = dataFilter.find((el) => el.column === header);
  if(DataColumn.type === "regex") {
    const column = DataColumn.column?.replace(' ', '_');
    for(const data of DataColumn.data) {
      for(let item of data.data) {
        const value_data = item[column];
        if (value_data === value) {
          return data.color; // On retourne la couleur du groupe (data), pas item.color
        }
      }
  }
}
else if (DataColumn.type === "number") {
  const column = DataColumn.column?.replace(' ', '_');
  const numValue = Number(value);
  // Clone + tri décroissant
  const sortedRange = [...DataColumn.range].sort((a, b) => Number(b.value) - Number(a.value));

  for (let i = 0; i < sortedRange.length; i++) {
    const current = Number(sortedRange[i].value);
    const next = i + 1 < sortedRange.length ? Number(sortedRange[i + 1].value) : -Infinity;


    if(numValue >= current) {
      return sortedRange[i].color; // Si la valeur est supérieure ou égale à la valeur actuelle, on retourne la couleur
    }



  if (numValue < current && numValue >= next) {
      return sortedRange[i].color;
    }
  }
  return '#cccccc'; // Si aucune correspondance trouvée, retourner une couleur par défaut
 
}

  



  // for (const el of dataFilter) {
  //   const data = el.data;

  //   for (const item of data) {
  //    const column = this.valueRegex.column?.replace(' ', '_');
  //     const value_data = item[column];
  //     if (value_data === value) {
  //       return el.color; // On retourne la couleur du groupe (el), pas item.color
  //     }
  //   }
  // }

  // Si aucune correspondance trouvée
  return '#14202C';
},
  getUniqueColumnValues(data: any[]) {
     const warning = {
      text: this.config.bilan.timeline.setup.legend?.find((src) => src.type === "warning")?.name,
      value: this.warning,
     }
      const duplicate = {
        text: this.config.bilan.timeline.setup.legend?.find((src) => src.type === "dual")?.name,
        value: this.duplicate,
      }
      const missing = {
        text: this.config.bilan.timeline.setup.legend?.find((src) => src.type === "missing")?.name,
        value: this.missing,
      }
      this.seen.forEach((value, key) => {
      });
      const correct = {
        text: this.config.bilan.timeline.setup.legend?.find((src) => src.type === "success")?.name,
        value: Array.from(this.seen.keys()),
      }
      const filter = [
        correct,
        warning,
        duplicate,
        missing
      ];
      // this.$store.commit(MutationTypes.SET_FILTER_DATA, filter);

      return [correct ,warning, duplicate, missing];
    },

  headershow(header) {
      this.selected_header = header.text
    },

    async filtredData(val: { filter?: any[] }) {
  if (!val.filter || !Array.isArray(val.filter)) return;

  const filterSet = new Set(val.filter);
  const result: any[] = [];

  this.$store.commit(MutationTypes.SET_LOADER, true);
  this.$store.commit(MutationTypes.SET_LOADING, {
    message: "Chargement des données",
    total: this.stripeData.length,
    complete: 0,
    percent: 0,
  });

  // Batching sur le filtrage
  let i = 0;
  const batchSize = 300;

  const processStripeData = () => {
    const end = Math.min(i + batchSize, this.stripeData.length);

    for (; i < end; i++) {
      const data = this.stripeData[i];
      for (const filterItem of filterSet) {
        if (filterItem.includes(data.value)) {
          result.push(data);
          break;
        }
      }
    }

    const completed = i;
    this.$store.commit(MutationTypes.SET_LOADING, {
      complete: completed,
      total: this.stripeData.length,
      percent: Math.round((completed / this.stripeData.length) * 100),
    });

    if (i < this.stripeData.length) {
      setTimeout(processStripeData, 0);
    } else {
      // Ensuite on traite sourceData
      const sourceData = this.item.map((el) => {
        if (el.sources) {
          return {
            dynamicId: el.dynamicId,
            sources: el.sources,
          };
        }
        return null;
      }).filter(Boolean);

      const resultSet = new Set(result.map(r => `${r.name}_${r.dynamicId}`));
      const replaceSource = sourceData.filter((el: any) => {
        return el.sources.some((src: any) =>
          resultSet.has(`${src.name}_${el.dynamicId}`)
        );
      });

      this.itemData = this.updateData(replaceSource);

      this.$store.commit(MutationTypes.SET_LOADER, false);
    }
  };

  processStripeData();
},
  filterOnStripeComponent(data){
    const sourceData = this.item.map((el) => {
      if(el.sources) {
        const value = {
          dynamicId: el.dynamicId,
          sources: el.sources
        }
        return value;
      }
      return null;
    }).filter(Boolean);

    let replaceSource : any[] = [];
    sourceData.forEach((el: any) => {
      const sources = el.sources;
      sources.map((src: any)=> {
        const macth = data.find((item: any) => item.name === src.name && item.dynamicId === src.dynamicId);
        if(macth) {
          const value = {
           dynamicId: el.dynamicId,
           sources: el.sources 
          }
          replaceSource.push(value);
        }
      })
    })
    this.itemData = this.updateData(replaceSource);

  },


  updateData(update: any[]){   
    if(update.length === this.item.length) {
      return this.item;
    } 
    else {
      return this.item.map((item: any) => {
        const data = update.find((el: any) => el.dynamicId === item.dynamicId);
        return data ? {...item, sources: [...data.sources]} : null;
      }).filter(Boolean);
    }
   

  }

},

computed: {
    dataStripe() {
      return this.$store.state.appDataStore.StripeDataList;
    },
    spaceSelected() {
      return this.$store.state.appDataStore.zoneSelected;
    },
    valueRegex() {
      return this.$store.state.appDataStore.ValueRegex as {regex: string, column: string};
    },
    config() {
    return this.$store.state.appDataStore.appConfig;
  }


  },
}



</script>

<style scoped>
.font-table {
  font: normal normal normal 11px/13px Charlevoix !important;
  letter-spacing: 1.1px;
  color: #14202C;
  opacity: 1;
  box-shadow: none !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.v-data-table {
  display: flex;
  flex-direction: column;
}
::v-deep .v-data-table__wrapper {
  flex-grow: 1;
  height: 0;
  overflow-y: auto !important;
}


::v-deep tr:first-child th{
  border: none !important;
  outline: none !important;
  color: #214353 !important;
  font-size: 10px !important;
  height: 16px !important;
  border-bottom: 1px solid white !important;
  border-right: 1px solid white !important;
  border-top: 1px solid white !important;

}
::v-deep .v-data-table th {
  height: 16px !important;
  font-size: 10px !important;
  color: #214353 !important;
  border: none !important;
}
::v-deep thead th .text-start .sortable {
  border: none !important;
}

::v-deep td {
  font-size: 14px !important;
  color: #14202C !important;
  background-color: #F4F4F4;
  border-bottom: 1px solid white !important;
  border-right: 1px solid white !important;
}

::v-deep tr:hover td {
  background-color: #f0f0f0 !important;
}
::v-deep tbody {
  padding: 10px !important;
}
::v-deep tbody tr  td:first-child {
    border-radius: 7px 0px 0px 7px !important;
}
::v-deep tbody tr  td:last-child {
    border-radius: 0px 7px 7px 0px !important;
}
::v-deep .v-icon__svg {
  fill: #214353 !important;
}

::v-deep .v-list .v-list-item--active, .v-list .v-list-item--active .v-icon {
  background-color: #2f5321 !important;
}

::v-deep .v-text-field.v-input--is-focused > .v-input__control > .v-input__slot:after{
  color: #214353;
}

::v-deep .v-list-item--link:before {
  background-color: #1500ff !important;
}

::v-deep .v-application .primary--text {
  color: #14202C !important;
  caret-color: #14202C !important;
  background-color: #1500ff !important;
}
</style>