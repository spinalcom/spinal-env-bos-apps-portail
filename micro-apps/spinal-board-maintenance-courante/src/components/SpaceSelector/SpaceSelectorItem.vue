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
  <v-list-item
    class="space-selector-list-item card-hover fade"
    :class="{
      ['space-selector-list-item-level-' + item.level]: true,
      'space-selector-list-item-isopen': item.isOpen && item.haveChildren,
      'space-selector-list-item-isSelected': isSelected,
    }"
    :style="{
      'margin-left': '' + ((item.level - 1) * 20 + 30) + 'px',
    }"
    @click="onSelect"
  >
    <!-- link to parent template -->
    <template v-if="item.level > 0">
      <div class="space-selector-list-item-angle"></div>
      <div class="space-selector-list-item-angle-extend"></div>
      <div
        class="parent-link"
        v-for="depth in item.level - 1"
        :key="depth+item.staticId"
        v-show="drawParentLink(depth)"
        :style="{ 'margin-left': '-' + (depth * 20 + 11) + 'px' }"
      ></div>
    </template>
    <div class="color-square" :style="{ 'background-color': item.color }"></div>
    <v-list-item-content style="margin-left: 21px">
      <!-- v-tooltip="item.name" -->
      <v-list-item-title
        >{{ item.name }}
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        elevation="0"
        fab
        icon
        style="color: #bfbfbf"
        dark
        :loading="item.loading"
        :disabled="item.loading"
        @click.stop="onOpenClose"
        v-show="item.level != maxDepth"
      >
        <v-icon dark> {{ icon }} </v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ISpaceSelectorItem } from './interfaces/ISpaceSelectorItem';

@Component
class SpaceSelectorItem extends Vue {
  @Prop({ type: Object, required: true })
item!: ISpaceSelectorItem;
  @Prop({ type: Number, required: true })
maxDepth!: number;
  @Prop({ type: Object, required: true })
selected!: ISpaceSelectorItem;

  public get isSelected(): boolean {
    return (
      this.item.patrimoineId === this.selected.patrimoineId &&
      this.item.platformId === this.selected.platformId &&
      (this.item.staticId === this.selected?.staticId ||
        this.selected?.parents?.includes(this.item.staticId))
    );
  }

  public get icon(): string {
    return this.item?.isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down';
  }

  onSelect() {
    this.$emit('onSelect');
  }
  onOpenClose() {
    this.$emit('onOpenClose');
  }
  drawParentLink(depth: number) {
    return !this.item.drawLink.includes(depth);
  }
}
export default SpaceSelectorItem;
</script>

<style scoped>
.space-selector-list-item {
  display: flex !important;
  margin-right: 10px;
  height: 50px;
  background-color: #14202c;
  border: 1px solid #bfbfbf;
  border-radius: 6px;
  margin-bottom: 0px;
  padding: 0;
  color: rgb(191, 191, 191) !important;
  margin-top: 6px;
}

.space-selector-list-item-angle {
  margin-left: -11px;
  height: 30px;
  background-color: transparent;
  border: 1px solid #4b6079;
  margin-top: -30px;
  width: 10px;
  border-right: none;
  border-top: none;
  position: absolute;
  border-radius: 0 0 0 6px;
  pointer-events: none;
}
.space-selector-list-item.space-selector-list-item-level-0
  + .space-selector-list-item-level-1,
.space-selector-list-item.space-selector-list-item-level-1
  + .space-selector-list-item-level-2,
.space-selector-list-item.space-selector-list-item-level-2
  + .space-selector-list-item-level-3,
.space-selector-list-item.space-selector-list-item-level-3
  + .space-selector-list-item-level-4,
.space-selector-list-item.space-selector-list-item-level-4
  + .space-selector-list-item-level-5,
.space-selector-list-item.space-selector-list-item-level-5
  + .space-selector-list-item-level-6,
.space-selector-list-item.space-selector-list-item-level-6
  + .space-selector-list-item-level-7,
.space-selector-list-item.space-selector-list-item-level-7
  + .space-selector-list-item-level-8 {
  margin-top: 6px;
}

.space-selector-list-item-angle-extend {
  margin-left: -11px;
  height: 50px;
  background-color: transparent;
  border: 1px solid #4b6079;
  border-radius: 6px;
  margin-top: -75px;
  width: 10px;
  border-right: none;
  border-bottom: none;
  border-top: none;
  position: absolute;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
  pointer-events: none;
}

.parent-link {
  height: 65px;
  background-color: transparent;
  border: 1px solid #4b6079;
  border-radius: 6px;
  margin-top: -45px;
  width: 10px;
  border-right: none;
  border-bottom: none;
  border-top: none;
  position: absolute;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
  pointer-events: none;
}
.color-square {
  margin-left: 8px;
  border-radius: 2px;
  display: inline-block;
  position: absolute;
  height: 16px;
  width: 6px;
}

.space-selector-list-item-isSelected {
  background-color: #444;
}

.space-selector-list-item.space-selector-list-item-isopen
  + .space-selector-list-item
  .space-selector-list-item-angle-extend {
  display: none;
}
</style>
