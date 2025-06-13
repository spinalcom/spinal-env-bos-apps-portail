
<template>
  <div class="date-fields-selector"
    :style="[
      { 'left': type === 'start' ? '-62px' : '-75px' },
    ]"
    :class="toggle ? 'open' : 'close'">
    <div class="date-field-selector">
      <div class="header">
        <span class="date-title">
          Date de {{ type === 'start' ? 'début' : 'fin' }}
        </span>
      </div>
      <div class="date-field-list">
        <div
          v-for="(dateField, index) in dateFields"
          class="date-field-item"
          @click="selectDateField(dateField.name)">
          <v-icon
            :style="[
            { 'color': selected === dateField.name ? '#757575' : 'transparent' },
            ]"
            class="date-icon"
          >mdi-check</v-icon>
          <v-icon class="date-icon">{{ dateField.icon }}</v-icon>
          <span
            :style="[
              { 'font-weight': selected === dateField.name ? '700' : '400' },
            ]"
            class="item-name">
            {{ dateField.name }}
          </span>
        </div>
        <div 
          v-if="type === 'start'"
          @click="selectDateField('Aucune date de début')"
          class="date-field-item">
          <v-icon
            :style="[
            { 'color': selected === 'Aucune date de début' ? '#757575' : 'transparent' },
            ]"
            class="date-icon"
          >mdi-check</v-icon>
          <span
            :style="[
              { 'font-weight': selected === 'Aucune date de début' ? '700' : '400' },
            ]"
            class="item-name">Aucune date de début</span>
        </div>
        <div 
          v-else-if="type === 'end'"
          @click="selectDateField('Aucune date de fin')"
          class="date-field-item">
          <v-icon
            :style="[
            { 'color': selected === 'Aucune date de fin' ? '#757575' : 'transparent' },
            ]"
            class="date-icon">
            mdi-check
          </v-icon>
          <span 
            :style="[
              { 'font-weight': selected === 'Aucune date de fin' ? '700' : '400' },
            ]"
            class="item-name">Aucune date de fin</span>
        </div>
        <div style="height: 5px;"></div>
      </div>
    </div>

  </div>
</template>

<script>
import config from '../../../config.js';
export default {
  name: 'DateFieldsSelector',
  props: [
    'toggle',
    'type',
  ],
  mounted() {
  },
  data: () => ({
    selected: null,
    dateFields: [
      {
        icon: 'mdi-calendar-blank-outline',
        name: 'Date de début estimée',
      },
      {
        icon: 'mdi-calendar-blank-outline',
        name: 'Date de début réelle',
      },
      {
        icon: 'mdi-calendar-blank-outline',
        name: 'Date de fin estimée',
      },
      {
        icon: 'mdi-calendar-blank-outline',
        name: 'Date de fin réelle',
      },
    ],
  }),
  mounted() {
    this.selected = this.type === 'start' ? 'Date de début estimée' : 'Date de fin estimée';
    this.emitDateField();
    const workflowList = config.config.workflow;
    const stepList = workflowList.flatMap(workflow => workflow.steps);
    this.dateFields = this.dateFields.concat(stepList.map(step => ({
      icon: 'mdi-note-text-outline',
      name: step.name,
    })));
  },
  methods: {
    selectDateField(name) {
      this.selected = name;
      this.emitDateField();
    },
    emitDateField() {
      this.$emit('select-date-field', this.type, this.selected);
    },
  }
}
</script>

<style scoped>
.date-fields-selector {
  position: absolute;
  top: 25px;
  width: 202px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  z-index: 900;
  transition: all 0.3s ease-in-out;
}
.open {
  opacity: 1;
  max-height: 900px;
  border: 1px solid #F2F2F2;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.04);
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

