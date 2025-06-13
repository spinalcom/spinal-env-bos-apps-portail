<template>
  <v-card
    style="min-height: 220px !important; background: #f9f9f9; border-radius: 10px;"
    class="bar-card  d-flex flex-shrink-1 flex-column"
    elevation="5"
    outlined
  >
  <v-card-title class="card-title flex-shrink-1 justify-space-between" style="height: fit-content !important; padding: 0 !important">
      <p class="mb-0" style="padding: 10px;">
        <slot name="title"></slot>
        <br>
        <slot name="subtitle"></slot>
      </p>
      <!-- <div class="d-flex align-center mln6" style="position: absolute; right: calc(50% - 55px)">
        <v-icon  icon class="pr-3" size="default">mdi-chart-line</v-icon>
        <v-switch @click="$emit('stack', switchValue)" style="margin-top: 1px; padding: 0px;height: 24px;" v-model="switchValue" inset color="blue-grey" dense/>
        <v-icon  icon size="default">mdi-layers-triple</v-icon>
      </div> -->
      <div v-if="next && prev" style="height: 40px; align-self: flex-start; padding-top: 10px; padding-right: 10px;">
        <v-btn @click="$emit('nav', -1)" style="font-size: 14px !important; border-radius: 10px;  min-width: 36px !important; box-shadow: none;"><v-icon style="color: #14202c !important" icon>mdi-chevron-left</v-icon> {{ prev }}</v-btn>
        <v-btn @click="$emit('nav', +1)" style="font-size: 14px !important; border-radius: 10px;  min-width: 36px !important; box-shadow: none;">{{ next }}<v-icon style="color: #14202c !important" icon>mdi-chevron-right</v-icon></v-btn>
      </div>
    </v-card-title>
      <div class="d-flex flex-column flex-grow-1 flex-shrink-1" style="height:0">
          <LineChart
            :data="lineChartData"
            :chart-id="'99'"
            :options="lineChartOptions"
            class="bar-height"
            />
      </div>
  </v-card>
</template>

<script>
import { Line as LineChart } from "vue-chartjs";
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
            display: true,
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
              return data[0].dataset.tooltipDate[data[0].parsed.x];
            },
            label: (tooltipItem, data) => {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw} ${this.optional.unit}`;
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
}
};
</script>

<style scoped>
.desc {
  margin-left: 23px;
  font-family: "Charlevoix Pro";
  font-size: 16px !important;
}
.v-application {
  font-family: "Charlevoix Pro";
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
.line-card {
  font-family: "Charlevoix Pro";
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
::v-deep .theme--light.v-input--switch .v-input--switch__thumb, .theme--light.v-input--switch .v-input--switch__track {
color: #607d8b !important;
}
</style>