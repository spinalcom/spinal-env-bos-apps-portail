<template>
  <v-card
    class="line-card pa-1 rounded-lg d-flex flex-column flex-grow-1"
    outlined
  >
    <v-card-title
      style="font-size: 20px; height: 56px"
      class="card-title pa-3 text-uppercase justify-space-between"
    >
      <p>
        {{ title }} <b>{{ titleDetails }}</b>
      </p>
      <div
        class="d-flex align-center ml-n6"
        style="position: absolute; right: calc(50% - 55px)"
      >

      <!-- <v-btn
          @click="resetZoom"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
          "
        >
          Reset zoom
          <v-icon icon>mdi-cancel</v-icon>
        </v-btn> -->

        <div v-if="switchEnabled" class="d-flex flex-row justify-space-between">
          <v-icon icon class="pr-3" size="default">{{
            switchFalseIcon
          }}</v-icon>
          <v-switch
            :value="switchValue"
            @click="switchClicked()"
            inset
            color="blue-grey"
            dense
          />
          <v-icon icon size="default">{{ switchTrueIcon }}</v-icon>
        </div>
      </div>
      <div v-if="navEnabled" style="height: 40px">
        <v-btn
          @click="$emit('nav', -1)"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
          "
        >
          <v-icon icon>mdi-chevron-left</v-icon>
        </v-btn>
        {{ navText }}
        <v-btn
          @click="$emit('nav', +1)"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
          "
        >
          <v-icon icon>mdi-chevron-right</v-icon>
        </v-btn>

        <v-btn
          @click="$emit('nav', +1)"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
          "
        >
          <v-icon icon>mdi-chevron-right</v-icon>
        </v-btn><v-btn
          @click="$emit('nav', +1)"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
          "
        >
          <v-icon icon>mdi-chevron-right</v-icon>
        </v-btn><v-btn
          @click="$emit('nav', +1)"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
          "
        >
          <v-icon icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn
          @click="$emit('nav', +1)"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
          "
        >
          <v-icon icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn
          @click="$emit('nav', +1)"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
          "
        >
          <v-icon icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn
          @click="$emit('nav', +1)"
          style="
            font-size: 14px !important;
            border-radius: 10px;
            min-width: 36px !important;
            box-shadow: none;
          "
        >
          <v-icon icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </v-card-title>
    <div class="d-flex flex-column flex-grow-1 flex-shrink-1">
      <LineChart
        ref="myChart"
        :data="chartData"
        :chart-id="'2'"
        :options="lineChartOptions"
        class="bar-height"
        @mounted="storeChartInstance"
      />
    </div>  
  </v-card>
</template>

<script>
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line as LineChart } from 'vue-chartjs';
import { customBackgroundPlugin } from '../plugins/canvasPlugins';
// import  LineChart  from './LineChart.vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  TimeSeriesScale,
  TimeScale,
  CategoryScale,
  PointElement,
  Filler,
} from 'chart.js';
import {
  defaultColor,
  gradiant,
  hexaToRGB,
  HSVtoRGB,
  RGBtoHexa,
} from '../colors';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  Filler,
  customBackgroundPlugin,
  zoomPlugin
);

export default {
  name: 'line-card',
  props: {
    title: {
      type: String,
      default: 'Line Card',
    },
    step: {
      type: Number,
      default: 1,
    },
    navEnabled: {
      type: Boolean,
      default: false,
    },
    switchEnabled: {
      type: Boolean,
      default: false,
    },
    switchValue: {
      type: Boolean,
      default: false,
    },
    switchFalseIcon: {
      type: String,
      default: 'mdi-chart-line',
    },
    switchTrueIcon: {
      type: String,
      default: 'mdi-layers-triple',
    },
    fill: {
      type: Boolean,
      default: false,
    },
    titleDetails: { type: String, required: false },
    navText: { type: String, default: '' },
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
      default: 'linear',
    },
    stacked: {
      type: Boolean,
      default: false,
    },
    optional: {
      type: Object,
      required: false,
    },
    tooltipCallbacks: {
      type: Object,
      default: () => ({}),
    },
    pointStyle: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    LineChart,
  },

  
  computed: {
    lineChartOptions() {
      return {
        type: 'line',
        id: 'line-chart-id',
        parsing: false, // disabled parsing for better performance -- careful, data must be sorted before feeding it to the chart
        scales: this.calculateScaling(),
        plugins: {
        // Enable zooming and panning
          // zoom: {
          //   pan: {
          //     enabled: true,
          //     mode: 'y', 
          //   },
          //   zoom: {
          //     wheel: {
          //       enabled: true, // Enable zooming with the mouse wheel
          //     },
          //     pinch: {
          //       enabled: true // Enable zooming with pinch gesture
          //     },

          //     mode: 'xy', // Allow zooming in both directions (x and y)
          //     // Optional: Set a speed and limits for zooming
          //     // speed: 0.1,
          //     // sensitivity: 3,
          //     // rangeMin: { x: null, y: null },
          //     // rangeMax: { x: null, y: null },
          //   }
          // }
        }
      };
    },

    chartData() {
      return {
        datasets: this.datasets.map((dataSet, index) => {
          return {
            label: dataSet.label,
            yAxisID: 'y' + index,
            borderColor: dataSet.borderColor,
            pointBackgroundColor: dataSet.pointBackgroundColor,
            backgroundColor: dataSet.backgroundColor,
            data: dataSet.data,
          };
        })
      };
    },
  },



  created() {
    this.handleColorAssignation();
  },

  mounted() {
  // this.$nextTick(() => {
  //   if (this.$refs.myChart?.chart) {
  //     console.log('Chart instance found:', this.$refs.myChart.chart);
  //     this.chartInstance = this.$refs.myChart.chart;
  //   } else {
  //     console.warn('Chart instance not available at mount.');
  //   }
  // });
},

  methods: {

    handleColorAssignation(){
      const colors =
      this.datasets.length <= 3
        ? defaultColor(3)
        : gradiant(this.datasets.length).map((color) => {
          const col = HSVtoRGB(color / 100, 1, 1);
          return RGBtoHexa(col.r, col.g, col.b);
        });
      this.datasets.forEach((set) => {
        set.borderColor = set.borderColor || colors.shift();
        set.pointBackgroundColor = set.borderColor;
        const { r, g, b } = hexaToRGB(set.borderColor);
        set.backgroundColor = set.backgroundColor || `rgba(${r},${g},${b},0.3)`;
      });
    },

    calculateScaling(){
      const scales = {
        x: {
          type: 'timeseries',
          time: {
            displayFormats: {
              quarter: 'MMM YYYY',
            },
          },
        },
      };
      // Dynamically create a y-axis for each dataset.
      this.datasets.forEach((dataSet, index) => {
        const axisId = 'y' + index;
        scales[axisId] = {
          type: 'linear',
          // Alternate positions.
          position: index % 2 === 0 ? 'left' : 'right',
          // Draw grid lines only on the first axis.
          grid: {
            drawOnChartArea: index === 0
          },
          title: {
            display: true,
            text: dataSet.label
          }
        };
      });
      return scales;
    },

    storeChartInstance(chart) {
    console.log('Chart instance stored:', chart);
    this.chartInstance = chart;
  },

  resetZoom() {
    if (this.chartInstance) {
      this.chartInstance.resetZoom();
    } else {
      console.warn('Chart instance not available.');
    }
  },




    switchClicked() {
      this.$emit('update:switchValue', !this.switchValue);
    },
  },

  watch: {
    datasets() {
      this.handleColorAssignation();
    },
  },
};
</script>

<style scoped>
.line-card {
  background-color: #f9f9f9;
}

.card-title {
  letter-spacing: 1.1px;
  color: #214353;
  opacity: 1;
  font-size: 20px !important;
}

.bar-height {
  height: 100%;
}

::v-deep .theme--light.v-input--switch .v-input--switch__thumb,
.theme--light.v-input--switch .v-input--switch__track {
  color: #607d8b !important;
}
</style>