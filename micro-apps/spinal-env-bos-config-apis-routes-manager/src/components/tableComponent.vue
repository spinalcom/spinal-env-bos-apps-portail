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
  <div class="tableContainer">
    <v-data-table dense
                  hide-default-header
                  disable-pagination
                  hide-default-footer
                  :headers="headers"
                  id="table"
                  :items="items"
                  item-key="name"
                  :expanded="expanded">

      <template v-slot:header="{ props : { headers } }">
        <thead>
          <tr>
            <th v-for="headerItem in headers"
                class="tableHeader"
                :key="headerItem.value">
              {{headerItem.text}}
            </th>
            <th class="expandedColumn"></th>
            <th class="expandedColumn"></th>
          </tr>
        </thead>
      </template>

      <template v-slot:item="{ item }">
        <tr class="categoryRow">
          <td @click="expand(item)">{{item.name}}</td>
          <td @click="expand(item)"></td>
          <td @click="expand(item)"></td>
          <td @click="expand(item)">
            <v-btn icon
                   color="pink"
                   @click.stop="deleteItem(item.children)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
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
            v-for="child of item.children"
            :key="child.id">
          <td>
            {{ child.route }}
          </td>
          <td>
            {{ child.scope }}
          </td>
          <td>
            {{ child.method }}
          </td>
          <td></td>
          <td>
            <v-btn icon
                   color="pink"
                   @click="deleteItem(child)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>

</template>

<script lang="ts">
import { IApiRoute } from "@/interfaces";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

const TableComponentProps = Vue.extend({
  props: ["headers", "items"],
});

@Component
class TableComponent extends TableComponentProps {
  // @Prop({ default: [] }) headers!: any[];
  // @Prop({ default: [] }) items!: any[];

  expanded: any[] = this.items;

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

  deleteItem(items: IApiRoute | IApiRoute[]) {
    if (!Array.isArray(items)) items = [items];

    this.$emit("delete", items);
  }
}

export default TableComponent;
</script>

<style lang="scss">
$expand-column-width: 50px;

.tableContainer {
  width: 100%;
  background: transparent !important;
  overflow: auto;

  #table {
    width: 100%;
    max-height: 74vh;
    background: transparent !important;

    overflow: auto;
    // colgroup {
    //   col {
    //     width: calc(33%) !important;
    //   }
    // }

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
      background: #14202c !important;

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
  }
}
</style>
