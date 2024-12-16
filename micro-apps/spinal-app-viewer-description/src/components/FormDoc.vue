<template>

<v-dialog class="dialog-content" v-model="show" persistent width="75%" style="display: flex !important;gap: 20px !important; font-size: 12px !important; overflow: hidden; background: white !important; border-radius: 20px !important;">
        <div class="content-form">
                <form style="width: 100%; height: 100%;" @submit.prevent="uploadDoc">
                    <div class="header">
                            <h2>Ajout de document</h2>
                            <div>
                                <button type="submit" class="save-btn">Enregistrer</button>
                                <button type="reset" class="cancel-btn" @click="closeDialog">Fermer</button>
                            </div>

                    </div>
                    <div class="content-input" >
                        <div class="upload-img">
                                <v-icon >
                                    mdi-file-download-outline
                                </v-icon>
                                <span>Cliquer ou glisser un fichier pour le téléverser</span>
                                <input type="file" multiple ref="fileInput" @change="pushFile">
                        </div>
                        <p v-if="isValid" class="valid_formText">{{ valid_message }}</p>
                        <div class="file-content">
                            <div class="file" v-for="(item, idx) in files" :class="{'animation-remove-file': remove_animation == idx}">
                                    <div style="width: 100%; display: flex; gap: 10px;">
                                        <v-icon :style="{ 'color': iconFile(item.name).color }" >{{ iconFile(item.name).name }}</v-icon>
                                        <span>{{ item.name }}</span>
                                    </div>
                                    <div >
                                        <span style="padding-left: 30px;">{{ filesSize(item.size) }}</span>
                                    </div>
                             
                                    <v-icon class="close" @click="removeFile(idx)" >mdi-close</v-icon>
                            </div> 
                        </div>
                    </div>

                </form>

        </div>


</v-dialog>

</template>


<script lang="ts">
import { get } from 'http';
import { ActionTypes } from '../interfaces/vuexStoreTypes';
import getIcon from '../services/function/getIcon';

    export default {
        name: 'form-doc',
        props : {
            isDialogOpen: {
                type: Boolean,
                default: false
            },
            referenceid : {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                show: this.isDialogOpen,
                files: Array(),
                valid_message: '',
                isValid: false,
                remove_animation: null,
                getIcon: getIcon,
            }
        },

        watch: {
            isDialogOpen(newVal: boolean) {
                this.show = newVal;
            },
            remove_animation(newVal: number) {
                if (newVal != null) {
                    setTimeout(() => {
                        this.remove_animation = null;
                    }, 500);
                }
            }
        },
        destroyed() {
            this.show = false;
        },
        methods : {
            closeDialog() {
                this.show = false;
                this.$emit('close-dialog');
            },
            resetForm () {
                this.files = Array()
                this.show = false
            },
           async uploadDoc(){
            const referenceid = this.referenceid
            let filesData = this.files
            if(filesData.length != 0) {
                const buildingId = localStorage.getItem('idBuilding')
                const res = await this.$store.dispatch(ActionTypes.ADD_DOC, {buildingId, referenceId:  referenceid,  file: filesData })
                if (res[0].status) {
                    this.resetForm()
                    this.$emit('add-doc', {message: 'Document ajouté avec succès', status: 'success', context: 'document'})
                } else {
                    this.$emit('add-doc', {message: 'Erreur lors de l\'ajout du document', status: 'error', context: 'document'})
                }
            } else {
                this.isValid = true;
                this.valid_message = 'Veuillez selectionner un fichier'
            }
           
            },
            getExtension(fileName: string){
                return fileName.match(/\.[0-9a-z]+$/i);
            },
            pushFile(){
                const files_types = ['png', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'csv', 'mp4', 'avi', 'webm'];
            
                const files = this.$refs.fileInput.files;
                for (let index = 0; index < files.length; index++) {
                    const type_file = files_types.find(type => files[index].name.includes(type));
                    if (type_file != undefined) {
                        this.files.push(files[index]);
                        this.isValid = false;
                        this.valid_message = '';
                    } else {
                        this.isValid = true;
                        this.valid_message = 'Les fichiers ' + this.getExtension(files[index].name)[0] + ' ne sont pas prise en charge';
                    }
                }
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
    removeFile(index: number) {
        this.remove_animation = index;
        setTimeout(() => {
            this.remove_animation = null;
            this.files.splice(index, 1)
            this.$refs.fileInput.value = '';
        }, 500);
    },
        iconFile(fileName: string){
            return getIcon(fileName);
        }
  
 }
    
    }
        

</script>


<style>
    .content-form {
        width: 100%;
        height: calc(100vh - 300px);
        background-color: #ffffff;
        border-radius: 24px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        
    }
    .content-form .header {
        width: 100%;
        padding: 20px;
        border-bottom: 1px solid #e8dfdf96;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .content-form .header > h2 {
        font-size: 20px;
        font-weight: 600;
        color: #14202C;
        text-transform: uppercase;
    }
    .content-input {
        width: 100%;
        height: calc(100% - 100px);
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding-top: 10px;
    }
    .content-form .header > div {
        display: flex;
        gap: 10px;
        font-size: 16px;
        font-weight: 600;
    } 
    .save-btn {
        width: max-content;
        height: max-content;
        padding: 12px;
        background-color: #14202C;
        border-radius: 16px;
        color: #fff !important;
        font-weight: 700;
      }
      .cancel-btn {
        width: max-content;
        height: max-content;
        padding: 12px;
        border-radius: 16px;
        background-color: rgb(226 232 240);
        font-weight: 700;
      }
    .content-form  .upload-img {
        width: calc(100% - 450px);
        height: calc(100% - 240px);
        border: 2px dashed #14202C;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        position: relative;
    }
    .file {
        display: flex;
        gap: 10px;
    }
   
    .content-form .file-content {
        margin-top: 10px;
        height: calc(100% - 10px);
        width: calc(100% - 450px);
        min-height: 25px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow: hidden;
        overflow-y: auto;
        background-color: rgb(255, 255, 255);
    }
    .file-content .file {
        width: 100%;
        min-height: 40px;
        height:40px;
        overflow: hidden;
        border-radius: 16px;
        border: 1px solid #14202C;
        padding: 10px;
        display: flex;
        font-size: 14px;
        flex-direction: column;
        position: relative;
        color: #14202C;

    }
    
    .content-form  .upload-img input {
        width: 100%;
        height: 100%;
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        position: absolute;
        opacity: 0;
    }
    .file-progress {
        width: 100%;
        height: 4px;
        display: flex;
        justify-content: flex-start;
        background-color: rgb(226 232 240);
        border-radius: 10px;
        margin-top: 8px;
        overflow: hidden;
    }
    .fill-progress {
        width: 50%;
        height: 100%;
        background-color: #14202C;
    }
    .row {
        width: 100%;
        max-height:  max-content !important;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom  : 30px;
        font-size: 24px;
    }
   .btn-save {
    border: 4px solid #fff;
    width: max-content;
    padding: 10px 20px;
    background-color: #14202C;
    color: white;
    position: absolute;
    top: -10px;
    right: -4px;
    border-radius: 8px;
    cursor: pointer;
   }
   .valid_formText {
    color: rgba(133, 27, 27, 0.757);
    font-size: 12px;
    font-weight: 600;
    margin-top: 10px;
    font-family: Charlevoix Pro, sans-serif;
   }
   .close {
    width: 24px;
     height: 24px;
      padding: 2px;
        translate: translateY(-50%);
     cursor: pointer;
   }
   .row {
    flex-direction: row;
   }
   .col {
    flex-direction: column;
   }
   /* MediaQuery */


   @media (min-width : 600px) and (max-width: 900px) {
    .dialog-content {
        width: 100% !important;
        height: 100% !important;
        gap: 10px !important;
    }
    .content-form header {
        font-size: 14px;
    }
    .content-form .header > h2 {
        font-size: 16px;
    }
    .content-form .upload-img {
        width: calc(100% - 100px);
        height: calc(100% - 240px);
    }
    .content-form .file-content {
        width: calc(100% - 100px);
    }
    .content-form .file-content .file {
        font-size: 12px;
    }
   }
</style>