<!--
Copyright 2023 SpinalCom - www.spinalcom.com

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
  <div>
    <div class="space-selector-container" :class="{ isopen: open }">
      <v-card color="#14202C" :class="{ 'space-selector-open': open }" class="space-selector" style="
          border: 1px solid #f5f5f5;
          border-left: 2px solid #f5f5f5;
          border-bottom: none !important;
          overflow: hidden;
        " :style="[
          { height: open ? selectorHeight + 'px !important' : '59px' },
          { 'overflow-y': !isFill },
          { 'border-right': edge ? '' : 'none' },
          { 'border-top-right-radius': edge ? '' : '0 !important' },
          {
            'border-bottom-right-radius':
              edge || (!edge && open) ? '' : '0 !important',
          },
        ]">
        <div ref="SpaceSelectorTitleContainer" @click.stop="
          $emit('update:open', !open);
        showSign();
        " class="space-selector-header" :style="{ cursor: maxDepth !== -1 ? 'pointer' : 'default' }">
          <span class="legend">{{ label }}</span>
          <p class="space-selector-header-title">

            <v-icon :style="[
              { color: maxDepth !== -1 ? '#f5f5f5' : '#14202c' },
              { width: maxDepth !== -1 ? 'auto' : '0 !important' },
              { color: maxDepth !== -1 ? '#f5f5f5' : '#14202c' },
            ]" class="rotate-disabled space-selector-header-title-icon" :class="{ 'rotate-enabled': open }">
              mdi-chevron-down
            </v-icon>

            {{ selectedZoneName.toUpperCase() }}


          </p>
          <v-progress-circular style="margin-right: 10px;" v-if="!viewerLoaded && label == 'ESPACE'" :size="25"
            color="white" indeterminate></v-progress-circular>
        </div>
        <transition-group id="myDiv" name="staggered-fade" class="card-list spinal-scrollbar"
          :style="[{ 'overflow-y': 'auto' + ' !important' }]" tag="div" v-bind:css="false"
          v-on:before-enter="beforeEnter" v-on:enter="enter">
          <SpaceSelectorItem :label="label" :loading_viewer="viewerLoaded" class="staggered-fade-item"
            v-for="(item, index) in buildingStructure"
            :key="`${index}-${item.dynamicId}-${item.platformId}-${item.patrimoineId}`" :item="item"
            v-bind:data-index="index" :maxDepth="maxDepth" @onSelect="select(item)" :selected="selectedZone"
            @onOpenClose="expandCollapse(item, index)" :spaceSelectorItemButtons="spaceSelectorItemButtons"
            :viewButtonsType="viewButtonsType" @onActionClick="onActionClick"></SpaceSelectorItem>
        </transition-group>
      </v-card>
    </div>
    <!-- Boite de dialogue pour la selection personnalisée de la temporalité -->
    <v-dialog v-model="pickDate" width="80%" persistent>
      <v-card>
        <v-card-text class="d-flex flex-row justify-space-between">
          <div style="width: calc(50% - 4px)">
            <v-card-title class="headline justify-center">
              Date de début
            </v-card-title>
            <div class="d-flex flex-row justify-space-around">
              <v-date-picker v-model="dateBegin" scrollable locale="fr" :first-day-of-week="1" color="orange"
                header-color="primary"></v-date-picker>
              <v-time-picker v-model="timeBegin" scrollable format="24hr" color="orange"
                header-color="primary"></v-time-picker>
            </div>
          </div>
          <v-divider vertical inset></v-divider>
          <div style="width: calc(50% - 4px)">
            <v-card-title class="headline justify-center">
              Date de fin
            </v-card-title>
            <div class="d-flex flex-row justify-space-around">
              <v-date-picker v-model="dateEnd" scrollable locale="fr" :first-day-of-week="1" color="orange"
                header-color="primary"></v-date-picker>
              <v-time-picker v-model="timeEnd" scrollable format="24hr" color="orange"
                header-color="primary"></v-time-picker>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="pickDate = false">Annuler</v-btn>
          <!-- validation possible que si tous les champs sont remplis -->
          <v-btn text @click="onDateChange" :disabled="!validatePicker">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Velocity from 'velocity-animate';
import { Vue, Component, Prop, VModel, Watch } from 'vue-property-decorator';
import type { IZoneItem, IButton } from './interfaces/IBuildingItem';
import type { ISpaceSelectorItem } from './interfaces/ISpaceSelectorItem';
import SpaceSelectorItem from './SpaceSelectorItem.vue';
import { convertZonesToISpaceSelectorItems } from './convertZonesToISpaceSelectorItems';
import moment from 'moment';
import { log } from 'console';

@Component({
  components: {
    SpaceSelectorItem,
  },
})
class SpaceSelector extends Vue {
  @Prop({ type: Array<IButton>, required: false, default: () => [] })
  spaceSelectorItemButtons!: IButton[];

  @Prop({ type: String, required: false })
  viewButtonsType!: string;

  @Prop({ type: Function, required: false })
  GetChildrenFct!: (item?: ISpaceSelectorItem) => Promise<IZoneItem[]>;

  @Prop({ type: Number, required: false, default: -1 })
  maxDepth!: number;

  @VModel({ type: Object }) selectedZone!: ISpaceSelectorItem;

  @Prop({ type: Boolean, required: true })
  open!: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  edge!: boolean;

  @Prop({ type: String, required: true })
  label: string;

  localOpen = this.open;
  selectorHeight = 0;
  pickDate = false;
  dateBegin: string = '';
  timeBegin: string = '';
  dateEnd: string = '';
  timeEnd: string = '';

  get selectedZoneName() {
    if (
      this.buildingStructure[0]?.type == 'building' &&
      this.selectedZone.type == 'building'
    ) {
      return this.buildingStructure[0]?.name || 'Bâtiments';
    }
    return this.selectedZone?.name || 'Sélectionnez une zone';
  }

  isFill = 'hidden';

  buildingStructure: ISpaceSelectorItem[] = [];

  get validatePicker() {
    return this.dateBegin && this.dateEnd && this.timeBegin && this.timeEnd;
  }

  @Watch('open')
  onopen(newVal) {
    this.localOpen = newVal;
  }

  @Watch("selectedZone")
  async onSelectedChange() {
    for (let idx = 0; idx < this.buildingStructure.length; idx++) {
      const item = this.buildingStructure[idx];
      let found = false;
      if (
        item.platformId === this.selectedZone.platformId &&
        item.dynamicId === this.selectedZone.dynamicId &&
        item.staticId === this.selectedZone.staticId
      ) {
        found = true;
        // if (!item.isOpen) {
        //   await this.openItem(item, idx);
        // }
      } else {
        for (const parentId of this.selectedZone.parents) {
          if (
            parentId === item.staticId &&
            (this.selectedZone.platformId === item.platformId ||
              item.type === "patrimoine")
          ) {
            found = true;
            if (!item.isOpen) {
              await this.openItem(item, idx);
              idx = 0;
            }
            break;
          }
        }
        if (found === false) {
          // await this.closeItem(item);
        }
      }
    }
    this.checkingOverflow();
  }


  @Watch("date")
  onDateChange() {
    // formattage de la plage de date pour les requetes
    const item = this.buildingStructure.find((b) => b.name === "Personnalisé");
    const [begin, end] = [
      this.dateBegin + " " + this.timeBegin,
      this.dateEnd + " " + this.timeEnd,
    ].sort();
    item.range = {
      begin: moment(begin).format("DD-MM-YYYY HH:mm:ss"),
      end: moment(end).format("DD-MM-YYYY HH:mm:ss"),
    };

    // reinitialisation des champs
    this.dateBegin = "";
    this.dateEnd = "";
    this.timeBegin = "";
    this.timeEnd = "";

    this.pickDate = false;
    this.$emit("update:open", !this.open);
    this.$emit("input", item);
  }

  select(item?: ISpaceSelectorItem) {
    if (item.name !== "Personnalisé") {
      this.$emit("update:open", !this.open);
      this.$emit("input", item);
      return;
    }
    this.pickDate = true;
  }

  private myDiv!: HTMLDivElement;
  checkingOverflow() {
    const myDiv = document.getElementById('myDiv');
    const windowHeight = window.innerHeight;
    const divHeight = myDiv!.offsetHeight;
    if (divHeight >= windowHeight - 421) {
      this.isFill = 'auto';
    } else {
      this.isFill = 'hidden';
    }
  }
  intervalId: number | undefined;

  async mounted() {
    const children = await this.GetChildrenFct();
    this.buildingStructure = convertZonesToISpaceSelectorItems(children);

    if (this.buildingStructure.length === 1) {
      await this.expandCollapse(this.buildingStructure[0], 0);
    }
    this.onSelectedChange();
    this.checkViewerStatus();
    this.intervalId = window.setInterval(this.checkViewerStatus, 1000);
  }


  viewerLoaded: boolean = true;
  checkViewerStatus() {
    const currentQuery = { ...window.parent.routerFontion.apps[0]._route.query }

    if (!currentQuery.app) {
      this.viewerLoaded = true
      localStorage.setItem("viewer_loaded", "loaded");
    } else {
      // TODO
      const currentStatus = ["loaded", "initialize"].includes(localStorage.getItem("viewer_loaded") || "");
      if (this.viewerLoaded !== currentStatus) {
        this.viewerLoaded = currentStatus;
      }
    }

  }

  async expandCollapse(
    item: ISpaceSelectorItem,
    index: number,
    forceOpen = false
  ) {
    if (item.isOpen === true && !forceOpen) {
      this.closeItem(item);
    } else {
      await this.openItem(item, index);
    }
    this.selectorHeight = this.buildingStructure.length * 56 + 60 + 30;
    this.checkingOverflow();
  }

  private async openItem(item: ISpaceSelectorItem, index: number) {
    item.isOpen = true;
    item.loading = true;
    try {
      const children = await this.GetChildrenFct(item);
      this.buildingStructure.splice(
        index + 1,
        0,
        ...convertZonesToISpaceSelectorItems(children, item)
      );
    } catch (error) {
      console.error('error fetch childrens.', error);
    }
    item.loading = false;
    this.checkingOverflow();
  }

  private closeItem(item: ISpaceSelectorItem) {

    item.isOpen = false;

    const toRm: typeof this.buildingStructure = [];
    for (const it of this.buildingStructure) {
      if (
        (it.platformId === item.platformId || item.type === 'patrimoine') &&
        it.parents.includes(item.dynamicId)
      ) {
        toRm.push(it);
      }
    }
    for (const it of toRm) {
      const idx = this.buildingStructure.findIndex((struct) => {
        return (
          struct.patrimoineId === it.patrimoineId &&
          struct.platformId === it.platformId &&
          struct.dynamicId === it.dynamicId
        );
      });
      this.buildingStructure.splice(idx, 1);
    }
  }

  // used in parent compoment for back button
  public getParentOfSelected(): ISpaceSelectorItem | undefined {
    for (let idx = 0; idx < this.buildingStructure.length; idx++) {
      const item = this.buildingStructure[idx];
      if (
        item.platformId === this.selectedZone.platformId &&
        item.dynamicId === this.selectedZone.dynamicId &&
        item.staticId === this.selectedZone.staticId
      ) {
        const level = item.level;
        for (let i = idx; i >= 0; i--) {
          const it = this.buildingStructure[i];
          if (level > it.level) return it;
        }
        break;
      }
    }
  }

  showSign(): void {
    this.selectorHeight = this.buildingStructure.length * 56 + 60 + 30;
  }

  // animation methods
  beforeEnter(el: { style: { opacity: number; height: number } }) {
    el.style.opacity = 0;
    el.style.height = 0;
  }

  enter(el: { dataset: { index: number } }, done: any) {
    var delay = el.dataset.index * 5;
    setTimeout(function () {
      Velocity(el, { opacity: 1, height: '50px' }, { complete: done });
    }, delay);
  }

  onActionClick(data) {
    this.$emit('onActionClick', data);
  }
}
export default SpaceSelector;
</script>

<style scoped>
.staggered-fade-item {
  transition-timing-function: cubic-bezier(0.57, 0.06, 0, 1);
  transition-duration: 500ms;
  transition-property: transform;
  opacity: 0;
}

.staggered-fade-enter,
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.card-list {
  max-height: calc(100% - 64px);
  padding-top: 10px;
  padding-bottom: 10px;
  overflow: auto;
}

.space-selector {
  z-index: 10;
  width: calc(100% - 0px);
  /* max-width: 500px; */
  height: 59px;
  float: right;
  border-radius: 10px !important;
  overflow: hidden;
  transition: height 0.2s ease-in;
  box-shadow: none !important;
}

.space-selector-container {
  position: absolute;
  max-height: calc(100vh - 10px);
  width: 100%;
  right: 0;
  overflow: hidden;
  min-width: 250px;
}

.space-selector-container.isopen {
  width: 100%;
}

.space-selector-header {
  display: flex;
  align-items: center;
  border-radius: 0px;
  height: 59px;
  background-color: #14202c;
  cursor: pointer;
  z-index: 99;
}

.space-selector-header-title {
  width: calc(100% - 20px);
  display: flex;
  align-items: center;
  margin: 0;
  font-weight: 300;
  padding: 8px;
  font-size: 20px;
  color: #f5f5f5;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.space-selector-header-title-icon {
  margin-top: 5px;
  float: left;
  padding: 0 10px;
  font-size: 20px;
}

.space-selector-open {
  /* padding-bottom: 10px; */
  overflow-y: auto;
  max-height: calc(100vh - 20px);
}

.rotate-enabled {
  transform: rotate(-180deg);
  transition: transform 0.3s ease-in;
}

.card-hover:hover {
  background-color: #444;
}

::v-deep .v-btn--fab.v-size--default {
  height: 49px;
  width: 50px;
}

::v-deep .v-application p {
  margin-bottom: 0px !important;
}

.spinal-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 1px;
}

.spinal-scrollbar::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background: rgba(169, 169, 169, 0.9);
}

.spinal-scrollbar::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3); */
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

/* .backdrop-handler {
  color: #bfbfbf;
  position: absolute;
  top: 0px;
  width: 100vw;
  left: 0px;
  height: calc(100vh - 10px);
  background-color: #fff;
  z-index: 999;
  background: rgba(215, 215, 215, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
} */

.legend {
  color: #fff;
  font-size: 9px;
  position: absolute;
  top: 3px;
  left: 11px;
  letter-spacing: 1.1px;
}
</style>

<style>
html {
  scroll-behavior: smooth;
  overflow: auto;
}
</style>
