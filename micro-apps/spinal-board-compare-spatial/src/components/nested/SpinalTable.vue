<template>
  <div style="width: 100%; max-height: 295px;min-height: 295px; font-size: 14px !important;background-color: white;border-radius: 10px !important;">
    <v-progress-circular style="z-index: 99;position: absolute;left: 50%; bottom: 13%;transform: translate(-50%);"
    v-if="context.length == 1"
        :size="60"
        color="#14202c"
        indeterminate
        />
    <v-data-table style="height: 100%; background: transparent !important;" mobile-breakpoint="0"
      no-data-text="Pas de données disponibles" :headers="dynamicHeaders()" :items="context" :items-per-page="4"
      fixed-header :footer-props="{
        'color': '#000',
        'items-per-page-text': '',
        'page-text': '',
      }">

    
      <template class="ligne" v-slot:[`item.name`]="{ item }">
        <SmallLegend :size="14" :color="context[0].name === item.name ? '#14202C' :   item.color" :text="item.name" />
        <!-- <div class="font-table">{{item.name}}</div> -->
      </template>
      <template v-slot:[`item.surface`]="{ item }">
        <span class="text">{{ item.area.toFixed(2) }} m²</span>
      </template>
      <template v-slot:[`item.sum`]="{ item }">
        <span class="text">{{ item.sum.toFixed(2) }} {{ unit }}</span>
      </template>
      <template v-slot:[`item.squareMeter`]="{ item }">
        <span class="text">{{ item.squareMeter.toFixed(2) }} {{ unit }}</span>
      </template>
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
  props: ['context', 'temporality', 'unit', 'label','reference'],
  data: () => ({
    headers: [
      { text: 'Nom', value: 'name' },
      { text: 'Surface', value: 'surface', align: 'center' },
      { text: '', value: 'sum', align: 'center' },
      { text: 'square', value: 'squareMeter', align: 'center' },
    ],
    contexts: [
      {
        "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
        "surface": 2335,
        "today": 23.63558589467181,
        "week": 97.52454541037936,
        "month": 90.63526454349034,
      },
      {
        "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
        "surface": 2335,
        "today": 23.63558589467181,
        "week": 97.52454541037936,
        "month": 90.63526454349034,
      },
      {
        "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
        "surface": 2335,
        "today": 23.63558589467181,
        "week": 97.52454541037936,
        "month": 90.63526454349034,
      },
      {
        "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
        "surface": 2335,
        "today": 23.63558589467181,
        "week": 97.52454541037936,
        "month": 90.63526454349034,
      },
      {
        "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
        "surface": 2335,
        "today": 23.63558589467181,
        "week": 97.52454541037936,
        "month": 90.63526454349034,
      },
      {
        "name": "VE_GTIE_GTB_GTB_MULTICAPTEUR [10288746]",
        "surface": 2335,
        "today": 23.63558589467181,
        "week": 97.52454541037936,
        "month": 90.63526454349034,
      },
    ]
  }),
  methods: {
    toto(ref){
      console.log(ref);
    },
    dynamicHeaders() {
      let dynamicText = this.temporality.name.toLowerCase();
      return this.headers.map(header => {
        if (header.text == this.label) {
          header.text = header.text + ' ' + dynamicText;
        } else if (header.text == 'square') {
          header.text = this.label + ' ' + dynamicText + ' au m²';
        }
        return header;
      });
    }
  },
  mounted() {
    this.headers[2].text = this.label;
    
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
.text-start{
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

::v-deep tr>td.text-start{
  display: flex;
  align-items: center;

}


</style>