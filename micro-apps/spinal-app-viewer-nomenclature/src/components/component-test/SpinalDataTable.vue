<template>
  <v-data-table id="my-data-table" ref="table" @click="" class="fixed-first-column"
    style="box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;overflow: auto;max-height: 75vh; background: transparent !important;overflow: hidden;"
    mobile-breakpoint="0" no-data-text="Pas de données disponibles" :headers="headers" :items="items"
    :items-per-page="8000" :height="height" fixed-header>

    <template v-for="header in headers" v-slot:[`header.${header.value}`]="{ header }">
      <div @click="headershow(header)" :class="{ 'selected-class': selected_header === header.text }"
        style="display: flex;flex-direction: row;justify-content: space-between; align-items: center ; height: 40px;">
        <div style="width: 35px; overflow: hidden;  transform: translate(-10px,-3px); ">
          <v-select v-model="selections[header.text]" :menu-props="{ offsetY: true }" :label="' '" multiple
            append-icon="mdi-chevron-down" color="#14202C" item-color="#14202C" class=" d-inline-block"
            style="width:20px;min-width: 20px;font-size: 14px !important;transform: translate(-5%,10%) ;"
            v-if="header.filterable" :items="getUniqueColumnValues(filteredContexts, header.text)">
            >
            <template v-slot:selection="{ item, index }">
              <div v-if="index == 0"
                style="position: absolute;background-color: #14202c;color: white;border-radius: 10px;width: 14px;height: 14px;font-size: 11px;display: flex;justify-content: center;align-items: center;transform: translate(20px,-8px);">
                {{ selections[header.text].length }} </div>
            </template>
          </v-select>
        </div>
        <span title="Cliquez pour afficher les éléments dans la 3D" id="headerName">{{ header.text }}</span>
        <div  title="Cliquez pour ordonner" style=" width: 30px;display: flex;justify-content: center;align-items: center;">
          <v-icon  v-if="arrow == header.text" @click="sort(header)" color="black">mdi-arrow-up-thin</v-icon>
          <v-icon v-if="arrow != header.text" @click="sort(header)" color="black">mdi-arrow-down-thin</v-icon>
        </div>
        <div
          style="border-right: 2px solid #d9d9d9;height: 100%;background-color: white;position: absolute;transform: translate(-16px);">
        </div>
      </div>
    </template>

    <template v-slot:item="{ item }">
      <tr @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" :ref="`row-${item.dynamicId}`"
        @click="selectDataView(item)">
        <td :class="selected_id == item.dynamicId ? 'colortd' : ''">{{ item.name }}</td>
        <td style="white-space: nowrap;" :class="selected_id == item.dynamicId ? 'colortd' : ''"
          v-for="(header, index) in headers" :key="`td-${index}-${item.id}`" v-if="header.value !== 'name'">
          <template v-if="isUrl(getAttributeValue(item, header.value))">
            <a :href="getAttributeValue(item, header.value)" target="_blank">
              {{ getAttributeValue(item, header.value) }}
            </a>
          </template>
          <template v-else>
            {{ getAttributeValue(item, header.value) }}
          </template>
        </td>
      </tr>
    </template>

  </v-data-table>
</template>

<script>
import { watch } from 'fs';

export default {
  props: ['items', 'headers', 'noDataText', 'itemsPerPage', 'tableHeight', 'shadow', 'selections', 'contexts', 'height', 'selectedItemTab'],

  data() {
    return {
      selected_id: null,
      selected_header: null,
      arrow: false
    };
  },
  computed: {
    filteredContexts() {
      if (this.contexts) {
        return this.contexts[0]?.data;
      }
    },
    computedStyle() {
      return {
        boxShadow: this.shadow ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" : "",
        marginTop: "65px",
        overflow: "auto",
        maxHeight: "75vh",
        background: "transparent",
        overflowX: "hidden",

      };
    }
  },
  methods: {

    isUrl(value) {
      // Vérifie si la chaîne commence par http ou https
      return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
    },

    selectDataView(item) {
      this.selected_id = item.dynamicId
      this.$emit('item-selected', item);
    },
    handleTableClick() {
      this.$emit('table-click');
    },
    selectItem(item) {
      this.$emit('item-selected', item);
    },
    headershow(header) {
      this.selected_header = header.text
    },

    sort(header) {
      if (this.arrow != header.text) {
        this.arrow = header.text;
      }
      else {
        this.arrow = null
      }
      this.$emit('filter', header);
    },
    filterColumn(header) {
      // console.log('sort');
      // this.$emit('filter-column', header);
    },
    getUniqueColumnValues(context, columnName) {
      const [attributeName, categoryName] = columnName.split('/');
      const uniqueValues = new Set();
      let attributeNotFound = false;
      context.forEach(item => {
        let foundInItem = false;
        item.categoryAttributes.forEach(category => {
          if (category.name === categoryName) {
            category.attributs.forEach(attribute => {
              if (attribute.label === attributeName) {
                uniqueValues.add(attribute.value);
                foundInItem = true;
              }
            });
          }
        });

        if (!foundInItem) {
          attributeNotFound = true;
        }
      });

      if (attributeNotFound) {
        uniqueValues.add("<empty>");
      }
      return uniqueValues.size >= 10 ? [] : [...uniqueValues];
    },
    getAttributeValue(item, attrLabel) {
      if (Array.isArray(item.categoryAttributes)) {
        for (const category of item.categoryAttributes) {
          const attribute = category.attributs.find(a => a.label === attrLabel);
          if (attribute) {
            return attribute.value;
          }
        }
      } else {
        return item[attrLabel];
      }
      return '';
    },
    handleMouseEnter(event) {
      const children = event.target.querySelectorAll('.colortd');
      children.forEach(child => {
        child.classList.add('custom-hover-color');
      });
    },
    handleMouseLeave(event) {
      const children = event.target.querySelectorAll('.colortd');
      children.forEach(child => {
        child.classList.remove('custom-hover-color');
      });
    },




  },
  watch: {
    selectedItemTab(newVal, oldVal) {
      this.selected_id = newVal
      if (this.$refs[`row-${newVal}`]) {
        this.$refs[`row-${newVal}`].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
  }
}
</script>

<style scoped>
::v-deep .v-text-field.v-input--is-focused>.v-input__control>.v-input__slot:after {
  color: rgba(255, 255, 255, 0) !important;
}

.selected-class {
  background-color: rgba(215, 240, 250, 0.644);
  border-radius: 2px;
  margin-left: -10px;
  padding-left: 10px;
  margin-right: -8px;
  /* padding-left: 10px; */
}

::v-deep .theme--light.v-text-field>.v-input__control>.v-input__slot:before {
  border-color: rgba(255, 255, 255, 0) !important;
}

.red-background {
  background-color: rgb(255, 255, 255) !important;
  color: #14202c !important;
  border: 1px solid #14202c !important;
}

::v-deep .theme--light.menuable__content__active {
  background-color: red !important;
  z-index: 99999999 !important;
}

::v-deep .v-chip {
  height: 22px !important;
  margin: 3px !important;
  transform: translate(0, -10%);
  overflow: visible;
}

::v-deep .v-breadcrumbs__divider {
  background-color: red !important;
}

::v-deep .v-data-table__wrapper>table>thead>tr>th:nth-child(1) {
  position: sticky;
  left: 0;
  z-index: 9;
}

.blur-background {
  background-color: rgba(0, 0, 0, 0.528);
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99999;
  content: '';
}

.custom-hover-color {
  background-color: rgb(142, 196, 221) !important;
}

tr .colortd.custom-hover-color {
  background-color: rgb(155, 223, 255) !important;
}

::v-deep .custom-hover-color {
  background-color: rgb(100, 206, 255) !important;
}

::v-deep .v-breadcrumbs {
  padding: 2px !important;
}

.colortd {
  background-color: rgb(201, 232, 255);
}

td {
  min-width: 250px;
}

.fixed-first-column table {
  position: relative;
}

::v-deep .v-data-footer {
  display: none;
}

::v-deep div.v-data-table__wrapper>table>thead>tr>th>i {
  display: none;
}

.mouse {
  width: 101%;
  height: 50px;
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  border: 1px solid rgb(0, 0, 0);
  padding-left: 20px;
  font-size: 17px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.5s;
  color: rgb(47, 47, 47);
  /* padding-right: 0px; */
}

.animate {
  -webkit-animation: scale-in-ver-top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: scale-in-ver-top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@-webkit-keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}

@keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}

::v-deep .v-treeview-node__children {
  padding-left: 20px
}

::v-deep .v-treeview-node__root {
  position: relative;
  border-radius: 5px;
  border: 0.2px solid rgb(143, 143, 143);
  max-height: 20px !important;
  overflow: hidden;
  background-color: rgb(255, 255, 255);
}

::v-deep .v-treeview-node__root:hover {
  background-color: rgb(238, 238, 238);
  border: 1px solid rgb(83, 83, 83);
}

.fixed-first-column tbody td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
}

::v-deep .v-data-table__wrapper>table>tbody>tr:nth-child(1)>td:nth-child(1) {
  position: sticky;
  left: 0;
  z-index: 1;
}

.scrollable-table-container {
  overflow-x: auto;
}

.fixed-first-column thead th:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  background-color: white;
}

.select-attr {
  -webkit-animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.line {
  position: relative;
  width: 0;
  top: 16px;
  height: 1px;
  background-color: rgb(143, 143, 143);
  animation: expandLine 0.5s forwards;
}

@keyframes expandLine {
  to {
    width: 46px;
  }
}

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

.hover-magnify:hover {
  background-color: rgb(219, 218, 218) !important;
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
  cursor: pointer;
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
  border-bottom-right-radius: 0px;
}

::v-deep tr>th:first-child {
  border-top-left-radius: 10px !important;
}

::v-deep tr>th:last-child {
  border-top-right-radius: 0px !important;
}

::v-deep tr>td.text-start {
  display: flex;
  align-items: center;

}

::v-deep .v-data-table__wrapper::-webkit-scrollbar-thumb {
  background: #e8e8e8;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 1px solid rgb(195, 195, 195);
  transition: 1s;
}

::v-deep .v-data-table__wrapper::-webkit-scrollbar {
  width: 10px;
}

::v-deep .v-data-table__wrapper::-webkit-scrollbar-track {
  background: #ffffff;

}

::v-deep .v-data-table__wrapper::-webkit-scrollbar-thumb {
  background: #e8e8e8;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 1px solid rgb(195, 195, 195);
  transition: 1s;
}

::v-deep .v-data-table__wrapper::-webkit-scrollbar-thumb:hover {
  background: #dedede;
}
</style>