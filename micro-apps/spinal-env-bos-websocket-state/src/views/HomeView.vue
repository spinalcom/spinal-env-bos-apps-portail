<!--
Copyright 2022 SpinalCom - www.spinalcom.com

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
  <div class="div_container">
    <div class="header"> </div>

    <div v-if="page === pages.normal" class="normalState">
      <div class="stateCard" elevation="4">
        <v-card class="buildingInfo">
          <div class="icon-box">
            <v-icon size="x-large">mdi-office-building</v-icon>
          </div>

          <div class="text-box">
            <div class="title-text">Etat du websocket</div>
            <div class="subtitle-text">
              <v-icon :color="stateColor" size="x-large">{{
                buildingIcon
              }}</v-icon>
              <div :style="{color: stateColor, marginLeft: '10px'}">{{
                buildingState
              }}</div>
            </div>
          </div>
        </v-card>

        <v-card class="statistics">
          <div class="stateDiv">
            <state-component
              color="green"
              icon="mdi-account-badge"
              :count="clients.numberOfClientConnected"
              title="Client(s) connecté(s)"
              subtitle="En temps réel"
            ></state-component>
          </div>

          <div class="stateDiv">
            <state-component
              color="orange"
              icon="mdi-file-sign"
              :count="getSubscriptionCount"
              :title="'Souscription(s)'"
              :subtitle="subtitle"
            ></state-component>
          </div>

          <div class="stateDiv">
            <state-component
              color="red"
              icon="mdi-bell-alert"
              :count="getAlertCount"
              title="Alerte(s)"
              :subtitle="subtitle"
            ></state-component>
          </div>
        </v-card>
      </div>

      <v-card class="tableCard" elevation="4">
        <div class="tableheader">
          <div
            class="_title text-caption charlevoix"
            v-text="'Liste des evenements'"
          ></div>

          <div class="filters">
            <div class="selectFilters">
              <v-select
                dense
                v-model="date"
                :items="dates"
                label="Filtrer par date"
                item-text="title"
                outlined
                hide-details
              ></v-select>
            </div>

            <div class="checkboxFilters">
              <div class="_title">Filtrer par type : </div>
              <div class="checkboxes">
                <v-checkbox
                  v-model="filterByType"
                  class="check"
                  dense
                  label="Alerte"
                  color="red"
                  value="alert"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  v-model="filterByType"
                  class="check"
                  dense
                  label="Souscription"
                  color="orange"
                  value="receive"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  v-model="filterByType"
                  class="check"
                  dense
                  label="Envoi de données"
                  color="green"
                  value="send"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  v-model="filterByType"
                  class="check"
                  dense
                  label="Connexion"
                  color="#43A047"
                  value="connected"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  v-model="filterByType"
                  class="check"
                  dense
                  label="Deconnexion"
                  color="#E53935"
                  value="disconnected"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  v-model="filterByType"
                  class="check"
                  dense
                  label="Redemarrage"
                  color="green"
                  value="restart"
                  hide-details
                ></v-checkbox>
              </div>
            </div>
          </div>
        </div>

        <div class="tableContent">
          <v-data-table
            sort-by="date"
            :sort-desc="true"
            style="background: transparent"
            :loading="loadingTableData"
            loadingText="Chargement... veuillez patienter"
            no-data-text="Aucune donnée à afficher"
            :height="tableHeight"
            fixed-header
            :headers="headers"
            :items="tableData"
            :items-per-page="15"
            :footer-props="{
              prevIcon: 'mdi-menu-left',
              nextIcon: 'mdi-menu-right',
              itemsPerPageText: '',
              showCurrentPage: true,
              itemsPerPageOptions: [5, 10, 15, -1],
              pageText: '',
            }"
          >
            <template v-slot:item="{item}">
              <tr class="tableRow">
                <td>{{ item.date | date }}</td>
                <td>{{ getAction(item) | action }}</td>
                <td>{{ getTargetName(item) | target }}</td>
                <td>{{ getNodeName(item) | nodeName }}</td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card>
      <!--
        <v-card class="stateCard" elevation="4">
          <div class="_circle offline"></div>
          <div class="message"><span>Hors ligne :</span></div>
          <div class="count offline">{{ nbHorsligne }}</div>
        </v-card>
      </div>

      <div class="content">

        <v-tabs vertical class="tabsContainer">
          <v-tab v-for="item of webSocketLogs" :key="item.building.id">

            <div class="_circle" left :class="getLogType(item)"></div>
            {{ item.building.name }}
          </v-tab>

          <v-tab-item v-for="item of webSocketLogs" :key="item.id">
            <TableComponent :logs="item.logs" />
          </v-tab-item>
        </v-tabs>


      </div> -->
    </div>

    <div
      class="loading"
      v-else-if="page === pages.loading || page === pages.error"
    >
      <v-progress-circular
        v-if="page === pages.loading"
        :size="70"
        color="primary"
        indeterminate
      ></v-progress-circular>

      <v-icon>mdi-error</v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TableComponent from '../components/tableComponent.vue';
import {mapActions, mapState} from 'vuex';
import {logTypes} from '../store/constants';
import StateComponent from '../components/stateComponent.vue';
import {correspondance_actions} from '../store/websocket_constants';
import moment from 'moment';

moment.locale('fr');

export default Vue.extend({
  name: 'HomeComponent',
  components: {
    TableComponent,
    StateComponent,
  },
  data() {
    this.pages = Object.freeze({
      normal: 1,
      loading: 2,
    });
    this.dates = [
      {title: "Aujourd'hui", value: 0, key: 'toDay'},
      {title: 'Hier', value: 1, key: 'yesterday'},
      {title: '7 derniers jours', value: 2, key: 'week'},
      {title: 'Une année', value: 3, key: 'year'},
      // {title: 'Personnaliser', value: 4},
    ];
    // windowInnerHeight - (headerHeight + stateHeight + filterHeight + tableHeader + (tableFooter - padding))
    this.otherSize = 80 + 120 + 100 + 48 + 40;
    return {
      intervalId: undefined,
      loadingTableData: true,
      page: this.pages.normal,
      filterByType: [
        'send',
        'receive',
        'alert',
        'connected',
        'disconnected',
        'restart',
      ],
      date: undefined,
      tableData: [],

      tableHeight: window.innerHeight - this.otherSize,
      headers: [
        {text: 'Date', sortable: true, value: 'date'},
        {text: 'Action', sortable: true, value: 'action'},
        {text: "Nom de l'application", sortable: true, value: 'targetName'},
        {text: 'Nom du noeud', sortable: true, value: 'nodeName'},
      ],
      subtitle: '',
    };
  },

  created() {
    window.addEventListener('resize', this.resizeWindow);
  },

  async mounted() {
    this.page = this.pages.loading;

    await this.initialize();
    this.date = this.dates[0].value;
    this.page = this.pages.normal;
    // console.log(this.webSocketLogs);
  },

  methods: {
    ...mapActions([
      'readCurrentYearLogs',
      'getWebsocketState',
      'getWebsocketClientCount',
    ]),

    async initialize() {
      this.loadingTableData = true;

      const promises = [
        this.readCurrentYearLogs(),
        this.createPoolingRequest(),
      ];

      return Promise.all(promises).then((result) => {
        this.loadingTableData = false;
      });
    },

    selectBuilding(data) {
      console.log(data);
    },

    async pooling() {
      await Promise.all([
        this.getWebsocketState(),
        this.getWebsocketClientCount(),
      ]);
    },

    async createPoolingRequest() {
      await this.pooling();
      this.intervalId = setInterval(async () => {
        await this.pooling();
      }, 50000);
    },

    getIcon(item) {
      return item.state === logTypes.Normal
        ? 'mdi-check'
        : 'mdi-alert-circle-outline';
    },

    getLogType(item) {
      // return item.state === logTypes.Normal ? "green" : "#ff5252";
      return {
        online: item.state === logTypes.Normal,
        offline: item.state !== logTypes.Normal,
      };
    },

    resizeWindow() {
      this.tableHeight = window.innerHeight - this.otherSize;
    },

    filterLogs() {
      const key = this.dates[this.date]?.key;
      const logs = Object.assign([], this.webSocketLogs[key] || []);
      console.log(key, logs);
      this.tableData = logs.filter((log) => {
        const type = log.value?.type;
        return this.filterByType.indexOf(type) !== -1;
      });

      console.log(this.tableData);
    },

    getAction(log) {
      return log?.value?.action;
    },
    getTargetName(log) {
      return log?.value?.targetInfo?.name;
    },
    getNodeName(log) {
      return log?.value?.nodeInfo?.info?.name;
    },
  },
  computed: {
    ...mapState(['webSocketLogs', 'websocketState', 'clients']),

    isMobile() {
      const breakpoint = this.$vuetify.breakpoint.name;
      if (['xs', 'sm'].indexOf(breakpoint) !== -1) return true;
      return false;
    },

    getSubscriptionCount() {
      const key = this.dates[this.date]?.key;
      const logs = Object.assign([], this.webSocketLogs[key] || []);

      return logs.reduce((count: number, log) => {
        if (log.value?.type === 'receive') count++;
        return count;
      }, 0);
    },

    getAlertCount() {
      const key = this.dates[this.date]?.key;
      const logs = Object.assign([], this.webSocketLogs[key] || []);

      return logs.reduce((count: number, log) => {
        if (log.value?.type === 'alert') count++;
        return count;
      }, 0);
    },

    stateColor() {
      switch (this.websocketState.state) {
        case 'alert':
          return 'red';
        case 'running':
          return 'green';
        default:
          return 'orange';
      }
    },
    buildingIcon() {
      switch (this.websocketState.state) {
        case 'alert':
          return 'mdi-bell-alert';
        case 'running':
          return 'mdi-circle';
        default:
          return 'mdi-help';
      }
    },
    buildingState() {
      const since = this.websocketState.since;
      switch (this.websocketState.state) {
        case 'alert':
          return 'En alerte';
        case 'running':
          return 'En ligne';
        default:
          return 'Inconnu';
      }
    },
  },
  watch: {
    webSocketLogs() {
      this.filterLogs();
    },

    filterByType() {
      this.filterLogs();
    },

    date() {
      this.subtitle = this.dates[this.date].title;
      this.filterLogs();
    },
  },
  filters: {
    date(value) {
      return moment(value).format('llll');
    },
    action(value) {
      const a = correspondance_actions[value];
      return a || value || '-';
    },

    target(value) {
      return value || '-';
    },
    nodeName(value) {
      return value || '-';
    },
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
});
</script>

<style lang="scss">
.div_container {
  width: 100vw;
  height: 100vh;

  .header {
    width: 100%;
    height: 70px;
    margin-bottom: 10px;
  }

  .normalState {
    width: calc(100% - 40px);
    height: calc(100% - 90px);
    background: transparent !important;
    margin: 10px;

    .stateCard {
      width: 100%;
      height: 100px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;

      .buildingInfo {
        width: 25%;
        background: transparent !important;
        display: flex;
        align-items: center;
        .icon-box {
          height: 30px;
          width: 30px;
          margin: 0 10px 0 10px;
          // background-color: #555;
          border-radius: 6px;
        }

        .text-box {
          width: 100%;
          display: flex;
          flex-flow: column;
          .title-text {
            letter-spacing: 2px;
            font-size: 1.3em;
            width: calc(100% - 80px);
            max-width: calc(100% - 80px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .subtitle-text {
            letter-spacing: 2px;
            white-space: nowrap;
            font-size: 16px;
            display: flex;
            align-items: center;
          }
        }
      }

      .statistics {
        width: calc(75% - 10px);
        display: flex;
        background: transparent !important;
      }

      .statistics {
        height: 100%;
        justify-content: space-around;
        .stateDiv {
          height: 100%;
        }
      }
    }

    .tableCard {
      height: calc(100% - 120px);
      background: transparent !important;
      padding: 10px;

      .tableheader {
        width: 100%;
        height: 100px;

        ._title {
          height: 30px;
        }

        .filters {
          height: calc(100% - 40px);
          margin: 5px 0px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .selectFilters {
            width: 30%;
            height: 100%;
            display: flex;
            align-items: center;
          }

          .checkboxFilters {
            width: 70%;
            height: 100%;
            display: flex;

            ._title {
              width: 30%;
              height: 100%;
              padding-right: 20px;
              display: flex;
              justify-content: flex-end;
              align-items: center;
            }

            .checkboxes {
              width: 70%;
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              .check {
                margin-right: 20px;
              }
            }
          }
        }
      }

      .tableContent {
        width: 100%;
        height: calc(100% - 100px);

        th {
          background: transparent;
          vertical-align: middle;
        }

        tr.tableRow {
          height: 50px;
          border: 1px solid #e3e7e8;
          background: #ffffff 0% 0% no-repeat padding-box;

          td {
            font-family: charl;
            vertical-align: middle;
          }
        }
      }
    }

    // .header {
    //   width: 100%;
    //   height: 130px;
    //   margin-bottom: 20px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: flex-end;
    //   .stateCard {
    //     width: 25%;
    //     height: 80%;
    //     margin-right: 15px;
    //     background: transparent;
    //     display: flex;
    //     align-items: center;
    //     padding: 0 30px;
    //   }

    //   .count {
    //     font-size: 3em;
    //   }

    //   .count.online {
    //     color: green !important;
    //   }
    //   .count.offline {
    //     color: #ff5252 !important;
    //   }
    //   .message {
    //     // height: 100%;
    //     margin: 0 15px;
    //     font-size: 25px;
    //   }
    // }

    // .content {
    //   width: 100%;
    //   height: calc(100% - 150px);
    //   display: flex;
    //   flex-direction: column;
    //   justify-content: space-between;
    //   align-items: center;
    //   padding: 5px;

    //   .tabsContainer {
    //     background: transparent !important;
    //   }

    //   .tabsContainer {
    //     .v-tabs-bar,
    //     .v-tabs-items {
    //       height: 100%;
    //       background: transparent !important;
    //       overflow: auto;
    //     }

    //     .v-tabs-items {
    //       width: calc(100% - 160px);
    //     }

    //     .v-tabs-bar {
    //       width: 160px;
    //       border-right: 1px dashed grey;
    //     }
    //   }

    //   .state {
    //     width: 100%;
    //     height: 20%;
    //     text-align: center;
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //   }

    //   .logs {
    //     width: 100%;
    //     max-height: calc(80% - 60px);
    //     padding: 10px;
    //     overflow: auto;

    //     .date {
    //       text-align: right;
    //     }
    //   }
    // }
  }

  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
