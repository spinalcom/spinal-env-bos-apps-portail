<template>
  <div class="card-menu">
    <ul class="cards">
      <div class="card">
        <div
          style="display: flex; flex-direction: column; padding-right: 5px"
          class="mt-4 ml-4"
        >
          <span
            @click.stop="onClick"
            style="
              font-size: 15px;
              color: rgb(0, 0, 0);
              position: absolute;
              right: 15px;
              font-weight: bold;
            "
          >
            X
          </span>
          <div style="width: calc(100% - 25px)">
            <div
              class="color"
              :style="{ background: data.color }"
              style="display: inline-block"
            ></div>
            <span style="font-size: 13px; color: rgb(20, 32, 44)">
              {{ data.name }} : {{ roundedValue }}
            </span>
          </div>
        </div>
        <LineChart
          class="mx-2"
          :data="{
            labels: labels,
            datasets: [
              {
                label: '',
                data: values,
                borderColor: '#00A2FF',
                backgroundColor: data.color,
                fill: false,
              },
            ],
          }"
          :options="{
            pointStyle: false,
            spanGaps: true,
            tension: 0.3,
            plugins: {
              title: {
                display: false,
              },
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                ticks: {
                  callback: function (_, i, x) {
                    if (i % Math.round(labels.length / 4)) return '';
                    return toDate(labels[i]);
                  },
                },
              },
            },
            interaction: {
              mode: 'nearest',
              axis: 'xy',
              intersect: false,
              callbacks: {
                title: (context) => {
                  return this.toTooltipDate(context[0].raw.x);
                },
                label: (tooltipItem) => {
                  return `${tooltipItem.parsed.y.toFixed(2)} ${data.unit}`;
                },
              },
            },
          }"
        />
      </div>
    </ul>
  </div>
</template>

<script>
import { store } from "../../services/store";
import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import { Line as LineChart } from "vue-chartjs";
import { getLabels, getValues } from "../../services/calcul/computeChart";
import { ITemporality } from "../../interfaces/IConfig";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr", {
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthsShort: [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ],
  weekdays: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  weekdaysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  weekdaysMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
});

export default {
  name: "ChartSpriteComponent",
  components: {
    LineChart,
  },
  props: {
    data: {},
  },
  data: () => ({
    dynamicStyle: {
      border: "3px solid #F9F9F9",
      boxShadow: "none",
    },
  }),
  computed: {
    roundedValue() {
      return `${this.data.displayValue.toFixed(2)} ${this.data.unit}`;
    },
    labels() {
      return getLabels(
        store.state.appDataStore.temporalitySelected,
        this.data.navIndex
      );
    },
    values() {
      const result = [];
      const vals = getValues(this.data.series);
      const valTimestamps = Object.keys(vals).map((key) => parseInt(key));
      // Build the chart data using the labels and the closest past timestamp in vals
      const data = this.labels.map((lab) => {
        // Find the closest past timestamp to the current label
        const closestTimestamp = this.findClosestPastTimestamp(lab, valTimestamps);

        // If a valid closest past timestamp was found, use its value; otherwise, use NaN
        const yValue = closestTimestamp !== null ? vals[closestTimestamp] : 'NaN';
        
        return { x: lab, y: yValue };
      }); 

      //result.push(data)
      return data;
      // return this.labels.map((label) => ({
      //   x: label,
      //   y: vals[label] ?? undefined,
      // }));
    },
  },
  methods: {
    findClosestPastTimestamp(label, timestamps) {
    // Filter the timestamps to only include those less than or equal to the label
    const pastTimestamps = timestamps.filter((timestamp) => timestamp <= label);
      
      // If there are no past timestamps, return null
      if (pastTimestamps.length === 0) return null;
      
      // Return the largest timestamp (the closest in the past)
      return pastTimestamps.reduce((prev, curr) => (curr > prev ? curr : prev));
  },
    onClick() {
      store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);
    },
    _isSelected() {},
    _isNotSelected() {},
    toDate(date) {
      switch (store.state.appDataStore.temporalitySelected.name) {
        case ITemporality.hour:
          return moment(date).format("HH:mm");
        case ITemporality.day:
          return moment(date).format("HH[h]");
        case ITemporality.week:
          return moment(date).format("dd");
        case ITemporality.month:
          return moment(date).format("D/M/YY");
        case ITemporality.year:
          return moment(date).format("MMM");
        case ITemporality.custom:
          const { begin, end } =
            store.state.appDataStore.temporalitySelected.range;
          const duration = moment.duration(
            moment(end, "DD-MM-YYYY HH:mm:ss").diff(
              moment(begin, "DD-MM-YYYY HH:mm:ss")
            )
          );
          console.log(moment(end, "DD-MM-YYYY HH:mm:ss"), duration);
          if (duration.asMonths() > 2) return moment(date).format("MMM");
          if (duration.asDays() > 1) return moment(date).format("D/M/YY");
          if (duration.asHours() > 1) return moment(date).format("HH[h]");
          return moment(date).format("HH:mm");
        default:
          return moment(date).format("D/M/YY");
      }
    },
    toTooltipDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
  },
  mounted() {},
};
</script>

<style scoped>
.color {
  width: 7px;
  height: 12px;
  margin-right: 4px;
  border-radius: 3px;
}

.card-menu {
  top: 50%;
  border-radius: 0px 12px 12px 12px !important;
  position: absolute;
  background-color: white;
  width: 310px;
  height: 200px;
  -webkit-animation: scale-in-tl 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: scale-in-tl 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  z-index: 99999 !important;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  color: "#14202C";
  font-size: 10px;
}

@-webkit-keyframes scale-in-tl {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

@keyframes scale-in-tl {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

.cards {
  padding-left: 0 !important;
}

.card {
  position: relative;
  display: block;
  height: 100%;
  border-radius: calc(var(--curve) * 1px);
  overflow: hidden;
  text-decoration: none;
}

.card__image {
  width: 100%;
  height: auto;
}

.card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  border-radius: calc(var(--curve) * 1px);
  background-color: var(--surface-color);
  transform: translateY(100%);
  transition: 0.2s ease-in-out;
}

.card__header:hover {
  background-color: rgb(230, 230, 230);
}

.card__arc {
  width: 80px;
  height: 80px;
  position: absolute;
  bottom: 100%;
  right: 0;
  z-index: 1;
}

.card__arc path {
  fill: var(--surface-color);
  d: path("M 40 80 c 22 0 40 -22 40 -40 v 40 Z");
}

.card__thumb {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.card__title {
  font-size: 1.5em;
  margin: 0 0 0.3em;
  color: #000000;
}

.card__tagline {
  display: block;
  margin: 1em 0;
  font-family: "MockFlowFont";
  font-size: 0.8em;
  color: #d7bdca;
}

.card__status {
  font-size: 0.9em;
  color: #616161;
}

.card__description {
  padding: 0 2em 2em;
  margin: 0;
  color: #000000;
  font-family: "MockFlowFont";
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  /*/ background-color: rgb(138, 29, 29);*/
  border-bottom-left-radius: 15px;
  font-size: 11px;
  /*background-color: rgb(244, 244, 244);*/
}
/* 
.sprite_container:hover {
  cursor: pointer;
} */
</style>
