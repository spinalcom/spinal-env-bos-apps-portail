<template>
    <div ref="currentCard" class="card-current-value"  >
        <span @click.stop="onClick" style="width: 20px; height: 20px; border-radius: 50%; background-color: #fff; font-size: 15px; color: rgb(0, 0, 0); position: absolute; right: -7px; top: -10px; font-weight: bold; display: flex; justify-content: center; align-items: center">X</span>
        <div class="space-select">
            <div style="width: calc(100% - 25px)">
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
    import { off } from 'process';
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
            }
        },
    
        data() {
            return {
                indcateur: []
            }
        },
        computed: {
            endpointName() {
                return this.data.endpoint.name;
            },
            endpointValue() {
                const value = this.data.endpoint.value;
                if(typeof value === 'boolean' ){
                    return value ? 1 : 0;
                }
                else if(value == null) {
                    return 'NaN';
                }
                else {
                    
                    return value;
                }
            },
            endpointUnit() {
                return this.data.endpoint.unit;
            }
    
        },
        mounted() {
          this.getCurrentEndpoint();
        },
        methods : {
          
           
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
                    endPointList = endPointList.filter((item) => item.name != this.data.endpoint.name);
                    endPointList.map((item) => {
                        let value = null;
                        let unit = null;
                        let color = null;
                        if(item.endpoint.length > 0) {
                            value = item.endpoint[0].value;
                            unit = item.endpoint[0].unit;
                            legend.map((leg) => {
                                if(leg.name == item.name) {
                                   if(item.endpoint[0].value >= leg.legend.max.value) {
                                          color = leg.legend.max.color;
                                     } else if(item.endpoint[0].value <= leg.legend.min.value) {
                                          color = leg.legend.min.color;
                                     } else if(item.endpoint[0].value >= leg.legend.median.value) {
                                          color = leg.legend.median.color;
                                     }
                                     else {
                                            color = '#1f2937';
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
                        this.indcateur = [...this.indcateur, {name: item.name, value: value, unit: unit, color: color ? color : '#00FF00'}]
                    })
                    const uniqueEndpoints = this.indcateur.filter((item, idx, self) => {
                        return idx === self.findIndex((t) => (
                            t.name === item.name && t.value === item.value
                        ))
                    })
                    this.indcateur = uniqueEndpoints;
                } catch (error) {
                    console.error('Error fetching details in CurrentCard -> ', error);
                }
            },
            onClick() {
                this.$emit('close');
            
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
            width: 250px;
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
    }
    </style>