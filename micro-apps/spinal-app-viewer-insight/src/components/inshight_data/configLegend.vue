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
  },

  data() {
    return {
      minValue: this.value.min.value,
      minColor: this.value.min.color,
      medianColor: this.value.median?.color || "#FFFF00",
      maxValue: this.value.max.value,
      maxColor: this.value.max.color,
      selectMedian: !!this.value.median,
    };
  },

  computed: {},

  methods: {
    selectConfig() {
      this.$emit("input", {
        min: {
          value: parseFloat(this.minValue),
          color: this.minColor,
        },
        median: this.selectMedian ? { color: this.medianColor } : undefined,
        max: {
          value: parseFloat(this.maxValue),
          color: this.maxColor,
        },
      });
      this.$emit("close");
    },
  },
};
</script>

<style></style>
