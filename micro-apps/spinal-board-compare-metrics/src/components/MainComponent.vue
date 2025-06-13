<template>
  <div class="RC" style="min-height: 480px">
    <div class="MC">
      <BarChart v-if="chart.label && chart.data" :title="title" :subtitle="subtitle" :labels="chart.label"
        :datasets="chart.data" :prev_next="true" @nav="nav" :stacked="true" :isYear="temporality.name === 'Année'"
        :calendar="calendar" :next="temporality.next" :prev="temporality.prev" :optional="barOptions" :noData="noData"
        style="max-height: 530px;" class="BR">
        <template v-slot:extras>
          <v-select v-model="selectedControlEndpoint" append-icon="mdi-chevron-down" :items="controlEndpointList"
            outlined menu-props="{ bottom: true }" color="#E3E7E8" item-color="#E3E7E8" dense
            style="min-width: 200px; width: 340px; flex-grow: 0; font-size: 14px !important;" class="ml-8" label="">
            <template #label="{ attrs }"> <label :for="attrs.id" style="font-size: 14px;">Select an
                item</label></template>

            <template #item="{ item }">
              <SmallLegend :color="item.color" :text="item.name" :size="14" />
            </template>

            <template #selection="{ item }">
              <SmallLegend :color="item.color" :text="item.name" :size="14" />
            </template>
          </v-select>
        </template>

      </BarChart>
      <div class="d-flex cards">
        <!-- <StatCard v-for="(card, index) in controlEndpoints" :key="index" 
            :value="index" 
            :unit="unit" 
            :title="'selectedTempoTicketsText'" 
            class="flex-grow-1 pa-4" 
            style="width: 100% !important"
            /> -->
        <StackCard v-if="totalCard.length !== 0 && cards.includes('total')" :title="totalTitle"
          :subtitle="totalSubtitle" :data="totalCard" class="flex-grow-1 pa-4"
          style="width: 100% !important; height: fit-content;" />
        <LoadingCard :noData="noData" class="flex-grow-1 pa-4" style="width: 100% !important; min-height: 105px;"
          v-else-if="cards.includes('total') || noData" />
        <StackCard v-if="averageCard.length !== 0 && cards.includes('average')" :title="averageTitle"
          :subtitle="averageSubtitle" :data="averageCard" class="flex-grow-1 pa-4"
          style="width: 100% !important; height: fit-content;" />
        <LoadingCard :noData="noData" class="flex-grow-1 pa-4" style="width: 100% !important; min-height: 105px;"
          v-else-if="cards.includes('average') || noData" />
        <StackCard v-if="todaysCard.length !== 0 && cards.includes('today')" :title="todaysTitle"
          :subtitle="todaysSubtitle" :data="todaysCard" class="flex-grow-1 pa-4"
          style="width: 100% !important; height: fit-content;" />
        <LoadingCard :noData="noData" class="flex-grow-1 pa-4"
          style="width: 100% !important; min-height: 105px !important;" v-else-if="cards.includes('today') || noData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue, Watch } from 'vue-property-decorator';
// import env from '../../config';
import BarChart from './BarCard.vue';
import StatCard from './StatsCard.vue';
import StackCard from './StackCard.vue';
import SmallLegend from "./SmallLegend.vue";
import LoadingCard from './LoadingCard.vue';
import { ISpaceSelectorItem } from './SpaceSelector/index';
import { TemporalityModel } from '../models/Temporality.model';
import { LegendModel } from '../models/Legend.model';
import { CalendarModel } from '../models/Calendar.model';
import { getData, getTodaysData } from '../services/index.js';
import moment from 'moment';
import { computed } from 'vue';

@Component({
  components: {
    BarChart,
    StatCard,
    StackCard,
    LoadingCard,
    SmallLegend
  },
})
class App extends Vue {

  // title = env.title;
  // subtitle = env.subtitle;
  // unit = env.unit;
  // controlEndpoints = env.controlEndpoints;
  // cards = env.cards;
  // totalTitle = env.totalCardTitle;
  // totalSubtitle = env.totalCardSubtitle;
  // averageTitle = env.averageCardTitle;
  // averageSubtitle = env.averageCardSubtitle;
  // todaysTitle = env.todaysCardTitle;
  // todaysSubtitle = env.todaysCardSubtitle;
  chart = {
    label: [],
    data: []
  }
  currentTimestamp = { valueTime: 0 };
  todaysCard = [];
  averageCard = [];
  totalCard = [];
  calendarList: CalendarModel[] = [];
  calendar: CalendarModel = { n: '', y: '', d: [] };
  barOptions = { unit: this.unit, footer: 'Consommation totale du patrimoine' };

  selectedControlEndpoint: LegendModel = { name: this.controlEndpoints[0].name, color: this.controlEndpoints[0].color };
  controlEndpointList: LegendModel[] = [];
  noData = false;

  @Prop({ type: Object as () => ISpaceSelectorItem, required: true })
  space: ISpaceSelectorItem;

  @Prop({ type: Object as () => TemporalityModel, required: true })
  temporality: TemporalityModel;

  public get config() {
    return this.$store.state.appDataStore.appConfig;
  }

  get title() {
    return this.config.title;
  }
  get subtitle() {
    return this.config.subtitle;
  }
  get unit() {
    return this.config.unit;
  }
  get controlEndpoints() {
    return this.config.controlEndpoints;
  }
  get cards() {
    return this.config.cards;
  }
  get totalTitle() {
    return this.config.totalCardTitle;
  }
  get totalSubtitle() {
    return this.config.totalCardSubtitle;
  }
  get averageTitle() {
    return this.config.averageCardTitle;
  }
  get averageSubtitle() {
    return this.config.averageCardSubtitle;
  }
  get todaysTitle() {
    return this.config.todaysCardTitle;
  }
  get todaysSubtitle() {
    return this.config.todaysCardSubtitle;
  }



  interval() {
    this.currentTimestamp = { valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
    this.spreadData();
  }

  async spreadData() {
    this.averageCard = [];
    this.totalCard = [];
    let res = await getData(this.space, this.temporality.name, this.currentTimestamp.valueTime, this.controlEndpoints);
    if (!res) {
      this.noData = true;
      return;
    }
    this.noData = false;
    this.chart.label = res[0];
    this.chart.data = res[1];
    this.averageCard = res[2];
    this.totalCard = res[3];
    this.calendarList = res[4];
    this.calendar = this.calendarList.find((e: CalendarModel) => e.n == this.selectedControlEndpoint.name)!;
  }

  async mounted() {

    console.log('salut');
    
    for (const controlEndpoint of this.controlEndpoints) {
      this.controlEndpointList.push({ name: controlEndpoint.name, color: controlEndpoint.color });
    }
    this.interval();
    this.todaysCard = await getTodaysData(this.space, this.controlEndpoints);

  }


  get stack() {
    let u = this.controlEndpoints[0].stackGroup;
    let stack = false;
    for (let i = 1; i < this.controlEndpoints.length; i++) {
      if (u !== this.controlEndpoints[i].stackGroup) {
        stack = true;
      }
    }
    return stack;
  }

  @Watch('space')
  async spaceChange() {
    this.todaysCard = [];
    this.spreadData();
    this.todaysCard = await getTodaysData(this.space, this.controlEndpoints);
  }

  @Watch('temporality')
  async temporalityChange() {
    this.interval();
  }

  @Watch('selectedControlEndpoint')
  async selectedControlEndpointChange() {
    this.calendar = this.calendarList.find((e: CalendarModel) => e.n == this.selectedControlEndpoint.name)!;
  }

  async nav(payload: number): Promise<void> {
    if (this.temporality.name == 'Semaine') {
      this.currentTimestamp = { valueTime: moment(this.currentTimestamp.valueTime).add(payload, 'weeks').valueOf() };
    }
    if (this.temporality.name == 'Mois') {
      this.currentTimestamp = { valueTime: moment(this.currentTimestamp.valueTime).add(payload, 'months').valueOf() };
    }
    if (this.temporality.name == 'Année') {
      this.currentTimestamp = { valueTime: moment(this.currentTimestamp.valueTime).add(payload, 'years').valueOf() };
    }
    this.spreadData();
  }
}
export default App;
</script>

<style scoped>
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
  overflow-y: auto;
}

.BR {
  /* height: 100%; */
  flex-grow: 1;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
  min-height: 300px;
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

::v-deep .v-label {
  font-size: 14px !important;
  letter-spacing: 1.1px !important;
  color: #000000DE !important;
}

::v-deep .v-list-item__title {
  font-size: 14px !important;
  letter-spacing: 1.1px !important;
  color: #000000DE !important;
}

::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)>.v-input__control>.v-input__slot fieldset {
  color: #E3E7E8 !important;
}

::v-deep .theme--light.v-icon {
  color: #E3E7E8 !important;
}

::v-deep .v-menu__content {
  top: 188px !important;
}

::v-deep .v-list-item--link:before {
  background: #fff !important;
}
</style>