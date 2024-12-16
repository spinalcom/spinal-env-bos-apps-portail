<template>
  <div class="d-flex flex-column flex-grow-1 flex-shrink-1" style="height: 0">
      <LineChart :data="lineChartData" :chart-id="'2'" :options="lineChartOptions" class="bar-height" />
    </div>
</template>

<script>
import { Line as LineChart } from "vue-chartjs";
import { customBackgroundPlugin } from "../plugins/canvasPlugins";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Filler,
} from "chart.js";
import {
  defaultColor,
  gradiant,
  hexaToRGB,
  HSVtoRGB,
  RGBtoHexa,
} from "../colors";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Filler,
  customBackgroundPlugin
);

export default {
  name: "line-card",
  props: {
    title: {
      type: String,
      default: "Line Card",
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
      default: "mdi-chart-line",
    },
    switchTrueIcon: {
      type: String,
      default: "mdi-layers-triple",
    },
    fill: {
      type: Boolean,
      default: false,
    },
    titleDetails: { type: String, required: false },
    navText: { type: String, default: "" },
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
    lineChartData() {
      return {
        labels: this.labels,
        datasets: this.datasets,
      };
    },
    lineChartOptions() {
      const yAxes = {
        y: {
          stacked: this.stacked,
          border: {
            display: false,
          },
          type: this.scaleType,
          position: 'left',
          grid: {
            color: "#f9f9f9",
            lineWidth: 2,
          },
          ticks: {
            callback: (val) => `${val}${this.optional?.unit || ""}`,
            font: {
              family: "Charlevoix Pro",
              size: 11,
            },
            color: this.datasets[0]?.borderColor || "#214353",
          },
        },
      };

      // Générer dynamiquement des axes Y si nécessaire
      this.datasets.forEach((dataset, index) => {
        if (dataset.specialAxis) {
          const axisId = `y${index + 1}`;
          dataset.yAxisID = axisId;

          yAxes[axisId] = {
            type: 'linear',
            position: 'right',
            grid: {
              drawOnChartArea: false, 
            },
            ticks: {
              callback: (val) => `${val}${this.optional?.unit || ""}`,
              font: {
                family: "Charlevoix Pro",
                size: 11,
              },
              color: dataset.borderColor || "#214353",
            },
          };
        } else {
          dataset.yAxisID = 'y';
        }
      });

      return {
        id: "line-chart-id",
        pointStyle: this.pointStyle,
        spanGaps: true,
        fill: this.fill && this.stacked,
        labelStep: this.step,
        maintainAspectRatio: false,
        borderWidth: 2,
        animations: false,
        tension: 0.3,
        scales: {
          ...yAxes,
          x: {
            stacked: this.stacked,
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              callback: (v, i) => {
                if (!(v % this.step || [0, this.labels.length - 1].includes(i)))
                  return this.labels[i];
              },
              font: {
                family: "Charlevoix Pro",
                size: 11,
              },
              color: "#214353",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            align: "start",
            labels: {
              color: "#214353",
              font: {
                family: "Charlevoix Pro",
                size: 14,
                letterSpacing: 0.7,
              },
              useBorderRadius: true,
              borderRadius: 5,
              boxWidth: 9,
              boxHeight: 21,
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "xy",
          intersect: false,
          callbacks: {
            label: (tooltipItem) =>
              `${tooltipItem.dataset.label}: ${tooltipItem.raw} ${this.optional?.unit || ""
              }`,
            footer: (data) => {
              let total = data.reduce((a, b) => a + b.raw, 0);
              return `${this.optional?.footer || "Total"}: ${total} ${this.optional?.unit || ""
                }`;
            },
            labelColor: (context) => ({
              borderColor: "rgba(0,0,0,0)",
              backgroundColor: context.dataset.borderColor,
            }),
            ...this.tooltipCallbacks,
          },
        },
      };
    }
  },

  created() {
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
    // Enregistrement du plugin de légende en HTML/CSS
  },

  methods: {
    switchClicked() {
      this.$emit("update:switchValue", !this.switchValue);
    },
  },

  watch: {
    datasets() {
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
  position: fixed;
}

::v-deep .theme--light.v-input--switch .v-input--switch__thumb,
.theme--light.v-input--switch .v-input--switch__track {
  color: #607d8b !important;
}
</style>
