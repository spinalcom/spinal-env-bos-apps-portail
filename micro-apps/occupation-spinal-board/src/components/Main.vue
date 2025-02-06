<template>
  <v-app>
  <div class="RC" style="min-height: 480px">

    <div v-if="config.config.enableWebSocket == false" class="refresh-div" @click="refresh">
      <v-icon class="v-icon-refresh"
        style="transition : 0.5s;width: 100%; height: 100%; color: rgb(190, 190, 190);">mdi-refresh</v-icon>
    </div>

    <sc-download-button style="position: absolute; top: 14px;left: 46%;" :file-name="'Occupation'"
      :data="roundedContext()"></sc-download-button>
    <div class="MC">
      <capacityTable v-if="config.config.enableCapacityTab == true" :headers="config.config.headers" :tab="tab"></capacityTable>
      <SpinalTabletest :title="config.config.title" :headers="config.config.headers" :id="0" :label="config.config.label"
        :reference="config.config.buildingApiUrl === ''" :unit="config.config.unit" :context="tab"
        :temporality="temporality" :itemperpage="config.config.itemPerTable" />
    </div>
  </div>
</v-app>
</template>

<script>
import Vue from 'vue';
import { ref } from 'vue';
import { tab } from "../services/index.js";
import SpinalTabletest from "./nested/SpinalTableTest.vue";
import capacityTable from "./nested/CapacityTable.vue";
import config from "../config.js"
import { gettabdata } from "../services/index.js"
export default {
  name: '',
  props: ['temporality'],
  components: {
    SpinalTabletest,
    capacityTable
  },
  data: () => ({
    id_batiment: '',
    config: config,
    tab: [],
    item: [],
  }),
  created() {
    Vue.set(this.$data, 'tab', tab);
  },
  async mounted() {
    this.id_batiment = localStorage.getItem("idBuilding");
  },

  methods: {
    refresh() {
      window.location.reload();
    },
    roundedContext() {
      if (!config || !config.config || !config.config.headers) {
        throw new Error('Headers are undefined');
      }
      const unitDict = config.config.headers.reduce((dict, header) => {
        if (header.unit) {
          dict[header.value] = header.unit;
        }
        return dict;
      }, {});

      return this.tab.map(item => {
        if (!item) {
          throw new Error('Item is undefined');
        }

        const newItem = {};
        Object.keys(item).forEach(key => {
          if (key === 'dynamicId') {
            return;
          }
          let newKey = key;
          if (typeof item[key] === 'number' && unitDict[key]) {
            newKey = `${key} (${unitDict[key]})`;
            newItem[newKey] = item[key].toFixed(2);
          } else {
            newItem[newKey] = item[key];
          }
        });

        return newItem;
      });
    },
  },
  watch: {

  }
}
</script>

<style scoped>
.refresh-div {
  position: absolute;
  left: 42.5%;
  top: 1.4%;
  width: 52px;
  height: 52px;
  background-color: rgb(28, 35, 46);
  border-radius: 10px;
  cursor: pointer;
}

.refresh-div:hover .v-icon-refresh {
  color: rgb(255, 255, 255) !important;
}

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

.MC {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  border-radius: 10px;
  width: 100%;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  overflow-y: hidden;
}

.BR {
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
