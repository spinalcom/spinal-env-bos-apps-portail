
<template>
  <div class="description-container">
    <div class="description">
      <div class="description-header"
        :style="[
          { 'border-bottom-left-radius': task.description ? '0' : '10px' },
          { 'border-bottom-right-radius': task.description ? '0' : '10px' },
        ]">
        <div class="description-label">
          <v-icon class="icon description-icon">
            mdi-square-edit-outline
          </v-icon>
          <span>Ticket créé</span>
        </div>
        <div>
          <span>{{ creationDate }}</span>
        </div>
      </div>
      <div class="description-body" v-if="task.description">
        <span>{{ task.description }}</span>
      </div>
    </div>
    <LogStep 
      v-for="(step, index) in logList"
      :key="index"
      :step="stepExtraction(step)" />
  </div>
</template>

<script>
import LogStep from './LogStep.vue';
import config from '../../../config';
import moment from 'moment';
export default {
  name: 'TaskDetails',
  components: {
    LogStep,
  },
  props: [
    'task',
  ],
  computed: {
    creationDate() {
      return moment(this.task.logList[0].date).format('DD/MM/YYYY, HH:mm');
    },
    logList() {
      return this.task.logList.slice(1);
    },
  },
  data: () => ({
    stepList: [],
  }),
  mounted() {
    this.stepList = config.config.workflow.find((workflow) => 
      workflow.name === this.task.workflowName).steps;
  },
  methods: {
    stepExtraction(step) {
      const { event, date } = step;
      const name = event.split(' to ')[1];
      const currentStep = this.stepList.find((s) => s.name === name);
      const icon = currentStep.icon || 'mdi-cloud-off-outline';
      const color = currentStep.defaultColor || '#c4c4c4';
      return { icon, name, date, color };
    },
  },
};
</script>

<style scoped>
.description-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px;
}
.description {
  display: flex;
  flex-direction: column;
  border: 1px solid #E0E0E0;
  border-radius: 10px;
}
.description-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #14202C;
  color: white;
  text-transform: uppercase;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.description-label {
  display: flex;
  align-items: center;
  font-size: 12px !important;
  font-weight: 700;
}
.description-icon {
  cursor: pointer;
  margin-right: 10px;
  color: white !important;
}
.description-body {
  padding: 10px;
  font-size: 12px;
}
</style>

