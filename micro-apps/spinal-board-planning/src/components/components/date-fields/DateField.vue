
<template>
  <div class="date-field">

    <div style="position: relative;">
      <div :style="[
        { 'background': toggleStartDateField ? '#d9d9d9' : 'transparent' },
        ]" class="action-group" @click="openStartDateField()">
        <v-icon class="action-icon icon"> mdi-calendar-week-begin-outline </v-icon>
        Début
      </div>
      <DateFieldSelector :toggle="toggleStartDateField" :type="'start'"
        @select-date-field="selectDateField" class="date-fields-selector" />
    </div>

    <div style="position: relative;">
      <div :style="[{ 'background': toggleEndDateField ? '#d9d9d9' : 'transparent' }]"
        class="action-group" @click="openEndDateField()">
        <v-icon class="action-icon icon transpose">mdi-calendar-week-begin-outline</v-icon>
        Fin
      </div>
      <DateFieldSelector :toggle="toggleEndDateField" :type="'end'"
      @select-date-field="selectDateField" class="date-fields-selector"/>
    </div>

  </div>
</template>

<script>
import DateFieldSelector from './DateFieldSelector.vue';
export default {
  name: 'DateField',
  components: {
    DateFieldSelector,
  },
  props: [],
  mounted() { },
  data: () => ({
    toggleStartDateField: false,
    toggleEndDateField: false,
    selected: {
      startDate: null,
      endDate: null,
    },
  }),
  methods: {
    openStartDateField() {
      if (this.toggleEndDateField) {
        this.toggleEndDateField = false;
      }
      this.toggleStartDateField = !this.toggleStartDateField;
    },
    openEndDateField() {
      if (this.toggleStartDateField) {
        this.toggleStartDateField = false;
      }
      this.toggleEndDateField = !this.toggleEndDateField;
    },
    selectDateField(type, name) {
      if (type === 'start') {
        this.selected.startDate = name;
      } else {
        this.selected.endDate = name;
      }
      this.$emit(type, name);
      this.toggleStartDateField = false;
      this.toggleEndDateField = false;
    },
    closeDateFields() {
      this.toggleStartDateField = false;
      this.toggleEndDateField = false;
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
.action-icon {
  font-size: 14px !important;
}
.date-fields-selector {
  cursor: normal;
}
.date-field {
  display: flex;
  gap: 10px;
}
.transpose {
  transform: scaleX(-1);
}
</style>

