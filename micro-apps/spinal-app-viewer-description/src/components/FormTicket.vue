<template>
    <v-dialog v-model="isDialogOpen" persistent max-width="65%" style="display: flex !important;gap: 20px !important; font-size: 12px !important; overflow: hidden; background: white !important;   border-radius: 20px !important;">
      <form @submit.prevent="createTicket"  class="content">
        <div style="padding: 10px; align-items: center;" class="w-full flex justify-between border-bottom">
              <span class="headline">Ajouter un ticket</span>
              <div style="display: flex; gap: 10px;">
                <button type="submit" class="save-btn">
                    <v-icon style="color: white;">mdi-content-save</v-icon>
                  Enregistrer</button>
                  <button type="reset" class="cancel-btn" @click="closeDialog">Fermer</button>
              </div>
            
            </div>
        <v-card elevation="0" style="overflow-y: auto !important; width: 100% !important; height: 100%; padding-top: 10px;">
         
        <div class="w-full h-full overflow-hidden overflow-y-auto" >
  
          <div style="width: 100%;  padding: 20px;">
            <v-row class="row" style="padding-inline: 30px">
  
              <v-select
              class="w-1/3 small-select"
              style="padding: 10px;"
              v-model="workflowId"
              :items="workflowlist"
              item-text="name"
              item-value="dynamicId"
              @change="getProcessList(workflowId)"
              outlined
              dense
              label="Séléctionner un workflow" >
              
            </v-select>
            <v-select
            v-model="processId"
            class="w-1/3 small-select"
            style="padding: 10px;"
            :items="process"
            item-text="name"
            item-value="dynamicId"
            outlined
            dense
            label="Séléctionner un process" >
            
          </v-select>
            </v-row>
    
          <!-- <v-card-title>
            <span class="headline"></span>
          </v-card-title> -->
  
          <v-card-text style="min-height: 200px;">
            <div class="col">
              <v-text-field label="Nom du ticket" v-model="ticketname" outlined></v-text-field>
              <v-textarea label="Description" v-model="description" outlined></v-textarea>
              <v-row v-if="showalert" style="width: 100%; display: flex; gap: 10px;  justify-content: center; align-items: center; ">
                  <v-icon  style=" color:rgba(133, 27, 27, 0.757);">mdi-alert-circle-outline</v-icon>
                  <span class="text-alert">Veuillez remplir tous les champs</span>
              </v-row>
              <v-row class="flex justify-center items-center" style="padding: 10px">
                  <span style="text-align: center; font-weight: 800; font-size: 16px;">Priorité: </span>
                  <span 
                  :class="['cursor-pointer chip', {'checked': item.checked}]"
                 
                v-for="(item , index) in prioritie"
                  @click="checkPrioritie(index)"
                >
                <span class="icon-check" v-if="item.checked">&#10003;</span>
                <span style="font-weight: 700; text-transform: capitalize;"> {{ item.name }}</span>
                <span class="chip-point" v-if="!item.checked"></span>
              </span>
              </v-row>
                <div class="upload-img" style="margin-top: 10px;" >
                  <v-icon>mdi-file-multiple</v-icon>
                  <span>cliquer ou glisser un fichier pour le téléverser</span>
                    <input type="file" name="images" id="" multiple @change="uploadsFile">
                </div>
              </div>
              <p v-if="isValid" class="valid_formText">{{ valid_message }}</p>
              <div class="file-content">
                            <div class="file" v-for="(item, idx) in files" :class="{'animation-remove-file': remove_animation == idx}">
                                    <div style="width: 100%; display: flex; gap: 10px;">
                                        <v-icon :style="{'color': getIcon(item.name).color}" >{{ getIcon(item.name).name }}</v-icon>
                                        <span>{{ item.name }}</span>
                                    </div>
                                    <div >
                                        <span style="padding-left: 40px;">{{ filesSize(item.size) }}</span>
                                    </div>
                             
                                    <v-icon class="close" @click="removeFile(idx)" >mdi-close</v-icon>
                            </div> 
                        </div>
             
              
            </v-card-text>
  
          </div>
  
        </div>
      </v-card>
    </form>
    </v-dialog>
  </template>
  
  <script lang="ts">
import { get } from 'http';
import { ActionTypes } from '../interfaces/vuexStoreTypes';
import { WorkflowInterface } from '../interfaces/Workflow';
import getIcon from '../services/function/getIcon';


  export default {
    name: 'form-ticket',
    props: {
      selectedZone: {
        type:  Object,
        required: true,

      },
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        showalert: false,
        workflowId : 0,
        processId : 0,
        ticketname: '',
        description: '',
        isDialogOpen: this.value,
        prioritie : [ 
          {
            name: 'low',
            color: 'green',
            value: 0,
            checked: false,
          },
          {
            name: 'medium',
            color: 'orange',
            value: 1,
            checked: false,
          },
          {
            name: 'high',
            color: 'red',
            value: 2,
            checked: false,

          },
        ],
        workflowlist: [{}],
        process: [],
        files : Array(),
        priority: null,
        remove_animation: null,
        isValid: false,
        valid_message: '',
        getIcon : getIcon,
      };

    },
  async mounted(){
      this.workflowlist = await this.getWorkFlowList();
    },
    watch: {
      value(newVal) {
        this.isDialogOpen = newVal;
      },
      isDialogOpen(newVal) {
        this.$emit('input', newVal);
      },
      remove_animation(newVal: number) {
                if (newVal != null) {
                    setTimeout(() => {
                        this.remove_animation = null;
                    }, 500);
                }
            }
    },
    methods: {
      closeDialog() {
        this.isDialogOpen = !this.isDialogOpen;
        this.$emit('close-dialog', this.isDialogOpen);
      },
      checkPrioritie(index) {
        this.prioritie = this.prioritie.map((item, i) => {
          if (i === index) {
            item.checked = !item.checked;
            this.priority = item.value; 
          } else {
            item.checked = false;
          }
          return item;
        });
      },
      async getWorkFlowList () {
    const buildingId = localStorage.getItem("idBuilding");
    const res = await this.$store.dispatch(ActionTypes.GET_WORKFLOW_LIST, { buildingId });
    const workflow = await Promise.all(res);
    return workflow;
  },
    async getProcessList (workflowId: Number) { 
      const buildingId = localStorage.getItem("idBuilding");
      const res = await this.$store.dispatch(ActionTypes.GET_PROCESS_WORKFLOW, { buildingId, workflowId});
      this.process = res.children;
    },
   async uploadsFile(e: any) {
    const files_types = ['png', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'csv', 'mp4', 'avi', 'webm'];
    for (let i = 0; i < e.target.files.length; i++) {
      const extension = e.target.files[i].name.match(/\.([^.]+)$/);
      const type_file = files_types.includes(extension![1]);
      if (type_file) {
        this.files.push(e.target.files[i]);
        this.isValid = false;
        this.valid_message = '';
      } 
      else {
        this.isValid = true;
        this.valid_message = 'Veuillez choisir un fichier valide';
      }
    }

    },
 
    resetForm() {
      this.ticketname = '';
      this.description = '';
      this.workflowId = 0;
      this.processId = 0;
      this.files = [];
      this.priority = null;
    },
    removeFile(index: number) {
      this.remove_animation = index;
      setTimeout(() => {
        this.remove_animation = null;
        this.files.splice(index, 1);
      }, 500);
    },
    filesSize(size: number){
      if (size < 1024) {
          return size + 'octets';
      }
      else if(size < (1024 * 1024)){
        return (size / 1024).toFixed(2) + 'Ko';
      }
      else {
        return (size / (1024 * 1024)).toFixed(2) + 'Mo';
      }

    },
    async createTicket(e) {
      e.preventDefault(); 
      const workflowname = this.workflowlist.find((item: WorkflowInterface) => item.dynamicId === this.workflowId);
      const processname = this.process.find((item: WorkflowInterface) => item.dynamicId === this.processId);
      const file = this.files;
      if (workflowname &&  processname && this.ticketname && this.description && this.priority != null) {
        const data = {
        workflow: workflowname.name,
        process: processname.name,
        nodeDynamicId: this.selectedZone.dynamicId,
        name: this.ticketname,
        priority : this.priority,
        description: this.description,
      }

      const buildingId = localStorage.getItem("idBuilding");
      const res = await this.$store.dispatch(ActionTypes.ADD_TICKET, { buildingId, data, file});
      if(res) {
        this.resetForm();
        this.closeDialog();
        this.$emit('add-ticket', {message: 'ticket ajouté', status: 'success', context: 'ticket' });
      }
      else {
        this.$emit('add-ticket', {message: 'Erreur lors de l\'ajout du ticket', status: 'error', context: 'ticket' });
        this.showalert = false;
        this.closeDialog();
      }
      } else {
        this.showalert = true;
      }
     
      
    },
    iconFile(type: string) {
        const extension = type.match(/\.([^.]+)$/);
      switch (extension![1]) {
        case 'pdf':
          return 'mdi-file-pdf-box';
        case 'xlsx':
        case 'xls':
        case 'csv':
          return 'mdi-file-excel-box';
        case 'jpg':
        case 'jpeg':
          return 'mdi-file-jpg-box';
        case 'png':
          return 'mdi-file-png-box';
        case 'mp4':
        case 'avi':
        case 'webm':
          return 'mdi-movie-outline';
        default:
          return 'mdi-file';
      }
    }
  
  }
  };
  </script>
  
  <style scoped src="../assets/formComp.css" >
  </style>
  