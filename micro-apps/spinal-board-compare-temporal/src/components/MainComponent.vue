<template>
  <div class="RC" style="min-height: 480px">
    <div class="MC">
      <div style="z-index: 1;" v-if="!calendarSwitchState || temporality.name !== 'Décennie'">

        <v-dialog v-model="dialog" width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" :disabled="false" class="plus-button">
              <v-icon style="color: #14202c !important" icon>mdi-cog</v-icon>
            </v-btn>
          </template>

          <v-card style="border-radius: 10px">
            <v-card-title class="text-h5 grey lighten-2">
              Ajouter des temporalités
            </v-card-title>

            <div class="d-flex flex-column pa-3">
              <div class="d-flex g">

                <v-select :items="colors" label="Couleur" outlined color="#14202c" style="width: 160px !important"
                  v-model="selectedColor">
                  <template #item="{ item }">
                    <div class="d-flex align-center">
                      <div class="mr-2" :style="{ backgroundColor: item, width: '16px', height: '16px' }"></div>
                    </div>
                  </template>
                  <template #selection="{ item }">
                    <div :style="{ backgroundColor: item, width: '16px', height: '16px' }"></div>
                  </template>
                </v-select>


                <v-select v-if="temporality.name === 'Journée'" :items="days" label="Jour" outlined color="#14202c"
                  v-model="selectedDay"></v-select>

                <v-select v-if="temporality.name === 'Semaine'" :items="weeks" label="Semaine" outlined color="#14202c"
                  v-model="selectedWeek"></v-select>

                <v-select v-if="temporality.name === 'Mois' || temporality.name === 'Journée'" :items="months"
                  item-text="name" item-value="value" label="Mois" outlined color="#14202c"
                  v-model="selectedMonth"></v-select>

                <v-select v-if="temporality.name === 'Trimestre'" :items="trimester" item-text="name" item-value="value"
                  label="Trimestre" outlined color="#14202c" v-model="selectedTrimester"></v-select>

                <v-select
                  v-if="temporality.name === 'Année' || temporality.name === 'Trimestre' || temporality.name === 'Mois' || temporality.name === 'Semaine' || temporality.name === 'Journée'"
                  :items="years" label="Année" outlined color="#14202c" v-model="selectedYear"></v-select>

                <v-btn @click="addTempo()" color="#14202c"
                  style="width: fit-content; height: 54px; color: white; border-radius: 10px;">
                  Ajouter
                </v-btn>

              </div>
              <v-divider></v-divider>
              <br>

              <div class="d-flex g flex-wrap">
                <v-chip @click="star('root')" :color="defaultFilter.color" filter
                  style="color: white; cursor: pointer;">
                  <div>
                    <v-avatar v-if="defaultFilter.star">
                      <v-icon size="16" color="#ffc069">mdi-star</v-icon>
                    </v-avatar>
                    {{ defaultFilter.name }}
                  </div>
                  <v-avatar style="cursor: pointer;" @click.stop="lock(-1)">
                    <v-icon size="16" v-if="defaultFilter.lock">mdi-lock</v-icon>
                    <v-icon size="16" v-else>mdi-lock-open-variant</v-icon>
                  </v-avatar>
                  <v-avatar v-if="!defaultFilter.star" @click.stop="removeTempo('root')" style="cursor: pointer;">
                    <v-icon size="16">mdi-close-octagon</v-icon>
                  </v-avatar>
                </v-chip>
                <v-chip @click="star(tempo.name)" v-for="(tempo, index) in selectedFilter" :key="tempo.name"
                  :color="tempo.color" filter>
                  <div>
                    <v-avatar v-if="tempo.star">
                      <v-icon size="16" color="#ffc069">mdi-star</v-icon>
                    </v-avatar>
                    {{ tempo.name }}
                  </div>
                  <v-avatar style="cursor: pointer;" @click.stop="lock(index)">
                    <v-icon size="16" v-if="tempo.lock">mdi-lock</v-icon>
                    <v-icon size="16" v-else>mdi-lock-open-variant</v-icon>
                  </v-avatar>
                  <v-avatar v-if="!tempo.star" @click.stop="removeTempo(tempo.name)" style="cursor: pointer;">
                    <v-icon size="16">mdi-close-octagon</v-icon>
                  </v-avatar>
                </v-chip>
              </div>
            </div>
          </v-card>
        </v-dialog>

      </div>
      <LineChart v-if="chart.label && chart.data && ['Journée', 'Trimestre'].includes(temporality.name)" :title="title"
        :subtitle="subtitle" :labels="chart.label" :datasets="chart.data" :optional="barOptions"
        :next="temporality.next" :prev="temporality.prev" @nav="nav" @stack="stack" :stacked="false"
        style="max-height: 530px;" class="BR">
        <template v-slot:title>
          <SelectCategory :controls_point="controlEndpoints" :control_value="select_endpoint"
            @changeEndpoint="changeEndpoint" />

        </template>

      </LineChart>
      <BarChart v-else-if="chart.label && chart.data" :labels="chart.label" :datasets="chart.data" :prev_next="true"
        @nav="nav" @calendar="calendarSwitch" :stacked="true"
        :isYear="temporality.name === 'Année' || temporality.name === 'Trimestre'" :calendar="calendar"
        :next="temporality.next" :prev="temporality.prev" :optional="barOptions" style="max-height: 530px;" class="BR">
        <template v-slot:title>
          <SelectCategory :controls_point="controlEndpoints" :control_value="select_endpoint"
            @changeEndpoint="changeEndpoint" />

        </template>



        <template v-slot:extras>
          <v-select v-model="domain" append-icon="mdi-chevron-down" :items="domainList" outlined
            menu-props="{ bottom: true }" color="#E3E7E8" item-color="#E3E7E8" dense
            style="margin-left: 100px !important; min-width: 200px; width: 340px; flex-grow: 0; font-size: 14px !important;"
            class="ml-8" label="Temporalité">
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
        <StackCard v-if="totalCard.length !== 0 && cards.includes('total')" :star="true" :lock="true"
          :title="totalTitle" :subtitle="totalSubtitle" :data="totalCard" class="flex-grow-1 pa-4"
          style="width: 100% !important; height: fit-content;" />
        <LoadingCard class="flex-grow-1 pa-4" style="width: 100% !important; min-height: 105px;"
          v-else-if="cards.includes('total')" />

        <StackCard v-if="meterCard.length !== 0 && cards.includes('today')" :star="false" :title="todaysTitle"
          :subtitle="todaysSubtitle" :data="meterCard" class="flex-grow-1 pa-4"
          style="width: 100% !important; height: fit-content;" />
        <LoadingCard class="flex-grow-1 pa-4" style="width: 100% !important; min-height: 105px !important;"
          v-else-if="cards.includes('today')" />

        <StackCard v-if="averageCard.length !== 0 && cards.includes('average')" :star="false" :title="averageTitle"
          :subtitle="averageSubtitle" :data="averageCard" class="flex-grow-1 pa-4"
          style="width: 100% !important; height: fit-content;" />
        <LoadingCard class="flex-grow-1 pa-4" style="width: 100% !important; min-height: 105px;"
          v-else-if="cards.includes('average')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LineChart from './LineCard.vue';
import Component from 'vue-class-component';
import { Prop, Vue, Watch } from 'vue-property-decorator';
// import env from '../../config';
import BarChart from './BarCard.vue';
import SelectCategory from './SelectCategory.vue';
import StatCard from './StatsCard.vue';
import StackCard from './StackCard.vue';
import SmallLegend from "./SmallLegend.vue";
import LoadingCard from './LoadingCard.vue';
import { ISpaceSelectorItem } from './SpaceSelector/index';
import { TemporalityModel } from '../models/Temporality.model';
import { LegendModel } from '../models/Legend.model';
import { CalendarModel } from '../models/Calendar.model';
import { getData, getTodaysData, getSolo, getTempoSuggestion } from '../services/index.js';
import moment from 'moment';
import { ControlEndpoint } from '../models/ConfigInterface.js';

interface ChartData {
  label: string;
  backgroundColor: string;
  data: number[];
  stack: string;
  tooltipDate: string[];
}

interface tempoFilter {
  name: string,
  value: string,
  color: string,
  lock: boolean,
  star: boolean,
}

@Component({
  components: {
    BarChart,
    StatCard,
    StackCard,
    LoadingCard,
    SmallLegend,
    LineChart,
    SelectCategory
  },
})
class App extends Vue {

  title = "";
  subtitle = "";
  unit = "";
  select_endpoint = {} as ControlEndpoint;
  // controlEndpoints = env.controlEndpoints;
  // cards = env.cards;
  // totalTitle = env.totalCardTitle;
  // totalSubtitle = env.totalCardSubtitle;
  // averageTitle = env.averageCardTitle;
  // averageSubtitle = env.averageCardSubtitle;
  // todaysTitle = env.todaysCardTitle;
  // todaysSubtitle = env.todaysCardSubtitle;
  chart: {
    label: string[];
    data: ChartData[];
  } = {
      label: [],
      data: [],
    };
  currentTimestamp = { valueTime: 0 };
  todaysCard: any[] = [];
  averageCard: any[] = [];
  totalCard: any[] = [];
  meterCard: any[] = [];
  calendarList: CalendarModel[] = [];
  calendar: CalendarModel = { n: '', y: '', d: [] };
  barOptions = { unit: this.unit, footer: '' };
  checkbox1 = { label: '', value: true };
  checkbox2 = { label: '', value: true };
  checkbox3 = { label: '', value: true };
  selectedControlEndpoint: LegendModel = { name: this.controlEndpoints[0].name, color: this.controlEndpoints[0].color };
  controlEndpointList: LegendModel[] = [];
  calendarSwitchState = false;

  selectedDay = '';
  selectedWeek = '';
  selectedMonth = '';
  selectedTrimester = '';
  selectedYear = '';
  selectedColor = '';

  defaultTimeChip = '';

  dialog = false;
  days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  weeks = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18', 'S19', 'S20', 'S21', 'S22', 'S23', 'S24', 'S25', 'S26', 'S27', 'S28', 'S29', 'S30', 'S31', 'S32', 'S33', 'S34', 'S35', 'S36', 'S37', 'S38', 'S39', 'S40', 'S41', 'S42', 'S43', 'S44', 'S45', 'S46', 'S47', 'S48', 'S49', 'S50', 'S51', 'S52'];
  months = [{ name: 'Janvier', value: '01' }, { name: 'Février', value: '02' }, { name: 'Mars', value: '03' }, { name: 'Avril', value: '04' }, { name: 'Mai', value: '05' }, { name: 'Juin', value: '06' }, { name: 'Juillet', value: '07' }, { name: 'Août', value: '08' }, { name: 'Septembre', value: '09' }, { name: 'Octobre', value: '10' }, { name: 'Novembre', value: '11' }, { name: 'Décembre', value: '12' }];
  trimester = ['T1', 'T2', 'T3', 'T4'];
  years = [];
  selectedFilter: tempoFilter[] = [
    // {
    //   "name": "Janvier 2023",
    //   "value": "01/2023",
    //   "color": "#74BDCB",
    //   "lock": false,
    //   "star": false
    // },
    // {
    //     "name": "Mars 2023",
    //     "value": "03/2023",
    //     "color": "#FFA384",
    //     "lock": false,
    //     "star": false
    // }
  ];

  get appConfig() {
    return this.$store.state.appDataStore.appConfig;
  }

  get controlEndpoints(): ControlEndpoint[] {
    return this.appConfig?.controlEndpoints || [];
  }

  get cards() {
    return this.appConfig?.cards || [];
  }

  get totalTitle(): string {
    return this.appConfig?.totalCardTitle || '';
  }

  get totalSubtitle(): string {
    return this.appConfig?.totalCardSubtitle || '';
  }

  get averageTitle(): string {
    return this.appConfig?.averageCardTitle || '';
  }

  get averageSubtitle(): string {
    return this.appConfig?.averageCardSubtitle || '';
  }

  get todaysTitle(): string {
    return this.appConfig?.todaysCardTitle || '';
  }

  get todaysSubtitle(): string {
    return this.appConfig?.todaysCardSubtitle || '';
  }


  getYears(startYear: number) {
    const currentYear = new Date().getFullYear();
    let years = [];
    for (let i = startYear; i <= currentYear; i++) {
      years.push(i);
    }
    return years;

  }


  defaultFilter: tempoFilter = {
    name: '',
    value: '',
    color: '', // on mettra à jour ensuite
    lock: false,
    star: true,
  };
  selectedReference: number = 0;
  colors = ['#FF4A3B', '#93876E', '#74BDCB', '#EFE7BC', '#FFA384', '#E7F2F8',
    '#ECF87F', '#B99095', '#93B9B8', '#FDA649', '#5050C8', '#0D698B',
    '#29A0B1', '#FFAEBC', '#B4F8C8', '#FBE7C6', '#3D5B59', '#A0E7E5',
    '#25C1AF', '#C37BCF', '#CC4D92', '#8A78FB', '#9DD6FF', '#D67D7D',
    '#FFD056', '#584A4A', '#C1CC80', '#AA2424', '#9DAABD', '#802877'
  ];

  selectedDomain = -1;
  domain: any = { name: '', color: '' };
  domainList: any[] = [];


  @Prop({ type: Object as () => ISpaceSelectorItem, required: true })
  space: ISpaceSelectorItem;

  @Prop({ type: Object as () => TemporalityModel, required: true })
  temporality: TemporalityModel;

  changeEndpoint(newValue: ControlEndpoint) {
    this.select_endpoint = newValue;
    this.$store.commit('setConfigEndpoint', newValue);
  }

  interval() {
    this.currentTimestamp = { valueTime: this.currentTimestamp.valueTime = moment().valueOf() };
    this.spreadData();
  }

  async spreadData() {

    this.averageCard = [];
    this.totalCard = [];
    this.meterCard = [];
    let res: any;
    res = await getData(this.space, this.temporality.name, this.currentTimestamp.valueTime, this.$store.state.appDataStore.appConfig?.controlEndpoints[0]);
    if (this.selectedReference !== 0) {
      res[2][0].root = false;
      res[3][0].root = false;
      res[5][0].root = false;
      res[3][0].subtitle = ' ';
      res[3][0].subValue = ' ';
    }
    res[3][0].lock = (this.defaultFilter.lock === true) ? true : false;
    this.chart.label = res[0];
    this.chart.data = res[1];
    this.defaultFilter.name = res[1][0].label;
    this.averageCard = res[2];
    this.totalCard = res[3];
    this.meterCard = res[5];
    this.calendarList = res[4];

    let index = 1;
    for (const ft of this.selectedFilter) {

      if (this.temporality.name === 'Journée') {
        let res1 = await getSolo(this.space, this.temporality.name, ft.value, 'DD/MM/YYYY', this.select_endpoint, ft.color, this.totalCard);
        if (this.selectedReference === index) {
          res1[1].root = true;
          res1[1].subtitle = ' ';
          res1[1].subValue = ' ';
          res1[2].root = true;
          res1[2].subtitle = ' ';
          res1[2].subValue = ' ';
          res1[3].root = true;
          res1[3].subtitle = ' ';
          res1[3].subValue = ' ';
        }
        res1[2].lock = (this.selectedFilter[index - 1].lock === true) ? true : false;

        this.addData(res1);
      }
      else if (this.temporality.name === 'Semaine') {
        let res1 = await getSolo(this.space, this.temporality.name, ft.value, 'WW/YYYY', this.select_endpoint, ft.color, this.totalCard);
        if (this.selectedReference === index) {
          res1[1].root = true;
          res1[1].subtitle = ' ';
          res1[1].subValue = ' ';
          res1[2].root = true;
          res1[2].subtitle = ' ';
          res1[2].subValue = ' ';
          res1[3].root = true;
          res1[3].subtitle = ' ';
          res1[3].subValue = ' ';
        }
        res1[2].lock = (this.selectedFilter[index - 1].lock === true) ? true : false;
        this.addData(res1);
      }
      else if (this.temporality.name === 'Mois') {
        let res1 = await getSolo(this.space, this.temporality.name, ft.value, 'MM/YYYY', this.select_endpoint, ft.color, this.totalCard);
        if (this.selectedReference === index) {
          res1[1].root = true;
          res1[1].subtitle = ' ';
          res1[1].subValue = ' ';
          res1[2].root = true;
          res1[2].subtitle = ' ';
          res1[2].subValue = ' ';
          res1[3].root = true;
          res1[3].subtitle = ' ';
          res1[3].subValue = ' ';
        }
        res1[2].lock = (this.selectedFilter[index - 1].lock === true) ? true : false;
        this.addData(res1);
      }
      else if (this.temporality.name === 'Trimestre') {
        let res1 = await getSolo(this.space, this.temporality.name, ft.value, 'TT/YYYY', this.select_endpoint, ft.color, this.totalCard);
        if (this.selectedReference === index) {
          res1[1].root = true;
          res1[1].subtitle = ' ';
          res1[1].subValue = ' ';
          res1[2].root = true;
          res1[2].subtitle = ' ';
          res1[2].subValue = ' ';
          res1[3].root = true;
          res1[3].subtitle = ' ';
          res1[3].subValue = ' ';
        }
        res1[2].lock = (this.selectedFilter[index - 1].lock === true) ? true : false;
        this.addData(res1);
      }
      else if (this.temporality.name === 'Année') {
        let res1 = await getSolo(this.space, this.temporality.name, ft.value, 'YYYY', this.select_endpoint, ft.color, this.totalCard);
        console.log("année Data: ", res1);
        if (this.selectedReference === index) {
          res1[1].root = true;
          res1[1].subtitle = ' ';
          res1[1].subValue = ' ';
          res1[2].root = true;
          res1[2].subtitle = ' ';
          res1[2].subValue = ' ';
          res1[3].root = true;
          res1[3].subtitle = ' ';
          res1[3].subValue = ' ';
        }
        res1[2].lock = (this.selectedFilter[index - 1].lock === true) ? true : false;
        this.addData(res1);
      }
      index++;

    }
    this.calendar = this.calendarList.find((e: CalendarModel) => e.y == this.domain.name)!;

  }

  async mounted() {
    const endpoint = this.controlEndpoints[0];
    if (endpoint?.color) {
      this.defaultFilter.color = endpoint.color;
    }

    this.select_endpoint = this.$store.state.appDataStore.appConfig?.controlEndpoints[0];
    this.title = this.select_endpoint.title
    this.subtitle = this.select_endpoint.subtitle;
    this.unit = this.select_endpoint.unit;

    this.years = this.getYears(2020);
    this.selectedYear = moment().format('YYYY');
    this.defaultTimeChip = moment().format('MM/YYYY');
    this.defaultFilter = {
      name: moment().format('MMMM YYYY'),
      value: moment().format('MM/YYYY'),
      color: this.controlEndpoints?.[0]?.color || '#cccccc', // couleur de secours si absent
      lock: false,
      star: true
    };
    for (const controlEndpoint of this.controlEndpoints) {
      this.controlEndpointList.push({ name: controlEndpoint.name, color: controlEndpoint.color });
    }
    this.interval();
    const color = this.controlEndpoints?.[0]?.color || '#cccccc';

    this.domainList.push({ name: this.selectedYear, color });
    this.domain = { name: this.selectedYear, color };
    // this.todaysCard = await getTodaysData(this.space, this.controlEndpoints);
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

  @Watch('select_endpoint')
  selectEndpointChange() {
    this.title = this.select_endpoint.title;
    this.subtitle = this.select_endpoint.subtitle;
    this.unit = this.select_endpoint.unit;
    this.barOptions.unit = this.unit;
    this.spreadData();
  }


  @Watch('space')
  async spaceChange() {
    this.todaysCard = [];
    this.spreadData();
    this.todaysCard = await getTodaysData(this.space, this.controlEndpoints);
  }

  @Watch('temporality')
  async temporalityChange() {
    this.chart.data = [];
    this.selectedFilter = [];
    this.selectedReference = 0;
    this.defaultFilter.star = true;
    // this.selectedDay = '';
    // this.selectedWeek = '';
    // this.selectedMonth = '';
    // this.selectedTrimester = '';
    // this.selectedYear = '';
    this.interval();
  }

  @Watch('selectedControlEndpoint')
  async selectedControlEndpointChange() {
    this.calendar = this.calendarList.find((e: CalendarModel) => e.n == this.selectedControlEndpoint.name)!;
  }

  @Watch('selectedYear')
  async selectedFilterChange(v) {
    this.weeks = [];
    for (var week = 1; week <= 52; week++) {
      // Get the start and end dates of the week using moment.js
      var startDate = moment().year(+this.selectedYear).isoWeek(week).startOf('isoWeek').format('DD/MM/YYYY');
      var endDate = moment().year(+this.selectedYear).isoWeek(week).endOf('isoWeek').format('DD/MM/YYYY');

      // Format the week string
      var weekString = 'S' + week + ' (' + startDate + ' - ' + endDate + ')';

      // Push the week string to the array
      this.weeks.push(weekString);
    }

  }

  @Watch('chart', { deep: true })
  emitChartChange(newChart) {
    let output: any[] = [];
    for (let c = 0; c < newChart.data.length; c++) {
      output.push({
        'Temporalité': newChart.data[c].label,
      })
      for (let i = 0; i < newChart.label.length; i++) {
        const label = '' + newChart.label[i];
        const data = newChart.data[c].data[i];
        output[c][label] = data;
      }
      const modifiedData = {
        Temporalité: output[c].Temporalité,
        ...output[c],
      };


    }
    this.$emit('chart-sent', output);
  }

  @Watch('domain')
  domainChange(y) {
    this.calendar = this.calendarList.find((e: CalendarModel) => e.y == y.name)!;
  }

  calendarSwitch(): void {
    this.calendarSwitchState = !this.calendarSwitchState;
  }

  async nav(payload: number): Promise<void> {

    if (this.temporality.name === 'Journée') {
      if (!this.defaultFilter.lock)
        this.currentTimestamp = { valueTime: moment(this.currentTimestamp.valueTime).add(payload, 'days').valueOf() };
      for (let i = 0; i < this.selectedFilter.length; i++) {
        let date = moment(this.selectedFilter[i].value, 'DD/MM/YYYY');
        if (this.selectedFilter[i].lock === false)
          date.add(payload, 'days');
        let newValue = date.format('DD/MM/YYYY');
        let newMonthName = date.format('DD MMMM YYYY');
        this.selectedFilter[i].name = newMonthName;
        this.selectedFilter[i].value = newValue;
        this.selectedFilter[i].color = this.selectedFilter[i].color;
      }
    }
    if (this.temporality.name === 'Semaine') {
      if (!this.defaultFilter.lock)
        this.currentTimestamp = { valueTime: moment(this.currentTimestamp.valueTime).add(payload, 'weeks').valueOf() };
      for (let i = 0; i < this.selectedFilter.length; i++) {
        let date = moment(this.selectedFilter[i].value, 'WW/YYYY');
        if (this.selectedFilter[i].lock === false)
          date.add(payload, 'weeks');
        let newValue = date.format('WW/YYYY');
        let newMonthName = 'S' + date.format('WW YYYY');
        this.selectedFilter[i].name = newMonthName;
        this.selectedFilter[i].value = newValue;
        this.selectedFilter[i].color = this.selectedFilter[i].color;
      }
    }
    if (this.temporality.name === 'Mois') {
      if (!this.defaultFilter.lock)
        this.currentTimestamp = { valueTime: moment(this.currentTimestamp.valueTime).add(payload, 'months').valueOf() };
      for (let i = 0; i < this.selectedFilter.length; i++) {
        let date = moment(this.selectedFilter[i].value, 'MM/YYYY');
        if (this.selectedFilter[i].lock === false)
          date.add(payload, 'month');
        let newValue = date.format('MM/YYYY');
        let newMonthName = date.format('MMMM YYYY');
        this.selectedFilter[i].name = newMonthName;
        this.selectedFilter[i].value = newValue;
        this.selectedFilter[i].color = this.selectedFilter[i].color;
      }
    }
    if (this.temporality.name === 'Trimestre') {
      if (!this.defaultFilter.lock)
        this.currentTimestamp = { valueTime: moment(this.currentTimestamp.valueTime).add(payload * 3, 'months').valueOf() };
      for (let i = 0; i < this.selectedFilter.length; i++) {
        let t = this.selectedFilter[i].value.split('/');
        let date;
        switch (t[0]) {
          case 'T1': date = moment(`01/01/${t[1]}`, 'DD/MM/YYYY'); break;
          case 'T2': date = moment(`01/04/${t[1]}`, 'DD/MM/YYYY'); break;
          case 'T3': date = moment(`01/07/${t[1]}`, 'DD/MM/YYYY'); break;
          case 'T4': date = moment(`01/10/${t[1]}`, 'DD/MM/YYYY'); break;
        }
        // let date = moment(this.selectedFilter[i].value, 'MM/YYYY');
        if (this.selectedFilter[i].lock === false) {
          date.add(payload * 3, 'months');
        }
        let currentMM = date.format('MM');
        let T = 'T' + Math.ceil(+currentMM / 3);
        let newValue = date.format('MM/YYYY');
        let newMonthName = date.format('MMMM YYYY');
        this.selectedFilter[i].name = `${T} ${date.format('YYYY')}`;
        this.selectedFilter[i].value = `${T}/${date.format('YYYY')}`;
        this.selectedFilter[i].color = this.selectedFilter[i].color;
      }
    }
    if (this.temporality.name === 'Année') {
      this.domain.name = '' + (+this.domain.name + payload);
      if (!this.defaultFilter.lock) {
        this.currentTimestamp = { valueTime: moment(this.currentTimestamp.valueTime).add(payload, 'years').valueOf() };
      }
      for (let i = 0; i < this.selectedFilter.length; i++) {
        let date = moment(this.selectedFilter[i].value, 'YYYY');
        if (this.selectedFilter[i].lock === false)
          date.add(payload, 'years');
        let newValue = date.format('YYYY');
        let newMonthName = date.format('YYYY');
        this.selectedFilter[i].name = newMonthName;
        this.selectedFilter[i].value = newValue;
        this.selectedFilter[i].color = this.selectedFilter[i].color;

      }

    }
    await this.spreadData();
    if (this.temporality.name === 'Année') {
      this.domainList = [];
      this.domainList.push({ name: this.defaultFilter.name, color: this.defaultFilter.color });
      for (let filter = 0; filter < this.selectedFilter.length; filter++) {
        this.domainList.push({ name: this.selectedFilter[filter].name, color: this.selectedFilter[filter].color });
      }
      if (!this.domain.name) {
        this.domain = { name: this.defaultFilter.name, color: this.defaultFilter.color }
      }
      // else 
      //   this.domain = {name: this.selectedFilter[0].name, color: this.selectedFilter[0].color}
    }
    this.star(undefined, this.selectedReference);
  }

  addData(soloData): void {

    this.chart.label = (soloData[5].length > this.chart.label.length) ? soloData[5] : this.chart.label;
    let temp: ChartData[] = [];
    for (const d of this.chart.data) {
      temp.push(d);
    };
    temp.push(soloData[0]);
    this.chart.data = temp;
    this.averageCard.push(soloData[1]);
    this.calendarList.push(soloData[4]);

    this.totalCard.push(soloData[2]);
    this.meterCard.push(soloData[3]);
  }

  async addTempo(): Promise<void> {

    if (this.temporality.name === 'Journée' && this.selectedDay && this.selectedMonth && this.selectedYear) {
      if (!this.selectedFilter.find(f => f.name === `${this.selectedDay} ${this.months.find(m => m.value === this.selectedMonth)?.name} ${this.selectedYear}`) && this.defaultFilter.name !== `${this.selectedDay}/${this.months.find(m => m.value === this.selectedMonth)?.value}/${this.selectedYear}`) {
        this.selectedFilter.push({
          name: `${this.selectedDay} ${this.months.find(m => m.value === this.selectedMonth)?.name} ${this.selectedYear}`,
          value: `${this.selectedDay}/${this.months.find(m => m.value === this.selectedMonth)?.value}/${this.selectedYear}`,
          color: this.selectedColor,
          lock: false,
          star: false
        });
        const tempovVal = `${this.selectedDay}/${this.months.find(m => m.value === this.selectedMonth)?.value}/${this.selectedYear}`;

        let res = await getSolo(this.space, this.temporality.name, tempovVal, 'DD/MM/YYYY', this.$store.state.appDataStore.appConfig?.controlEndpoints[0], this.selectedColor, this.totalCard);
        this.addData(res);
      }
    }
    if (this.temporality.name === 'Semaine' && this.selectedWeek && this.selectedYear) {
      if (!this.selectedFilter.find(f => f.name === `${this.selectedWeek} ${this.selectedYear}`) && this.defaultFilter.name !== `${this.selectedWeek}`) {
        this.selectedFilter.push({
          name: `${this.selectedWeek}`,
          value: `${this.selectedWeek.split(' ')[0]}/${this.selectedYear}`,
          color: this.selectedColor,
          lock: false,
          star: false
        });
        const tempovVal = `${this.selectedWeek.split(' ')[0]}/${this.selectedYear}`;

        let res = await getSolo(this.space, this.temporality.name, tempovVal, 'WW/YYYY', this.controlEndpoints, this.selectedColor, this.totalCard);
        this.addData(res);
      }
    }
    if (this.temporality.name === 'Mois' && this.selectedMonth && this.selectedYear) {
      if (!this.selectedFilter.find(f => f.name === `${this.months.find(m => m.value === this.selectedMonth)?.name} ${this.selectedYear}`) && this.defaultFilter.name !== `${this.months.find(m => m.value === this.selectedMonth)?.name} ${this.selectedYear}`) {
        this.selectedFilter.push({
          name: `${this.months.find(m => m.value === this.selectedMonth)?.name} ${this.selectedYear}`,
          value: `${this.months.find(m => m.value === this.selectedMonth)?.value}/${this.selectedYear}`,
          color: this.selectedColor,
          lock: false,
          star: false
        });
        const tempovVal = `${this.months.find(m => m.value === this.selectedMonth)?.value}/${this.selectedYear}`;

        let res = await getSolo(this.space, this.temporality.name, tempovVal, 'MM/YYYY', this.$store.state.appDataStore.appConfig?.controlEndpoints[0], this.selectedColor, this.totalCard);
        this.addData(res);
      }
      return;
    }
    if (this.temporality.name === 'Trimestre' && this.selectedTrimester && this.selectedYear) {
      if (!this.selectedFilter.find(f => f.name === `${this.selectedTrimester} ${this.selectedYear}`) && this.defaultFilter.name !== `${this.selectedTrimester} ${this.selectedYear}`) {
        this.selectedFilter.push({
          name: `${this.selectedTrimester} ${this.selectedYear}`,
          value: `${this.selectedTrimester}/${this.selectedYear}`,
          color: this.selectedColor,
          lock: false,
          star: false
        });
        const tempovVal = `${this.selectedTrimester}/${this.selectedYear}`;
        let res = await getSolo(this.space, this.temporality.name, tempovVal, 'TT/YYYY', this.$store.state.appDataStore.appConfig?.controlEndpoints[0], this.selectedColor, this.totalCard);
        this.addData(res);
      }
      return;
    }
    if (this.temporality.name === 'Année' && this.selectedYear) {
      if (!this.selectedFilter.find(f => f.name === `${this.selectedYear}`) && this.defaultFilter.name !== `${this.selectedYear}`) {
        this.selectedFilter.push({
          name: `${this.selectedYear}`,
          value: `${this.selectedYear}`,
          color: this.selectedColor,
          lock: false,
          star: false
        });
        const tempovVal = `${this.selectedYear}`;
        this.domainList.push({ name: `${this.selectedYear}`, color: this.selectedColor })
        let res = await getSolo(this.space, this.temporality.name, tempovVal, 'YYYY', this.$store.state.appDataStore.appConfig?.controlEndpoints[0], this.selectedColor, this.totalCard);
        this.addData(res);
      }
      return;
    }
  }

  removeTempo(name: string): void {
    if (name === 'root') {
      this.defaultFilter = this.selectedFilter[this.selectedReference - 1];
      this.selectedFilter.splice(this.selectedReference - 1, 1);
      this.totalCard[0] = this.totalCard[this.selectedReference];
      this.averageCard[0] = this.averageCard[this.selectedReference];
      this.meterCard[0] = this.meterCard[this.selectedReference];
      this.totalCard.splice(this.selectedReference, 1);
      this.averageCard.splice(this.selectedReference, 1);
      this.meterCard.splice(this.selectedReference, 1);
      this.chart.data[0] = this.chart.data[this.selectedReference];
      this.chart.data.splice(this.selectedReference, 1);
      let temp: ChartData[] = [];
      for (let i = 0; i < this.chart.data.length; i++) {
        temp.push(this.chart.data[i]);
      }
      this.chart.data = temp;

      let maxLenght = 0, daysToRemove = 0;
      for (let i = 0; i < this.chart.data.length; i++) {
        maxLenght = (this.chart.data[i].data.length > maxLenght) ? this.chart.data[i].data.length : maxLenght;
      }

      daysToRemove = this.chart.label.length - maxLenght;
      for (let i = 0; i < daysToRemove; i++) {
        this.chart.label.pop();
      }

      return;
    }
    const index = this.selectedFilter.findIndex(f => f.name === name);
    this.selectedFilter.splice(index, 1);

    let temp: ChartData[] = [];
    let tempAvgCard: any[] = [];
    let tempTotalCard: any[] = [];
    let tempMeterCard: any[] = [];

    temp.push(this.chart.data[0]);
    tempAvgCard.push(this.averageCard[0]);
    tempTotalCard.push(this.totalCard[0]);
    tempMeterCard.push(this.meterCard[0]);

    for (let i = 1; i < this.chart.data.length; i++) {
      if (i !== index + 1) {
        tempAvgCard.push(this.averageCard[i]);
        tempTotalCard.push(this.totalCard[i]);
        tempMeterCard.push(this.meterCard[i]);
        temp.push(this.chart.data[i]);
      }
    }
    this.chart.data = [];
    this.chart.data = temp;
    this.averageCard = tempAvgCard;
    this.meterCard = tempMeterCard;
    this.totalCard = tempTotalCard;

    let maxLenght = 0, daysToRemove = 0;
    for (let i = 0; i < this.chart.data.length; i++) {
      maxLenght = (this.chart.data[i].data.length > maxLenght) ? this.chart.data[i].data.length : maxLenght;
    }

    daysToRemove = this.chart.label.length - maxLenght;
    for (let i = 0; i < daysToRemove; i++) {
      this.chart.label.pop();
    }
  }

  star(name?: string, id?: number): void {
    if (id) {
      const rootValue = this.totalCard[id].value;
      this.totalCard.map((obj, i) => {
        if (i !== id) {
          obj.root = false;
          obj.subtitle = 'de la consommation de référence';
          obj.subValue = (rootValue !== 0 && obj.value > 0) ? (((obj.value - rootValue) / rootValue) * 100).toFixed(1) + '%' : '∞';
        }
        else {
          obj.root = true;
          obj.subtitle = 'Consommation de référence';
          obj.subValue = ' '
        }
      });
      this.averageCard.map((obj, i) => { if (i !== id) { obj.root = false; } else { obj.root = true; } });
      this.meterCard.map((obj, i) => { if (i !== id) { obj.root = false; } else { obj.root = true; } });

      return;
    }
    else if (name) {
      const oldIndex = this.selectedFilter.findIndex(e => e.star === true);
      if (name === 'root') {
        this.selectedReference = 0;
        let index = 0;
        const rootValue = this.totalCard[0].value;

        this.totalCard.map((obj, i) => {
          if (i !== index) {
            obj.root = false;
            obj.subtitle = 'de la consommation de référence';
            obj.subValue = (rootValue !== 0 && obj.value > 0) ? (((obj.value - rootValue) / rootValue) * 100).toFixed(1) + '%' : '∞';
          }
          else {
            obj.root = true;
            obj.subtitle = 'Consommation de référence';
            obj.subValue = ' '
          }
        });
        this.averageCard.map((obj, i) => { if (i !== index) { obj.root = false; } else { obj.root = true; } });
        this.meterCard.map((obj, i) => { if (i !== index) { obj.root = false; } else { obj.root = true; } });

        this.totalCard[0].subtitle = 'Consommation de référence';

        this.defaultFilter.star = true;
        if (oldIndex !== -1)
          this.selectedFilter[oldIndex].star = false;
      }
      else {
        this.defaultFilter.star = false;
        const index = this.selectedFilter.findIndex(f => f.name === name);
        this.selectedReference = index + 1;
        if (oldIndex !== -1 && index === oldIndex) return;
        const rootValue = this.totalCard[index + 1].value;
        this.totalCard.map((obj, i) => {
          if (i !== index + 1) {
            obj.root = false;
            obj.subtitle = 'de la consommation de référence';
            obj.subValue = (rootValue !== 0 && obj.value > 0) ? (((obj.value - rootValue) / rootValue) * 100).toFixed(1) + '%' : '∞';
          }
          else {
            obj.root = true;
            obj.subtitle = 'Consommation de référence';
            obj.subValue = ' '
          }
        });
        this.averageCard.map((obj, i) => { if (i !== index + 1) { obj.root = false; } else { obj.root = true; } });
        this.meterCard.map((obj, i) => { if (i !== index + 1) { obj.root = false; } else { obj.root = true; } });
        this.selectedFilter[index].star = true;
        if (oldIndex !== -1)
          this.selectedFilter[oldIndex].star = false;
      }
    }




  }

  lock(id: number): void {
    if (id === -1) {
      this.defaultFilter.lock = !this.defaultFilter.lock;
      this.totalCard[0].lock = this.defaultFilter.lock;
    }
    else {
      this.selectedFilter[id].lock = !this.selectedFilter[id].lock;
      this.totalCard[id + 1].lock = this.selectedFilter[id].lock;
    }
    let temp: any[] = [];
    for (let i = 0; i < this.totalCard.length; i++) {
      temp.push(this.totalCard[i]);
    }
    this.totalCard = temp;
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

.plus-button {
  /* background: #f9f9f9 !important; */
  background: transparent !important;
  position: absolute;
  top: 180px;
  left: 40px;
  font-size: 14px !important;
  border-radius: 10px;
  min-width: 36px !important;
  box-shadow: none;
  /* border: 1px solid #EAEEF0 !important; */
  width: 48px !important;
  height: 36px !important;
}

.plus-button:hover {
  background: transparent !important;
}

.g {
  gap: 10px;
}

.active-select {
  border-color: green;
  /* set the border color to red when the select is active */

}

::v-deep .v-application .primary--text {
  color: #000000DE !important;
}

::v-deep .v-menu__content {
  border-radius: 10px !important;
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
  color: #E3E7E8;
}

::v-deep .v-menu__content {
  top: 188px !important;
}

::v-deep .v-list-item--link:before {
  background: #fff !important;
}
</style>