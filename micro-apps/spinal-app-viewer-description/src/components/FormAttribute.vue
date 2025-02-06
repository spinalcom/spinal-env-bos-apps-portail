<template>
    <v-dialog class="dialog-content" v-model="dialog" persistent width="50%" style="display: flex !important;gap: 20px !important; font-size: 12px !important; overflow: hidden; background: white !important; border-radius: 20px !important;">
        <div class="content-form">
            <form  @submit.prevent="addAttribut" style="width: 100%; padding: 20px;">
                <div class="header">
                    <h2>ajout d'un attribut</h2>
                    <div style="width: max-content; 
                    padding: auto; display: flex; gap: 10px;">
                        <button type="submit" class="save-btn" style="display: flex; gap: 5px; align-items: center;">
                            <div v-if="loader" class="loader-att"></div>   
                            <span @click="loadFunction()" >Enregistrer</span>
                        </button>
                        <button type="reset" class="cancel-btn" @click="closeDialog">Fermer</button>
                    </div>
                    
                </div>
                <div class="top-cat">
                    <span>Catégories</span>
                    <p style="font-size: 14px; color: rgb(100 116 139); padding-left: 10px; color: rgb(180 83 9);">{{ not_selected_category }}</p>
                    <div>
                        <v-chip style="background-color: #14202C; min-width: max-content; cursor: pointer; color: #fff; font-weight: 700; font-size: 20px;" v-if="!show_categoryForm" @click="showFormCategory" class="rounded-pill">+</v-chip>
                        <v-chip style="background-color: #14202C; min-width: max-content; cursor: pointer; color: #fff; font-weight: 700; font-size: 20px;" v-if="show_categoryForm" @click="showFormCategory" class="rounded-pill">x</v-chip>
                   
                            <!-- Another form -->
            <div class="content-cat" v-if="show_categoryForm" >
            <div class="header">
                    <h2>Ajouter une catégorie</h2>
            </div>
            <v-row 
            class="d-flex flex-row justify-center align-center mt-2"
            
            >

                <v-text-field
                v-model="category"
                label="Nom de la catégorie"
                outlined
                dense
                hide-details
                class="mx-4"
                style="width: 100%;"
                ></v-text-field>
            </v-row>
            <p style=" width: 100%; height: max-content; font-size: 14px; color: rgb(100 116 139);   text-align: center; color: rgb(180 83 9); margin-top: 15px;" v-if="message_from_categories != ''" >{{message_from_categories}}</p>
            <div
            class="d-flex flex-row justify-center align-center"
            style="margin-top: 15px;"
            
            >
                <v-btn
                @click="AddCategory"
                color="#14202C"
                class="mx-4"
                depressed
                small
                style="color: #ffff ; font-weight: 700;"
                >
                    Ajouter
                </v-btn>
                <v-btn
                @click="showFormCategory"
                color="#E0E0E0"
                class="mx-4"
                depressed
                small
                style="color: #14202C; font-weight: 700;"
                >
                    Annuler
                </v-btn>
            </div>
    </div>
                             <!-- End Another form -->
                            <!-- <div class="category-form" v-if="show_categoryForm">
                                <input  type="text" ref="category" placeholder="Nom de la catégorie">
                                <v-icon 
                                
                                style=" width: max-content; height: max-content; cursor: pointer; display: flex; justify-content: center; margin-left: 5px; align-items: center; background-color: #14202C; color: white; font-size: 18px; font-weight: 700; border-radius: 15px; padding-inline: 5px" @click="AddCategory"
                                >
                                mdi-shape-circle-plus
                            </v-icon>
                        </div> -->
                        <ul style=" width: max-content; height: max-content; display: flex; justify-content: center; align-items: center; list-style: none; gap: 5px; border-right: 1px solid #14202C; padding-right: 10px;" v-if="categoriesList_add.length != 0">
                            <li v-for="(item, idx) in categoriesList_add" >
                                <v-chip style="background-color: #14202C; min-width: max-content; cursor: pointer; color: #fff; display: flex; align-items: center;" @click="changeSelect(idx, 'update')">{{ item.name }}
                                    <span class="icon-check" v-if="(selectCateogry.index == idx ) && (selectCateogry.update) ">&#10003;</span>
                                    
                                    <v-icon style="color:white; font-weight: 700; margin-left: 5px; font-size: 14px;" class="rm-category" @click="removeCategory(idx)" >mdi-close</v-icon>
                                </v-chip> 
                            </li>
                        </ul>
                        <ul style=" width: max-content; display: flex; list-style: none;  gap: 5px;" >
                                <li  v-for="(item, idx) in categoriesList">
                                    <v-chip style="background-color: #14202C; min-width: max-content; cursor: pointer; color: #fff; overflow: auto; position: relative;" @click="changeSelect(idx, 'no-update', item.dynamicId)" >{{ item.name }}
                                        <span class="icon-check" v-if="(selectCateogry.index == idx ) && (!selectCateogry.update) ">&#10003;</span>
                                    </v-chip>
                                </li>
                            </ul>
                    </div>


                </div>
                <div>
            <v-container class="mt-5">
                    <v-row
                        dense
                        cols="12"
                    >
                        <v-col
                        dense
                        cols="12"
                  
                        >
                        <v-text-field
                            dense
                            outlined
                            label="Nom de l'attribut *"
                            v-model="attributeName"
                        ></v-text-field>
                        </v-col>

                        
            
        <!--  -->
            
                        <v-col
                        dense
                        cols="12"
          
                        >
                        <v-text-field
                            dense
                            outlined
                            label="Valeur *"
                            v-model="attributeValue"
                        ></v-text-field>
                        </v-col>

                        <v-col
                        dense
                        cols="12"
                  
                        >
                        <v-text-field
                            label="Unité"
                            outlined
                            dense
                            v-model="attributeUnit"
                        ></v-text-field>
                        </v-col>
                </v-row>
                <p style="color: red; font-size: 14px;" >{{ valid_message }}</p>
    </v-container>
                        </div>
                </form>
            </div>
    </v-dialog>

</template>

<script lang="ts">
import { get } from 'lodash';
import { ActionTypes } from '../interfaces/vuexStoreTypes';
import AddCategorie from './data-side/AddCategorie.vue';

    export default {
        name: 'FormAttribute',
        props: {
            show: {
                type: Boolean,
                required: true
            },
            referenceId : {
                type: Number,
                required: true
            }
        },
        components: {
            AddCategorie
        },

        data() {
            return {
                dialog: this.show,
                show_categoryForm: false,
                categoriesList: Array<{ name: string, dynamicId: number, type: string }>(),
                categoriesList_add: Array<{ name: string}>(),
                selectCateogry : {
                    update: false,
                    index: null,
                    dynamicId: null
                },
                attributeName: '',
                attributeValue: '',
                attributeUnit: '',
                message_from_categories: '',
                not_selected_category: '',
                loader: false,
                valid_message: '',
                category: ''
            }
        },
            watch: {
            show(newVal: boolean) {
                this.dialog = newVal;
                this.getCategoriesList();
            },
            referenceId(newVal: number) {
                this.referenceId = newVal;
                console.log('newVal -> ', newVal)
                this.getCategoriesList();
            }
        },
        async mounted() {   
            await this.getCategoriesList();
        },
        methods: {
            closeDialog() {
                this.dialog = false;
                this.$emit('close-dialog');
            },
            showFormCategory (e){
                this.show_categoryForm = !this.show_categoryForm
            },
            loadFunction(){
                this.loader = true;
            },

           async getCategoriesList(){
                const buildingId = localStorage.getItem('idBuilding');
                this.categoriesList = await this.$store.dispatch(ActionTypes.GET_CATEGORIES_LIST , {buildingId, referenceId: this.referenceId})
            },


            AddCategory(){
                const category = this.category;
                
                if (category !== '') {
                    const list_categories = this.categoriesList.map(item => item.name);
                    const verif = list_categories.includes(category);
                    console.log(verif)
                    if(!verif){
                        this.categoriesList_add.push({name: category}) 
                        this.category = '';
                        this.message_from_categories = ''
                        this.show_categoryForm = false;
                    }
                    else {
                        this.message_from_categories = 'Cette catégorie existe déjà'
                    }
                }
            },
            removeCategory(idx: number){
                this.categoriesList_add.splice(idx, 1)
                this.selectCateogry = {
                    update: false,
                    index: null,
                    dynamicId: null
                }
            },
            changeSelect(idx: number, update: string, dynamicId?: number){
                this.not_selected_category = '';
                if(update != 'update'){
                    this.selectCateogry.update = false;
                    this.selectCateogry.index = idx;
                    this.selectCateogry.dynamicId = dynamicId;
            }
            else {
                this.selectCateogry.update = true;
                this.selectCateogry.index = idx;
                this.selectCateogry.dynamicId = dynamicId;
            }
        },

        resetForm(){
            this.attributeName = '';
            this.attributeType = '';
            this.attributeValue = '';
            this.attributeUnit = '';
            this.categoriesList_add = [];
            this.selectCateogry = {
                update: false,
                index: null,
                dynamicId: null
            }
        },

        // CreateAttribute

       async addAttribut(){
            const buildingId = localStorage.getItem('idBuilding');

            const formdata = new FormData();
            if((this.attributeName !== ''  && this.attributeValue !== '') && this.selectCateogry.index != null){
                this.loader = true;
                this.valid_message = '';
                this.not_selected_category = '';

              console.log('selectCateogry -> ', this.selectCateogry)
    
                   if(this.selectCateogry.update){
                    const category = this.categoriesList_add.find((item, idx) => idx == this.selectCateogry.index);
                console.log('category -> ', category)
                formdata.append('categoryName', category.name);
                formdata.append('attributeLabel', this.attributeName);
                formdata.append('attributeType', this.attributeType);
                formdata.append('attributeValue', this.attributeValue);
                formdata.append('attributeUnit', this.attributeUnit);
                formdata.append('update', 'true');
                formdata.append('categoriesList', this.categoriesList_add.map(item => item.name));
               
            }
            else {
                formdata.append('dynamicId', this.selectCateogry.dynamicId);
                formdata.append('attributeLabel', this.attributeName);
                formdata.append('attributeType', this.attributeType);
                formdata.append('attributeValue', this.attributeValue);
                formdata.append('attributeUnit', this.attributeUnit);
                formdata.append('update', 'false');
                formdata.append('categoriesList',  this.categoriesList_add.map(item => item.name));
            
            }
         const referenceId = this.referenceId;
            let result: { status: number } | null = { status: 0 };
            
                result = await this.$store.dispatch(ActionTypes.ADD_ATTRIBUT, {buildingId, referenceId , formData: formdata})
            
                console.log('result rq -> ',result)
                if(result && result.status == 200){
                this.dialog = false;
                this.$emit('close-dialog');
                this.resetForm();
                this.loader = false;
                await this.getCategoriesList();
                this.$emit('add-attribute', {message: 'l\'attribut a bien été ajouté', status: 'success', context: 'attribut' });
            }
            else {
                this.dialog = false;
                this.loader = false;
                this.$emit('close-dialog');
                this.$emit('add-attribute', {message: 'Une erreur est survenue lors de l\'ajout de l\'attribut', status: 'error', context: 'attribut' });
            }       
            } 
            else {
                console.log('selectCateogry -> ', this.selectCateogry)
                    if(this.selectCateogry.index == null){
                        this.not_selected_category = 'Veuillez selectionner une catégorie';
                        this.loader = false;
                    }
                    else {
                        this.valid_message = 'Veuillez remplir les champs avec *'
                        this.loader = false;
                    }
                    console.log('Message -> ', this.not_selected_category)
            }
        }
    }
}


</script>

<style scoped>
    .content-form {
        width: 100%;
        height: max-content;
        min-height: max-content;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        background-color: #fff;
    }
    .loader-att {
        border: 1px solid #f3f3f3;
        border-top: 1px solid #14202C;
        border-radius: 50%;
        width: 20px !important;
        height: 20px !important;
        animation: spin 2s linear infinite;
    }
    .content-form .header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #5052549c;
    }
    .content-form .header h2 {
        font-size: 20px;
        font-weight: 700;
        color: #14202C;
        text-transform: lowercase;
    }
    .content-form .header h2::first-letter{
        text-transform: uppercase;
    }

    .top-cat{
        position: relative;
        width: 100%;
        height: max-content;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start !important;
        gap: 5px;
        padding-top: 20px;
        padding-inline: 20px;
        /* padding-block: 10px;
        padding-inline: 30px;   */
        margin-top: 40px; 
        position: relative;
        background-color: rgb(226 232 240);
        border-radius: 5px;
    }
    .top-cat > span {
        font-size: 16px;
        font-weight: 600;
        color: #14202C;
        position: absolute;
        top: -4px;
        left: 0;
        padding-inline: 7px;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 10px;
        background-color: #fff;
    }
    .top-cat > div {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        padding: 20px;
        gap: 5px;
        overflow: hidden;
        overflow-x: auto;
    }
    .top-cat > div::-webkit-scrollbar-thumb {
     border-radius: 20px;
     width: 8px;
        height: 10px;
        padding: 10px;
        background-color: #3e4042;
    }
    
    .top-cat > div::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    .top-cat > div::-webkit-scrollbar-track {
        background-color: rgb(100 116 139);
        height: 10px;
        padding: 20px;
        border-radius:  10px;
    }
    
    .top-cat  input {
        min-width: 80px;
        width: max-content;
        color: #000000;
        font-weight: 600;
        border: none;
        font-size: 12px;
        /* border: 1px solid #14202C; */
        border-radius: 5px;
        padding-left: 4px;
        padding-block: 5px;
        width: max-content;
    }
    .top-cat  input:focus {
        outline: none;
    }
    .category-form {
        display: flex;
        padding: 5px;
        gap: 5px;
        align-items: center;
        border: 1px solid #14202C;
        border-radius: 5px;
        border-right: 1px solid #14202C;
    }
    .rm-category {
        cursor: pointer;
        color: #fff;
        border-radius: 50%;
        font-weight: 700;
        background-color: #ece1e1a6;
    }


    .icon-check {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #14202C !important;
        display: flex;
        justify-content: center;
        border: 2px solid white;
        align-items: center;
        padding: 5px;
        color: white !important;
        font-size:  14px; 
        margin-left: 5px;
        animation: check-animation 4ms ease-in-out;
      }
      /* Another form category */ 

      .content-cat{
        max-width: 300px;
        max-height: 400px;
        height: max-content;
        padding-bottom: 10px;
        background-color: #ffffff;
        position: absolute;
        bottom: -150px;
        left: 0;
        box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        border-radius: 5px;
        z-index: 9999;
        transition: height 0.5s;
        display: flex;
        
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        border: 1px solid #14202c30;
        overflow:  hidden !important;
    }
    .content-cat .header {
        width: 100%;
        height: 45px;
      
    }
    .content-cat .header h2 {
        color: #14202C;
        font-size: 18px;
        text-align: center;
        padding: 10px;
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
      @keyframes check-animation {
        0% {

          transform: scale(1.2) translate(0, -10px);
        }
        100% {
          transform: scale(1) translate(0, 0);
        }
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        
      }
</style>