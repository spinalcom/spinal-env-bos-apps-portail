<template>
  <v-card
    class="bar-card  d-flex flex-shrink-1 flex-column"
  >
      <div class="d-flex flex-column flex-grow-1 flex-shrink-1" style="width: 100%; height: 100%;">
          <LineChart
            :data="lineChartData"
            :chart-id="'99'"
            :options="lineChartOptions"
            />
      </div>
  </v-card>
</template>

<script>
import { Line as LineChart } from "vue-chartjs";
import {
  customBackgroundPlugin,
  customLegendPlugin,
} from "../plugins/canvasPlugins";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement, Filler } from 'chart.js';
ChartJS.register( Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement, Filler );
export default {
  name: "line-card",
  props: {
    title: {
      type: String,
      default: "Line Card",
    },
    subtitle: {
      type: String,
    },
    switchval: {
      type: Boolean,
      default: false
    },
    titleDetails: {type: String, required: false},
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
    optional: {
      type: Object,
      default: () => {return {unit: '', footer: 'Total'}},
      required: false
    },
  },
  components: {
    LineChart,
  },
  mounted() {

  },
  computed: {
    lineChartData() {
      let tempDatasets = this.datasets;
      for (let i = 0; i < this.datasets.length; i++) {
        tempDatasets[i]['fill'] = false;
        tempDatasets[i]['borderColor'] = this.datasets[i].backgroundColor;
      }
      return {
        labels: this.labels,
        datasets: tempDatasets,
      };
    },
    lineChartOptions() {
      return {
        maintainAspectRatio: false,
        responsive: true,
        borderWidth: 2,
        tension: 0.2,
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
        elements: {
          point: {
            pointStyle: 'false', // set point style to cross
            radius: 1, // set point radius
            hoverRadius: 3, // set point hover radius
          },
        },
        scales: {
          y: {
            stacked: this.switchValue,
            border: {
              display: false,
            },
            type: this.scaleType,
            ticks: {
            // color: (item) => {
            //   const max = (Math.floor((item.scale.max - 1) / 10) + 1) * 10;
            //   item.scale.end = max;
            //   return !item.tick.value || item.tick.value % Math.floor(max / 2)
            //     ? item.tick.value === item.scale.max
            //       ? "#214353"
            //       : "#f9f9f9"
            //     : "#214353";
            // },
          },
            grid: {
              color: "#f0f0f0",
            },
          },
          x: {
            stacked: this.stacked,
            border: {
              display: false,
            },
            grid: {
              color: "#f0f0f0",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            align: "start",
            labels: {
              color: "#000000DE",
              font: {
                size: 14,
              },
              useBorderRadius: true,
              borderRadius: 5,
              boxWidth: 10,
              boxHeight: 25
            },
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
          callbacks: {
            title: (data) => {
              return data[0].dataset.tooltipDate[data[0].parsed.x]
            },
            label: (tooltipItem, data) => {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(1)} ${this.optional.unit}`;
            },
            // footer: (data) => {
            //   let total = data.reduce((a, b) => a+b.raw, 0);
            //   return `${this.optional.footer}: ${total} ${this.optional.unit}`;
            // },
          }
        },
      };
    },
  },
  created() {
    const radius = 9;
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
    });
    // Enregistrement du plugin de légende en HTML/CSS
  },
  data() {
  return {
    switchValue: this.stacked
  }
},
watch: {
  datasets: {
    deep: true,
    handler(n, o) {
    }
  }
}
};
</script>

<style scoped>
.desc {
  margin-left: 23px;
  font-family: "Charlevoix Pro";
  font-size: 1em !important;
}
.v-application {
  font-family: "Charlevoix Pro";
}

.bar-card {
  background-color: #f9f9f9;
  font-family: "Charlevoix Pro";
  font-size: 0.875em;
}

.card-title {
  letter-spacing: 1.1px !important;
  color: #000000DE !important;
  font-size: 1.25em !important;
}
.line-card {
  font-family: "Charlevoix Pro";
  background-color: #f9f9f9;
}
.card-title {
  letter-spacing: 1.1px;
  color: #214353;
  opacity: 1;
  font-size: 1.25em !important;
}
.bar-height {
height: 75% !important;
}
::v-deep .theme--light.v-input--switch .v-input--switch__thumb, .theme--light.v-input--switch .v-input--switch__track {
color: #607d8b !important;
}
</style>