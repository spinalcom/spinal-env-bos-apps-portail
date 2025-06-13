<template>
  <v-card
    class="pie-card pa-1 rounded-lg d-flex flex-column"
    elevation="5"
    outlined
    style="background: #f9f9f9"
  >
    <v-card-title class="card-title text-uppercase flex-shrink-1 pa-3">
      {{ title }}
    </v-card-title>
    <div
      class="d-flex flex-row justify-start flex-grow-1 pb-3"
      style="gap: 50px; padding-left: 40px;"
    >
      <div>
        <Pie :width="200" :data="pieData" :options="pieChartOptions" ref="pieChart" />
      </div>
      <div id="pie-legend-container"></div>
    </div>
  </v-card>
</template>

<script>
import { Pie } from "vue-chartjs";
import { customBackgroundPlugin } from "../plugins/canvasPlugins";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Title,
  Legend,
  Tooltip,
  CategoryScale,
  customBackgroundPlugin
);

export default {
  name: "pie-card",
  components: {
    Pie,
  },

  data() {
    return {
      pieId: 1,
      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: 0,
        autopadding: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            titleFont: {
              size: 14,
              family: 'Charlevoix Pro'
            },
            bodyFont: {
              size: 14,
              family: 'Charlevoix Pro'
            },
            footerFont: {
              size: 14,
              family: 'Charlevoix Pro'
            }
          }
        },
      },
    };
  },

  props: {
    title: {
      type: String,
      default: "Pie Card",
    },
    pieChartData: {
      type: Array,
      required: true,
    },
    color: {
      type: Array,
      required: false,
    },
  },

  computed: {
    pieData() {
      if (this.pieChartData.length == 0) {
        return {
          labels: ['Pas de données disponibles'],
          datasets: [
            {
              backgroundColor: ['#c4c4c4'],
              data: [1]
            }
          ]
        }
      }
      const data = [...this.pieChartData];
      data.sort((e1, e2) => e1.value - e2.value).reverse();
      let sorted = [];
      if (data.length > 7) {
        for (let i = 0; i < 6; i++) sorted.push(data.shift());
        sorted.push({
          label: "ETC...",
          value: data.map((e) => e.value).reduce((e1, e2) => e1 + e2, 0),
          color: '#d0d0d0'
        });
      } else sorted = data;
      if (this.color)
      return {
        labels: sorted.map((t) => `${t.value}: ${t.label}`),
        datasets: [
          {
            backgroundColor: this.color,
            data: sorted.map((t) => t.value),
            borderRadius: 1,
          },
        ],
      };
      else
      return {
        labels: sorted.map((t) => `${t.value}: ${t.label}`),
        datasets: [
          {
            backgroundColor: sorted.map((t) => t.color),
            data: sorted.map((t) => t.value),
            borderRadius: 1,
          },
        ],
      };
    },
  },

  mounted() {
    this.renderChart();
  },

  methods: {
    renderChart() {
      // re-render the chart
      if (this.$refs.pieChart.chartInstance)
      this.$refs.pieChart.chartInstance.resize();
    },
  },

  watch: {
    "$el.clientWidth": function (val) {
      this.renderChart();
    },
    "$el.clientHeight": function (val) {
      this.renderChart();
    },
  },
};
</script>

<style>
.v-application {
  font-family: "Charlevoix Pro";
}

.card-title {
  font-family: "Charlevoix Pro";
  letter-spacing: 1.1px !important;
  color: #000000DE !important;
  font-size: 20px !important;
}

li p {
  letter-spacing: 1.1px !important;
  font-size: 14px !important;
  color: #000000DE;
  font-family: "Charlevoix Pro";
  width: 100%;
}

.chartjs-tooltip {
  font-family: "Charlevoix Pro";
  font-size: 44px;
}

#pie-legend-container {
  flex-grow: 1;
  flex-wrap: wrap;
  display: flex;
  max-width: 400px;
}
</style>
