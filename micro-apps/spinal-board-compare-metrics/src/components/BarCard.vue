<template>
  <v-card
    style="min-height: 75vh !important; background: #f9f9f9; border-radius: 10px;"
    class="bar-card  d-flex flex-shrink-1 flex-column"
    elevation="5"
    outlined
  >
    <v-card-title class="card-title flex-shrink-1 justify-space-between" style="height: fit-content !important; padding: 0 !important">
      <p class="mb-0" style="padding: 10px;">
        {{ title }}
        <br>
        <span class="desc">{{ subtitle }}</span>
      </p>
      <div class="d-flex align-center mln6" style="position: absolute; right: calc(50% - 55px)" v-if="isYear">
        <v-icon icon style="color: #0000008a !important" class="pr-3" size="default">mdi-poll</v-icon>
        <v-switch @click="$emit('stack', switchValue)" style="margin-top: 1px; padding: 0px;height: 24px;" v-model="switchValue" inset color="blue-grey" dense />
        <v-icon icon style="color: #0000008a !important" size="default">mdi-calendar-month-outline</v-icon>
      </div>
      <div v-if="prev_next" style="height: 40px; align-self: flex-start; padding-top: 10px; padding-right: 10px;">
        <v-btn :disabled="false" @click="$emit('nav', -1)" style="font-size: 14px !important; border-radius: 10px;  min-width: 36px !important; box-shadow: none; border: 1px solid #EAEEF0 !important;"><v-icon style="color: #14202c !important" icon>mdi-chevron-left</v-icon>{{ prev }}</v-btn>
        <v-btn :disabled="false" @click="$emit('nav', +1)" style="font-size: 14px !important; border-radius: 10px;  min-width: 36px !important; box-shadow: none; border: 1px solid #EAEEF0 !important;">{{ next }}<v-icon style="color: #14202c !important" icon>mdi-chevron-right</v-icon></v-btn>
      </div>
    </v-card-title>

    <div v-if="noData" class="no-data-container d-flex justify-center align-center flex-grow-1">
      <v-icon style="color: red !important; ">mdi-alert-circle-outline</v-icon>
      <span class="no-data-text">NO DATA</span>
    </div>

    <div v-else class="d-flex flex-column flex-grow-1">
      <slot name="extras" v-if="switchValue && isYear"></slot>
      <div class="flex-grow-1" style="height: 0;" v-if="switchValue && isYear">
        <CalendarAndStripe :results="calendar" :unit="optional.unit" v-if="calendar && calendar.d && calendar.d.length > 0" />
      </div>
      <div class="flex-grow-1" style="height: 0;" v-else>
        <Bar :data="barChartData" :chart-id="'1'" :options="barChartOptions" ref="barChart" />
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
  Tooltip,
  BarElement,
  LinearScale,
  CategoryScale,
  LogarithmicScale,
  Chart as ChartJS,
} from "chart.js";

ChartJS.register(
  Legend,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  customBackgroundPlugin,
  customLegendPlugin
);

import CalendarAndStripe from './CalendarAndStripe.vue';
export default {
  name: "bar-card",
  props: {
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    prev_next: {type: Boolean, required: false},
    next: {type: String, required: false},
    prev: {type: String, required: false},
    labels: {
      type: Array,
      required: true,
    },

    datasets: {
      type: Array,
      required: true,
    },

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
    isYear: {
      type: Boolean,
      required: false,
    },
    calendar: {
      
      required: false
    },
    optional: {
      type: Object,
      default: () => {return {unit: '', footer: 'Total'}},
      required: false
    },
    noData: {
      type: Boolean,
      required: false,
    },
  },

  data: () => ({
    isD: false,
    switchValue: false,
    results: {
      y: '2023',
      d: [
        [
          182, 400, 200, 201, 201, 170,
          187, 282, 258, 171, 275, 183,
          267, 294, 288, 194, 258, 228,
          204, 236, 244, 172, 274, 290,
          206, 274, 293, 185, 261, 247,
          210
        ] ,
        [
          225, 140, 139, 166, 179, 205,
          159, 134, 210, 137, 163, 227,
          185, 197, 174, 226, 215, 147,
          144, 216, 145, 206, 206, 159,
          223, 169, 206, 207
        ] ,
        [
          125, 156,  92, 120, 131, 113, 157,
          133, 155, 134, 153, 137, 114, 127,
          110, 113, 146, 107, 120, 169, 142,
          146, 167, 165, 125, 144, 119, 153,
          123, 144,  95
        ] ,
        [
          101,  91, 139, 154, 100, 127, 157,
          90, 141, 119, 146, 102, 137, 125,
          118, 146,  96, 117, 106, 165, 102,
          118,  94, 140,  95, 131,  93, 163,
          92, 102
        ] ,
        [
          86, 104, 126, 139, 116, 168, 109,
          56, 132, 113,  55, 150, 109, 123,
          64,  85, 129, 100,  67,  91, 137,
          104, 157,  96, 141, 163,  89,  53,
          119, 126, 130
        ] ,
        [
          81, 32, 23,  15, 116, 57, 21, 73,  0,
          77, 84, 76, 101, 116, 30, 79, 81, 59,
          25, 24, 47,   3,  20, 35, 39, 29, 80,
          64, 83, 98
        ] ,
        [
          129,   1, 63, 28, 50, 106,  3, 104, 21,
          34, 105, 48, 93,  0,  80, 36,  25, 48,
          95,  23, 98, 25, 78,  56, 71,  40, 43,
          86, 109, 34, 86
        ] ,
        [
          32, 59, 56, 23, 94, 20, 38, 83, 41,
          81, 64, 52, 84, 99, 97, 40, 46, 22,
          98, 31, 94, 13, 30, 30, 37,  9, 62,
          9,  6, 18, 16
        ] ,
        [
          96, 17, 27, 94, 11, 58, 63, 34, 39,
          74, 52, 82, 96, 80, 39,  7, 41, 32,
          43, 89, 75, 80, 67, 70, 69, 63, 77,
          23, 68, 12
        ] ,
        [
          128, 124, 144,  87, 128, 132, 168,
          129, 154, 158, 150,  79, 138, 101,
          123,  74, 167, 160,  86, 162, 162,
          116,  72, 160, 108,  71,  81, 112,
          127,  74,  78
        ] ,
        [
          252, 259, 193, 263, 285, 204,
          232, 210, 224, 196, 198, 282,
          240, 282, 193, 289, 245, 255,
          178, 225, 248, 297, 228, 234,
          280, 197, 207, 203, 282, 237
        ] ,
        [
        280, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
        ] ,
      ],
    }
  }),

  components: {
    Bar,
    CalendarAndStripe
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
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
          callbacks: {
            title: (data) => {
              return data[0].dataset.tooltipDate[data[0].parsed.x];
            },
            label: (tooltipItem, data) => {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(1)} ${this.optional.unit}`;
            },
            // footer: (data) => {
            //   let total = data.reduce((a, b) => a+b.raw, 0);
            //   return `Total: ${total}`;
            // },
          }
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
  
  methods: {
    
  },
  mounted() {
    
  },
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

.desc {
  margin-left: 23px;
  font-family: "Charlevoix Pro";
  font-size: 16px !important;
}
.v-application {
  font-family: "Charlevoix Pro";
}
</style>
<style scoped>
.no-data-container {
  border-radius: 8px;
  padding: 20px;
}
.no-data-text {
  font-size: 24px;
  margin-left: 10px;
}
.bar-card {
  background-color: #f9f9f9;
  font-family: "Charlevoix Pro";
  font-size: 14px;
}

.card-title {
  letter-spacing: 1.1px !important;
  color: #000000DE !important;
  font-size: 20px !important;
}

::v-deep .theme--light.v-input--switch .v-input--switch__thumb, .theme--light.v-input--switch .v-input--switch__track {
color: #607d8b !important;
}

@font-face{font-family:'Charlevoix Pro';src:url('../assets/font/CharlevoixPro-Regular.woff2') format('woff2'),url('../assets/font/CharlevoixPro-Regular.woff') format('woff'),url('../assets/font/CharlevoixPro-Regular.ttf') format('truetype');font-weight:normal;font-style:normal}

</style>
