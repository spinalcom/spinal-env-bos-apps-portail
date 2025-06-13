<template>
  <div class="sprite_container_insight" ref="container" @click.stop="onClick">
    <div
      class="sprite_color_insight"
      :style="{ background: data.color, ...dynamicStyle, zIndex: 1 }"
    ></div>
    <div
      v-if="roundedValue"
      class="sprite_value_unit_insight"
      :style="{ ...dynamicStyle, zIndex: 0 }"
    >
      {{ roundedValue }}
    </div>
    <CurrentCard v-if="showCardcurrentValue" :data="currentData" :on3D="false" @removeCard="closeCard" />
    
    <div class="card-menu" v-if="displayChart">
      <Loader  v-if="showLoader" />
      <div v-if="switchChart == 'current'" style="display: flex; flex-direction: column; padding-right: 5px;" class="mt-4 ml-4">
          <span @click.stop="onClose" style="font-size: 15px; color: rgb(0, 0, 0); position: absolute; right: 15px; font-weight: bold;">X</span>
          <div style="width: calc(100% - 25px)">
            <div class="color" :style="{ background: data.color }" style="display: inline-block"></div>
            <span style="font-size: 13px; color: rgb(20, 32, 44)">{{ data.name }} : {{ roundedValue }}</span>
          </div>
        </div>
        <!-- Other endpoint -->
        <div v-if="switchChart == 'other'" style="display: flex; flex-direction: column; padding-right: 5px;" class="mt-4 ml-4">
          <span
              @click.stop="onClose"
              style="
                font-size: 15px;
                color: rgb(0, 0, 0);
                position: absolute;
                right: 15px;
                font-weight: bold;
              "
            >
              X
            </span>          <div style="width: calc(100% - 25px)">
            <div class="color" :style="{ background: data.color }" style="display: inline-block"></div>
            <span style="font-size: 13px; color: rgb(20, 32, 44)">{{ data.name }} : {{ roundedValue }}</span>
          </div>
        </div>
        <!-- End other endpoint -->
    <div style="width: 310px; height: 50px; background-color: white; border-top-left-radius: 5px; border-top-left-radius: 5px; border-bottom: 1px solid #14202C; overflow: hidden; overflow-x: auto;">
      <ul style="width: max-content; height: 100%; display: flex; justify-content: start; align-items: center; list-style: none; padding: 5px; gap: 2px;">
        <li v-for="(item, idx) in endpoint" :key="idx" class="endpoint-item" :class="{ 'active': endpointName_selected == item.name }" @click.stop="changeChart(item)">
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
      <ul class="cards">
        <div style="z-index: 2" class="card">
          
          <LineChart
          v-if="switchChart === 'current'"
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
              tension: 0.1,
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
           
        <LineChart
        v-if="switchChart === 'other'"
          class="mx-2"
          :data="{
            labels: labels,
            datasets: [
              {
                label: '',
                data: otherValues,
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
                  return `${tooltipItem.parsed.y.toFixed(2)} ${unit}`;
                },
              },
            },
          }"
        />
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
} from "spinal-viewer-event-manager";
import { store } from "../../services/store";
import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import { Line as LineChart } from "vue-chartjs";
import { getLabels, getValues } from "../../services/calcul/computeChart";
import { ITemporality } from "../../interfaces/IConfig";
import moment from "moment";
import "moment/locale/fr";
import CurrentCard from "./CurrentCard.vue";
import { getControlEndpointList, getTimeSeriesAsync } from '../../services/spinalAPI/endpoints/getEndpoints';
import Loader from './loader.vue'
import CurrentCard from "./CurrentCard.vue";

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
  name: "SpriteComponent",
  components: {
    LineChart,
    Loader,
    CurrentCard
  },
  props: {
    data: {},
  },
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    showCardcurrentValue: false,
    currentData:  {},
    dynamicStyle: {
      border: "3px solid #F9F9F9",
      boxShadow: "none",
    },
    isClicked: false,
    endpoint: [],
    endpointName_selected: "",
    t_index: store.state.appDataStore.t_index,
    unit: "",
    time: null,
    otherValues: [],
    switchChart: 'current',
    showLoader: true,
  }),
  computed: {
    roundedValue() {
      const value = Number(this.data.displayValue);
      return value || value === 0
        ? `${Number(value.toFixed(2))} ${this.data.unit}`
        : "";
    },
    displayChart() {
      //console.log('---> item selected', store.state.appDataStore.itemSelected)
      return (
        this.isClicked &&
        store.state.appDataStore.temporalitySelected.name !==
          ITemporality.currentValue && 
          !store.state.appDataStore.itemSelected.children
      );
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
      this.showLoader = false;
      return data;
      // return this.labels.map((label) => ({
      //   x: label,
      //   y: vals[label] ?? undefined,
      // }));
    },
  },
  async mounted()  {
    console.log('this.data', this.data)
    await this.loadEndpoint();

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
    async onClick() {
      if(store.state.appDataStore.temporalitySelected.name === "Valeur courante"){
        this.showCardcurrentValue = true;
      }
      const idBuilding = localStorage.getItem("idBuilding");
      this.endpointName_selected = this.data.endpoint.name;
      this.unit = this.data.unit;
      this.currentData = this.data;

      const endpoint = store.state.appDataStore.appConfig.source
      const endpointList = await getControlEndpointList(idBuilding, this.data.dynamicId);
      let controlPoints = [];
      endpoint.forEach((item) => {
        endpointList.forEach((el) => {
          if (item.profileName === el.profileName) {
            controlPoints.push(el);
          }
        });
      });
      let uniqueEndpoints = new Map();
      endpoint.forEach((item) => {
        controlPoints.forEach((el) => {
          el.endpoints.forEach((end) => {
            if (item.name === end.name) {
              uniqueEndpoints.set(item.name, { name: item.name, dynamicId: end.dynamicId, unit: end.unit });
            }
          });
        });
      });
      this.endpoint = Array.from(uniqueEndpoints.values());
      const emitterHandler = EmitterViewerHandler.getInstance();
      emitterHandler.emit(VIEWER_SPRITE_CLICK, { node: this.data });
      store.dispatch(ActionTypes.SELECT_SPRITES, [this.data.dynamicId]);
      store.dispatch(ActionTypes.SELECT_ITEMS, this.data);
      const el = document.querySelector(".dataContainer");
      el.dispatchEvent(
        new CustomEvent("onSpriteClick", { detail: { ...this.data } })
      );
    },
    onClose() {
      this._isNotSelected();
    },
    _isSelected() {
      
      if(store.state.appDataStore.temporalitySelected.name === "Valeur courante"){
        const item = store.state.appDataStore.itemSelected;
        if(!item.children) {
          
          this.showCardcurrentValue = true;
          this.currentData = this.data;
        }
        else {
          this.showCardcurrentValue = false;
          this.currentData = {};
        }

     
      }
      this.dynamicStyle = {
        border: "3px solid #00A2FF",
        boxShadow: "0px 0px 10px 2px #00A2FF",
      };
      const enfant = this.$refs.container;
      if (enfant && enfant.parentElement) {
        enfant.parentElement.style.zIndex = "2";
      }
      this.isClicked = true;
    },
    closeCard() {
      this.showCardcurrentValue = false;

    },
    _isNotSelected() {
      if(store.state.appDataStore.temporalitySelected.name === "Valeur courante"){
        this.showCardcurrentValue = false;
      }

      this.dynamicStyle = {
        border: "3px solid #F9F9F9",
        boxShadow: "none",
      };
      const enfant = this.$refs.container;
      if (enfant && enfant.parentElement) {
        enfant.parentElement.style.zIndex = "1";
      }
      this.isClicked = false;
    },
    // Load chart data
    async loadEndpoint() {
      // this.endpointName_selected = this.data.endpoint.name;
      // const idBuilding = localStorage.getItem("idBuilding");
      // const endpointList = await getControlEndpointList(idBuilding, this.data.dynamicId);
      // let controlPoints = [];
      // endpoint.forEach((item) => {
      //   endpointList.forEach((el) => {
      //     if (item.profileName === el.profileName) {
      //       controlPoints.push(el);
      //     }
      //   });
      // });
      // let uniqueEndpoints = new Map();
      // endpoint.forEach((item) => {
      //   controlPoints.forEach((el) => {
      //     el.endpoints.forEach((end) => {
      //       if (item.name === end.name) {
      //         uniqueEndpoints.set(item.name, { name: item.name, dynamicId: end.dynamicId });
      //       }
      //     });
      //   });
      // });
      // this.endpoint = Array.from(uniqueEndpoints.values());
    },
    async changeChart(item) {
      this.showLoader = true;
      this.unit = item.unit;
      this.endpointName_selected = item.name;
      const dynamicId = item.dynamicId;
      this.t_index = store.state.appDataStore.t_index;
      this.updateDataOnTimeChanged();
      const {begin, end} = this.time;
      const buildingId = localStorage.getItem("idBuilding");
      const series = await getTimeSeriesAsync(buildingId ,dynamicId, begin, end);
      const values = getValues(series);
      const valuesTimestamps = Object.keys(values).map((key) => parseInt(key));
      const data = this.labels.map((lab) => {
        // Find the closest past timestamp to the current label
        const closestTimestamp = this.findClosestPastTimestamp(lab, valuesTimestamps);

        // If a valid closest past timestamp was found, use its value; otherwise, use NaN
        const yValue = closestTimestamp !== null ? values[closestTimestamp] : 'NaN';
        return { x: lab, y: yValue };
      });
      this.otherValues = data;
      this.showLoader = false;
      if(item.name === this.data.endpoint.name) {
        this.switchChart = 'current';
      } else {
        this.switchChart = 'other';
      }
       
    },
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
          // console.log(moment(end, "DD-MM-YYYY HH:mm:ss"), duration);
          if (duration.asMonths() > 2) return moment(date).format("MMM");
          if (duration.asDays() > 1) return moment(date).format("D/M/YY");
          if (duration.asHours() > 1) return moment(date).format("HH[h]");
          return moment(date).format("HH:mm");
        default:
          return moment(date).format("D/M/YY");
      }
    },
    // Update the chart data when the time range changes
    async updateDataOnTimeChanged() {
    const end = moment().minutes(59).seconds(59);
    switch (store.state.appDataStore.temporalitySelected.name) {
      case ITemporality.currentValue:
        this.time = null;
        break;
      case ITemporality.hour:
        end.add(this.t_index, 'hours');
        this.time = {
          begin: moment(end).startOf('hour').format('DD-MM-YYYY HH:mm:ss'),
          end: end.format('DD-MM-YYYY HH:mm:ss'),
        };
        break;
      case ITemporality.day:
        end.endOf('day').add(this.t_index, 'days');
        this.time = {
          begin: moment(end).startOf('day').format('DD-MM-YYYY HH:mm:ss'),
          end: end.format('DD-MM-YYYY HH:mm:ss'),
        };
        break;
      case ITemporality.week:
        end.endOf('week').add(this.t_index, 'weeks');
        this.time = {
          begin: moment(end).startOf('week').format('DD-MM-YYYY HH:mm:ss'),
          end: end.format('DD-MM-YYYY HH:mm:ss'),
        };
        break;
      case ITemporality.month:
        end.endOf('month').add(this.t_index, 'months');
        this.time = {
          begin: moment(end).startOf('month').format('DD-MM-YYYY HH:mm:ss'),
          end: end.format('DD-MM-YYYY HH:mm:ss'),
        };
        break;
      case ITemporality.year:
        end.endOf('year').add(this.t_index, 'years');
        this.time = {
          begin: moment(end).startOf('year').format('DD-MM-YYYY HH:mm:ss'),
          end: end.format('DD-MM-YYYY HH:mm:ss'),
        };
        break;
      case ITemporality.custom:
        this.time = this.selectedTime.range;
        break;
      default:
        this.time = null;
        break;
    }
  },

    toTooltipDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
  },

  watch: {
    showCardcurrentValue: function (val) {
      this.showCardcurrentValue = val;  
    },
  }
};
</script>

<style scoped>
.color_insight {
  width: 7px;
  height: 12px;
  margin-right: 4px;
  border-radius: 3px;
}

.sprite_container_insight {
  overflow: hidden;
  background: none;
  box-shadow: none;
  color: transparent;
  display: flex;
  /* flex-direction: row;
  align-items: center; */
  
}
.sprite_color_insight {
  width: 13px;
  height: 13px;
  border-radius: 100%;
  z-index: 2 ;
  transition: 0.2s;
}
.sprite_value_unit_insight {
  border-radius: 100px;
  color: #14202c;
  margin-left: -15px;
  padding-left: 15px;
  padding-right: 2px;
  padding-bottom: 0.5px;
  height: 13px;
  font-size: 12px;
  font-weight: 500;
  background: #f9f9f9;
  z-index: 1;
}

.card-menu {
  left: 13px;
  top: 50%;
  border-radius: 0px 12px 12px 12px !important;
  position: absolute;
  background-color: white;
  width: 310px;
  min-height: 250px;
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

/* Box chart */
.active {
  background-color: slategray;
  color: #ffffff !important;
}
.endpoint-item {
  display: flex;
  width: max-content;
  justify-content: center;
  align-items: center;
  color: #14202C;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
}
.endpoint-item:hover {
  background-color: slategray;
  color: #f9f9f9;
}
.endpoint-item:hover span {
  color: #f9f9f9;
}
.endpoint-item:nth-last-child(1) {
  border-right: none;
}

</style>
