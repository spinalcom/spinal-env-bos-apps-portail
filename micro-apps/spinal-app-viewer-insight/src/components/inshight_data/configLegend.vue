<template>
  <v-card>
    <v-card-text class="d-flex flex-row justify-space-between">
      <div style="width: calc(100% / 3 - 4px)">
        <v-card-title class="headline justify-center">
          Valeur minimale
        </v-card-title>
        <div class="d-flex flex-column align-center">
          <v-text-field
            type="number"
            v-model="minValue"
            :rules="[
              (v) => v < maxValue || 'Doit être inférieur à la valeur maximale',
            ]"
            outlined
          ></v-text-field>
          <div class="d-flex justify-center">
            <v-color-picker v-model="minColor"></v-color-picker>
          </div>
        </div>
      </div>
      <v-divider vertical inset></v-divider>
      <div
        style="width: calc(100% / 3 - 8px)"
        class="d-flex flex-column justify-space-between"
      >
        <v-card-title
          @click="selectMedian = !selectMedian"
          class="headline justify-center"
        >
          <v-checkbox @click.stop v-model="selectMedian"></v-checkbox> Valeur
          médiane
        </v-card-title>
        <div
          :style="
            selectMedian ? {} : { 'pointer-events': 'none', opacity: 0.7 }
          "
          class="d-flex justify-space-around"
        >
          <v-color-picker v-model="medianColor"></v-color-picker>
        </div>
      </div>
      <v-divider vertical inset></v-divider>
      <div style="width: calc(100% / 3 - 4px)">
        <v-card-title class="headline justify-center">
          Valeur maximale
        </v-card-title>
        <div class="d-flex flex-column align-center">
          <v-text-field
            type="number"
            v-model="maxValue"
            :rules="[
              (v) => v > minValue || 'Doit être supérieur à la valeur minimale',
            ]"
            outlined
          ></v-text-field>
          <div class="d-flex justify-center">
            <v-color-picker v-model="maxColor"></v-color-picker>
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <button 
      @click="autoL = !autoL"
      class="btn-auto"
      :class="{'autoL-active': autoL}"
      >
      <div class="check" v-if="!autoL"></div>
      <v-icon v-if="autoL" :style="{backgroundColor: autoL  ? 'rgb(21 128 61 / var(--tw-bg-opacity, 1))': '',
        color: autoL ? 'white' :'',
        borderRadius: autoL ? '8px' : ''
      }" >mdi-check</v-icon>
      légende automatique </button>
      <v-spacer></v-spacer>
      <v-btn text @click="$emit('close')">Annuler</v-btn>
      <v-btn text :disabled="minValue >= maxValue" @click="selectConfig"
        >OK</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "config-legend",
  props: {
    value: {
      type: Object,
      require: true,
    },
    data : {
      type : Array,
      required : true
    }
  },

  data() {
    return {
      minValue: null,
      minColor: this.value.min.color,
      medianColor: this.value.median?.color || "#FFFF00",
      maxValue: null,
      maxColor: this.value.max.color,
      selectMedian: !!this.value.median,
      autoL : false,
      endpoint: []
    };
  },

  computed: {},
  async mounted()  {
    const childrenAlt = this.data.map((el) => el.children);
    let endpointalt = []
    await childrenAlt.map((el) => {
      el.map((_el) => {
        this.endpoint.push(_el)
      })
    })
   
    this.autoLengende()
  },
  watch: {
    
    autoL(newVal){
      // this.autoL = !this.autoL
      this.autoLengende()
    }
  },

  methods: {
    maxDataValue(data) {
      const validValues = data.filter((el) => el.displayValue && !isNaN(el.displayValue));
      return Math.max(...validValues.map((el) => el.displayValue)).toFixed(2);
    },
    minDataValue(data) {
      const validValues = data.filter((el) => !isNaN(el.displayValue));
      return Math.min(...validValues.map((el) => el.displayValue)).toFixed(2);
    },
    autoLengende(){
      if(!this.autoL) {
        this.minValue = this.value.min.value;
        this.maxValue = this.value.max.value;
      }
      else {
          this.minValue = this.minDataValue(this.endpoint);
          this.maxValue = this.maxDataValue(this.endpoint);
      } 
    },
    selectConfig() {
      this.$emit("input", {
        min: {
          value: parseFloat(this.minValue).toFixed(2),
          color: this.minColor,
        },
        median: {
          value: ( parseFloat(this.maxValue) + parseInt(this.minValue)) / 2,
          color: this.medianColor,
        },
        max: {
          value: parseInt(this.maxValue).toFixed(2),
          color: this.maxColor,
        },
      });
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.autoL-active{
    color: #ffffff;
    font-weight: 700;
    background-color: #14202C;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
    --tw-shadow-color: #e2e8f0;
}

.btn-auto {
  border: 1px solid rgb(226 232 240 / var(--tw-bg-opacity, 1));
  border-radius: 7px;
  padding: 5px;
  background: #14202C;
  color: white;
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
}
.check{
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background-color: rgb(241 245 249 / var(--tw-bg-opacity, 1));
  border: 2px solid rgb(226 232 240 / var(--tw-bg-opacity, 1));

}


</style>
