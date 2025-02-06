<template>
  <div class="main-tab elevation-5"
    style=" background-color: rgb(255, 255, 255) !important;height: 100%;border: 1px solid rgb(219, 219, 219) ;width: 100%; font-size: 14px !important;border-radius: 10px !important;">
    <span class="v-card__title card-title pa-3 text-uppercase justify-space-between mb-6 ml-1 mt-2">{{
      title }}</span>
    <v-data-table ref="dataTable" style="height: 92%;background: rgb(255, 255, 255) !important; border-radius: 45px;"
      mobile-breakpoint="0" no-data-text="Pas de données disponibles" :headers="dynamicHeaders()"
      :items="filteredContexts" :items-per-page="numberofelement" fixed-header :footer-props="{
        'color': '#000',
        'items-per-page-text': '',
        'page-text': '',
      }">

      <!-- ajout du loader si pas de données -->
      <template v-slot:no-data>
        <v-progress-circular v-if="loading" indeterminate color="primary">
        </v-progress-circular>
        <span v-else>Pas de données disponibles</span>
      </template>

      <!-- ajout du mode select -->
      <template v-for="header in headers" v-slot:[`header.${header.value}`]="{ header }">
        <v-select @click.stop multiple v-model="selectedFloors[header.value]" :menu-props="{ offsetY: true }"
          append-icon="mdi-chevron-down" :items="selectOptions(header)" color="#14202C" item-color="#14202C"
          style="width: fit-content;min-width: 220px;font-size: 14px !important;transform: translate(-5%,10%)"
          class="ml-8 d-inline-block" :label="header.text" v-if="header.filterable">
          <template v-slot:selection="{ item, index }" />
        </v-select>
        <span v-else>{{ header.text }}</span>
      </template>

      <!-- ajout des unités et des pastilles de couleur-->
      <template v-for="header in headers" v-slot:[`item.${header.value}`]="{ item }">
        <div style=" display: flex;justify-content: center; align-items: center">
          <div v-if="header.colorBoolean" class="group-div">
            <v-badge style="position: relative; margin-right: 10px;margin-bottom: 8px;width: 50px;"
              v-if="header.colorBoolean && item[header.value] == header.editBoolean.split('/')[0]"
              :color="header.colorBoolean.split('/')[0]" overlap></v-badge>
            <v-badge style="position: relative; margin-right: 10px;margin-bottom: 8px; width: 50px;"
              v-if="header.colorBoolean && item[header.value] == header.editBoolean.split('/')[1]"
              :color="header.colorBoolean.split('/')[1]" overlap></v-badge>
            <div class="enfant">
              <div v-if="item[header.value]">{{ item[header.value] }} {{ header.unit }}</div>
            <div style="font-weight: 800;" v-else> NC </div>
            </div>
          </div>
          <div v-else>
            <div v-if="item[header.value]">{{ item[header.value] }} {{ header.unit }}</div>
            <div style="font-weight: 800;" v-else> NC </div>
          </div>
        </div>
      </template>

      <!--ajout de pagination -->
      <template v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }">
        {{ pageStart }} of {{ itemsLength }}
      </template>

    </v-data-table>
  </div>
</template>

<script>
import SmallLegend from './SmallLegend.vue';
export default {
  components: {
    SmallLegend,
  },
  props: ['context', 'temporality', 'unit', 'label', 'reference', 'title', 'tab', 'headers', 'itemperpage'],
  data: () => ({
    selectedFloors: [],
    formattedHeaders: [],
    loading: true,
    tableHeight: 1,
    numberofelement: 10,
  }),


  computed: {

    filteredContexts() {
      if (Object.keys(this.selectedFloors).length === 0) {
        return this.editContext();
      }

      return this.editContext().filter(context => {
        const contextValues = Object.values(context);
        const matchingFilters = Object.keys(this.selectedFloors).filter(filter => this.selectedFloors[filter].length > 0);

        if (matchingFilters.length === 0) {
          return true;
        }
        const isIncluded = matchingFilters.every(filter => {
          const filterValues = this.selectedFloors[filter];
          return filterValues.some(value => contextValues.includes(value));
        });
        return isIncluded;
      });
    },


  },

  mounted() {
    this.updateNumberOfElements();
    window.onresize = () => {
      this.updateNumberOfElements();
    };
  },

  methods: {

    updateNumberOfElements() {
      this.$nextTick(() => {
        const dataTable = this.$refs.dataTable;
        const height = dataTable.$el.clientHeight;
        this.numberofelement = Math.ceil((height - 69) / 58.9);
      });
    },

    // modifie les valeurs du header en rapport avec notre config (arrondi/bool)
    selectOptions(header) {
      const column = this.context.map(item => item[header.value]);
      const uniqueValues = [...new Set(column)];
      if (!header.isBoolean) {
        const roundedValues = uniqueValues.map(value => {
          if (typeof value === 'number') {
            return parseFloat(value.toFixed(2));
          } else {
            return value;
          }
        });
        return roundedValues;
      } else {
        const roundedValues = uniqueValues.map(value => {
          if (value == 0 || value === false) {
            return header.editBoolean.split('/')[1];
          } else {
            return header.editBoolean.split('/')[0];
          }
        });
        return roundedValues;
      }
    },

    dynamicHeaders() {
      return this.headers.map((header, index) => {
        const updatedHeader = { ...header };
        updatedHeader.align = 'center';
        return updatedHeader;
      });
    },

    editContext() {
      const roundedItems = this.context.map(item => {
        const newItem = { ...item };

        // Arrondir les nombres à 2
        Object.keys(newItem).forEach(key => {
          if (typeof newItem[key] === 'number') {
            newItem[key] = parseFloat(newItem[key].toFixed(2));
          }
        });

        // Modifier les valeurs booléennes avec le fichier config
        for (const header of this.headers) {
          if (newItem.hasOwnProperty(header.value) && header.isBoolean) {
            const value = newItem[header.value];
            if (value === true || value === 1) {
              newItem[header.value] = header.editBoolean.split('/')[0];
            } else if (value === false || value === 0) {
              newItem[header.value] = header.editBoolean.split('/')[1];
            }
          }
        }
        return newItem;
      });
      return roundedItems;
    }

  },
}
</script>

<style scoped>
::v-deep .v-data-table-header__icon {
  position: absolute !important;
  right: 8%;
  top: 38%;
}

::v-deep .v-data-table-header-wrapper::after {
  background-color: red;
}


::v-deep th.v-data-table-sortable:not(.v-data-table-sortable--active)::after {
  color: blue;
}

::v-deep th.v-data-table-sortable.v-data-table-sortable--active::after {
  color: green;
}

.enfant {
  margin-left: 10px;
  display: flex;
  justify-content: flex-start;
  white-space: nowrap;
  width: 100px;
}

.group-div {
  width: 60px;
  height: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

::v-deep .v-select__slot::before {
  display: none !important;
  background-color: red;
}

.no-underline .v-input__slot::before,
.no-underline .v-input__slot::after {
  border-bottom: none !important;
}

.text-success {
  color: rgb(14, 165, 14);
}

.text-danger {
  color: red;
}

::v-deep .v-label--active {
  transform: none !important;

}

::v-deep .v-label {
  font-size: 14px !important;
  color: #214353 !important;
}




::v-deep .v-select__selections {
  position: absolute !important;
}

::v-deep .v-select__slot {
  width: 80%;
  text-align: center !important;
  display: flex;
  justify-content: center;
}

::v-deep .v-select__slot label {
  width: auto;
  text-align: center !important;
  position: relative !important;
  margin-bottom: 17px;
}

::v-deep .v-input__append-inner {
  margin-left: 0px !important;
  margin-top: 3px !important;
}

::v-deep .v-select__slot input {
  position: absolute !important;
  background-color: rgba(102, 51, 153, 0.363);
}


::v-deep .v-data-table__wrapper>table>thead>tr>th {
  /* background-color: coral !important; */
  max-width: 100px !important;

}

.card-title {
  color: #214353;
  font-size: 20px;
}

::v-deep .theme--light.v-text-field>.v-input__control>.v-input__slot:before {
  border: none !important;
}

::v-deep .v-text-field.v-input--is-focused>.v-input__control>.v-input__slot:after {
  color: white !important;
}

.v-data-table {
  display: flex;
  flex-direction: column;
}

::v-deep .v-input__slot {
  display: flex !important;
  justify-content: center !important;
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

::v-deep .v-data-footer {
  /* background-color: red !important; */
  width: 100%;
  margin-right: 0px !important;
  background: #fff !important;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  align-self: flex-end;
  position: relative;
  bottom: 1px;
  height: 60px;
}

::v-deep tr>th:first-child>div {
  position: relative;
  top: 10px;
}

::v-deep tr>td.text-start {
  display: flex;
  align-items: center;
}
</style>