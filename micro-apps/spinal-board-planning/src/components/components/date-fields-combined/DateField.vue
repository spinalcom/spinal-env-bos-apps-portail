
<template>
  <div class="date-field">
    <div style="position: relative;">
      <div
        :style="[
        { 'background': toggleDateField ? '#d9d9d9' : 'transparent' },
        ]"
        class="action-group"
        @click="toggleDateField = !toggleDateField">
        <v-icon class="action-icon icon">
          mdi-calendar-weekend
        </v-icon>
        Champs de date
      </div>
      <DateFieldsSelector
        :toggle="toggleDateField"
        @select-date-field="selectDateField"
        class="date-fields-selector"
      />
    </div>
  </div>
</template>

<script>
import DateFieldsSelector from './DateFieldsSelector.vue';
export default {
  name: 'DateField',
  components: {
    DateFieldsSelector,
  },
  props: [ ],
  mounted() { },
  data: () => ({
    toggleDateField: false,
    selected: {
      startDate: null,
      endDate: null,
    },
  }),
  methods: {
    selectDateField(type, name) {
      if (type === 'start') {
        this.selected.startDate = name;
      } else {
        this.selected.endDate = name;
      }
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

