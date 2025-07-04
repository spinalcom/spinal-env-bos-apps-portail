<template>
  <div class="list-wrapper" :class="classesLegend">
    <div class="list">
      <div class="item" v-for="(item, i) in listItem" :key="i">
        <div class="color" :style="{ background: item.color }" :class="getClass(item.type)"></div>
        <div class="title">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { type Legend } from "../../interfaces/ILegend";

export default {
  props: {
    listItem: {
      type: Array<Legend>,
      required: false,
      default() {
        return [];
      },
      validator(arr: any) {
        for (const cell of arr) {
          if (!cell.hasOwnProperty("title") || !cell.hasOwnProperty("color") || !cell.hasOwnProperty("type")) {
            return false;
          }
        }
        return true;
      },
    },
  },
  setup(props) {
    const toggledLegend = ref(true);

    return { props, toggledLegend };
  },
  methods: {
    toggleLegend() {
      this.toggledLegend = !this.toggledLegend;
    },
    getClass(type) {
      switch (type) {
        case 'line':
          return 'line-class';
        case 'border':
          return 'border-class';
        case 'rectangle':
          return 'rectangle-class';
        default:
          return 'rectangle-class';
      }
    },
  },
  computed: {
    classesLegend() {
      return this.toggledLegend ? "slide-down-anim" : "slide-up-anim";
    },
  },
};
</script>

<style lang="scss" scoped>
.list-wrapper {
  // Increase this value in order to scale the components
  --global-font-size: 15px;

  --height-legend-list: 15em;
  --height-legend-action-bar: 2em;

  z-index: 5;
  position: relative;
  height: fit-content;
  width: fit-content;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0.5em;
  font-size: var(--global-font-size);
}

.list {
  background: rgba(255, 255, 255, 1);
  border-radius: 0.5em;
  padding: 1.5em 1.5em 1.5em 1.5em !important;
  overflow: hidden;
  height: 100%;
  width: 100%;
  box-shadow: 0px 10px 8px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  flex-wrap: wrap;

  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 1.5em;
    overflow-x: hidden;
    overflow-y: hidden;
    margin-bottom: 0.5em;
    cursor: pointer;

    .color {
      // border-radius: 0.2em;
      // border: 0.1em solid rgb(0, 0, 0);
      // width: 2.5em !important;
      // height: 40%;
      // box-shadow: 0px 10px 8px -5px rgba(0, 0, 0, 0.1);
    }

    .title {
      margin-left: 1.7em;
      text-align: start;
      // text-transform: uppercase;
      font-size: 0.8em !important;
      font-family: charlevoix, sans-serif !important;
      color: rgb(158, 158, 158);
      font-weight: 600;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

@keyframes slide-down {
  0% {
    height: var(--height-legend-list) !important;
  }

  100% {
    height: var(--height-legend-action-bar) !important;
  }
}

@keyframes slide-up-keyframes {
  from {
    height: var(--height-legend-action-bar) !important;
  }

  100% {
    height: var(--height-legend-list) !important;
  }
}

.slide-down-anim {
  // animation: slide-down 1s both !important;
}

.slide-up-anim {
  // animation: slide-up-keyframes 1s both !important;
}

.line-class {
  // Add your styles for line type here
  border-radius: 0em;
  height: 20%;
  width: 2.5em !important;
  // box-shadow: 0px 10px 8px -5px rgba(0, 0, 0, 0.1);
}

.border-class {
  // Add your styles for border type here
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background-color: white !important;
  border: 3px solid #d7270c;
  margin-left: 0.7rem;
  margin-right: 0.4rem;
  // animation: blink-border 1.5s infinite steps(1);
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

.rectangle-class {
  border-radius: 0.2em;
  // border: 0.1em solid rgb(0, 0, 0);
  width: 2.5em !important;
  height: 40%;
  box-shadow: 0px 10px 8px -5px rgba(0, 0, 0, 0.1);
}
</style>
