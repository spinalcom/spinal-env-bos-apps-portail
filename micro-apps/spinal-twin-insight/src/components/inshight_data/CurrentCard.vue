<template>
<div ref="currentCard" class="card-current-value"  >
    <span @click.stop="onClick" style="width: 20px; height: 20px; border-radius: 50%; background-color: #fff; font-size: 15px; color: rgb(0, 0, 0); position: absolute; right: -7px; top: -10px; font-weight: bold; display: flex; justify-content: center; align-items: center">X</span>
    <div class="space-select">
        <div class="roomName" :data-name="data.name" style="width: calc(100% - 25px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px;">
            <div class="color" :style="{ background: data.color }" style="display: inline-block"></div>
            <span style="font-size: 13px; color: rgb(20, 32, 44)">{{ data.name }} </span>
          </div>
    </div>
    <div class="content-indicateur">

        <table class="list-endpoint">
            <thead>
                <tr>
                    <th>Indicateur</th>
                    <th>Valeur</th>
                </tr>
            </thead>
            <tbody>
                <tr style="font-weight: bolder">
                    <td >
                        <div class="color" :style="{ background: data.color }" style="display: inline-block"></div>
                        {{ endpointName }}</td>
                        <td>{{ endpointValue }}{{ endpointUnit }}</td>
                    </tr>
                    <tr v-for="(item , idx) of indcateur">
                        <td>
                            <div class="color" :style="{ background: item.color }" style="display: inline-block"></div>
                            {{ item.name }}</td>
                            <td>{{ item.value }}{{ item.unit }}</td>
                            
                        </tr>
                    </tbody>
                </table>
            </div>
</div>
</template>
<script>
import { _getReadStaticDetails } from '../../services/spinalAPI/endpoints/getEndpoints';
import {store} from '../../services/store'
import { ActionTypes } from '../../interfaces/vuexStoreTypes';
export default {
    name: 'CurrentCard',
    props : {
        data : {
            type : Object,
            default : () => {},
            required : true
        },
        on3D : {
            type : Boolean,
            default : true
        },
      
    },

    data() {
        return {
            indcateur: [],
            endpointName: '',
            endpointValue: '',
            endpointUnit: '',
        }
    },
    computed: {

    },
    mounted() {
      this.getCurrentEndpoint();
      if(this.data.endpoint == undefined) {
        console.log('data endpoint is undefined');
        this.endpointName = this.data.source.name;
        this.endpointValue = this.data.displayValue;
        this.endpointUnit = this.data.source.unit;
      }else {
          this.endpointName = this.data.endpoint.name;
          const value = this.data.endpoint.value;
          if(typeof value === 'boolean') {
              this.endpointValue = value ? 1 : 0;
          }
          else if(value == null) {
              this.endpointValue = 'NaN';
          }
          else  {
              console.log('value', value);
              this.endpointValue = this.fixedValue(value);
          }
          this.endpointUnit = this.data.endpoint.unit;
      }
    },
    methods : {
        showCardCurrentValue() {
            this.showCardcurrentValue = true;
        },
        fixedValue(value) {
            if(Number(value) === value && value % 1 !== 0) {
                return value.toFixed(2);
            }
            return value;
        },
      
        hideCardCurrentValue() {
            store.dispatch(ActionTypes.REMOVE_ALL_SPRITES)
            this.showCardcurrentValue = false;
        },

        async getCurrentEndpoint () {
            const context = {
                dynamicId: this.data.dynamicId,
                type: this.data.type
            }
            const buildingId = localStorage.getItem('idBuilding');
            try {
                let endPointList = [];
                let legend = []
                const details = await _getReadStaticDetails(buildingId, context);
                
                store.state.appDataStore.appConfig.source.map((item) => {
                    details.controlEndpoint.map((control) => {
                        if(item.profileName == control.profileName) {
                            const endpoint = {
                                name: item.name,
                                endpoint: control.endpoints.filter((end) => end.name === item.name)
                            }
                            legendItem = {
                                name: item.name,
                                legend: item.legend
                            }
                            legend.push(legendItem);
                            endPointList.push(endpoint);
                        }
                    })
                    
                })
                console.log('endPointList', this.data);
                const endpointselected = endPointList.map((el) => {
                    if(el.endpoint.length == 0) {
                        const match = el.name !== this.data.source.name
                        if(match) {
                            return {
                                name: el.name,
                                endpoint: {
                                    name: el.name,
                                    value: NaN,
                                    unit: ""
                                }
                            }

                        }
                    }
                    const match = el.endpoint.find((end) => end.name !== this.data.source.name && end.value !== this.data.displayValue);
                    if(match){
                        return {
                            name: el.name,
                            endpoint: match
                        }
                    } 
                }).filter((el) => el !== undefined);
                endPointList = endpointselected;
                console.log('endPointList', endPointList);
                console.log('legend', legend);
                endPointList.map((item) => {
                    let value = null;
                    let unit = null;
                    let color = null;
                    if(item.endpoint) {
                        value = item.endpoint.value;
                        unit = item.endpoint.unit;
                        legend.map((leg) => {
                            if(leg.name == item.name) {
                               if(item.endpoint.value >= leg.legend.max.value) {
                                      color = leg.legend.max.color;
                                 } else if(item.endpoint.value <= leg.legend.min.value) {
                                      color = leg.legend.min.color;
                                 } else if(item.endpoint.value >= leg.legend.median.value) {
                                      color = leg.legend.median.color;
                                 }
                                 else {
                                        color = '#d6e2e6';
                                 }
                            }
                        
                        })                        
                    }
                   if(typeof value === 'boolean') {
                        value = value ? 1 : 0;
                    }
                    else
                    if(value == null) {
                        value = 'NaN';
                    }
                    this.indcateur = [...this.indcateur, {name: item.name, value: !isNaN(value)? value.toFixed(2) : value , unit: unit, color: color ? color : '#d6e2e6'}]
                })
                console.log('indcateur', this.indcateur);
                const uniqueEndpoints = this.indcateur.filter((item, idx, self) => {
                   if(isNaN(item.value)) {
                       return idx === self.findIndex((el) => el.name === item.name &&  isNaN(el.value));
                   }
                   return true;
                })
                this.indcateur = uniqueEndpoints;
            } catch (error) {
                console.error('Error fetching details in CurrentCard -> ', error);
            }
        },
        onClick() {
            if(this.on3D) {
                store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);
            }
            else 
            {
                this.$emit('removeCard');
            }
      
    },

        _isSelected() {},
    _isNotSelected() {},
    },

   
    
}
</script>


<style scoped>
    .card-current-value {
        position: absolute;
        top: 0;
        left: 30px;
        width: 300px;
        height: 150px;
        background-color: #fff;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        z-index: 100;
        display: flex;
        flex-direction: column;
        padding: 10px;
        color: #14202C;
        border-radius: 6px;
    }
    .content-indicateur {
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
    .content-indicateur::-webkit-scrollbar {
        width: 5px;
    }
    .content-indicateur::-webkit-scrollbar-thumb {
        background-color: #cac6c6;
        border-radius: 10px;
        border: 0.5px solid #868686c0
    }
    .content-indicateur::-webkit-scrollbar-track {
        background-color: #E5E3E3;
        border-radius: 10px;
    }
    .space-select {
        width: calc(100% - 20px);
        height: max-content;
        padding: 7px;
        background-color: #E5E3E3;
        border-radius: 6px;
}
.roomName:hover::before {
    content: attr(data-name);
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #14202C;
    padding: 5px;
    border-radius: 5px;
    font-size: 12px;
    color: #fff;
    font-weight: 500;
    
}
.color {
  width: 7px;
  height: 12px;
  margin-right: 4px;
  border-radius: 3px;
}
.list-endpoint {
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
    padding: 10px;
    border-radius: 10px;
}
.list-endpoint th {
    text-align: left;
    font-size: 12px;
    color: #14202C;
    font-weight: 500;
    padding: 5px;
    border-bottom: 1px solid #E5E3E3;
}
.list-endpoint tbody tr {
    font-size: 12px;
    border-bottom: 1px solid #E5E3E3;
    
}
.list-endpoint tbody tr td {
    padding: 5px;
    color: #14202C;
    max-width: 150px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.list-endpoint tbody tr td:first-child {
    max-width: 150px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>