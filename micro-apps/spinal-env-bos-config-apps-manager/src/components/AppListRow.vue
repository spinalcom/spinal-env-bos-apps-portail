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
  <tr class="itemRow">
    <td class="iconsCell" :style="computedOffsetIconStyle">
      <v-timeline>
        <v-timeline-item color="#fff" fill-dot small>
          <template v-slot:icon>
            <v-icon>{{ icon }}</v-icon>
          </template>
        </v-timeline-item>
      </v-timeline>
    </td>
    <td>{{ item.name }}</td>
    <td>{{ formatTags }}</td>
    <td>{{ formatCatGrp }}</td>
    <td class="actions">
      <v-btn
        v-if="item.type === 'BuildingApp'"
        class="actionBtn dark"
        @click="createSubApp"
      >
        <v-icon small>mdi-plus</v-icon>
      </v-btn>
      <v-btn class="actionBtn dark" @click="editApp">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>

      <v-btn class="actionBtn" color="error" outlined @click="deleteApp">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </td>
    <td>
      <v-btn v-if="canExpand" icon @click="expand">
        <v-icon>
          {{ isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
        </v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import type { ISpinalApp } from '../types/ISpinalApp';

@Component({
  filters: {
    formatIcon(iconName: string) {
      if (/^mdi-/.test(iconName)) return iconName;
      return `mdi-${iconName}`;
    },
  },
})
class AppListRow extends Vue {
  @Prop({
    required: true,
    type: Object,
    validator: (value: ISpinalApp) => {
      return value && typeof value.name === 'string';
    },
  })
  item: ISpinalApp;
  @Prop({ required: false }) isExpanded: boolean;
  @Prop({ required: true }) canExpand: boolean;
  @Prop({ required: false, default: 0 }) offset: number;
  @Prop({
    required: false,
    type: Object,
    validator: (value: ISpinalApp) => {
      return value && typeof value.name === 'string';
    },
  })
  parentItem: ISpinalApp;

  @Emit() createSubApp() {
    return this.item;
  }
  @Emit() editApp() {
    return this.item;
  }
  @Emit() deleteApp() {
    return this.item;
  }
  @Emit() expand() {
    return this.item;
  }

  get getCat() {
    if (this.item.categoryName) return this.item.categoryName;
    if (this.parentItem && this.parentItem.categoryName)
      return this.parentItem.categoryName + '*';
    return 'undefined';
  }
  get getGrp() {
    if (this.item.groupName) return this.item.groupName;
    if (this.parentItem && this.parentItem.groupName)
      return this.parentItem.groupName + '*';
    return 'undefined';
  }
  get formatCatGrp() {
    return `${this.getCat} / ${this.getGrp}`;
  }

  get iconCompu() {
    if (this.item.icon) return this.item.icon;
    if (this.parentItem && this.parentItem.icon)
      return this.parentItem.icon + '*';
    return 'mdi-apps';
  }
  get icon() {
    return this.$options.filters.formatIcon(this.iconCompu);
  }
  get tagsCompu() {
    if (this.item.tags) return this.item.tags;
    if (this.parentItem && this.parentItem.tags)
      return this.parentItem.tags + '*';
    return '';
  }

  get formatTags() {
    if (Array.isArray(this.tagsCompu)) {
      return this.tagsCompu.join(', ').toUpperCase();
    }
    return this.tagsCompu?.toUpperCase() || this.tagsCompu;
  }

  get computedOffsetIconStyle() {
    if (this.offset === 0) return {};
    return {
      paddingLeft: `${18 * this.offset}px !important`,
    };
  }
}
export default AppListRow;
</script>
