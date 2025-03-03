<template>
  <div
    id="floor-sprite"
    class="sprite_container rounded-circle pa-1"
    :style="{
      background: `conic-gradient(green ${gradient.firstStep}deg, orange ${gradient.firstStep}deg ${gradient.lastStep}deg, red ${gradient.lastStep}deg)`,
    }"
    @click.stop="onClick"
    @clickExteriorSprite="_isNotSelected()"
  >
    <div
      class="sprite_color rounded-circle d-flex flex-grow-1 align-center justify-center"
      :style="{
        background: '#14202C',
        color: '#FFFFFF',
        'text-align': 'center',
        ...dynamicStyle,
      }"
    >
      {{ floorValue }}
    </div>
  </div>
</template>
<script>
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
} from "spinal-viewer-event-manager";
import { store } from "../../services/store";
import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import { MutationTypes } from "../../services/store/appDataStore/mutations";

export default {
  props: {
    data: {},
  },
  filters: {
    round(value) {
      try {
        if (typeof value === "string" && value.length === 0) return "";
        var num = Number(value);
        var rounded = num.toFixed(2);
        return Number(rounded);
      } catch (error) {
        console.error(error);
        return "";
      }
    },
  },
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    dynamicStyle: {
      boxShadow: "none",
    },
  }),

  computed: {
    floorValue() {
      return this.data?.data?.length || 0;
    },
    gradient() {
      const len = this.data?.data?.length || 1;
      const low = this.data?.data?.filter((d) => d.priority == 2)?.length || 0;
      const mid = this.data?.data?.filter((d) => d.priority == 1)?.length || 0;
      const first = Math.round(360 * (low / len));
      const last = first + Math.round(360 * (mid / len));
      return {
        firstStep: first,
        lastStep: last,
      };
    },
  },

  mounted() {},
  methods: {
    onClick() {
      const emitterHandler = EmitterViewerHandler.getInstance();
      emitterHandler.emit(VIEWER_SPRITE_CLICK, { node: this.data });
      this._isSelected();
      store.dispatch(ActionTypes.SELECT_SPRITES, []);
      store.commit(
        MutationTypes.SET_SELECTED_TICKETS,
        this.data.data.map((d) => d.dynamicId)
      );
    },
    _isSelected() {
      this.dynamicStyle = {
        boxShadow: "0px 0px 10px 2px #00A2FF",
      };
    },
    _isNotSelected() {
      this.dynamicStyle = {
        boxShadow: "none",
      };
    },
  },
};
</script>

<style scoped>
.sprite_container {
  aspect-ratio: 1/1;
  box-shadow: none;
  color: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.sprite_color {
  aspect-ratio: 1/1;
}
</style>
