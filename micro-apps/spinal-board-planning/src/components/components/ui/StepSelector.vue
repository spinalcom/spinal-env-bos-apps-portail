
<template>
  <div class="step-selector" @click="toggleSelector()">
    <div style="width: fit-content;">
      <Chip
      :text="'Ouvert'"
      :status="'open'" />
    </div>
    <div class="step-selector-content" :class="{ 'active': showSelector }">
      <div class="padding-holder"></div>
      <div v-for="step in stepList" :key="step.dynamicId">
        <div class="item">
          <div class="square" :style="{ 'background': step.color }"></div>
          <div class="step-name">{{ step.name }}</div>
        </div>
      </div>
      <div class="padding-holder"></div>
    </div>
    <div
      v-if="showSelector"
      @click="closeSelector"
      class="menu-overlay"
    ></div>
  </div>
</template>

<script>
import Chip from '../details/Chip.vue';
export default {
  name: 'StepSelector',
  components: {
    Chip,
  },
  props: [
    'stepList',
  ],
  data: () => ({
    showSelector: false,
  }),
  computed: {
    stepLength() {
      return this.stepList.length;
    },
  },
  mounted() {
  },
  methods: {
    toggleSelector() {
      this.showSelector = !this.showSelector;
    },
    closeSelector(event) {
      event.stopPropagation();
      this.showSelector = false;
    },
  },
};
</script>

<style scoped>
.step-selector {
  height: 100%;
  width: 100%;
}
.step-selector-content {
  position: absolute;
  top: 40px;
  right: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
  width: 100%;
  z-index: 1;
  border-radius: 10px;
  transition: all .3s cubic-bezier(1, 0.02, 0, 1.04);
  overflow: hidden;
  max-height: 0;
  border: 0px solid transparent;
  color: transparent;
  padding: 0 5px;
  z-index: 99;
}
.active {
  color: #575757;
  max-height: 500px;
  background: white;
  border: 1px solid #848484;
  box-shadow: -5px 3px 20px 1px #d9d9d933, -1px 16px 20px 13px #e7e7e724, 4px -6px 20px 2px #8989891f !important;
}
.item {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  transition: background .3s;
}
.item:hover {
  background: #f2f2f2;
}
.square {
  width: 7px;
  min-width: 7px;
  height: 10px;
  min-height: 10px;
  border-radius: 3px;
}
.padding-holder {
  min-height: 5px;
  background: white;
}
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 98;
}
</style>

