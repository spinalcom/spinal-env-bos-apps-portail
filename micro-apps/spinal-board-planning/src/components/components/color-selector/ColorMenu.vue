
<template>
  <div class="date-fields-selector" :class="toggle ? 'open' : 'close'">
    <div class="date-field-selector">
      <div class="header">
        <span class="date-title">
          Colorer par
        </span>
      </div>
      <div class="date-field-list">
        <div
          v-for="(color, index) in typeColor"
          class="date-field-item"
          @click="selectColorType(color.name)">
          <v-icon
            :style="[
            { 'color': selected === color.name ? '#757575' : 'transparent' },
            ]"
            class="date-icon">mdi-check</v-icon>
          <!--
            <v-icon class="date-icon">{{ color.icon }}</v-icon>
          -->
          <span
            :style="[
              { 'font-weight': selected === color.name ? '700' : '400' },
            ]"
            class="item-name">
            {{ color.name }}
          </span>
        </div>
        <div style="height: 5px;"></div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'ColorMenu',
  props: [
    'toggle',
  ],
  mounted() {
  },
  data: () => ({
    selected: null,
    typeColor: [
      {
        icon: 'mdi-palette-outline',
        name: 'Priorité',
      },
      {
        icon: 'mdi-palette-outline',
        name: 'Etape',
      },
      {
        icon: 'mdi-palette-outline',
        name: 'Processus',
      },
      {
        icon: 'mdi-palette-outline',
        name: 'Réinitialiser la couleur',
      },
    ],
  }),
  mounted() {},
  methods: {
    async selectColorType(name) {
      if (name === 'Réinitialiser la couleur') {
        this.selected = null;
      } else {
        this.selected = name;
      }
      this.emitDateField();
    },
    emitDateField() {
      this.$emit('select-color-type', this.selected);
    },
  }
}
</script>

<style scoped>
.date-fields-selector {
  position: absolute;
  top: 30px;
  width: 202px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  z-index: 900;
  transition: max-height .3s cubic-bezier(1, 0.01, 0, 1.1), opacity .1s ease-in-out, border .1s ease-in-out, box-shadow .3s ease-in-out;
}
.open {
  opacity: 1;
  max-height: 900px;
  border: 1px solid #848484;
  box-shadow: -5px 3px 20px 1px #d9d9d933, -1px 16px 20px 13px #e7e7e724, 4px -6px 20px 2px #8989891f !important;
}
.close {
  opacity: 0;
  max-height: 0;
  border: 1px solid transparent;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0);
}
.header {
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 10px 5px;
  width: 100%;
  height: 30px;
}
.date-title {
  font-size: 10px !important;
  font-weight: 700;
  color: #8d8d8d;
}
.date-field-list {
  padding: 0 5px;
  display: flex;
  flex-direction: column;
}
.date-field-item {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 5px;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  letter-spacing: 0.5px !important;
}
.date-field-item:hover {
  cursor: pointer;
  background-color: #F2F2F2;
}
.date-icon {
  font-size: 14px !important;
}
.item-name {
  flex-grow: 1;
}
</style>

