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
  <v-hover v-slot="{ hover }">
    <v-list-item class="data-table-item" @click="onclick">
      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action class="data-table-item-btn-container">
        <v-fade-transition group>
          <template v-if="hover && item.type !== 'platform'">
            <v-btn
              v-for="menu in menuItems"
              :key="menu.eventName"
              v-once
              v-tooltip="menu.tooltip"
              icon
              @click="callEvent(menu.eventName)"
            >
              <v-icon>{{ menu.icon }}</v-icon>
            </v-btn>
          </template>
        </v-fade-transition>

        <v-btn
          v-if="item.type !== 'BIMObject'"
          icon
          @click.stop="$emit('onOpen', item)"
        >
          <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-hover>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import type { TGeoItem } from '../../../../../global-components/SpaceSelector';

@Component
class DataTableItem extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  item: TGeoItem;
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

  callEvent(eventName) {
    this.$emit(eventName);
  }

  showMenu = false;
  onclick() {}
}
export default DataTableItem;
</script>

<style scoped>
.data-table-item {
  height: 60px;
}
.data-table-item-btn-container {
  flex-direction: row;
}
</style>
