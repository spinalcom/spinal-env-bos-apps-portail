<template>
    <div class="dots-grid">
        <div
        v-for="(dot, index) in dotsList"
        :key="index"
        class="dot"
        >
        
    </div>
    </div>
</template>

<script lang="ts">
import { config } from '../../config';
export default {
    name: "DotsGrid",
    props: {
        dotsList: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            dotData: this.dotsList,
            endpointList: [],
        }
    },


     mounted() {
    },



    watch: {
        dotsList: {
            handler: function (value) {
               this.dotData = value;
               this.getEndpoint(this.dotData);
            },
            deep: true,
        },
    },
    computed : {
        config() {
            return this.$store.state.appDataStore.appConfig || {};
        }
    },

    methods : {
        getColors(value: any) {
            if(typeof value === 'string') {

            }
            else if(typeof value === 'number') {

            }
            else if(typeof value === 'boolean') {

            }
        },

     getEndpoint(data){
       const sourceIdselect = this.config.bilan.dotsGrid?.sourceId;


     }
    }
}

</script>