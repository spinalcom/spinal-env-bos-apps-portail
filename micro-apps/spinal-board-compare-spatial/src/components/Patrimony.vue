<template>
  <div class="RC" style="min-height: 480px">
    <div class="MC" v-if="loaded">
      <LineCard :title="config_change.title" :titleDetails="currentTimestamp.stringTime" :hidden="hiddenelement"
        :labels="barLabels" :tooltipdate="tooltipinfo" :datasets="barChartData" :optional="lineOptions"
        :next="temporality.next" :prev="temporality.prev" @nav="nav" @stack="stack" :stacked="stackState"
        @update:hidden="hiddenelement = $event" class="BR" :control_value="config_change"
        @change_endpoint="changeConfig" />
      <div class="d-flex cards">
        <sc-stat-card :value="stats.totalArea" :unit="'m²'" :title="`Superficie totale (${stats.buildings} Étages)`"
          class="flex-grow-1 pa-4" />
        <sc-stat-card :value="stats.totalConsumption" :unit="config_change.unit"
          :title="config_change.labelIndicators + ' par le bâtiment'" class="flex-grow-1 pa-4" />
        <sc-stat-card :value="stats.totalConsumptionSquareMeter" :unit="config_change.unit"
          :title="config_change.labelIndicators + ' au m²'" class="flex-grow-1 pa-4" />
      </div>
      <SpinalTable :label="config_change.label"
        :reference="config_change.source.building.name != config_change.source.floors.name ? '' : reference"
        :unit="config_change.unit" :context="patrimonyTable" :temporality="temporality" />
    </div>
    <div class="MC" v-else>
      <LoadingCard class="flex-grow-1 pa-4 br" style="width: 100%;" />
      <div class="d-flex cards">
        <LoadingCard class="flex-grow-1 pa-4" style="height: 106px" />
        <LoadingCard class="flex-grow-1 pa-4" style="height: 106px" />
        <LoadingCard class="flex-grow-1 pa-4" style="height: 106px" />
      </div>
      <LoadingCard class="pa-4" :style="{ height: tableCard + 'px' }" style="width: 100%;" />
    </div>
  </div>
</template>

<script>
import SpinalTable from "./nested/SpinalTable.vue";
import { getData } from "../services/index.js";
import { getDataBuilding } from "../services/index.js";
import LineCard from "./nested/LineCard.vue";
import StatCard from "./nested/StatsCard.vue";
import LoadingCard from "spinal-components/src/components/LoadingCard.vue";
import moment from 'moment';
// import config from "../config.js"
export default {
  name: 'PatrimonyWaterDashboard',
  props: ['temporality'],
  components: {
    SpinalTable,
    LineCard,
    "sc-stat-card": StatCard,
    LoadingCard
  },
  data: () => ({
    tooltipinfo: [],
    hiddenelement: [],
    // config: config,
    stackState: true,
    stats: {},
    colors: ['#ff6384', '#36a2eb', '#4bc0c0'],
    patrimonyTable: [],
    period: 'Mois',
    loaded: false,
    buildingList: null,
    barLabels: [],
    barChartData: [],
    lineOptions: { unit: '', footer: 'Consommation totale du bâtiment' },
    buildingsInTheList: 0,
    currentTimestamp: { stringTime: '', valueTime: 0 },
    id_batiment: '',
    reference: [],
    config_change: {},
  }),

  async mounted() {
    this.config_change = this.$store.state.appDataStore.config_endpoint;
    this.lineOptions.unit = this.config_change.unit;

    moment.locale("fr");
    if (this.temporality.name == 'Mois') {
      this.currentTimestamp = { stringTime: 'EN ' + moment().format('MMMM YYYY'), valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
    }
    else if (this.temporality.name == 'Année') {
      this.currentTimestamp = { stringTime: 'EN ' + moment().format('YYYY'), valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
    }
    else if (this.temporality.name == 'Décennie') {
      this.currentTimestamp = { stringTime: 'EN ' + moment().format('YYYY'), valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
    }
    else if (this.temporality.name == '3 mois') {
      this.currentTimestamp = {
        stringTime: `EN 
          ${moment(this.currentTimestamp.valueTime).add(payload * 3, 'months').format('MMMM')}, 
          ${moment(this.currentTimestamp.valueTime).add(payload * 2, 'months').format('MMMM')}, 
          ${moment(this.currentTimestamp.valueTime).add(payload, 'months').format('MMMM')}`,
        valueTime: moment(this.currentTimestamp.valueTime).add(payload * 3, 'months').valueOf()
      };
    }
    else this.currentTimestamp = { stringTime: '', valueTime: 0 };
    const patrimoine = localStorage.getItem("patrimoine");
    this.id_batiment = localStorage.getItem("idBuilding");



    let patrimoineObject = JSON.parse(patrimoine);
    this.buildingsInTheList = patrimoineObject.buildings;
    this.loaded = true;
  },
  computed: {
    config() {
      return this.$store.state.appDataStore.appConfig;
    },
    currentPeriod() {
      moment.locale("fr");
      if (this.temporality.name == 'Mois') {
        this.currentTimestamp = { stringTime: 'EN ' + moment().format('MMMM YYYY'), valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
      }
      else if (this.temporality.name == 'Année') {
        this.currentTimestamp = { stringTime: 'EN ' + moment().format('YYYY'), valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
      }
      else if (this.temporality.name == 'Décennie') {
        this.currentTimestamp = { stringTime: 'EN ' + moment().format('YYYY'), valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
      }
      else if (this.temporality.name == '3 mois') {
        this.currentTimestamp = {
          stringTime: `EN 
          ${moment(this.currentTimestamp.valueTime).add(payload * 3, 'months').format('MMMM')}, 
          ${moment(this.currentTimestamp.valueTime).add(payload * 2, 'months').format('MMMM')}, 
          ${moment(this.currentTimestamp.valueTime).add(payload, 'months').format('MMMM')}`,
          valueTime: moment(this.currentTimestamp.valueTime).add(payload * 3, 'months').valueOf()
        };
      }
      else return { stringTime: '', valueTime: 0 };
      return this.currentTimestamp;
    },
    tableCard() {
      let fiveCheck = (this.buildingsInTheList && this.buildingsInTheList.length >= 5) ? 5 : this.buildingsInTheList;
      return 104 + fiveCheck * 48;
    }
  },
  methods: {
    nav(payload) {
      if (this.temporality.name == 'Mois') {
        this.currentTimestamp = { stringTime: 'EN ' + moment(this.currentTimestamp.valueTime).add(payload, 'months').format('MMMM YYYY'), valueTime: moment(this.currentTimestamp.valueTime).add(payload, 'months').valueOf() };
      }
      if (this.temporality.name == 'Année') {
        this.currentTimestamp = { stringTime: 'EN ' + moment(this.currentTimestamp.valueTime).add(payload, 'years').format('YYYY'), valueTime: moment(this.currentTimestamp.valueTime).add(payload, 'years').valueOf() };
      }
      if (this.temporality.name == '3 mois') {
        if (payload < 0) {
          this.currentTimestamp = {
            stringTime: `EN 
            ${moment(this.currentTimestamp.valueTime).add(-5, 'months').format('MMMM')}, 
            ${moment(this.currentTimestamp.valueTime).add(-4, 'months').format('MMMM')}, 
            ${moment(this.currentTimestamp.valueTime).add(-3, 'months').format('MMMM')}`,
            valueTime: moment(this.currentTimestamp.valueTime).add(-3, 'months').valueOf()
          };
        }
        else {
          this.currentTimestamp = {
            stringTime: `EN 
            ${moment(this.currentTimestamp.valueTime).add(1, 'months').format('MMMM')}, 
            ${moment(this.currentTimestamp.valueTime).add(2, 'months').format('MMMM')}, 
            ${moment(this.currentTimestamp.valueTime).add(3, 'months').format('MMMM')}`,
            valueTime: moment(this.currentTimestamp.valueTime).add(3, 'months').valueOf()
          };
        }
      }
    },
    stack(payload) {
      this.stackState = payload;
    },
    async onRequest() {
      let res;
      this.loaded = false;
      res = await getData(this.currentTimestamp.valueTime, this.temporality.name, this.config_change.source.floors.profileName, this.config_change.source.floors.name, this.config_change.source.building.name, this.id_batiment, this.config_change.color);
      this.barLabels = res[0];
      this.stats = res[2];
      this.tooltipinfo = res[3];
      this.patrimonyTable = res[1];
      this.barChartData = [];
      for (let i = 0; i < res[1].length; i++) {
        const bat = res[1].find(el => el.staticId === this.id_batiment);
        this.barChartData.push(
          {
            label: res[1][i].name,

            backgroundColor: res[1][i].name === bat.name ? '#14202C' : res[1][i].color,
            data: res[1][i].timeSeries,
            borderColor: res[1][i].name === bat.name ? '#14202C' : res[1][i].color,
            pointRadius: 0,
            // data: this.shuffleArray(res[1][i].timeSeries),
            // fill: true
          }
        )
      }
      this.loaded = true;
    },
    async onRequestBatiement() {
      let res;
      this.loaded = false;
      res = await getDataBuilding(this.currentTimestamp.valueTime, this.temporality.name, this.buildingsInTheList, this.config_change.source.building.profileName, this.config_change.source.building.name, this.id_batiment, this.config_change.color);
      this.barLabels = res[0];
      this.stats = res[2];
      this.patrimonyTable = res[1];
      this.tooltipinfo = res[3];
      this.barChartData = [];
      for (let i = 0; i < res[1].length; i++) {
        this.barChartData.push(
          {
            label: res[1][i].name,
            backgroundColor: "#14202C",
            data: res[1][i].timeSeries,
            borderColor: "#14202C",
            pointRadius: 0,
          }
        )
      }
      this.loaded = true;
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    changeConfig(value) {
      this.config_change = value;
    }
  },
  watch: {
    currentTimestamp(value) {
      this.onRequestBatiement();
      this.onRequest();

    },
    config_change(value) {
      this.onRequestBatiement();
      this.onRequest();
    },

    temporality(value) {
      if (this.temporality.name == 'Mois') {
        this.currentTimestamp = { stringTime: 'EN ' + moment().format('MMMM YYYY'), valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
      }
      else if (this.temporality.name == 'Année') {
        this.currentTimestamp = { stringTime: 'EN ' + moment().format('YYYY'), valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
      }
      else if (this.temporality.name == 'Décennie') {
        this.currentTimestamp = { stringTime: `ENTRE ${moment().add(-9, 'years').format('YYYY')} et ${moment().format('YYYY')}`, valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
      }
      else if (this.temporality.name == '3 mois') {
        this.currentTimestamp = {
          stringTime: `EN 
          ${moment().add(-2, 'months').format('MMMM')}, 
          ${moment().add(-1, 'months').format('MMMM')}, 
          ${moment().add(0, 'months').format('MMMM')}`,
          valueTime: moment().valueOf()
        };
      }
      else this.currentTimestamp = { stringTime: '', valueTime: moment().valueOf() };
    }
  }
}
</script>

<style scoped>
/* root container */

.RC {
  font-family: Charlevoix;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 80px 10px 10px;
  gap: 10px;
  height: 100vh;
  width: 100%;
  background: linear-gradient(111.34deg, #F8FAFA 0%, #D6E2E6 100%);
}

/* main container */
.MC {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  /* background: #F9F9F9; */
  /* border: 1px solid #F7F7F7; */
  /* box-shadow: 0px 3px 10px rgba(73, 84, 92, 0.16); */
  border-radius: 10px;
  width: 100%;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  overflow-y: hidden;
}

.BR {
  /* height: 100%; */
  flex-grow: 1;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

.cards {
  gap: 10px;
  width: 100%;
}

.v-application .ma-2 {
  margin: 0 !important;
}

.v-application .elevation-5 {
  box-shadow: 0px 3px 10px #49545C29 !important;
}

::v-deep .card-title {
  height: 0 !important;
}
</style>
