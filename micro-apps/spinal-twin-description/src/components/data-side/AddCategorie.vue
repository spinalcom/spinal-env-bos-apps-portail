<template>
    <div class="content-cat">
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
            <div
            class="d-flex flex-row justify-center align-center mt-2"
            
            >
                <v-btn
                @click="addCategorie"
                color="#14202C"
                class="mx-4"
                depressed
                small
                style="color: #ffff ; font-weight: 700;"
                >
                    Ajouter
                </v-btn>
                <v-btn
                @click="close"
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
</template>

<script lang="ts" >
    export default {
        name: 'AddCategorie',

        props: {
            list_cateogries : {
                type: Array,
                required: true
            }
        },
     
        data() {
            return {
                category: ''
            }
        },
        methods: {
            addCategorie() {
                if (this.category) {
                    this.$emit('add', this.category)
                    this.category = ''
                    this.close()
                }
            },
            close() {
                this.$emit('close')
            }
        }

    }

</script>

<style scoped >
    .content-cat{
        max-width: 300px;
        max-height: 400px;
        height: max-content;
        padding-bottom: 10px;
        background-color: #ffffff;
        position: absolute;
        bottom: -160px;
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
</style>