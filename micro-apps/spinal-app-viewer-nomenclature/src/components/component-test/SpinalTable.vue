<template>
  <div class="main-tab"
    style=" width: 100%; font-size: 14px !important;background-color: rgb(255, 255, 255);border-radius: 10px !important;border-color: black !important;">

    <!-- BREADCRUMBS -->
    <SpinalbreadCrumb @itemSelected="emitValue($event.listType, $event.value)" :ctx_list="ctx_list" :cat_list="cat_list"
      :grp_list="grp_list"></SpinalbreadCrumb>

    <!-- LE TREEVIEW -->
    <div title="Sélection de la catégory d'attribut / attribut" style="width: 100%; display: flex; margin-top: 10px; position: relative;">
      <div
        style="margin-left: 2px; z-index: 10; position: absolute; width: calc(100% - 70px - 10px); border-radius: 5px; background-color: rgb(255, 255, 255);">
        <div class="mouse" @click="showattribut = !showattribut" style="">
          <v-icon v-if="!showattribut" color="black" style="font-size: 2em">mdi-chevron-down</v-icon>
          <v-icon v-else color="black" style="font-size: 2em">mdi-chevron-up</v-icon>
          <div v-if="!keyselected[0]">Selectionner des attributs.</div>
          <div style="padding-top: 5px;">
            <v-chip style="margin: 2px " v-for="(element, index) in keyselected" :key="index" :class="{
      'blue-background': element.parentName === element.childName,
      'red-background': element.parentName !== element.childName
    }">
              {{ element.childName }}
              <div
                style="top: -5px;right:-5px;position: absolute;background-color: white;border-radius: 20px;height: 15px;width: 15px;display: flex;justify-content: center;align-items: center;border: 1px solid #14202c; color: #14202c;">
                <v-icon style="margin-top: 1px;" size="13px"
                  @click.stop="deleteAttrSelected(element)">mdi-close</v-icon>
              </div>
            </v-chip>
          </div>
        </div>

        <div>
          <v-treeview class="my-custom-treeview animate" v-if="showattribut"
            style="width: 100%;padding-left: 20px;user-select: none;" v-model="selectedKeys" selectable
            item-disabled="locked" :items="treeviewItems"></v-treeview>
        </div>
      </div>
      <div @click.stop="importAttr = !importAttr"
        style="cursor: pointer;  position: absolute; right: 0;  border-radius: 5px;  margin-left: 10px;">
        <v-icon title="import" color="black"
          style="font-size: 2em;border: 1px solid black;border-radius: 5px;padding: 10px;">mdi-file-upload</v-icon>
      </div>
    </div>

    <!-- LE DATA TABLE -->
    <!-- items = filtred items / headers = headers / contexts = global items / selection = items du select / -->
    <div style="padding: 2px;margin-top: 65px;" class="scrollable-table-container">
      <DataTable :selectedItemTab="selectedItemTab" :height="'74vh'" :items="filteredContextsV"
        :headers="dynamicHeaders()" :contexts="contexts" :selections="selections"
        @item-selected="selectDataView($event)" @filter="filtercolumn($event)" />
    </div>

    <!--SPINALCOMPARAISON -->
    <div class="blur-background" @click="importAttr = !importAttr" v-if="importAttr">
      <SpinalComparaison :contexts="contexts" @extractData="extractData()" @updateSuccess="handleSuccess">
      </SpinalComparaison>
    </div>

  </div>
</template>


<script>
import SmallLegend from './SmallLegend.vue';
import { MutationTypes } from "../../services/store/appDataStore/mutations";
import SpinalComparaison from './SpinalComparaison.vue';
import SpinalbreadCrumb from './SpinalbreadCrumb.vue';
import DataTable from './SpinalDataTable';
export default {
  components: {
    SmallLegend,
    SpinalComparaison,
    SpinalbreadCrumb,
    DataTable
  },
  props: ['contexts', 'temporality', 'unit', 'label', 'reference', 'selectedItemTab', 'ctx_list', 'cat_list', 'grp_list'],
  data: () => ({
    selections: {},
    tableData: [],
    selectedCategory: [],
    selectedAttribute: null,
    filteredAttributes: [],
    filteredItem: [],
    selectedKeys: [],
    keyselected: {},
    showattribut: false,
    selected_id: null,
    importAttr: false,
    checked: false,
    allFilteredData: [],
    currentfilter: null,
    order: false
  }),
  mounted() {
    this.extractData();
    this.$nextTick(() => {
      const headers = document.querySelectorAll('#my-data-table .v-data-table-header ');
      headers.forEach(header => {
        header.addEventListener('click', (e) => {
          this.onHeaderClick(e.target.textContent.trim());
        });
      });
    });
  },
  computed: {

    treeviewItems() {
      if (!this.contexts[0].nomenclature) {
        return [];
      }

      const nomenclatureObj = this.contexts[0].nomenclature;
      const items = Object.entries(nomenclatureObj).map(([key, value], index) => {
        return {
          id: key + index,
          name: key,
          children: value?.map((item, itemIndex) => ({
            id: `${key}-${itemIndex}`,
            name: item,
          }))
        };
      });

      return items;
    },

    filteredContexts() {
      if (this.contexts) {
        return this.contexts[0]?.data;
      }
    },

    filteredContextsV() {
      if (this.contexts && this.contexts[0]?.data) {
        Object.keys(this.selections).forEach(key => {
          if (Array.isArray(this.selections[key]) && this.selections[key].length === 0) {
            delete this.selections[key];
          }
        });

        if (Object.keys(this.selections).length === 0) {
          let allFilteredData = this.contexts[0]?.data;
          this.$emit('allFiltredData', allFilteredData);
          if (this.currentfilter) {
            this.$store.commit(MutationTypes.SET_DLDATA, this.sortDataByAttribute(this.currentfilter, [...allFilteredData]));
            return this.sortDataByAttribute(this.currentfilter, [...allFilteredData])
          } else {
            this.extractData()
            return this.contexts[0]?.data;
          }
        }

        const criteria = Object.entries(this.selections).map(([key, values]) => {
          const [label, category] = key.split('/');
          return { label, category, values };
        });

        let allFilteredData = [];

        criteria.forEach((criterion, index) => {
          const filteredDataForCriterion = this.contexts[0].data.filter(object => {
            const category = object.categoryAttributes.find(cat => cat.name === criterion.category);
            return criterion.values.some(value => {
              if (value === "<empty>") {
                if (!category || !category.attributs.some(attr => attr.label === criterion.label)) {
                  return true;
                }
                const attribute = category.attributs.find(attr => attr.label === criterion.label);
                return !attribute || attribute.value === "";
              } else {
                return category && category.attributs.some(attr => attr.label === criterion.label && attr.value === value);
              }
            });
          });
          if (index === 0) {
            allFilteredData = filteredDataForCriterion;
          } else {
            allFilteredData = allFilteredData.filter(item => filteredDataForCriterion.includes(item));
          }
        });
        this.$emit('allFiltredData', allFilteredData);
        if (this.currentfilter && allFilteredData != []) {
          this.$store.commit(MutationTypes.SET_DLDATA, this.sortDataByAttribute(this.currentfilter, [...allFilteredData]));
          return this.sortDataByAttribute(this.currentfilter, [...allFilteredData])
        } else {
          this.extractData(allFilteredData)

          return allFilteredData;
        }
      }
    }
  },

  methods: {

    handleSuccess() {
      this.importAttr = false;
      this.$emit('updateSuccess');
    },

    filtercolumn(item) {
      this.order = !this.order;
      this.currentfilter = item.text
    },

    sortDataByAttribute(categoryAttributePair, dataArray) {
      const [attributeName, categoryName] = categoryAttributePair.split('/');

      const findAttributeValue = (item) => {
        const category = item.categoryAttributes.find(cat => cat.name === categoryName);
        const attribute = category?.attributs.find(attr => attr.label === attributeName);
        return attribute ? attribute.value : '';
      };

      const sortOrder = this.order ? 1 : -1;

      dataArray.sort((a, b) => {
        const aValue = findAttributeValue(a);
        const bValue = findAttributeValue(b);

        if (!isNaN(aValue) && !isNaN(bValue)) {
          return (Number(aValue) - Number(bValue)) * sortOrder;
        }
        return aValue.localeCompare(bValue) * sortOrder;
      });

      return dataArray;
    },

    deleteAttrSelected(item) {
      let selectedKeys = this.selectedKeys
      if (item.parentName === item.childName) {
        this.selectedKeys = selectedKeys.filter(key => !key.startsWith(item.parentName));
      } else {
        const childIndex = this.contexts[0].nomenclature[item.parentName].indexOf(item.childName);
        if (childIndex !== -1) {
          const keyToRemove = `${item.parentName}-${childIndex}`;
          this.selectedKeys = this.selectedKeys.filter(key => key !== keyToRemove);
        }
      }
    },

    emitValue(listType, value) {
      if (listType == 'ctx' || listType == 'cat') {
        this.selected_grp = []
      }
      if (listType == 'ctx') {
        this.selected_cat = ""
      }
      this.$emit('itemSelected', { listType, value });
    },

    onHeaderClick(headerName) {
      if (headerName.length > 0)
        this.$store.commit(MutationTypes.SET_ATTR, headerName);
    },

    extractData(givendata = this.filteredContexts) {
      const dynamicHeaders = this.dynamicHeaders()?.map(header => header.text);
      const filteredContexts = givendata;

      // const { filteredContexts } = this;
      if (this.$store.state.appDataStore.dl_data_option == false || this.checked == true) {
        this.tableData = filteredContexts?.map(item => {
          const dataForRow = {};
          dynamicHeaders.forEach(header => {
            dataForRow['dynamicId'] = item.dynamicId;
            dataForRow['staticId'] = item.staticId;
            if (header.includes('Nom')) {
              dataForRow['Nom'] = item.name;
            } else {
              const attributeValue = this.getAttributeValueDL(item, header);
              dataForRow[header] = attributeValue;
            }
          });
          return dataForRow;
        });

      } else {
        this.tableData = filteredContexts?.map(item => {

          const dataForRow = {
            dynamicId: item.dynamicId,
            staticId: item.staticId,
            Nom: item.name,
          };

          item.categoryAttributes.forEach(category => {
            category.attributs.forEach(attr => {
              const attrKey = `${attr.label}/${category.name}`;
              dataForRow[attrKey] = attr.value;
            });
          });

          return dataForRow;
        });
      }
      this.ChipKeySlected();
      this.$store.commit(MutationTypes.SET_DLDATA, this.tableData);
    },

    getAttributeValueDL(item, attrLabel) {
      const [childName, parentName] = attrLabel.split('/');
      const category = item.categoryAttributes.find(cat => cat.name === parentName);
      if (category) {
        const attribute = category.attributs.find(a => a.label === childName);
        if (attribute) {
          return attribute.value;
        }
      }
      return '';
    },

    getAttributeValue(item, attrLabel) {
      for (const category of item.categoryAttributes) {
        const attribute = category.attributs.find(a => a.label === attrLabel);
        if (attribute) {
          return attribute.value;
        }
      }
      return '';
    },

    selectDataView(item) {
      this.selected_id = item.dynamicId
      this.$emit('item-selected', item);
    },

    ChipKeySlected() {
      const headers = [
        { text: 'Nom', value: 'name', sortable: true, filtrable: true, filtrable: true },
      ];
      const selectedItems = this.selectedKeys?.map(key => {
        const foundItem = this.treeviewItems?.find(item =>

          item.children && item.children.find(child => child.id === key)
        );
        if (foundItem) {
          const foundChild = foundItem.children.find(child => child.id === key);

          return {
            parentName: foundItem.name,
            childName: foundChild ? foundChild.name : null
          };
        }
        return null;
      }).filter(item => item && item.childName !== null);
      selectedItems.forEach(({ parentName, childName }) => {
        headers.push({ text: `${childName}/${parentName}`, value: childName, filtrable: true });
      });

      let parentCounts = {};
      let optimizedItems = [];

      if (!this.contexts) {
        return
      }
      let nomenclature = this.contexts[0].nomenclature

      selectedItems.forEach(item => {
        const { parentName, childName } = item;
        if (!parentCounts[parentName]) {
          parentCounts[parentName] = { count: 1, children: [childName] };
        } else {
          parentCounts[parentName].count++;
          parentCounts[parentName].children.push(childName);
        }
      });

      for (const parentName in parentCounts) {
        const parentInfo = parentCounts[parentName];
        if (nomenclature[parentName] && nomenclature[parentName].length === parentInfo.count && nomenclature[parentName].every(child => parentInfo.children.includes(child))) {
          optimizedItems.push({ parentName, childName: parentName });
        } else {
          parentInfo.children.forEach(childName => optimizedItems.push({ parentName, childName }));
        }
      }
      this.keyselected = optimizedItems;
    },

    dynamicHeaders() {
      let headers = [{ text: 'Nom', value: 'name', sortable: true }];
      const selectedItems = this.selectedKeys?.map(key => {
        const foundItem = this.treeviewItems.find(item =>
          item.children && item.children.find(child => child.id === key)
        );
        if (foundItem) {
          const foundChild = foundItem.children.find(child => child.id === key);
          return {
            parentName: foundItem.name,
            childName: foundChild ? foundChild.name : null
          };
        }
        return null;
      }).filter(item => item && item.childName !== null);

      selectedItems.forEach(({ parentName, childName }) => {
        if (childName !== 'name') {
          headers.push({ text: `${childName}/${parentName}`, value: childName, filterable: true });
        }
      });
      return headers;
    }
  },
  watch: {

    allFilteredData(newVal, oldVal) {
      this.$emit('allFiltredData', newVal);
    },

    '$store.state.appDataStore.dl_data_option': {
      handler(newValue, oldValue) {
        this.extractData();
      },
      deep: true,
      immediate: false,
    },

    // selectedItemTab(newVal, oldVal) {
    //   this.selected_id = newVal
    //   if (this.$refs[`row-${newVal}`]) {
    //     this.$refs[`row-${newVal}`].scrollIntoView({ behavior: 'smooth', block: 'center' });
    //   }
    // },

    selectedKeys(newVal, oldVal) {
      this.extractData();
      const resultat = {};
      newVal.forEach(s => {
        const dernierTiretIndex = s.lastIndexOf("-");
        const nom = s.substring(0, dernierTiretIndex);
        const numero = s.substring(dernierTiretIndex + 1);

        if (!resultat[nom]) {
          resultat[nom] = [];
        }
        resultat[nom].push(numero);
      });
      return resultat;
    },

    selectedCategory(newVal, oldVal) {
      if (newVal) {
        this.filteredAttributes = this.contexts[0].nomenclature[newVal];
      } else {
        this.filteredAttributes = [];
      }
      this.selectedAttribute = null;
    },

    selectedAttribute(newVal, oldVal) {
      if (newVal && this.selectedCategory) {
        let allValues = [];
        this.contexts[0].data.forEach(context => {
          const category = context.categoryAttributes.find(cat => cat.name === this.selectedCategory);
          if (category) {
            const filteredAttributess = category.attributs.filter(attr => attr.label === newVal);
            filteredAttributess.forEach(attr => {
              allValues.push(attr.value);
            });
          }
        });
        this.filteredItem = Array.from(new Set(allValues));
      } else {
        this.filteredItem = [];
      }
    }
  }
}
</script>

<style scoped>
.blue-background {
  background-color: #14202c !important;
  color: white !important;
}


::v-deep .v-text-field.v-input--is-focused>.v-input__control>.v-input__slot:after {
  color: rgba(255, 255, 255, 0) !important;
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