<!--
Copyright 2025 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Software license Agreement ("Agreement")
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
  <div class="tableContainer" v-if="items">
    <div class="my_title" v-if="title">
      {{ title }}
    </div>
    <v-treeview
      selectable
      open-all
      open-on-click
      :items="items"
      :return-object="false"
      item-key="id"
      item-text="name"
      item-children="subApps"
      hoverable
      dense
      selection-type="leaf"
      transition
      :activatable="false"
      v-model="selected"
    ></v-treeview>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue, VModel } from 'vue-property-decorator';
import { ISpinalAppTableItem, ISubAppTableItem } from '../types';
@Component({})
class TableAppExtends extends Vue {
  @Prop() items!: ISpinalAppTableItem[];
  @VModel() selected!: any[];
  @Prop({ default: '', type: String, required: true }) title;
  // get selected(): (ISpinalAppTableItem | ISubAppTableItem)[] {
  //   const res = [];
  //   for (const item of this.items) {
  //     if (item.selected) {
  //       res.push(item);
  //     }
  //     if (item.subApps) {
  //       for (const subItem of item.subApps) {
  //         if (subItem.selected) {
  //           res.push(subItem);
  //         }
  //       }
  //     }
  //   }
  //   return res;
  // }
  // set selected(value) {
  //   for (const item of this.items) {
  //     if (value.includes(item)) {
  //       item.selected = true;
  //     } else item.selected = false;
  //     if (item.subApps) {
  //       for (const subItem of item.subApps) {
  //         if (value.includes(subItem)) {
  //           subItem.selected = true;
  //         } else {
  //           subItem.selected = false;
  //         }
  //       }
  //     }
  //   }
  // }
  // @Watch('items', { deep: true, immediate: true })
  // onItemsChange(newValue?: ISpinalAppTableItem[]) {
  //   if (!newValue) return;
  //   console.log('watach items', newValue);
  //   for (const item of newValue) {
  //     if (this.itemToSelect.includes(item.id)) {
  //       item.selected = true;
  //     } else item.selected = false;
  //     if (item.subApps) {
  //       for (const subItem of item.subApps) {
  //         if (this.itemToSelect.includes(subItem.id)) {
  //           subItem.selected = true;
  //         } else subItem.selected = false;
  //       }
  //     }
  //   }
  // }
}

export default TableAppExtends;
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
