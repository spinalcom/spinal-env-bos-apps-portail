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
  <div class="tableContainer"
       ref="tableContainer">
    <div class="my_title"
         v-if="title">
      {{title}}
    </div>
    <v-data-table dense
                  hide-default-header
                  disable-pagination
                  hide-default-footer
                  :headers="headers"
                  id="table"
                  :items="items"
                  item-key="name"
                  :expanded="expanded">

      <template v-slot:no-data>
        Aucune donnée
      </template>

      <template v-slot:header="{ props : { headers } }">
        <thead>
          <tr>
            <th class="expandedColumn">
              <v-checkbox class="checkboxDiv"
                          :value="checkIfAllCategoriesAreSelected"
                          @click="selectAll"></v-checkbox>
            </th>
            <th v-for="headerItem in headers"
                class="tableHeader"
                :key="headerItem.value">
              {{headerItem.text}}
            </th>
            <th class="expandedColumn"></th>
          </tr>
        </thead>
      </template>

      <template v-slot:item="{ item }">
        <tr class="categoryRow">
          <td>
            <v-checkbox v-model="item.selected"
                        @change="() => selectCategory(item)"
                        class="checkboxDiv">
            </v-checkbox>
          </td>
          <td @click="expand(item)">{{item.name}}</td>
          <td @click="expand(item)">
            <v-btn icon
                   x-small
                   color="white">
              <v-icon>
                {{IsExpanded(item) ? "mdi-chevron-down" : "mdi-chevron-up"}}
              </v-icon>
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:expanded-item="{ item }">
        <tr class="subItemRow"
            v-for="child of item[childrenKey]"
            :key="item.id + child.id">

          <td>
            <v-checkbox v-model="child.selected"
                        @change="() => selectSubItem(item, child)"
                        class="checkboxDiv"></v-checkbox>
          </td>
          <td>
            {{ child.name }}
          </td>
          <td></td>
        </tr>
      </template>
    </v-data-table>
  </div>

</template>
  
  <script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

const TableComponentProps = Vue.extend({
  props: {
    headers: {},
    title: {
      default: "",
    },
    items: {},
    childrenKey: {
      default: "children",
    },
  },
});

@Component
class TableComponent extends TableComponentProps {
  @Prop() edit!: boolean;
  @Prop() itemToSelect!: any[];

  mounted() {
    if (this.edit) {
      this._selectItemsOnEdit(this.itemToSelect);
    }
  }

  allCategoriesAreSelected = false;

  selectAll() {
    const value = !this.checkIfAllCategoriesAreSelected;
    for (const category of this.items) {
      category.selected = value;
      this.selectCategory(category);
    }
  }

  selectCategory(category: any) {
    const value = category.selected;
    category[this.childrenKey].forEach((element: any) => {
      element.selected = value;
    });

    if (value && !this.allCategoriesAreSelected) {
      // return this.checkIfAllCategoriesAreSelected();
    } else if (!value && this.allCategoriesAreSelected) {
      this.allCategoriesAreSelected = false;
    }
  }

  selectSubItem(category: any, item: any) {
    const value = item.selected;
    if (value) {
      this.checkIfAllItemsAreSelectedInCategory(category);
    } else if (category.selected) {
      category.selected = false;
      this.allCategoriesAreSelected = false;
    }
  }

  get checkIfAllCategoriesAreSelected() {
    for (const { selected } of this.items) {
      if (!selected) {
        // this.allCategoriesAreSelected = false;
        return false;
      }
    }

    // this.allCategoriesAreSelected = true;
    return true;
  }

  checkIfAllItemsAreSelectedInCategory(category: any) {
    for (const { selected } of category[this.childrenKey]) {
      if (!selected) return;
    }

    category.selected = true;

    this.selectCategory(category);
  }

  _selectItemsOnEdit(itemToSelect: any) {
    const obj: any = {};
    for (const { tag, id } of itemToSelect) {
      if (obj[tag]) obj[tag][id] = id;
      else obj[tag] = { [id]: id };
    }

    for (const category of this.items) {
      if (obj[category.name]) {
        for (const subItem of category.children) {
          if (obj[category.name][subItem.id]) {
            subItem.selected = true;
            this.selectSubItem(category, subItem);
          }
        }
      }
    }
  }

  // expanded: any[] = this.items || [];
  expanded: any[] = [];

  get expandedArray() {
    return this.expanded;
  }

  expand(item: any) {
    if (!this.IsExpanded(item)) this.expanded.push(item);
    else this.expanded = this.expanded.filter((el) => el.name !== item.name);
  }

  IsExpanded(item: any) {
    return this.expanded.find((el: any) => el.name === item.name);
  }
}

export default TableComponent;
</script>
  
  <style lang="scss">
$expand-column-width: 50px;
$title-background: #14202c;

.tableContainer {
  width: 99%;
  height: 100%;
  background: transparent !important;
  overflow: auto;
  margin: auto;

  .my_title {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 1.2em;
    padding-left: 10px;
    margin-bottom: 5px;
    color: #fff;
    background: $title-background;
  }

  #table {
    width: 100%;
    height: 450px;
    // height: calc(100% - 50px);
    background: transparent !important;

    th.tableHeader {
      // width: calc((100% - #{$expand-column-width}) / 3);
      height: 50px;
      text-transform: lowercase;
      font-size: 0.9em !important;
      text-align: left;
      vertical-align: middle;
    }

    th.expandedColumn {
      width: $expand-column-width;
      text-align: center;
    }

    tr.categoryRow {
      background: $title-background !important;

      :hover {
        cursor: pointer;
      }

      td {
        color: white;
        border-bottom-color: #fff !important;
        vertical-align: middle;
      }

      td:first-child {
        border-radius: 5px 0 0 5px !important;
      }

      td:last-child {
        border-left: 1px solid #fff;
        border-radius: 0 5px 5px 0;
      }
    }

    .subItemRow {
      td {
        height: 40px;
        vertical-align: middle !important;
      }
    }

    .checkboxDiv {
      min-height: unset;
      height: 25px;
      width: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
  