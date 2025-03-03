<template>
  <div
    class="sprite_container pa-1"
    :style="{
      background: `conic-gradient(green ${gradient.firstStep}deg, orange ${gradient.firstStep}deg ${gradient.lastStep}deg, red ${gradient.lastStep}deg)`,
    }"
    @click.stop="onClick()"
  >
    <div
      class="sprite_color d-flex align-center justify-center"
      :style="{
        background: '#14202C',
        color: '#FFFFFF',
        'text-align': 'center',
        ...dynamicStyle,
      }"
    >
      {{ data.data.length }}
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
    gradient() {
      const len = this.data.data.length;
      const low = this.data.data.filter((d) => d.priority == 2).length;
      const mid = this.data.data.filter((d) => d.priority == 1).length;
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
      store.dispatch(ActionTypes.SELECT_SPRITES, [this.data.dynamicId]);
      store.commit(
        MutationTypes.SET_SELECTED_TICKETS,
        this.data.data.map((d) => d.dynamicId)
      );
      const floor = document.querySelector("#floor-sprite");
      floor.dispatchEvent(new Event("clickExteriorSprite"));
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
  width: "fit-content";
  height: "fit-content";
  box-shadow: none;
  color: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 100%;
}
.sprite_color {
  width: 20px;
  height: 20px;
  border-radius: 100%;
}
</style>
