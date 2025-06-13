<template>
    <div>
            <div ref="selectCategory"  class="selectCategory">
               <div @click="show" class="selected"> <span class="chip" :style="{'background-color': localControlValue.color}"></span> {{ localControlValue.title }} <v-icon icon>{{ icon }}</v-icon></div>
               <div class="option" v-if="showIn">
                <ul>
                    <li v-for="control in controls_point" :key="control.title" @click="change_endpoint(control)">
                        <span class="chip" :style="{'background-color': control.color}"></span>
                        {{ control.title }}</li>
                </ul>
               </div>
            </div>
        


        <!-- <v-select class="selectCategory"  :items="controls_point" outlined @change="change_endpoint" v-model="localControlValue" item-text="title" style="cursor: pointer;">
         
        
        </v-select> -->
    </div>
  </template>





<script lang="ts">
import { ConfigInterface } from '@/Interfaces/ConfigInterface.js';

export default {
    name: 'SelectCategory',
    props: {
        controls_point: {
            type: Array as () => ConfigInterface[],
            required: true
        },
        control_value: {
            type: Object as () => ConfigInterface,
            required: false
        }
     
    },

    computed: {
        computedControlValue: {
            get() {
                return this.control_value;
            },
            set(newValue: ConfigInterface) {
                this.change_endpoint(newValue);
            }
        }
    },
    mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
    data() {
        return {
                localControlValue: this.control_value as ConfigInterface,
                showIn: false,
                icon: 'mdi-chevron-down'
        }
    },

   methods:{
    show(){
        this.showIn = !this.showIn
        this.showIn ? this.icon = 'mdi-chevron-up' : this.icon = 'mdi-chevron-down';
    },
    change_endpoint(newValue: ConfigInterface){
        this.localControlValue = newValue || this.control_value;
        this.localControlValue === newValue ? this.showIn = false : this.showIn = true;
        console.log('change_endpoint', newValue)
        this.$emit('change_endpoint', newValue)
   },
   hide() {
      this.showIn = false;
      this.icon = 'mdi-chevron-down';
    },
   handleClickOutside(event: MouseEvent) {
      const selectCategory = this.$refs.selectCategory as HTMLElement;
      if (selectCategory && !selectCategory.contains(event.target as Node)) {
        this.hide();
      }
    },
  
},
    
}
</script>

<style scoped>
    .selectCategory {
        max-width: max-content;
        padding-inline: 10px;
        padding-block: 5px;
        border-radius: 10px;   
        border: 1px solid hsla(0, 0%, 50%, 0.5);
        font-size: 16px;
        position: relative;
    }
    .selectCategory:hover {
        background-color: hsla(120, 100%, 50%, 0.05);
        outline: none;
    }
    .selected {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
    }
    .selectCategory .option {
        min-width: max-content;
        width: 100%;
        height: max-content;
        position: absolute;
        
        left: 0; 
        top: 45px;
        background-color: white;
        border-radius: 5px;
        z-index: 100;
        box-shadow: 0 4px 8px hsla(120, 20%, 50%, 0.5); 
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .option ul {
        list-style-type: none;
        width: 100%;
        padding-inline: 0;
        padding-block: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-size: 14px;
    }
    .option ul li {
        display: flex;
        gap: 5px;
        flex-direction: row;
        padding: 7px;
        align-items: center;
        cursor: pointer;
        border-bottom: 1px solid hsla(0, 0%, 50%, 0.05);
        justify-content: flex-start;
    }
    .option ul li:hover {
        background-color: hsla(0, 0%, 50%, 0.04);;
    }
    .chip{
        width: 10px;
        height: 20px;
        border-radius: 15px;
        display: inline-block;
        margin-inline: 5px;
    }
</style>
