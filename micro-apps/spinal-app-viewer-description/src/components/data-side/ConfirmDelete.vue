<template>

    <div class="content-modal" v-if="show_delete">
        <div style="display: flex; gap: 10px; justify-content: center;">
          
            <v-icon style="color: #FDDA0D; width: max-content; height: max-content;" >mdi-alert-outline</v-icon>
            <p>Êtes-vous sûr(e) de vouloir supprimer ce document ?</p>
        </div>
        <span class="text-grey-darken-1"  style="font-size: 12px;" >Cette action est irréversible et le fichier sera définitivement supprimé</span>
        <div class="btn-group">
            <v-btn
            dense
            color="error"
            style=" font-weight: 700;"
            @click="DeleteFile()" >Confirmer</v-btn>
            <v-btn
            dense
                color="#14202C"
                style="font-weight: 500; color: white;"
            @click="$emit('close')" >Annuler</v-btn>
        </div>
    </div>
</template>


<script lang="ts">
import { ActionTypes } from '../../interfaces/vuexStoreTypes';


export default {
    namem: 'ConfirmDelete',
    props: {
        show: {
            type: Boolean,
            required: true
        },
        idReference: {
            validator(value) {
      return typeof value === 'number' || value === null;
    },
            required: true
        },
        idFile : {
            validator(value) {
        // Vérifie si la valeur est un Number ou null
        return typeof value === 'number' || value === null;
          },
            required: true
        },
        contextFile : {
            type: String,
            required: true
        }
    },
    data () { 
        return {
            show_delete: this.show,
        }
    },
    watch: {
        show: function (val: boolean) {
            this.show_delete = val;
        }
    },

    methods: {
      
        
         async DeleteFile() {
            const buildingId = localStorage.getItem('idBuilding');
          const res = await this.$store.dispatch(ActionTypes.DELETE_FILE, {
            buildingId: buildingId,
            referenceId: this.idReference!,
            fileId: this.idFile!, 
          } ) 
          if(res.status === 200) {
            this.show_delete = false;
            this.$emit('close', this.show_delete);
            this.$emit('delete-doc', {message: 'Le document a été supprimé avec succès.', status: 'success', context: 'document' });
        }
        else {
                this.show_delete = false;   
                this.$emit('close', this.show_delete);
                this.$emit('delete-doc', {message: 'Erreur lors de la suppression du document', status: 'error', context: 'document' });
        }
  }
    },
    
}

</script>

<style scoped>
    .content-modal {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: max-content;
        height: max-content;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        padding: 20px;
        border-radius: 26px;
        background-color: #ffffff;
        z-index: 1000;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    }
    .btn-group 
     {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
        background-color: #ffffff;
     }
    .btn {
        padding: 10px 20px;
        border-radius: 26px;
        cursor: pointer;
    }
    .row {
        display: flex;
        align-items: center;
        padding: 6px;
        vertical-align: baseline;
    }
    


</style>