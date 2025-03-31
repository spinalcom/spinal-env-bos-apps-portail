<template>
    <div
    v-if="dialog"
    class="dialog"
    @click.stop=""
    >
    <div class="box-content">
        <div class="title">
            <h3>Modification</h3>
            <v-icon class="close" @click.stop="close()">mdi-close</v-icon>
        </div>
        <div  v-if="!endpoint.name && !allFloor_alt">
            <div style="padding-left: 25px; display: flex; align-items: center; gap: 5px;">
                <input type="checkbox" v-model="all" name="allValue" id="" style="accent-color: #14202C;">
                <label for="all" style="font-size: 16px; color: #14202C; font-weight: 700">Tout le groupe</label>
            </div>
            
        </div>
        <form v-if="allFloor_alt" ref="allFloor" @submit.prevent="updateAllFloor">
        <div v-if="allFloor_alt" style="padding: 20px;">
            <label for="allValue">
                <span style="font-size: 16px; color: #14202C; font-weight: 700">Valeur pour tout l'étage</span><br />
                <span>{{ endpointName }}</span>
            </label>
                    <input type="text" name="allValue" id="allValue">
        </div>
        <div class="action">
            <v-btn 
            depressed
            color="#d1d5db"                
            class="ma-2" @click.stop="close()">Annuler</v-btn>
            <v-btn 
          dense
          class="ma-2" 
          color="#14202C"
          type="submit"
            @click.stop=""
            style="color: #fff; font-weight: 600; font-size: 16px;">Confirmer</v-btn>
        </div>
      </form>
        <!-- Formulaire pour modifier qu'un seul un endpoint -->
      <form v-if="all && !allFloor_alt" ref="allEndpopint" @submit.prevent="updateEndpoint">
        <div v-if="all" style="padding: 20px;">
            <label for="allValue">
                <span style="font-size: 16px; color: #14202C; font-weight: 700">Valeur pour tous les endpoints</span><br />
                <span>{{ endpointName }}</span>
            </label>
                    <input type="text" name="allValue" id="allValue">
        </div>
        <div class="action">
            <v-btn 
            depressed
            color="#d1d5db"                
            class="ma-2" @click.stop="close()">Annuler</v-btn>
            <v-btn 
          dense
          class="ma-2" 
          color="#14202C"
          type="submit"
            @click.stop=""
            style="color: #fff; font-weight: 600; font-size: 16px;">Confirmer</v-btn>
        </div>
      </form>
        <!-- Formulaire pour modifier plusieurs endpoints -->
        <form v-if="!all && !allFloor_alt" ref="form"   @submit.prevent="updateEndpoint">
            
                <div class="edit_singleEndpoint" v-if="endpoint.name">
                    <label  :for="endpoint.endpoint.dynamicId">
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                        <span style="display: flex;">
                               <div class="color" :style="{ background: endpoint.color }"></div>
                               {{ endpoint.name }}
                           </span>
                        </div>
                        <span class="end_name">
                            {{ endpoint.endpoint.name}}
                        </span>
                        <input
                        @click.stop=""
                        :name="endpoint.endpoint.dynamicId"
                        :id="endpoint.endpoint.dynamicId"
                        v-model="endpoint.endpoint.value"
                        type="text"
                        placeholder="Enter endpoint"
                        />
                    </label>
                </div>
                <div class="content-form" v-if="endPointList.length > 0 && !all">
                <div class="grid" >
                    <label class="item" v-for="(item, idx) in endPointList" :for="item.endpoint.dynamicId">
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <span style="display: flex;">
                               <div class="color" :style="{ background: item.color }"></div>
                               {{ item.name }}
                           </span>
                        </div>
                        <span class="end_name">
                            {{ item.endpoint.name}}
                        </span>
                        <input
                        @click.stop=""
                        :name="item.endpoint.dynamicId"
                        :id="item.endpoint.dynamicId"
                        v-model="item.endpoint.value"
                        type="text"
                        placeholder="Enter endpoint"
                        />
                    </label>    
                </div>

            </div>
            <div class="action">
                <v-btn 
                depressed
                color="#d1d5db"                
                class="ma-2" @click.stop="close()">Annuler</v-btn>
              <v-btn 
              dense
              class="ma-2" 
              color="#14202C"
              type="submit"
              @click.stop=""
              style="color: #fff; font-weight: 600; font-size: 16px;">Confirmer</v-btn>
            </div>
        </form>
    </div>
    </div>
</template>

<script lang="ts">
import { ActionTypes } from '../interfaces/vuexStoreTypes';
import { MutationTypes } from '../services/store/appDataStore/mutations';
import { config } from '../config'

    export default  {
        name: "EditEndpoint",
        props : {
            _dialog: {
                type: Boolean,
                default: true
            },
            item: {
                type: [Object, Array],
                default: () => ({}),
            },
            allFloor: {
                type: Boolean,
                default: false,
                required: false 
            }
            
        },
        data () {
      return {
        dialog: this._dialog,
        isGroup: false,
        endPointList: [] as any,
        endpoint: {} as any,
        endpointName: '',
        all: false,
        allFloor_alt: this.allFloor
      }
    },

    watch : {
        _dialog : function (val) {
            this.dialog = val;
            this.loadData();
            if(this.dialog) {
                this.$store.commit(MutationTypes.SET_ENABLERELOAD, false);
            }
        },
        allFloor_alt: {
            handler(val) {
                if (val) {
                    this.$store.commit(MutationTypes.SET_ENABLERELOAD, false);
                    this.endpointName =  this.item[0].endpoint.name;
                }
                
            },
            immediate: true
        }

    },
    methods: {
        loadData () {
            this.checkIfGroup(this.item);
            if(this.isGroup) {
                let endpointList : any[]  = [];
                this.item.children.forEach((child: any) => {
                    const endpointChild = 
                        {
                            name: child.name,
                            color: child.color,
                            endpoint: child.endpoint
                        }
                    endpointList.push(endpointChild);
                });
                this.endPointList = endpointList;
                this.endpointName = this.item.children[0].endpoint.name;
                
            } else {

                this.endpoint = 
                {
                    color: this.item.color,
                    name : this.item.name,
                    endpoint: this.item.endpoint
                }



            }
       
        },

        close (){
            this.dialog = false;
            this.all = false;
            this.allFloor_alt = false;
            this.endPointList = [];
            this.endpoint = {};
            this.$emit('close');
            this.$store.commit(MutationTypes.SET_ENABLERELOAD, true);
        },
        checkIfGroup(item: any) {
            const type = item.type;
            item.children ? this.isGroup = true : this.isGroup = false;
        },
      async  updateAllFloor() {
            const buildingId = localStorage.getItem('idBuilding');
            const formElement = this.$refs.allFloor as HTMLFormElement;
            const updateType = this.$store.state.appDataStore.selectedSource.controllable.type;
            const formData = new FormData(formElement);
            const dynamicIds: number[] = [];
            this.item.forEach((child: any) => {
                dynamicIds.push(child.endpoint.dynamicId);
            });
            formData.append('dynamicIds', JSON.stringify(dynamicIds));
            
            await this.$store.dispatch(ActionTypes.UPDATE_ENDPOINT, {buildingId, formData, updateType}).then((res) => {
                if(res.success) {
                    this.$emit('update',  {
                        status: 'success',
                        statusCode: 200,
                        text: 'Synchronisation...',
                        data: res.data
                    });
                    this.close();
                }
            }).catch((error) => {
                console.log('error: ', error);
                // handle error
                this.$emit('update',  {
                    status: 'error',
                    statusCode: 500,
                    text: 'Erreur lors du pilotage',
                    data: error
                });
            });
        },
        
       async updateEndpoint() {
            const buildingId = localStorage.getItem('idBuilding');
            const updateType = this.$store.state.appDataStore.selectedSource.controllable.type;
            
           const formElement = this.all ? this.$refs.allEndpopint as HTMLFormElement : this.$refs.form as HTMLFormElement;
           const formData = new FormData(formElement);
           if(this.all) {
            let dynamicIds: number[] = [];
            this.endPointList.forEach((item: any) => {
                dynamicIds.push(item.endpoint.dynamicId);
            })
            
            formData.append('dynamicIds', JSON.stringify(dynamicIds));
           }
           
          await  this.$store.dispatch(ActionTypes.UPDATE_ENDPOINT, {buildingId, formData, updateType}).then((res) => {
                if(res.success) {
                    this.$emit('update',  {
                        status: 'success',
                        statusCode: 200,
                        text: 'Synchronisation...',
                        data: res.data
                    });
                    this.close();
                }
            }).catch((error) => {
                console.log('error: ', error);
                // handle error
                this.$emit('update',  {
                    status: 'error',
                    statusCode: 500,
                    text: 'Erreur lors du pilotage',
                    data: error
                });
            });
            
    }
    },
    mounted() {
    }
    }
</script>

<style scoped>
.dialog{

    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: all 0.5s;
    opacity: 1;
    visibility: visible;
    transform: scale(1);
}
.box-content  {
    width: 70%;
    min-height: 200px;
    max-height: calc(100% - 20%);
    background-color: #ffffff;
    border-radius: 10px;
    border: 1px solid #14202C;
    position: relative;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
 
 form {
    width: 100%;
    min-height: 200px;
    max-height: calc(100% - 20%);
    background-color: #ffffff;
    border-radius: 10px;
    /* border: 1px solid #14202C; */
    position: relative;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
 }
.box-content .title {       
    width: 100%;
    height: max-content;
    padding: 10px;
    background-color: #d3d3d3e6;
    color: #14202C;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 7px;
    font-size: 20px;
    font-weight: bold;
}
.close {
    position: absolute !important;
    top: -2px;
    right: -10px;
    background-color: #14202C;
    color: #fff !important;
    cursor: pointer;
    width: 20px !important;
    height: 20px !important;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    padding: 10px;
    border: 1px solid #ffffff;
}

.grid {
 
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}
.item {
    background: #dcdcdc75;
    backdrop-filter: blur(30px);
    color: #14202C;
    padding: 10px;
    text-align: start;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
}
 span {
    font-size: 0.875rem;
    font-weight: 600;
    color: #14202C;
}

 input[type="text"] {
    width: 100%;
    height: 30px;
    border: 1px solid #14202C;
    border-radius: 5px;
    font-size: 0.875rem;
    padding: 5px;
    margin-top: 5px;
    font-weight: bold;
}
.end_name {
    font-weight: 500 !important;
    color: #14202C;
}
.action {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 10px;
}

.content-form  {
    width: 100%;
    min-height: 200px;
    height: 85%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    overflow: hidden !important;
    overflow-y: auto !important;
}
.content-form::-webkit-scrollbar {
    width: 7px;
}
.content-form::-webkit-scrollbar-thumb {
    background-color: #b2b2b2b7;
    border: 1px solid #14202C;
    border-radius: 5px;
}
.content-form::-webkit-scrollbar-track {
    background-color: #dcdcdccf;
    border-radius: 5px;
    padding: 10px;
}
.color {
  width: 7px;
  height: 20px;
  margin-right: 4px;
  border-radius: 3px;
}
.edit_singleEndpoint {
    width: 100%;
    min-height: 40px;
    padding-inline: 30px;
}
</style>
