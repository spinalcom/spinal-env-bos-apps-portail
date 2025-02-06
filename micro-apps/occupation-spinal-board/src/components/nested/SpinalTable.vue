<template>
  <div class="main-tab"
    style="margin-top: 100px; width: 100%; max-height: 295px;min-height: 295px; font-size: 14px !important;background-color: white;border-radius: 10px !important;border-color: black !important;">
    <span C class="v-card__title card-title pa-3 text-uppercase flex-shrink-1 justify-space-between mb-6 ml-1 mt-2">État
      des position de travail</span>
    <v-progress-circular style="z-index: 99;position: absolute;left: 50%; bottom: 13%;transform: translate(-50%);"
      v-if="context.length == 1" :size="60" color="#14202c" indeterminate />
    <v-data-table style="height: 100%; background: transparent !important;" mobile-breakpoint="0"
      no-data-text="Pas de données disponibles" :headers="dynamicHeaders()" :items="filteredContexts" :items-per-page="7"
      fixed-header :footer-props="{
        'color': '#000',
        'items-per-page-text': '',
        'page-text': '',
      }">
      <template v-slot:header.floor="{ header }">
        <v-select v-model="selectedFloors" :items="floors" label="Étages" multiple chips
          @input="filterTable"></v-select>
      </template>

      <template class="d-flex justify-center" v-slot:[`item.presence`]="{ item }">


        <div style="left:50%;" class="d-flex align-center align-items-center ">
          <v-badge style="margin-top: 11px;" :color="item.presence ? 'red' : 'green'" class="mr-6 d-flex justify-center">
            <v-icon size="l" icon="mdi-vuetify"></v-icon>
          </v-badge>
          <span :class="{ 'text-success': !item.presence, 'text-danger': item.presence }">
            {{ item.presence ? 'Occupé' : 'Disponible' }}
          </span>
        </div>
      </template>

      <!-- <template class="ligne" v-slot:[`item.name`]="{ item }">
        <SmallLegend :size="14" :color="item.color" :text="item.name" /> -->
      <!-- <div class="font-table">{{item.name}}</div> -->
      <!-- <div class="ml-1" style="font-size: 9px;">
          {{ item === context[0] ? '('+reference[0]+')' : '('+reference[1]+')' }}</div> -->

      <!-- </template>
      <template v-slot:[`item.surface`]="{ item }">
        <span class="text">{{ item.area.toFixed(2) }} m²</span>
      </template>
      <template v-slot:[`item.sum`]="{ item }">
        <span class="text">{{ item.sum.toFixed(2) }} {{ unit }}</span>
      </template>
      <template v-slot:[`item.squareMeter`]="{ item }">
        <span class="text">{{ item.squareMeter.toFixed(2) }} {{ unit }}</span>
      </template> -->
      <!--<template v-slot:[`item.month`]="{ item }">
    <span class="text">{{ item.month.toFixed(2) }} L</span>
  < /template> -->
    </v-data-table>
  </div>
</template>


<script>
import SmallLegend from './SmallLegend.vue';
export default {
  components: {
    SmallLegend,
  },
  props: ['context', 'temporality', 'unit', 'label', 'reference'],
  data: () => ({
    selectedFloors: [],
    headers: [
      { text: 'Nom', value: 'name' },
      { text: 'Étage', value: 'floor', align: 'center' },
      { text: 'Service', value: 'service', align: 'center' },
      { text: 'Présence', value: 'presence', align: 'center' },
      { text: 'État', value: 'state', align: 'center' },
      { text: 'Occupation effective', value: 'occupation', align: 'center' },
      { text: 'Taux d\'occupation effective', value: 'squareOccupation', align: 'center' },
    ],
    contexts: [
      {
        "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
        "floor": 2335,
        "service": 'DET',
        "presence": true,
        "state": 'reservé',
        "occupation": true,
        "squareOccupation": 10,
      },
      {
        "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
        "floor": 2335,
        "service": 'DET',
        "presence": false,
        "state": 'libre',
        "occupation": true,
        "squareOccupation": 10,
      },
      {
        "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
        "floor": 2435,
        "Service": 'DET',
        "presence": false,
        "state": 'reservé',
        "occupation": true,
        "squareOccupation": 10,
      },
      {
        "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
        "floor": 2335,
        "Service": 'DET',
        "presence": true,
        "state": 'reservé',
        "occupation": true,
        "squareOccupation": 10,
      },
      // {
      //   "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
      //   "floor": 2335,
      //   "Service": 'DET',
      //   "presence": true,
      //   "state": 'reservé',
      //   "occupation": true,
      //   "squareOccupation": 10,
      // },
      // {
      //   "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
      //   "floor": 2335,
      //   "Service": 'DET',
      //   "presence": true,
      //   "state": 'reservé',
      //   "occupation": true,
      //   "squareOccupation": 10,
      // },
      // {
      //   "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
      //   "floor": 2335,
      //   "Service": 'DET',
      //   "presence": false,
      //   "state": 'reservé',
      //   "occupation": true,
      //   "squareOccupation": 10,
      // },
      // {
      //   "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
      //   "floor": 2335,
      //   "Service": 'DET',
      //   "presence": false,
      //   "state": 'reservé',
      //   "occupation": true,
      //   "squareOccupation": 10,
      // },
    ]
  }),
  computed: {
    filteredContexts() {
      if (this.selectedFloors.length === 0) {
        return this.contexts;
      }
      return this.contexts.filter(
        (context) => this.selectedFloors.indexOf(context.floor) !== -1
      );
    },
    floors() {
      return [...new Set(this.contexts.map((context) => context.floor))];
    },
  },
  methods: {
    dynamicHeaders() {
      return this.headers.map(header => {
        const updatedHeader = Object.assign({}, header);
        if (header.value === 'presence') {
          updatedHeader.text = 'Présence (Occupé/Disponible)';
        }
        return updatedHeader;
      });
    },
    filterTable() {
      this.$refs.dataTable.filter();
    },
  },
  mounted() {
    // this.headers[2].text = this.label;
  }
}
</script>

<style scoped>
.font-table {
  font: normal normal normal 16px/13px Charlevoix !important;
  letter-spacing: 1.1px;
  color: #14202C;
  opacity: 1;
  box-shadow: none !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.text-success {
  color: rgb(14, 165, 14);
}

.text-danger {
  color: red;
}


.card-title {
  color: #214353 !important;
  font-size: 20px !important;
}

.text-start {
  justify-content: center;
  display: flex !important;
  flex-direction: row !important;
}

.v-data-table {
  display: flex;
  flex-direction: column;
}

::v-deep .v-data-table__wrapper {
  flex-shrink: 0;
  flex-grow: 1;
  overflow-y: auto !important;
}

::v-deep th {
  height: 48px !important;
  font-size: 14px !important;
  color: #214353 !important;
}

::v-deep td {
  font-size: 14px !important;
  color: #14202C !important;
  background-color: #F4F4F4;
  border-bottom: 1px solid white !important;
  border-right: 1px solid white !important;
}

::v-deep tr:hover td {
  background-color: #f0f0f0 !important;
}

::v-deep .v-icon__svg {
  fill: #214353 !important;
}

::v-deep .v-list .v-list-item--active,
.v-list .v-list-item--active .v-icon {
  background-color: #2f5321 !important;
}

::v-deep .v-text-field.v-input--is-focused>.v-input__control>.v-input__slot:after {
  color: #214353;
}

::v-deep .v-list-item--link:before {
  background-color: #1500ff !important;
}

::v-deep .v-application .primary--text {
  color: #14202C !important;
  caret-color: #14202C !important;
  background-color: #1500ff !important;
}

::v-deep .v-data-footer__select {
  visibility: hidden;
}

.title {
  letter-spacing: 1.1px;
  color: #214353;
  opacity: 1;
  font-size: 20px !important;
}

.text {
  font-size: 14px;
  font-family: Charlevoix;
  letter-spacing: 0.7px;
  color: #214353;
  opacity: 1;
  font-size: 14px;

}



.theme--light.v-data-table .v-data-footer {
  background: #7b5151 !important;
}



::v-deep .v-data-footer {
  width: 100%;
  margin-right: 0px !important;
  background: #fff !important;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

::v-deep tr>th:first-child {
  border-top-left-radius: 10px !important;
}

::v-deep tr>th:last-child {
  border-top-right-radius: 10px !important;
}

::v-deep tr>td.text-start {
  display: flex;
  align-items: center;

}
</style>