<template>
  <div @click.stop="onClick" :class="['sprite_container', { blinker: data.self_status === 'inactive' && this.data.clignot }]">
    <div :class="{
      sprite_color:
        data.data.parent !== null && data.data.parent !== undefined,
      sprite_color2:
        data.data.parent === null || data.data.parent === undefined,
    }" :style="{ backgroundImage: `url(${dataImageUrl})`, ...dynamicStyle }"></div>
    <div v-if="showDetails" class="sprite_details">
      <div class="close-details" @click.stop="closeDetails"></div>
      <div class="row-space-between">
        <div class="title" style="font-size: 0.9rem !important">
          {{ data.typologie }}
        </div>
        <div class="title" :style="{
          fontSize: '0.7rem!important',
          color:
            data.status === 'inactive'
              ? 'red'
              : data.status === 'active'
                ? 'green'
                : 'inherit',
        }">
          {{ data.status }}
        </div>
      </div>
      <div class="description-text" style="font-size: 0.6rem !important; margin-top: -10px !important">
        {{ data.name }}
      </div>
      <div class="endpoints-container">
        <div v-for="(endpoint, index) in data.endpoints" :key="index" class="endpoint-item">
          <p class="title" style="font-size: 1.3rem !important; margin-bottom: 10px !important">
            {{ formatValue(endpoint.value) }}
          </p>
          <p class="title" style="font-size: 0.7rem !important">
            {{ endpoint.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
} from "spinal-viewer-event-manager";
import { EventBus } from "./EventBus";
// import { ActionTypes } from "../../interfaces/vuexStoreTypes";
// import lodash from "lodash";
// import { State } from "vuex-class";
// import { MutationTypes } from "../../services/store/appDataStore/mutations";
// // import { ActionTypes } from "../store/actions";
// import { IConfig } from "../../interfaces/IConfig";

export default {
  props: {
    data: {},
  },
  data() {
    return {
      fav: true,
      menu: false,
      message: false,
      hints: true,
      dynamicStyle: {
        border: "2px solid #F9F9F9",
        boxShadow: "none",
      },
      dataImageUrl: "",
      showDetails: false,
      selectedNodeId: null,
    };
  },
  async mounted() {
    const typologie = this.data.data.typologie || "default";
    this.dataImageUrl = await this.getImageUrl(typologie);
  },
  methods: {
    async getImageUrl(typologie) {
      const imageMapping = this.data.imageMapping;

      if (imageMapping.hasOwnProperty(typologie)) {
        return imageMapping[typologie];
      }
      console.warn(
        `Image not found for typologie ${typologie}, using default image.`
      );
      return imageMapping.Default;
    },
    onClick() {
      // console.log("Sprite -onClick", this.data);
      const emitterHandler = EmitterViewerHandler.getInstance();
    
      emitterHandler.emit(VIEWER_SPRITE_CLICK, { node: this.data });
      //EventBus.$emit("toggle-children", this.data.dynamicId);
      // console.log("Sprite -onClick", this.data);
      EventBus.$emit("table-node-click", this.data, 2);
      
    },

    formatValue(value) {
      // Check if the value is a number
      if (typeof value === "number") {
        // Return the number rounded to one decimal place
        return value.toFixed(1);
      }
      // If it's not a number, return the value as is
      return value;
    },
    _isSelected() {
      this.dynamicStyle = {
        border: "2px solid #F9F9F9",
        boxShadow: "0px 0px 10px 2px #00A2FF",
      };
    },
    _isNotSelected() {

      this.dynamicStyle = {
        border: "3px solid #F9F9F9",
        boxShadow: "none",
      };
    },
  },
};
</script>
<style scoped>
.sprite_container {
  width: fit-content;
  height: fit-content;
  background: none;
  box-shadow: none;
  color: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  /* Ensure relative positioning */
  overflow: visible;
  /* Ensure child elements are not clipped */
  z-index: 1;
  /* Set a base z-index */

  /* animation: blinker 1s linear infinite; */
}

.blinker {
  border: 3px solid #d7270c;
  /* Initial border color */
  display: inline-block;
  box-sizing: border-box;
  animation: blink-border 1.5s infinite steps(1);
  /* Use steps(1) for instant change */
  border-radius: 50%;
}

@keyframes blink-border {

  0%,
  50% {
    border-color: #d7270c;
    /* Red border */
  }

  51%,
  100% {
    border-color: transparent;
    /* Transparent border */
  }
}

.sprite_color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  z-index: 2;
  background: #fff;
  background-size: contain;
}

/* .sprite_color:hover {
  width: 22px;
  height: 22px;
} */
.sprite_color2 {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  z-index: 2;
  background: #fff;
  background-size: contain;
}

/* .sprite_color2:hover {
  width: 26px;
  height: 26px;
} */
.sprite_details {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 200px;
  /* overflow-y: scroll;
  overflow-x: hidden; */
  display: flex;
  flex-direction: column;
  transform: translateX(-50%);
  background: #fff;
  padding: 0px 10px;
  border-radius: 7px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 9999 !important;
  white-space: nowrap;
  color: #14202c;
}

.close-details {
  height: 10px;
  width: 10px;
  background-color: red;
  border-radius: 50%;
  margin: 5px 0px;
  margin-bottom: -3px;
}

.row-space-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.endpoints-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 4%;
  /* Space between items */
  overflow-y: auto;
}

.endpoint-item {
  /* flex: 0 0 40%; Adjusting for the gap */
  width: 48%;
  border: 1px solid rgba(128, 128, 128, 0.5);
  /* Thin grey border with low opacity */
  padding: 10px 2px;
  box-sizing: border-box;
  /* Include padding in width calculation */
  margin-bottom: 10px;
  /* Space between rows */
  text-align: center;
  color: #14202c !important;
}
</style>
