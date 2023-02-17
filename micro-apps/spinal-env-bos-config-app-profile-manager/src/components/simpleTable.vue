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
       v-if="items">
    <div class="my_title"
         v-if="title">
      {{title}}
    </div>
    <v-data-table hide-default-header
                  disable-pagination
                  hide-default-footer
                  :headers="headers"
                  id="table"
                  :items="items"
                  item-key="name">

      <template v-slot:header="{ props : { headers } }">
        <thead>
          <tr>
            <th class="expandedColumn">
              <v-checkbox class="checkboxDiv"
                          :value="checkIfAllItemsAreSelected"
                          @click="selectAll"></v-checkbox>
            </th>
            <th v-for="headerItem in headers"
                class="tableHeader"
                :key="headerItem.value">
              {{headerItem.text}}
            </th>
          </tr>
        </thead>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-checkbox v-model="item.selected"
                        class="checkboxDiv">
            </v-checkbox>
          </td>
          <td>{{item.name}}</td>
        </tr>
      </template>

    </v-data-table>
  </div>

</template>
    
    <script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

const TableComponentProps = Vue.extend({
  props: {
    headers: {},
    title: {
      default: "",
    },
  },
});

@Component
class TableComponent extends TableComponentProps {
  @Prop() items!: any;
  @Prop() edit!: boolean;
  @Prop() itemToSelect!: any[];

  allItemsAreSelected = false;

  mounted() {
    if (this.edit) {
      this._selectItemsOnEdit(this.itemToSelect);
    }
  }

  _selectItemsOnEdit(itemToSelect: any) {
    const obj: any = {};
    for (const { id } of itemToSelect) {
      obj[id] = id;
    }

    for (const item of this.items || []) {
      if (obj[item.id]) item.selected = true;
    }
  }

  selectAll() {
    const value = !this.checkIfAllItemsAreSelected;

    for (const item of this.items) {
      item.selected = value;
    }
  }

  @Watch("items")
  watchItems() {
    if (this.items) this._selectItemsOnEdit(this.itemToSelect);
  }

  get checkIfAllItemsAreSelected() {
    for (const item of this.items) {
      if (!item.selected) return false;
    }

    return true;
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
  margin-top: 10px;

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
    background: transparent !important;
    max-height: calc(100% - 50px);
    overflow: auto;

    th.tableHeader {
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
    