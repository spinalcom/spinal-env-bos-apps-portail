<template>

    <v-dialog class="dialog-content" v-model="show" persistent width="65%"
        style="display: flex !important;gap: 20px !important; font-size: 12px !important; overflow: hidden; background: white !important; border-radius: 20px !important;">
        <div class="content-form">
            <form style="width: 100%; height: 100%;" @submit.prevent="validateChanges">
                <div class="header">
                    <h2>Modification d'attribut</h2>
                    <div>
                        <button type="submit" class="save-btn">Enregistrer</button>
                        <button type="reset" class="cancel-btn" @click="closeDialog">Fermer</button>
                    </div>
                </div>
                <h2 class="ml-2">Label :</h2>
                <v-text-field v-model="localCopy.label" label="Label de l'attribut" outlined dense hide-details
                    class="mx-4 mb-2" style="width: 95%;"></v-text-field>
                <h2 class="ml-2">Valeur :</h2>
                <v-text-field v-model="localCopy.value" label="Valeur de l'attribut" outlined dense hide-details
                    class="mx-4 mb-2" style="width: 95%;"></v-text-field>
                <h2 class="ml-2">Unité</h2>
                <v-text-field v-model="localCopy.unit" label="Unité de l'attribut" outlined dense hide-details
                    class="mx-4 mb-2" style="width: 95%;"></v-text-field>
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
    props: {
        isDialogOpen: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            required: false
        },
        itemOp : {
            type: Object,
            required: false
        },
        id : {
            type: Number,
        },
        
    },
    data() {
        return {
            show: this.isDialogOpen,
            files: Array(),
            valid_message: '',
            isValid: false,
            remove_animation: null,
            getIcon: getIcon,
            localCopy: { ...this.item },
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
        },
        item: {
            immediate: true,
            handler(newItem) {
                this.localCopy = { ...newItem };
            },
        },

    },
    destroyed() {
        this.show = false;
    },
    methods: {
        closeDialog() {
            this.show = false;
            this.$emit('close-dialog');
        },
        resetForm() {
            this.files = Array()
            this.show = false
        },
        validateChanges() {
            console.log('Copie validée :', this.localCopy , this.itemOp , this.item);
            this.$emit('validated', this.localCopy , this.itemOp , this.item ,this.id ); 
            this.closeDialog(); 
        }
    }
}


</script>


<style scoped>
.content-form {
    width: 100%;
    height: max-content;
    padding-bottom: 30px;
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

.content-form .header>h2 {
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

.content-form .header>div {
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

.content-form .upload-img {
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
    height: 40px;
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

.content-form .upload-img input {
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
    max-height: max-content !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30px;
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

    .content-form .header>h2 {
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