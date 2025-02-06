<!--
Copyright 2023 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div>
    <v-card elevation="4" class="cardContainer">
      <!-- configuration de la légende (affichage et couleur des sprites)-->
      <v-card
        v-if="!ActiveData"
        class="d-flex flex-column justify-space-around align-center"
        style="
          position: absolute;
          top: 0px;
          left: -75px;
          width: 70px;
          min-width: 70px !important;
          height: 160px;
          z-index: 2;
        "
      >
        <!-- <v-switch dense v-model="sprites"></v-switch> -->
        <div class="switch">
          <input
            id="toggle"
            type="checkbox"
            :checked="sprites"
            @change="updateSpritesModel($event)"
          />
          <label class="toggle" for="toggle">
            <i></i>
          </label>
        </div>

        <div style="display: flex; align-items: center">
          <div
            class="rounded mr-2"
            :style="{
              background: legend.min.color,
              width: '9px',
              height: '18px',
            }"
          ></div>
          <div style="font-size: 13px">{{ legend.min.value }}</div>
        </div>
        <div v-if="legend.median" style="display: flex; align-items: center">
          <div
            class="rounded mr-2"
            :style="{
              background: legend.median.color,
              width: '9px',
              height: '18px',
            }"
          ></div>
          <div style="font-size: 13px">{{ medianValue }}</div>
        </div>
        <div style="display: flex; align-items: center">
          <div
            class="rounded mr-2"
            :style="{
              background: legend.max.color,
              width: '9px',
              height: '18px',
            }"
          ></div>
          <div style="font-size: 13px">{{ legend.max.value }}</div>
        </div>
        <v-btn icon @click="dialog = true"><v-icon>mdi-cog</v-icon></v-btn>
      </v-card>
      <!-- affichage scindé ou complet (dataapp viewer)-->
      <button
        class="notdisplayed"
        @click="
          () => {
            $emit('buttonClicked');
            resize();
          }
        "
        style="
          position: absolute;
          top: 47.5%;
          left: -20px;
          background-color: white;
          border-radius: 10px;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: 5px;
          border-left: 2px solid gainsboro;
          z-index: 2;
        "
        :style="{ left: DActive ? '-35px' : '-20px' }"
      >
        <v-icon v-if="DActive"> mdi-chevron-double-left </v-icon>
        <v-icon v-else-if="ActiveData">mdi-chevron-right</v-icon>
        <v-icon v-else>mdi-chevron-left</v-icon>
      </button>
      <button
        class="notdisplayed"
        @click="
          () => {
            $emit('buttonClicked3D');
            resize();
          }
        "
        style="
          position: absolute;
          top: 52.5%;
          background-color: white;
          border-radius: 10px;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: 5px;
          border-left: 2px solid gainsboro;
          z-index: 2;
        "
        :style="{ left: DActive ? '-35px' : '-20px' }"
      >
        <v-icon v-if="ActiveData">mdi-chevron-double-right</v-icon>
        <v-icon v-else-if="DActive">mdi-chevron-left</v-icon>
        <v-icon v-else>mdi-chevron-right</v-icon>
      </button>

      <div class="graphDataContainer" v-show="ActiveData || !DActive">
        <div
          class="graphContainer"
          v-if="
            (!isMobileDisplay && ActiveData) ||
            (isMobileDisplay && isFullGraph && ActiveData)
          "
          :class="[{ 'full-width': isMobileDisplay && isFullGraph }]"
        >
          <sc-line-card
            :title="title"
            :labels="labelDisplay"
            :datasets="chartData"
            :step="labels.length / 4"
            :tooltipCallbacks="{
              title: (context) => toTooltipDate(context[0].raw.x),
              label: (tooltipItem) =>
                `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(
                  2
                )} ${unit}`,
              footer: (data) => {},
            }"
          ></sc-line-card>
        </div>

        <div
          v-if="!isFullGraph"
          class="dataContainer"
          :style="{ width: ActiveData ? '40%' : '100%' }"
          :class="[{ 'full-width': isMobileDisplay && !isFullGraph }]"
          @onSpriteClick="updateSelected"
        >
          <div class="detail_header">
            <div class="title_date">
              <div class="_title">{{ config.title }}</div>
              <!-- navigation temporelle-->
              <div v-if="navigable">
                <v-btn elevation="0" fab small @click="t_index--">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                {{ displayDate }}
                <v-btn
                  elevation="0"
                  fab
                  small
                  :disabled="!t_index"
                  @click="t_index++"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
              <!-- rafraichissement des données -->
              <div v-else>
                <v-progress-circular
                  :rotate="-90"
                  :size="40"
                  :width="2"
                  color="purple"
                  :value="reload_countdown"
                  @click="reload()"
                >
                  <v-icon>mdi-reload</v-icon>
                </v-progress-circular>
              </div>
            </div>

            <!-- selection de la source et du regroupement -->
            <v-row class="source_regroupement_select">
              <v-col>
                <v-autocomplete
                  v-model="sourceSelectedName"
                  item-text="name"
                  outlined
                  dense
                  rounded
                  flat
                  :hide-details="true"
                  :items="sources"
                  label="Source"
                ></v-autocomplete>
              </v-col>

              <v-col>
                <v-autocomplete
                  v-model="regroupementSelected"
                  item-text="name"
                  item-value="value"
                  outlined
                  dense
                  rounded
                  flat
                  :hide-details="true"
                  :items="regroupements"
                  label="Regroupement"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <!-- selection du type de calcul -->
            <div class="calcul_content">
              <div class="calcul">
                <div class="select">
                  <v-select
                    v-model="calculMode"
                    :items="calculItems"
                    height="30"
                    background-color="#eaeef0"
                    dense
                    append-icon=""
                    solo
                    flat
                    :hide-details="true"
                  >
                    <template v-slot:item="{ item, index }">
                      <div style="display: flex; align-items: center">
                        <div
                          class="color"
                          :style="{
                            background: '#14202c',
                            width: '8px',
                            height: '15px',
                            marginRight: '5px',
                          }"
                        ></div>
                        <div style="font-size: 13px">{{ item }}</div>
                      </div>
                    </template>

                    <template v-slot:selection="{ item, index }">
                      <div style="display: flex; align-items: center">
                        <div
                          class="color"
                          :style="{
                            height: '15px',
                            background: '#14202c',
                            borderRadius: '3px',
                          }"
                        ></div>
                        <div style="font-size: 13px">{{ item }}</div>
                      </div>
                    </template>
                  </v-select>
                </div>

                <div class="calculResult">
                  <div class="color" :style="{ background: toltalColor }"></div>
                  <div class="value">{{ total | round }}</div>
                  <div class="value">{{ unit }}</div>
                  <div class="text">Pour l'étage {{ selectedZone.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- affichage des données -->
          <div
            v-if="pageSate === PAGE_STATES.loaded && !isBuildingSelected"
            class="detail_container"
          >
            <GroupDataView
              v-for="(d, i) in data"
              :key="i"
              :data="d"
              :config="config"
              :calculMode="calculMode"
              :selectedItem="selectedItem"
              :unit="unit"
              :legend="legend"
              :percent="percent"
              @onClick="selectDataView"
            />
          </div>

          <!-- page chargée avec succès (zone non selectionnée) -->
          <div
            class="centered"
            v-else-if="pageSate === PAGE_STATES.loaded && isBuildingSelected"
          >
            <p>
              Aucune donnée à afficher ! veuillez selectionner un étage ou une
              pièce.
            </p>
          </div>

          <!-- animation de rafraichissement -->
          <div class="centered" v-else-if="pageSate === PAGE_STATES.loading">
            <v-progress-circular
              :size="70"
              :width="3"
              color="purple"
              indeterminate
            ></v-progress-circular>
          </div>

          <!-- bouton de relance en cas d'erreur -->
          <div class="centered" v-else-if="pageSate === PAGE_STATES.error">
            <div>
              <v-icon color="red" style="font-size: 5em"
                >mdi-alert-circle-outline</v-icon
              >
            </div>
            <div color="red">
              Quelque chose s'est mal passé ! Veuillez
              <v-btn small outlined color="red" @click="retry"
                >réessayer
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <!-- boite de dialogue de configuration de la légende -->
    <v-dialog v-model="dialog" width="80%">
      <config-legend v-if="dialog" v-model="legend" @close="dialog = false">
      </config-legend>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Watch } from 'vue-property-decorator';
import { PAGE_STATES } from '../../interfaces/pageStates';
import GroupDataView from './groupDataView.vue';
import ConfigLegend from './configLegend.vue';
import Component from 'vue-class-component';
import {
  IConfig,
  calculTypes,
  ISource,
  IRegroupement,
  ITemporality,
} from '../../interfaces/IConfig';
import { ISpaceSelectorItem } from 'global-components';
import { ActionTypes } from '../../interfaces/vuexStoreTypes';
import {
  calculItemsValue,
  getColor,
  calculateTotal,
} from '../../services/calcul/calculItems';
import SpriteComponent from './SpriteComponent.vue';
import ChartSpriteComponent from './ChartSpriteComponent.vue';
import lodash from 'lodash';
import { MutationTypes } from '../../services/store/appDataStore/mutations';
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
  VIEWER_AGGREGATE_SELECTION_CHANGED,
} from 'spinal-viewer-event-manager';
import { ViewerManager } from '../../../../../global-components/viewer';
// import { ViewerManager } from '../viewer'
import moment from 'moment';
import { getLabels, getValues } from '../../services/calcul/computeChart';
import 'moment/locale/fr';

moment.updateLocale('fr', {
  months: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
});

@Component({
  components: {
    GroupDataView,
    ConfigLegend,
  },
  filters: {
    round(value) {
      try {
        var num = Number(value);
        var rounded = num.toFixed(2);
        return Number(rounded);
      } catch (error) {
        console.error(error);
        return '-';
      }
    },
  },
})
class InsightApp extends Vue {
  // @State data!: any[];

  @Prop() config!: IConfig;
  @Prop() selectedZone: ISpaceSelectorItem;
  @Prop() selectedTime: ISpaceSelectorItem;
  @Prop() data: any[];
  @Prop() DActive: boolean;
  @Prop() ActiveData: boolean;
  @Prop() vueChart: boolean;
  @Prop() isFullGraph: boolean;
  @Prop() isMobileDisplay: boolean;

  time: any = null;
  sprites: boolean = true;
  reload_countdown: number = 0;
  t_index: number = 0;
  sourceSelectedName: string = '';
  regroupementSelected: 'floors' | 'rooms' | IRegroupement =
    this.config.regroupement[0];
  legend: any = this.config.source[0].legend;
  dialog: boolean = false;
  reload = function () {};
  ignoreViewerSelection: boolean = false;
  initiated: boolean = false;

  selectedItem: any = null;
  selectedItems: any[] = [];

  intervalId: any;

  regroupItemsAndCalculateDebounced: any = lodash.debounce(
    this.regroupItemsAndCalculate.bind(this),
    500
  );

  PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
  pageSate: PAGE_STATES = PAGE_STATES.loading;
  isBuildingSelected: boolean = true;
  calculMode: calculTypes = this.calculItems[0];
  percent: boolean = false;
  total: number = 0;
  retry: Function;
  timeoutId: any;
  chartData: any[] = [];
  //emitterHandler: EmitterViewerHandler | undefined = undefined;
  // viewerManager: ViewerManager | undefined = undefined;

  public get sourceSelected() {
    return this.config.source.find((el) => el.name === this.sourceSelectedName);
  }

  public get medianValue() {
    return (
      this.legend.median?.value ||
      (this.legend.max.value + this.legend.min.value) / 2
    );
  }

  public get selectedChartItems() {
    return this.$store.state.appDataStore.selectedChartItems;
  }

  public get title() {
    return `${this.$store.state.appDataStore.selectedSource.profileName}/${this.$store.state.appDataStore.selectedSource.name}`;
  }

  public get labels() {
    //const firstItem = this.selectedChartItems[0];
    return getLabels(
      this.$store.state.appDataStore.temporalitySelected,
      this.t_index
    );
  }

  public get labelDisplay() {
    return this.labels.map((label) => this.toDate(label));
  }

  toDate(date) {
    switch (this.$store.state.appDataStore.temporalitySelected.name) {
      case ITemporality.hour:
        return moment(date).format('HH:mm');
      case ITemporality.day:
        return moment(date).format('HH[h]');
      case ITemporality.week:
        return moment(date).format('dd');
      case ITemporality.month:
        return moment(date).format('D/M/YY');
      case ITemporality.year:
        return moment(date).format('MMM');
      case ITemporality.custom:
        const { begin, end } =
          this.$store.state.appDataStore.temporalitySelected.range;
        const duration = moment.duration(
          moment(end, 'DD-MM-YYYY HH:mm:ss').diff(
            moment(begin, 'DD-MM-YYYY HH:mm:ss')
          )
        );
        console.log(moment(end, 'DD-MM-YYYY HH:mm:ss'), duration);
        if (duration.asMonths() > 2) return moment(date).format('MMM');
        if (duration.asDays() > 1) return moment(date).format('D/M/YY');
        if (duration.asHours() > 1) return moment(date).format('HH[h]');
        return moment(date).format('HH:mm');
      default:
        return moment(date).format('D/M/YY');
    }
  }

  toTooltipDate(date) {
    return moment(date).format('DD/MM/YYYY HH:mm');
  }

  findClosestPastTimestamp(label, timestamps) {
    // Filter the timestamps to only include those less than or equal to the label
    const pastTimestamps = timestamps.filter((timestamp) => timestamp <= label);

    // If there are no past timestamps, return null
    if (pastTimestamps.length === 0) return null;

    // Return the largest timestamp (the closest in the past)
    return pastTimestamps.reduce((prev, curr) => (curr > prev ? curr : prev));
  }

  getValueAtTimestamp(timestamp, series) {
    const timestamps = Object.keys(series).map((key) => parseInt(key));
    const ts = this.findClosestPastTimestamp(timestamp, timestamps);
    return ts !== null ? series[ts] : null;
  }

  updateChartData() {
    const result: any[] = [];
    const t_index = this.t_index;
    const items = this.selectedChartItems;
    console.log('Chart items : ', items);
    for (const item of items) {
      const labels = getLabels(
        this.$store.state.appDataStore.temporalitySelected,
        t_index
      );

      if (item.children) {
        // item is a group of items
        const values: any[] = [];
        for (const child of item.children) {
          const vals = getValues(child.series);
          values.push(vals);
          //values.push(child.series)
        }
        const data = labels.map((lab) => {
          // pour chaque timestamp
          let timestampValues: any[] = [];

          for (const series of values) {
            // on récupère le tableau de timeseries de chaque enfant
            const valueAtTimestamp = this.getValueAtTimestamp(lab, series);
            if (valueAtTimestamp !== null) {
              timestampValues.push(valueAtTimestamp);
            }
            console.log('series : ', series);
          }
          console.log(
            'calculTotal : ',
            calculateTotal(timestampValues, this.calculMode)
          );
          return {
            x: lab,
            y: calculateTotal(timestampValues, this.calculMode),
          };
        });

        //console.log('data!!! : ', data);
        const color = '#ffffff';
        result.push({ label: item.name, data, color, tension: 0.3 });
      } else {
        const vals = getValues(item.series);
        console.log('labels : ', labels);
        console.log('vals : ', vals);

        // Convert the vals object keys to an array of timestamps
        const valTimestamps = Object.keys(vals).map((key) => parseInt(key));

        let lastUsedTimestamp = null; // To track the last projected timestamp

        // Build the chart data using the labels and the closest past timestamp in vals
        const data = labels
          .map((lab) => {
            // Find the closest past timestamp to the current label
            const closestTimestamp = this.findClosestPastTimestamp(
              lab,
              valTimestamps
            );

            // Check if this timestamp is new, i.e., different from the last projected timestamp
            if (
              closestTimestamp !== null &&
              closestTimestamp !== lastUsedTimestamp
            ) {
              // Update the last used timestamp
              lastUsedTimestamp = closestTimestamp;

              // Use the value for the closest past timestamp
              const yValue = vals[closestTimestamp] ?? 'NaN';

              return { x: lab, y: yValue };
            }

            // Return NaN if no new timestamp is encountered
            return { x: lab, y: 'NaN' };
          })
          .filter((point) => point !== null); // Filter out null values

        const color = item.color;
        result.push({ label: item.name, data, color, tension: 0.1 });
      }
    }

    // Assign the result to a reactive property (if necessary)
    this.chartData = result;
    console.log(this.chartData, 'gab');
  }

  async mounted() {
    const emitterHandler = EmitterViewerHandler.getInstance();

    emitterHandler.on(VIEWER_AGGREGATE_SELECTION_CHANGED, async (data) => {
      if (this.ignoreViewerSelection) return;
      if (data && !data[0]) {
        //console.log('viewer aggr selection : ',data)
        console.log('no data inside viewer selection');
        this.clearSelection();
        //this.selectedItem = null;
      }
      if (data && data[0]) {
        const buildingId = localStorage.getItem('idBuilding');
        const vselected_bimFileId = data[0].modelId.bimFileId;
        const vselected_dbIds = data[0].dbIds;
        for (const group of this.data) {
          let rooms = group.children;
          if (!rooms) continue;
          //console.log('viewer_selected_items : ', viewer_selected_items);
          rooms = rooms.map((el) => {
            return { ...el, buildingId };
          });
          // console.log('rooms : ', rooms);
          const viewer_info_rooms =
            await ViewerManager.getInstance().getViewerInfo(rooms);
          for (const viewer_info_room of viewer_info_rooms) {
            for (const viewer_info_room_data of viewer_info_room.data) {
              const room_bimFileId = viewer_info_room_data.bimFileId;
              const room_dbIds = viewer_info_room_data.dbIds;
              if (
                room_bimFileId === vselected_bimFileId &&
                room_dbIds.includes(vselected_dbIds[0])
              ) {
                const matching_room = rooms.find(
                  (el) => el.dynamicId === viewer_info_room.dynamicId
                );
                // console.log('matching_room : ', matching_room);

                this.selectedItem = matching_room;
                this.$store.commit(
                  MutationTypes.SET_ITEM_SELECTED,
                  matching_room
                );
                await this.$store.dispatch(ActionTypes.SELECT_SPRITES, [
                  matching_room.dynamicId,
                ]);
              }
            }
            // console.log('viewer_info_room : ', viewer_info_room);
            // console.log('vselected_bimFileId : ', vselected_bimFileId);
            // console.log('vselected_dbIds : ', vselected_dbIds);
          }
        }
      }
    });

    this.sourceSelectedName = this.config.source[0].name;
    const source = this.config.source.find(
      (el) => el.name === this.sourceSelectedName
    );
    if (source) {
      this.$store.commit(MutationTypes.SET_SOURCE, source);
    }
    await this.retriveData();
  }

  get navigable() {
    return ![ITemporality.currentValue, ITemporality.custom].includes(
      this.selectedTime.name
    );
  }

  // date à afficher dans le header (navigation temporelle)
  get displayDate() {
    const currentDay = moment();
    let end;
    switch (this.selectedTime.name) {
      case ITemporality.custom:
        return `${moment(this.selectedTime.range.begin).format(
          'DD/MM/YYYY HH:mm'
        )} - ${moment(this.selectedTime.range.end).format('DD/MM/YYYY HH:mm')}`;
      case ITemporality.hour:
        if (!this.t_index) return 'Dernière heure';
        currentDay.add(this.t_index, 'hours');
        end = moment(currentDay).add(1, 'hours');
        return (
          currentDay.format('DD/MM/YY HH[h]') + ' - ' + end.format('HH[h]')
        );
      case ITemporality.day:
        if (!this.t_index) return "Aujourd'hui";
        currentDay.add(this.t_index, 'days');
        return currentDay.format('DD/MM/YYYY');
      case ITemporality.week:
        if (!this.t_index) return 'Cette semaine';
        currentDay.add(this.t_index, 'week');
        end = moment(currentDay).endOf('week');
        return `${moment(end).add(-6, 'days').format('DD MMMM')} - ${end.format(
          'DD MMMM'
        )}`;
      case ITemporality.month:
        if (!this.t_index) return 'Ce mois';
        currentDay.add(this.t_index, 'months');
        return currentDay.format('MMMM YYYY');
      case ITemporality.year:
        if (!this.t_index) return 'Cette année';
        currentDay.add(this.t_index, 'years');
        return currentDay.format('YYYY');
      default:
        return '';
    }
  }

  // chartView(val) {
  //   this.chartViewDisplay = val;
  //   this.$emit("chartView", { display: val, source: this.sourceSelectedName });
  // }
  resize() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  getFirstSource() {
    return Array.isArray(this.config.source)
      ? this.config.source[0]
      : this.config.source;
  }

  getFirstRegroupement() {
    return Array.isArray(this.config.regroupement)
      ? this.config.regroupement[0]
      : this.config.regroupement;
  }

  async retriveData() {
    try {
      this.pageSate = PAGE_STATES.loading;
      const buildingId = localStorage.getItem('idBuilding');
      const promises = [
        this.$store.dispatch(ActionTypes.GET_GROUPS_ITEMS, {
          config: this.config,
          buildingId,
          forceUpdate: true,
        }),
      ];
      if (!['rooms', 'equipments'].includes(this.regroupementSelected as any)) {
        promises.push(
          this.$store.dispatch(ActionTypes.GET_CATEGORIES_TREE, {
            buildingId,
            forceUpdate: true,
            context: (this.regroupementSelected as any).context,
          })
        );
      }

      await Promise.all(promises);
      this.pageSate = PAGE_STATES.loaded;
    } catch (err) {
      console.error(err);
      this.retry = this.retriveData;
      this.pageSate = PAGE_STATES.error;
    }
  }

  async regroupItemsAndCalculate(forceUpdate: boolean = false) {
    try {
      const config_copy = {
        ...this.config,
        regroupement: this.regroupementSelected,
        source: this.sourceSelected,
      };

      const playload = {
        config: config_copy,
        item: this.selectedZone,
        forceUpdate,
      };

      this.pageSate = PAGE_STATES.loading;
      const regrouped = await this.$store.dispatch(
        ActionTypes.REGROUP_ITEMS,
        playload
      );
      const calculated = await calculItemsValue(
        regrouped,
        this.calculMode,
        this.time,
        this.legend.min.value,
        this.legend.max.value
      );
      this.$store.commit(MutationTypes.SET_DATA, calculated);
      this.pageSate = PAGE_STATES.loaded;
      this.reload_countdown = 0;
    } catch (error) {
      console.error(error);
      this.retry = this.regroupItemsAndCalculateDebounced;
      this.pageSate = PAGE_STATES.error;
    }
  }

  updateSelected(item) {
    //console.log('----> selected item : ', item);
    // item.detail is the item clicked in the viewer (sprite), item is the item clicked in the data view
    this.selectedItem = item.detail || item;
  }

  // MAJ des données en fonction de la temporalité de la navigation temporelle
  async updateDataOnTimeChanged() {
    this.selectedItem = null;
    const end = moment().minutes(59).seconds(59);
    switch (this.selectedTime.name) {
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
    await this.regroupItemsAndCalculate(true);
    await this.updateSprites();
  }

  async updateSprites() {
    const buildingId = localStorage.getItem('idBuilding');

    // Récuperation des zones à afficher dans le viewer + données utiles
    const itemsToColor = this.data.flatMap((el) => el.children || []);
    itemsToColor.forEach((el) => {
      el.unit = this.sourceSelected.unit;
      el.navIndex = this.t_index;
    });
    if (this.sprites) {
      await this.$store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);

      await this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
        items: itemsToColor,
        buildingId,
        component: SpriteComponent,
      });

      // si on affiche les sprites, on enlève la heatmap
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor.map((el) => ({ ...el, color: null })),
        buildingId,
      });
      if (!this.selectedItem) return;
      // envoi de l'evenement de click sur le sprite selectionné
      const emitterHandler = EmitterViewerHandler.getInstance();
      emitterHandler.emit(VIEWER_SPRITE_CLICK, { node: this.selectedItem });

      // selection des items dans le viewer (regroupement pas complet)
      const selectedIds = this.selectedItem.children?.map(
        (el) => el.dynamicId
      ) || [this.selectedItem.dynamicId];
      setTimeout(() => {
        this.$store.dispatch(ActionTypes.SELECT_SPRITES, selectedIds);
      }, 500);
    } else {
      // coloration des espaces si on n'affiche pas les sprites
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId,
      });
    }
  }

  updateSpritesModel(event) {
    this.sprites = event.target.checked;
  }
  // affichage du diagramme sans les sprites
  updateChartSprite() {
    if (!this.sprites) this.$store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);
    if (
      !this.selectedItem ||
      this.sprites ||
      this.selectedTime.name === ITemporality.currentValue
    )
      return;
    this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
      items: [{ ...this.selectedItem, navIndex: this.t_index }],
      buildingId: localStorage.getItem('idBuilding'),
      component: ChartSpriteComponent,
    });
  }

  clearSelection() {
    this.selectedItem = null;
    this.$store.commit(MutationTypes.SET_ITEM_SELECTED, null);
    this.$store.dispatch(ActionTypes.SELECT_SPRITES, []);
    //this.$store.dispatch(ActionTypes.SELECT_ITEMS,[]); // select the item(s) in the viewer
  }
  // selection d'un element dans la vue de données au click
  selectDataView(item) {
    console.log('selectDataView :', item);
    this.updateSelected(item);
    this.$store.commit(MutationTypes.SET_ITEM_SELECTED, item);

    // select the sprites (highlight) , opens the charts only if item is singular
    if (item.children) {
      const multipleSelection = item.children.map((el) => el.dynamicId);
      this.$store.dispatch(ActionTypes.SELECT_SPRITES, multipleSelection);
    } else {
      this.$store.dispatch(ActionTypes.SELECT_SPRITES, [item.dynamicId]);
    }
    this.ignoreViewerSelection = true;
    this.$store.dispatch(ActionTypes.SELECT_ITEMS, item.children || item); // select the item(s) in the viewer
    setTimeout(() => {
      this.ignoreViewerSelection = false;
    }, 500);

    //this.$emit('clickOnDataView', item);
    // if(item.children) {
    //   const multipleSelection = item.children.map((el) => el.dynamicId);
    //   this.$store.dispatch(ActionTypes.SELECT_SPRITES, multipleSelection);
    // }
  }

  /**
   * Watchers
   */

  @Watch('pageSate')
  watchPageState(state) {
    if (state === PAGE_STATES.error) {
      clearInterval(this.intervalId);
      this.reload_countdown = 0;
    }
  }

  // watch sprites
  @Watch('sprites')
  watchSprites() {
    this.updateSprites();
    this.updateChartSprite();
  }

  @Watch('selectedZone')
  watchSelectedZone() {
    if (this.selectedZone.type === 'building') {
      this.isBuildingSelected = true;
      this.$store.commit(MutationTypes.SET_DATA, []);
      this.reload = function () {};
      return;
    }
    this.initiated = false;
    this.isBuildingSelected = false;
    this.reload = this.updateDataOnTimeChanged;
    if (this.selectedTime.name === ITemporality.currentValue) {
      // rafraichissement automatique
      this.intervalId = setInterval(() => {
        this.reload_countdown += 1 / 6;
      }, 100);
    } else {
      clearInterval(this.intervalId);
    }

    this.updateDataOnTimeChanged();
  }

  // watch selectedItem
  @Watch('selectedItem')
  watchSelectedItem() {
    this.updateChartSprite();
  }

  @Watch('reload_countdown')
  watchReloadCountdown() {
    if (this.reload_countdown > 100) this.reload();
  }

  @Watch('calculMode')
  async watchCaculMode(mode) {
    this.percent = mode === calculTypes.MoyennePercent;
    if (this.isBuildingSelected) return;

    const calculated = await calculItemsValue(
      this.data,
      this.calculMode,
      this.time,
      this.legend.min.value,
      this.legend.max.value
    );

    this.$store.commit(MutationTypes.SET_DATA, calculated);

    await this.updateSprites();
  }

  @Watch('data')
  watchData() {
    if (this.isBuildingSelected) return;

    const values = this.data.map((el) => el.displayValue);
    this.total = calculateTotal(values, this.calculMode);

    if (!this.initiated) {
      this.updateSprites();
      this.initiated = true;
    }
  }

  @Watch('sourceSelectedName')
  async watchSource(newVal) {
    if (!newVal) return;
    this.legend = this.config.source.find((el) => el.name === newVal).legend;

    if (this.isBuildingSelected) return;

    await this.regroupItemsAndCalculate(true);
    await this.updateSprites();
    this.updateChartSprite();
  }

  @Watch('regroupementSelected')
  watchRegroupement() {
    if (this.isBuildingSelected) return;
    this.regroupItemsAndCalculateDebounced();
    this.updateChartSprite();
  }

  @Watch('selectedTime')
  async watchSelectedTime(newVal) {
    if (this.isBuildingSelected) return;
    if (!this.t_index) await this.updateDataOnTimeChanged();
    // remise de la navigation temporelle à 0 au changement de temporalité
    else this.t_index = 0;
    if (newVal.name === ITemporality.currentValue) {
      this.intervalId = setInterval(() => {
        this.reload_countdown += 1 / 6;
      }, 100);
    } else {
      clearInterval(this.intervalId);
    }
    this.updateChartSprite();
  }

  @Watch('t_index')
  async watchTIndex() {
    this.$store.commit(MutationTypes.SET_T_INDEX, this.t_index);
    if (this.isBuildingSelected) return;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(async () => {
      await this.updateDataOnTimeChanged();
      this.updateChartSprite();
      this.updateChartData();
    }, 500);
  }

  @Watch('legend')
  async watchLegend() {
    if (this.isBuildingSelected) return;
    await this.updateSprites();
  }

  @Watch('selectedChartItems', { deep: true })
  async watchSelectedChartItems(select) {
    this.updateChartData();
  }

  /**
   * Getters
   *
   * Récupération des données de configuration
   */

  public get calculItems() {
    return this.config.calculs || [];
  }

  public get unit() {
    return this.sourceSelected?.unit || '';
  }

  public get toltalColor() {
    return getColor({ displayValue: this.total }, this.legend, this.percent);
  }

  public get sources(): ISource[] {
    if (this.config && this.config.source)
      return Array.isArray(this.config.source)
        ? this.config.source
        : [this.config.source];
    return [];
  }

  public get regroupements(): {
    name: string;
    value: 'floors' | 'rooms' | IRegroupement;
  }[] {
    if (this.config && this.config.regroupement) {
      const arr = Array.isArray(this.config.regroupement)
        ? this.config.regroupement
        : [this.config.regroupement];

      return arr.map((el: any) => {
        return {
          name: el.category || el.context || el,
          value: el,
        };
      });
    }
    return [];
  }
}

export { InsightApp };
export default InsightApp;
</script>
<style lang="css">
/* From Uiverse.io by elijahgummer */
.switch {
  position: relative;
  width: 90%;
  height: 30px;
  box-sizing: border-box;
  padding: 3px;
  background: #eaeef0;
  border-radius: 6px;
  margin-bottom: 3px;
}

.switch input[type='checkbox'] {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.switch input[type='checkbox'] + label {
  position: relative;
  display: block;
  left: 0;
  width: 50%;
  height: 100%;
  background: #1b1c1c;
  border-radius: 3px;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
  transition: all 0.5s ease-in-out;
}

.switch input[type='checkbox'] + label:after {
  content: '';
  display: inline-block;
  width: 0;
  height: 100%;
  vertical-align: middle;
}

.switch input[type='checkbox'] + label i {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 12px;
  margin-top: -6px;
  margin-left: -1.5px;
  background: #ffffff;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.3);
}

.switch input[type='checkbox'] + label i:before,
.switch input[type='checkbox'] + label i:after {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background: #ffffff;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.3);
}

.switch input[type='checkbox'] + label i:before {
  left: -7px;
}

.switch input[type='checkbox'] + label i:after {
  left: 7px;
}

.switch input[type='checkbox']:checked + label {
  left: 50%;
}
</style>
<style lang="scss">
@media (max-width: 500px) {
  .cardContainer {
    transform: translate(0, 50px);
  }

  .notdisplayed {
    visibility: hidden;
  }
}

.cardContainer {
  width: 100%;
  height: 100%;

  $titleDateHeight: 40px;
  $gradientContentHeight: 40px;
  $calculContentHeight: 50px;
  $selectionHeight: 60px;

  .graphDataContainer {
    display: flex;
    /* Enables flexbox layout */
    justify-content: space-between;
    /* Creates space between the two components */
    width: 100%;
    height: 100%;
  }

  .graphContainer {
    border-radius: 0px;
    width: 60%;
    height: 100%;
    display: flex;
    /* Enables flexible layout */
    padding: 10px;
  }

  .graphDataContainer .line-card {
    border-top-right-radius: 0px !important;
    /* Removes the rounding on the top-right */
  }

  .dataContainer {
    width: 40%;
    height: 100%;
    border-radius: 10px;
    padding: 10px;

    .detail_header {
      width: 100%;
      height: #{$titleDateHeight + $gradientContentHeight + $calculContentHeight +
        $selectionHeight};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px;

      .title_date {
        width: 100%;
        height: $titleDateHeight;
        display: flex;
        align-items: center;
        justify-content: space-between;

        ._title {
          max-width: 50%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-transform: uppercase;
          font-size: 0.8em;
        }
      }

      .source_regroupement_select {
        /*width: 100%;*/
        height: $selectionHeight;
        display: flex;
        align-items: center;
      }

      .gradient_content {
        width: 100%;
        height: $gradientContentHeight;

        .gradient_bar {
          width: 100%;
          height: 15px;
          border-radius: 5px;
        }

        .indicators {
          width: 100%;
          height: 15px;
          font-size: 11px;
          display: flex;
          justify-content: space-between;
        }
      }

      .calcul_content {
        width: 100%;

        .calcul {
          width: 100%;
          display: flex;

          .select {
            width: 35%;
            min-height: unset;
            margin-right: 50px;
          }

          .calculResult {
            display: flex;
            align-items: center;
            height: 10px;

            .value {
              margin-right: 1px;
              font-weight: 500;
              height: 15px;
            }

            .text {
              margin-left: 2px;
              padding: 0px;
              font-size: 15px;
              height: 15px;
            }
          }
        }

        .color {
          width: 8px;
          height: 20px;
          margin-right: 5px;
          border-radius: 3px;
        }
      }
    }

    .detail_container {
      width: 100%;
      height: calc(
        100% - #{$titleDateHeight + $gradientContentHeight +
          $calculContentHeight + $selectionHeight}
      );
      overflow: auto;
      scroll-behavior: smooth;
    }
  }

  .centered {
    width: 100%;
    height: calc(100% - 190px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .full-width {
    width: 100% !important;
  }
}

.test {
  width: 100%;
}
</style>

<style scoped lang="scss"></style>
