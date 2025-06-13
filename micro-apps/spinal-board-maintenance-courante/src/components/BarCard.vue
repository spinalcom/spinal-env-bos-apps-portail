<template>
  <v-card
    style="min-height: 220px !important; background: #f9f9f9"
    class="bar-card pa-1 rounded-lg d-flex flex-shrink-1 flex-column"
    elevation="5"
    outlined
  >
    <v-card-title
      class="card-title pa-3 text-uppercase flex-shrink-1 justify-space-between"
      style="height: fit-content !important"
    >
      <p class="mb-0">{{ title }}</p>

      <div v-if="prev_next" style="height: 40px">
        <v-btn
          :disabled="false"
          @click="$emit('nav', -1)"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
            border: 1px solid #eaeef0 !important;
          "
          ><v-icon style="color: #14202c !important" icon
            >mdi-chevron-left</v-icon
          ></v-btn
        >
        {{ currentPeriod }}
        <v-btn
          :disabled="false"
          @click="$emit('nav', +1)"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
            border: 1px solid #eaeef0 !important;
          "
          ><v-icon style="color: #14202c !important" icon
            >mdi-chevron-right</v-icon
          ></v-btn
        >
      </div>
    </v-card-title>
    <div class="d-flex flex-column flex-grow-1">
      <slot name="extras"></slot>
      <div class="flex-grow-1" style="height: 0">
        <Bar
          :data="barChartData"
          :chart-id="'1'"
          :options="barChartOptions"
          ref="barChart"
        />
      </div>
    </div>
  </v-card>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  customBackgroundPlugin,
  customLegendPlugin,
} from "../plugins/canvasPlugins";
import {
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
  LogarithmicScale,
  Chart as ChartJS,
} from "chart.js";

ChartJS.register(
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  customBackgroundPlugin,
  customLegendPlugin
);

export default {
  name: "bar-card",

  props: {
    title: {
      type: String,
      default: "Bar Card",
    },
    prev_next: { type: Boolean, required: false },
    labels: {
      type: Array,
      required: true,
    },

    datasets: {
      type: Array,
      required: true,
    },

    currentPeriod: { type: String, default: "" },

    scaleType: {
      type: String,
      default: "linear",
    },

    stacked: {
      type: Boolean,
      default: false,
    },
    noNav: {
      type: Boolean,
      required: false,
    },
  },

  data: () => ({
    isD: false,
  }),

  components: {
    Bar,
  },

  computed: {
    barChartData() {
      return {
        labels: this.labels,
        datasets: this.datasets,
      };
    },

    barChartOptions() {
      return {
        maintainAspectRatio: false,
        barThickness: 20,
        transitions: {
          show: {
            animations: {
              y: {
                from: 1000,
              },
            },
          },
          hide: {
            animations: {
              y: {
                to: 1000,
              },
            },
          },
        },
        scales: {
          y: {
            border: {
              display: false,
            },
            type: this.scaleType,
            stacked: this.stacked,
            ticks: {
              font: {
                family: "Charlevoix Pro",
                size: 11,
                letterSpacing: 1.1,
              },
              // color: (item) => {
              //   console.log(item);
              //   const step =
              //     item.scale.ticks[1].value - item.scale.ticks[0].value;
              //   let mid = Math.floor(item.scale.max / 2);
              //   while (mid % step) mid += 1;
              //   switch (item.tick.value) {
              //     case item.scale.max:
              //     case mid:
              //       return "#000000DE";
              //     default:
              //       return "#f9f9f9";
              //   }
              // },
            },
            grid: {
              color: "#f9f9f9",
              lineWidth: 2,
            },
          },
          x: {
            stacked: this.stacked,
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: "Charlevoix Pro",
                size: 11,
                letterSpacing: 1.1,
              },
              color: "#000000DE",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            align: "start",
            labels: {
              color: "#000000DE",
              font: {
                family: "Charlevoix Pro",
                size: 14,
                letterSpacing: 1.1,
              },
              useBorderRadius: true,
              borderRadius: 5,
              boxWidth: 9,
              boxHeight: 21,
            },
          },
        },
      };
    },
  },

  created() {
    const radius = 4;
    const borderRadius = {
      topLeft: radius,
      topRight: radius,
      bottomLeft: radius,
      bottomRight: radius,
    };
    this.datasets.forEach((set) => {
      set.borderSkipped = false;
      set.borderRadius = borderRadius;
      set.borderWidth = 1;
      set.borderColor = "rgba(0,0,0,0)";
    });

    // Enregistrement du plugin de légende en HTML/CSS
  },

  methods: {},
  watch: {
    datasets() {
      const radius = 4;
      const borderRadius = {
        topLeft: radius,
        topRight: radius,
        bottomLeft: radius,
        bottomRight: radius,
      };
      this.datasets.forEach((set) => {
        set.borderSkipped = false;
        set.borderRadius = borderRadius;
        set.borderWidth = 1;
        set.borderColor = "rgba(0,0,0,0)";
      });
    },
  },
};
</script>
<style>
.v-application {
  font-family: "Charlevoix Pro";
}
</style>
<style scoped>
.bar-card {
  background-color: #f9f9f9;
  font-family: "Charlevoix Pro";
  font-size: 14px;
}

.card-title {
  letter-spacing: 1.1px !important;
  color: #000000de !important;
  font-size: 20px !important;
}

@font-face {
  font-family: "Charlevoix Pro";
  src: url("../assets/font/CharlevoixPro-Regular.woff2") format("woff2"),
    url("../assets/font/CharlevoixPro-Regular.woff") format("woff"),
    url("../assets/font/CharlevoixPro-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}
</style>
