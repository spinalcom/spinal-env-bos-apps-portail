
<template>
  <div class="action-group" @click="openColorField()"
    :style="[
      { 'background': toggleColorField ? '#d9d9d9' : 'transparent' },
    ]">
    <v-icon class="action-icon icon rainbow-text">mdi-palette</v-icon>
    <span class="rainbow-text">{{ selected || 'Couleur' }}</span>
    <ColorMenu
      :toggle="toggleColorField"
      @select-color-type="selectColorType"
      />
  </div>
</template>

<script>
import ColorMenu from './ColorMenu.vue';
export default {
  name: 'ColorSelector',
  components: {
    ColorMenu,
  },
  props: [],
  data: () => ({
    selected: null,
    toggleColorField: false,
  }),
  methods: {
    selectColorType(name) {
      this.selected = name;
      this.$emit('select-color-type', this.selected);
    },
    openColorField() {
      this.$emit('close');
      this.toggleColorField = !this.toggleColorField;
    },
  },
};
</script>

<style scoped>
.action-group {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 5px;
  gap: 5px;
  transition: all 0.1s;
}
.action-group:hover {
  cursor: pointer;
  background: #d9d9d9 !important;
}
.rainbow-text {
  /*background: linear-gradient(90deg, #000000DE, #000000DE, #000000DE, red, orange, #ff0, green, #000000DE, #000000DE, #000000DE, #000000DE, #000000DE, #000000DE, #000000DE) 0 0 / 200% 100%;*/
  background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: 10s cubic-bezier(1, 0, 0, 1.01) infinite rainbow-animation;
}
@keyframes rainbow-animation {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
