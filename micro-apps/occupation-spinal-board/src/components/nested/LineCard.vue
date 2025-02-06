<template>
  <v-card class="line-card pa-1 rounded-lg d-flex flex-column flex-grow-1" elevation="5" outlined
    style="border-radius: 10px !important;">
    <v-card-title class="card-title pa-3 text-uppercase flex-shrink-1 justify-space-between"
      style="height: fit-content !important ; ">
      <p class="mb-0">{{ title }} <b>{{ titleDetails }}</b></p>
      <div class="d-flex align-center mln6" style="position: absolute; right: calc(50% - 55px)">
        <v-icon icon class="pr-3" size="default">mdi-chart-line</v-icon>
        <v-switch @click="$emit('stack', switchValue)" style="margin-top: 1px; padding: 0px;height: 24px;"
          v-model="switchValue" inset color="blue-grey" dense />
        <v-icon icon size="default">mdi-layers-triple</v-icon>
      </div>
      <div v-if="next && prev" style="height: 40px;">
        <v-btn @click="$emit('nav', -1)"
          style="font-size: 14px !important; border-radius: 10px;  min-width: 36px !important; box-shadow: none;"><v-icon
            icon>mdi-chevron-left</v-icon> {{ prev }}</v-btn>
        <v-btn @click="$emit('nav', +1)"
          style="font-size: 14px !important; border-radius: 10px;  min-width: 36px !important; box-shadow: none;">{{ next
          }}<v-icon icon>mdi-chevron-right</v-icon></v-btn>
      </div>
    </v-card-title>
    <v-progress-circular style="position: absolute;left: 52.5%; top: 77px;" v-if="lineChartData.datasets.length == 1"
      :size="25" color="#14202c" indeterminate />
    <div class="d-flex flex-column flex-grow-1 flex-shrink-1" style="height:0">
      <LineChart ref="chart" :key="chartKey" :data="lineChartData" :chart-id="'99'" :options="lineChartOptions"
        class="bar-height" />
    </div>
  </v-card>
</template>

<script>
import { Line as LineChart } from "vue-chartjs";
import { Chart } from 'chart.js';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement, Filler } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement, Filler);
export default {
  name: "line-card",
  props: {
    title: {
      type: String,
      default: "Line Card",
    },
    switchval: {
      type: Boolean,
      default: false
    },
    titleDetails: { type: String, required: false },
    next: { type: String, required: false },
    prev: { type: String, required: false },
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
    hidden: {
      type: Array,
      default: true,
    },
    optional: {
      type: Object,
      default: () => { return { unit: '', footer: 'Total' } },
      required: false
    },
    tooltipdate: {
      type: Array,
      required: true,
    },
  },
  components: {
    LineChart,
  },
  computed: {
    lineChartData() {
      let tempDatasets = this.datasets;
      for (let i = 0; i < this.datasets.length; i++) {
        if (i == 0) {
          tempDatasets[i]['fill'] = false; // dernier élément du tableau
          tempDatasets[i]['stack'] = true;
          tempDatasets[i]['borderWidth'] = 2
          if (this.stacked === false) {
            tempDatasets[i]['borderWidth'] = 2
          }
        } else {
          tempDatasets[i]['fill'] = true;
          if (this.stacked === false) {
            tempDatasets[i]['fill'] = false; // tous les autres éléments
            this.chartKey += 1;
            tempDatasets[i]['borderWidth'] = 2
          } else {
            tempDatasets[i]['fill'] = true;
            tempDatasets[i]['borderWidth'] = 2
            this.chartKey += 1;

          }
        }
        if (this.hidden.includes(i)) {
          tempDatasets[i]['hidden'] = true;
        } else {
          // Si l'élément n'est pas masqué, afficher les données
          tempDatasets[i]['hidden'] = false;
        }
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
        scales: {
          y: {
            stacked: this.switchValue,
            // stacked: true,
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
            onClick: (e, legendItem, legend) => {
              var index = legendItem.datasetIndex;
              var chart = legend.chart;
              var dataset = chart.data.datasets[index];
              var legendIndex = chart.data.datasets.findIndex(ds => ds.label === dataset.label);
              dataset.hidden = !dataset.hidden;
              this.toggleHidden(legendIndex);
              chart.update();
            },

            display: true,
            align: "center",
            labels: {
              color: "#214353",
              font: {
                size: 12,
              },
              useBorderRadius: true,
              borderRadius: 5,
              boxWidth: 10,
              boxHeight: 25,
            },

          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
          callbacks: {
            title: (tooltipItem) => {
              const tooltipIndex = tooltipItem[0].dataIndex;
              const tooltipLabel = this.tooltipdate[tooltipIndex];
              let label = `${tooltipLabel}`
              // label += '\n' + `${tooltipItem[0].dataset.label}: ${tooltipItem[0].raw} ${this.optional.unit} `;
              return label
            },
            label: (tooltipItem) => {
              // if (tooltipItem.dataset.label == this.datasets[0].label) {
              //   return ''
              // }
              let label = ` ${tooltipItem.dataset.label}: ${tooltipItem.raw} ${this.optional.unit}`;
              return label;
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
    });
  },
  data() {
    return {
      chartKey: 0,
      switchValue: this.stacked
    }
  },
  methods: {
    toggleHidden(index) {
      let tab = this.hidden
      if (tab.includes(index)) {
        tab = tab.filter(item => item !== index);
      } else {
        tab.push(index);
      }
      this.$emit('update:hidden', tab);
    },
    updateChart() {
      this.$refs.lineChart.update();
    }
  }
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