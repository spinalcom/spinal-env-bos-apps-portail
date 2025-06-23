<template>


 <div class="filter-form">
   <div style="display: flex; align-items: center; gap: 10px;">
    <div>

        <v-btn depressed small style="background-color: #14202C; color: #ffffff;"  @click="showFilter = true; showFilterValue = false">
            <v-icon left>{{ iconFilter }}</v-icon>    
            <span style="font-size: 14px; font-weight: 500; text-transform: lowercase; font-family: 'Charlevoix', sans-serif;">
                {{ buttonName }}
            </span>
        </v-btn>
    </div>
    <div>
        <!-- Legend -->
<!-- Legend -->
        <Legend :legend="configLabel" />
    </div>
   </div>
     
     <div
        v-if="showFilter"
     class="filter-content"
     >
     <div
     class="filter-header"
     >
     <h3>Filtre sur {{ columnSelected }}</h3>
    </div>
    
    <div class="filter-body">
        <div class="filter-column">
            <span class="label-column">
                Sélectionner une colonne
            </span>
            <ul>
                <li class="column" v-for="(col, index) in column" :key="index" @click="showForm(col)" :style="{ backgroundColor: columnSelected === col.text ? '#14202C' : '#ffffff', boxShadow: columnSelected === col.text ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none', transform: columnSelected === col.text ? 'scale(1.02)' : 'scale(1)', color: columnSelected === col.text ? '#ffffff' : '#14202C' }">
                    <div class="applied-filter" v-if="filterapplied(col.text)"></div>
                    <span style="padding-inline: 25px;">
                        {{ col.text }}
                    </span>

                    <div>
                                <input
                                :checked="mainFilterColumn === col.text"
                                @click.stop="toggleMainFilter(col.text)"
                                v-if="filterapplied(col.text)"
                                title="assigner le filtre à la frise"
                                type="checkbox"
                                />
                        <v-icon :style="{color: columnSelected === col.text ? '#ffffff': '#14202C'}">mdi-chevron-right</v-icon>
                    </div>
                </li>
            </ul>
        </div>
        <div
          v-if="showFilterValue"
        class="filter-value"
        >
        <section style="width: 100%;">
            <div style="display: flex; gap: 10px; align-items: center;">
                <span>
                    Filtrer par :
                </span>
                    <span class="badge" @click="isText = true; isNumber =  false" :style="{'background-color': isText ? '#142020' : '', 'color': isText ? '#fff':''}">
                        Regex
                    </span>
                    <span class="badge" @click="isNumber= true; isText = false" :style="{'background-color': isNumber ? '#14202C' : '', 'color': isNumber  ? '#fff' : ''}">
                        nombre
                    </span>


                </div>
       <div v-if="isText">
         <div
                class="filter-value-input"
        >
          <v-text-field
           style="width: 100%"
            label="Entrer une valeur"
            placeholder="ex: ^[a-zA-Z0-9]+$)"
            v-model="filterValue"
            outlined
            dense
          ></v-text-field>
        </div>
          <div
                class="color-section"
          >
          <ul class="filter-regex-list">
            <li  class="label" v-for="(item, index) in filterRegex" :key="index">
                <span>
                    {{  item.name }}
                </span>
                <div style="width: 20px; height: 20px; border-radius: 5px; position: relative;" :style="{ backgroundColor: item.color }" @click.stop="ShowBoxcolor(item)">

                </div>
                <div class="box-color" v-if="item.showBoxColor">
                        <v-icon style="position: absolute; top: -10px; right: -4px; z-index: 1000; background-color: #ffffff; border-radius: 50%; border: 1px solid #14202C;
                            padding: 2px; cursor: pointer; font-size: 14px; color: #14202C;" @click="item.showBoxColor = false">mdi-close</v-icon>
                    <div class="body">
                        <v-color-picker
                        v-model="item.color"
                        mode="hexa"
                        />
                    </div>
                </div>
            </li>
          </ul>


          </div>
       </div>
       <div v-if="isNumber">

                <div style="width: 100%; height: max-content;  padding: 10px; display: flex; flex-direction: column; gap: 4px; justify-content: flex-start;">
                <li  class="label-number" v-for="(item, index) in filterNumber" :key="index">

                    <div class="box">
                        <span>
                            {{  item.name }}
                        </span>
                    </div>

                <div class="box">
                    <input v-if="item.name !== 'non défini'" type="number" name="" id="" v-model="item.value">
                </div>
                <div class="box">
                    <div style="width: 20px; height: 20px; border-radius: 5px; position: relative;" :style="{ backgroundColor: item.color }" @click.stop="ShowBoxcolor(item)">
                </div>
                <div class="box-color" v-if="item.showBoxColor">
                        <v-icon style="position: absolute; top: -10px; right: -4px; z-index: 1000; background-color: #ffffff; border-radius: 50%; border: 1px solid #14202C;
                            padding: 2px; cursor: pointer; font-size: 14px; color: #14202C;" @click="item.showBoxColor = false">mdi-close</v-icon>
                    <div class="body">
                        <v-color-picker
                        v-model="item.color"
                        mode="hexa"
                        />
                    </div>
                </div>
                </div>
                
           
            </li>
                </div>
       </div>

        </section>
        
        </div>
    </div>
    
    <div class="filter-footer">
        <v-btn depressed small color="#e1e3e1" @click="showFilter = false;  showFilterValue = false">Fermer</v-btn>
        <v-btn depressed small color="#14202C" @click="SaveFilter" style="color: #ffffff;">Appliquer</v-btn>
    </div>
</div>

</div>
</template>





<script lang="ts">
import { MutationTypes } from '../services/store/appDataStore/mutations';
import Legend from './legend.vue';


 export default {
    name: 'FilterForm',
    components: {
        Legend
    },
    props: {
        buttonName: {
            type: String,
            default: 'Configurer un filtre'
        },
        iconFilter: {
            type: String,
            default: 'mdi-filter'
        },
        column: {
            type: Array as () => any[],
            required: true
        },
    },

    data() {
        return {
            columnSelected: null,
            columnSelectedList: [] as string[],
            dataFiltered: [] as any[],
            filterList : [] as {colum: string, value: string | number}[],
            valueFilters: [] as any[],
            showFilter: false,
            showFilterValue: false,
            isNumber: false,
            isText: false,
            filterValue: '',
            filterData: [],
            dataAlt: [] as any[],
            mainFilterColumn: '',
            mainFilter: {
                column:'' as string,
                type: '' as string,
                data: [] as { name: string; value: number; color: string }[],
                
            },
            filterNumber : [
                {
                    name: 'max',
                    data: [] as any[],
                    showBoxColor: false,
                    value: 50,
                    color: '#14202C',
                    isActive: false,
                    percent: 0
                },
                {
                    name: 'median',
                    data: [] as any[],
                    showBoxColor: false,
                    value: 0,
                    color: '#e6af30',
                    isActive: false,
                    percent: 0
                },
                {
                    name: 'min',
                    data: [] as any[],
                    showBoxColor: false,
                    value: 12,
                    color: '#6e60e6',
                    isActive: false,
                    percent: 0
                },
                {
                    name: 'non défini',
                    data: [] as any[],
                    showBoxColor: false,
                    value: 0,
                    color: '#ab0322',
                    isActive: false,
                    percent: 0
                }
            ],
            filterRegex: [
                {
                    name: 'correspond',
                    data: [] as any[],
                    color: '#17641B',
                    showBoxColor: false,
                    percent: 0,
                    isActive: false,

                },
                {
                    name: 'ne correspond pas',
                    data: [],
                    color: '#ff0f73',
                    showBoxColor: false,
                    percent: 0,
                    isActive: false,
                },
                
                {
                    name: 'doublon',
                    data: [],
                    color: '#7b03ab',
                    showBoxColor: false,
                    percent: 0,
                    isActive: false,
                },
                {
                    name: 'non défini',
                    data: [],
                    color: '#ab0322',
                    showBoxColor: false,
                    percent: 0,
                    isActive: false,
                }
            ]
        }
    },

    methods: {

         isValueNumber(value: any): boolean {
            // Vérifie si c'est un vrai nombre ou une chaîne convertible
            return typeof value === 'number' || (!isNaN(Number(value)) && value !== '');
        },

        isValueText(value: any): boolean {
            // Ce n'est pas un nombre valide
            return !this.isValueNumber(value);
        },
        showForm(column) {
            const name = column.value;
            this.filterValue = this.$store.state.appDataStore.ValueRegex.regex || '';
            const items = this.$store.state.appDataStore.filterDataConfig.data;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const key = Object.keys(item).find(key => key == name);
                if (key) {
                    this.isNumber = this.isValueNumber(item[key]);
                    this.isText = this.isValueText(item[key]);
                    this.columnSelected = column.text;
                    if(!this.columnSelectedList.includes(column.text)) {
                        this.columnSelectedList.push(column.text)
                    }
                    this.showFilterValue = true;
                    break;
                }
            }

            
        },

        ShowBoxcolor(item: {
            name: string;
            data: any[];
            color: string;
            showBoxColor: boolean;
            mode?: string[];

        }) {
            item.showBoxColor = !item.showBoxColor;
        },

        SaveFilter() {
        this.showFilter = false;
        const column = this.columnSelected;
        
        if (this.isNumber) {
            console.log('isNumber');
            const filterData = this.filterDataWithNumber(
            this.filterDataConfig,
            column,
            this.filterNumber
            );

            const numberFilter = {
            column,
            type: 'number',
            range: filterData
            };

            const index = this.valueFilters.findIndex(f => f.column === column && f.type === 'number');
            if (index !== -1) {
                this.valueFilters[index] = numberFilter
                if( this.mainFilterColumn === column) {
                    this.mainFilter = numberFilter;
                    this.$store.commit(MutationTypes.SET_STRIPE_DATA, this.mainFilter);
                }
            }
            
            else {
                this.valueFilters.push(numberFilter)
            };

            this.$store.commit(MutationTypes.SET_CONFIG_LABEL, this.valueFilters);            
            // this.$store.commit(MutationTypes.SET_VALUE_FILTERS, this.valueFilters);
        }

       else if (this.isText) {
            console.log('isText');
            const filtered = this.filterDataWithRegex(
            this.filterDataConfig,
            this.filterValue,
            column
            );
            const regexFilter = {
            column,
            type: 'regex',
            regex: this.filterValue,
            data: filtered
            }

            const index = this.valueFilters.findIndex(f => f.column === column && f.type === 'regex');
            if (index !== -1) {
                this.valueFilters[index] = regexFilter;
                if( this.mainFilterColumn === column) {
                    this.mainFilter = regexFilter;
                    this.$store.commit(MutationTypes.SET_STRIPE_DATA, this.mainFilter);
                }
            } else {
                this.valueFilters.push(regexFilter);
            }

            

            this.$store.commit(MutationTypes.SET_CONFIG_LABEL, this.valueFilters);

        }
        // this.$store.commit(MutationTypes.SET_CONFIG_LABEL, this.valueFilters);

        this.columnSelected = null;

        },

filterDataWithNumber(data: any[], selectedColumn: string, filter: any[]) {
  let columnName = this.column.find(col => col.text === selectedColumn)?.value || this.$store.state.appDataStore.StripeDataList.column
    || this.$store.state.appDataStore.ValueRegex.column;
  if (!columnName) return [];

  const groupesFiltres = JSON.parse(JSON.stringify(this.filterNumber || []));

  const { maxValue, minValue } = filter.reduce((acc, filtre) => {
    if (filtre.name === 'max') acc.maxValue = parseFloat(filtre.value);
    if (filtre.name === 'min') acc.minValue = parseFloat(filtre.value);
    return acc;
  }, { maxValue: 0, minValue: 0 });
    columnName = columnName.replace(/ /g, '_'); // Replace spaces with underscores if needed
  for (const item of data) {
    const rawValue = item[columnName];
    if (rawValue === undefined || rawValue === null || rawValue === 'non défini' ) {
      groupesFiltres.find(g => g.name === 'non défini')?.data.push(item);
      continue;
    }

    const valeur = parseFloat(rawValue);
    if (isNaN(valeur)) {
      groupesFiltres.find(g => g.name === 'non défini')?.data.push(item);
      continue;
    }

    if (valeur <= minValue) {
      groupesFiltres.find(g => g.name === 'min')?.data.push(item);
    } else if (valeur >= maxValue) {
      groupesFiltres.find(g => g.name === 'max')?.data.push(item);
    } else {
        groupesFiltres.find(g => g.name === 'median')?.data.push(item);
    }
  }

  const total = data.length;
    groupesFiltres.forEach(g => {
        g.percent = total > 0 ? +(g.data.length * 100 / total).toFixed(2) : 0;
    });

  return groupesFiltres;
},
 

    filterDataWithRegex(data: any[], regex: string, columnSelected: string) {
    let columnName = this.column.find(col => col.text === this.columnSelected)?.value || this.$store.state.appDataStore.StripeDataList.column;
    if (!columnName) return [];

   
    const localFilterGroups = JSON.parse(JSON.stringify(this.filterRegex));

    const regexPattern = regex ? new RegExp(regex, 'i') : this.$store.state.appDataStore.ValueRegex.regex;
    const seen = new Map<string, any[]>();
    columnName = columnName.replace(/ /g, '_'); // Replace spaces with underscores if needed
    for (const item of data) {
        const value = item[columnName];
        const strValue = String(value);

        if (!value || value === 'undefined' || value === 'non défini') {
            localFilterGroups.find(g => g.name === 'non défini')?.data.push(item);
            continue;
        }

        if (regexPattern.test(strValue)) {
            if (!seen.has(strValue)) seen.set(strValue, []);
            seen.get(strValue)?.push(item);
        } else {
            localFilterGroups.find(g => g.name === 'ne correspond pas')?.data.push(item);
        }
    }

    for (const [val, items] of seen.entries()) {
        if (items.length > 1) {
            localFilterGroups.find(g => g.name === 'doublon')?.data.push(...items);
        } else {
            localFilterGroups.find(g => g.name === 'correspond')?.data.push(...items);
        }
    }

    const total = data.length;
    localFilterGroups.forEach(g => {
        g.percent = total > 0 ? +(g.data.length * 100 / total).toFixed(2) : 0;
    });
    return localFilterGroups;
},
filterapplied(column: string) {
        return this.valueFilters.some(filter => filter.column === column);
    },

    toggleMainFilter(col: string) {
        this.mainFilterColumn = this.mainFilterColumn === col ? '' : col;
        this.mainFilter = this.$store.state.appDataStore.configLabel    .find(filter => filter.column === this.mainFilterColumn);
        if(this.mainFilter) {
            this.$store.commit(MutationTypes.SET_STRIPE_DATA, this.mainFilter)
        }
    }


},


    computed: {
        selectedZone() {
            return this.$store.state.appDataStore.zoneSelected;
        },
        filterDataConfig() {
            return this.$store.state.appDataStore.filterDataConfig.data;
        },
        spaceSelected() {
            return this.$store.state.appDataStore.zoneSelected;
        },
         configLabel() {
  return this.$store.state.appDataStore.configLabel.filter(filter => filter.column != "");
}
        
    },
    
    watch: {
        
        spaceSelected: {
            handler(newData) {
                const dataConfig = this.$store.state.appDataStore.data.data;
                const regex = this.$store.state.appDataStore.ValueRegex.regex;
                
            },
            immediate: true
        },

        filterDataConfig: {
            handler(newData) {
                const stripeData = this.$store.state.appDataStore.StripeDataList;
                if(stripeData.type === 'regex') {
                    this.isText = true;
                    this.isNumber = false;
                    const filterData = this.filterDataWithRegex(newData, stripeData.regex, stripeData.column);
                    const regexFilter = {
                        column: stripeData.column,
                        type: 'regex',
                        regex: stripeData.regex,
                        data: filterData
                    };
                    const index = this.valueFilters.findIndex(f => f.column === stripeData.column && f.type === 'regex');
                    if (index !== -1) {
                        this.valueFilters[index] = regexFilter;
                    } else {
                        this.valueFilters.push(regexFilter);

                    }
                    this.$store.commit(MutationTypes.SET_CONFIG_LABEL, this.valueFilters);
                    this.mainFilter = this.$store.state.appDataStore.configLabel.find(filter => filter.column === stripeData.column);
                    if(this.mainFilter) {
                        this.$store.commit(MutationTypes.SET_STRIPE_DATA, this.mainFilter);
                    }
                }
                else if(stripeData.type === 'number') {
                    this.isText = false;
                    this.isNumber = true;
                    const filterData = this.filterDataWithNumber(newData, stripeData.column, this.filterNumber);
                    const numberFilter = {
                        column: stripeData.column,
                        type: 'number',
                        range: filterData
                    };
                    const index = this.valueFilters.findIndex(f => f.column === stripeData.column && f.type === 'number');
                    if (index !== -1) {
                        this.valueFilters[index] = numberFilter;
                    } else {
                        this.valueFilters.push(numberFilter);
                    }
                    this.$store.commit(MutationTypes.SET_CONFIG_LABEL, this.valueFilters);
                    this.mainFilter = this.$store.state.appDataStore.configLabel.find(filter => filter.column === stripeData.column);
                    if(this.mainFilter) {
                        this.$store.commit(MutationTypes.SET_STRIPE_DATA, this.mainFilter);
                    }
                }
                
                
               
            }
        },

        mainFilterColumn: {
            handler(newData) {
                if (newData.column) {
                    this.appliedMainFilter(newData.column);
                }
            },
            immediate: true
        }
    }
    
 }

</script>


<style  scoped>

.filter-form {
    width: max-content;
    height: max-content;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    user-select: none;
}



.filter-content {
    width: max-content;
    height: 500px;
    display: flex;
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    background-color: transparent;
    border-radius: 8px;
    padding: 20px;
    gap: 20px;
    z-index: 1000;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    right: -10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color:#ffffff;
}

.filter-body {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100% - 100px);
    justify-content: space-between;
    gap: 4px;
}
.filter-column {
    width: 500px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    background-color: #ffffff;
    border-radius: 5px;
}
.filter-column .label-column {
    position: absolute;
    top: -12px;
    left: 10px;
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
    text-transform: lowercase;
    padding: 2px;
    background-color: #14202C;
    border-radius: 5px;
    outline: 4px solid #ffffff;
}
.filter-column > span::first-letter {
    text-transform: uppercase;
    font-weight: bold;
    font-family: 'Charlevoix', sans-serif;
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
    font-family: 'Charlevoix', sans-serif;
}
.filter-column ul {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0;
    margin: 0;
    padding: 20px    ;
}

.filter-column  .column {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border: 1px solid #14202C;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    transition: all 0.2s ease;
    font-family: 'Charlevoix', sans-serif;
    font-weight: 600;
    font-size: 16px;
    align-items: center;
    text-transform: capitalize;
}
.filter-column .column div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.selected-column {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #14202C;
    margin-right: 10px;
    border: 2px solid #ffffff;
    outline: 4px solid #14202C;
}

.filter-column li:hover {
    background-color: #f0f0f0;
    font-family: 'Charlevoix', sans-serif;
    font-weight: 700;
}

.filter-value {
    width: 500px;
    min-height: 200px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff;
    transition: all 1s linear;
    border-radius: 5px;

}
.filter-value-input {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 20px;
}
.color-section {
    width: 100%;
}
.filter-regex-list {
   width: 100%;
   display: flex;
    flex-direction: row ;
    flex-wrap: wrap;
    gap: 10px;
    align-items: start;


}
.filter-regex-list  > .label {
    width: max-content;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 7px;
    border: 1px solid #14202C;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 700;
    padding: 5px;
    text-transform: lowercase;
    position: relative;
}
.filter-regex-list  > .label span {
    width: max-content;
}

.box-color {
    width: 270px;
    height: 270px;
    position: absolute;
    top: 20px;
    left: 90%;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    padding: 4px;
    background-color: #ffffff;
    backdrop-filter: blur(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #14202C;
}



.box-color .body {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
   overflow: hidden;
   overflow-y: auto;
   padding: 5px;
}
.box-color .v-color-picker {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}
.filter-footer {
    width: 100%;
    display: flex;
   justify-content: flex-end;
    gap: 10px;
}
.filter-footer v-btn {
    width: max-content;
    height: max-content;
    font-size: 14px;
    font-weight: 600;
    text-transform: lowercase;
    font-family: 'Charlevoix', sans-serif;
}


.badge {
    width: max-content;
    height: max-content;
    padding: 4px;
    border-radius: 5px;
    border: 1px solid #14202C;
    font-weight: 600;

}

.label-number {
    position: relative;
    border: 1px solid #14202C;
    display: flex;
    gap: 5px;
    align-items: center;
    border-radius: 5px;
    padding-inline: 10px;
    justify-content: space-between;   
}
.label-number .box {
    width: calc(100% / 3);
    /* background-color: chocolate; */
}
.label-number .box:last-child {
    display: flex;
    justify-content: flex-end;
}
.label-number .box:nth-child(2) {
    display: flex;
    justify-content: center;
}
.label-number input {
    width: 70px;
    border: 1px solid #14202C;
    padding: 5px;
    border-radius: 5px;
    outline: none;
    text-align: center;
    font-weight: 600;
}
.applied-filter{
    position: absolute;
    left: 10px;
   width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #2e7200;
    margin-right: 10px;
    border: 2px solid #ffffff;
    outline: 4px solid #2e7200c4;
}
</style>