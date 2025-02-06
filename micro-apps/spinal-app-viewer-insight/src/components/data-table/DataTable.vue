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
  <div style="height: 100%">
    <v-hover v-slot="{ hover }">
      <v-app-bar dark color="#14202c">
        <v-btn
          v-if="selectedZone.type !== 'patrimoine'"
          icon
          @click.stop="$emit('goBack')"
        >
          <v-icon color="grey lighten-1">mdi-chevron-left</v-icon>
        </v-btn>

        <!-- <v-toolbar-title>Data App</v-toolbar-title> -->
        <v-spacer></v-spacer>
        <v-fade-transition group>
          <template v-if="hover && selectedZone.type !== 'patrimoine'">
            <v-btn
              v-for="menu in menuItems"
              :key="menu.eventName"
              v-once
              v-tooltip="menu.tooltip"
              icon
              @click="$emit(menu.eventName, tableData)"
            >
              <v-icon>{{ menu.icon }}</v-icon>
            </v-btn>
          </template>
        </v-fade-transition>
      </v-app-bar>
    </v-hover>
    <v-list
      style="overflow: auto; height: calc(100% - 65px)"
      class="spinal-scrollbar"
    >
      <DataTableItem
        v-for="item in tableData"
        :key="item.staticId"
        :item="item"
        @onOpen="onOpen(item)"
        @onSelect="$emit('onSelect', item)"
        @onfitToView="$emit('onfitToView', item)"
        @onIsolate="$emit('onIsolate', item)"
        @onColor="$emit('onColor', item)"
      ></DataTableItem>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, VModel, Watch } from 'vue-property-decorator';
import {
  convertZonesToISpaceSelectorItems,
  ISpaceSelectorItem,
  TGeoItem,
} from '../../../../../global-components/SpaceSelector';
import DataTableItem from './DataTableItem.vue';

@Component({
  components: { DataTableItem },
})
class DataTable extends Vue {
  @Prop({ type: Function, required: true }) GetChildrenFct: (
    item?: ISpaceSelectorItem
  ) => Promise<TGeoItem[]>;

  public tableData: TGeoItem[] = [];
  menuItems = [
    { icon: 'mdi-cellphone-link', eventName: 'onSelect', tooltip: 'Select' },
    {
      icon: 'mdi-magnify-plus-outline',
      eventName: 'onfitToView',
      tooltip: 'Fit to view',
    },
    { icon: 'mdi-overscan', eventName: 'onIsolate', tooltip: 'Isolate' },
    // { icon: 'mdi-palette', eventName: 'onColor', tooltip: 'Color' },
  ];

  async mounted() {
    const children = await this.GetChildrenFct(this.selectedZone);
    this.tableData = children;
  }

  @VModel({ type: Object }) selectedZone: ISpaceSelectorItem;
  @Watch('selectedZone')
  async onSelectedChange() {
    const children = await this.GetChildrenFct(this.selectedZone);
    this.tableData = children;
  }

  onOpen(item: TGeoItem) {
    const res = convertZonesToISpaceSelectorItems([item], this.selectedZone);
    this.selectedZone = res[0];
  }
}
export default DataTable;
</script>
