<template>
  <v-card class="stat-card rounded-lg" elevation="5" outlined style="background: #f9f9f9;">
    <v-flex class="d-flex flex-row fill-height">
      <v-flex
        v-if="value !== -1"
        class="d-flex flex-column justify-center text-center stat-value"
        :style="{ color: color }"
      >
        {{ shortNumberCall(value) }}
      </v-flex>
      <div class="d-flex align-center " style="padding: 0 20px" v-else>
        <v-progress-circular
          :size="40"
          color="#14202c"
          indeterminate
        />
      </div>
      <v-flex class="d-flex flex-column justify-center justify-start stat-text">
        <div>
          <span v-if="unit" :style="{ color: color }">{{ unit + "  " }}</span>
          {{ title }}
        </div>
        <div v-if="type === 'comparison'" class="stat-subtitle">
          <span class="black--text">{{ compared + " " }}</span
          >{{ subtitle }}
        </div>
        <div
          v-else-if="subtitle"
          class="stat-subtitle orange--text text-uppercase"
        >
          <div class="rounded-circle d-inline-block orange pa-1" ></div>
          {{ subtitle }}
        </div>
      </v-flex>
    </v-flex>
  </v-card>
</template>

<script>
export default {
  name: "StatsCard",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "date",
    },
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    compared: {
      type: String,
    },
    subtitle: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      default: "#000000DE",
    },
  },
  methods: {
    shortNumberCall(n) {
      if (Math.abs(n) >= 1000000000)
        return Math.round(n / 100000000) / 10 + "B";
      if (Math.abs(n) >= 1000000) return Math.round(n / 100000) / 10 + "M";
      if (Math.abs(n) >= 1000) return Math.round(n / 100) / 10 + "K";
      return n === Math.floor(n) ? n : n.toFixed(1);
    },
  },
};
</script>

<style scoped>
.stat-card {
  font-family: "Charlevoix Pro";
  background-color: #f9f9f9;
}
.stat-value {
  font-family: "Charlevoix Pro";
  font-size: 48px;
}
.stat-subtitle {
  font-family: "Charlevoix Pro";
  font-size: 12px;
  font-weight: bold;
  color: #FF7612 !important;
}
.stat-text {
  font-size: 16px;
  font-family: "Charlevoix Pro";
  width: 60%;
  color: #949da6;
}

@font-face{font-family:'Charlevoix Pro';src:url('../assets/font/CharlevoixPro-Regular.woff2') format('woff2'),url('../assets/font/CharlevoixPro-Regular.woff') format('woff'),url('../assets/font/CharlevoixPro-Regular.ttf') format('truetype');font-weight:normal;font-style:normal}

</style>
