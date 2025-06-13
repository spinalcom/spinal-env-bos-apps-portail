
<template>
  <div class="edit-details-container">
    <div class="edit-status">
      <div class="edit-row">
        <span class="label">Statut</span>
        <div class="action">
          <StepSelector :stepList="stepList"></StepSelector>
        </div>
      </div>
      <div class="edit-row">
        <span class="label">Date de début estimée</span>
        <div class="action">
          <Menu
            :text="estimatedStartDate"
            @input="updateEstimatedStartDate"
          ></Menu>
        </div>
      </div>
      <div class="edit-row">
        <span class="label">Date de fin estimée</span>
        <div class="action" id="menu-activator-end">
          <Menu
            :text="estimatedEndDate"
            @input="updateEstimatedEndDate"
          ></Menu>
        </div>
      </div>
      <div class="edit-row">
        <span class="label">Date de début réelle</span>
        <div class="action">
          <span>{{ realStartDate }}</span>
        </div>
      </div>
      <div class="edit-row">
        <span class="label">Date de fin réelle</span>
        <div class="action">
          <span>{{ realEndDate }}</span>
        </div>
      </div>
    </div>
    <div class="danger-zone">
      <div class="edit-row">
        <span class="label">
          <v-icon class="icon">mdi-archive</v-icon>
          <span style="color: #FF0000 !important;">Archiver</span>
        </span>
        <div class="action">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dates from '../../../services/tickets/dates.js';
import step from '../../../services/tickets/step.js';
import moment from 'moment';
import Chip from './Chip.vue';
import Menu from '../ui/Menu.vue';
import StepSelector from '../ui/StepSelector.vue';
export default {
  name: 'EditDetails',
  components: {
    Chip,
    Menu,
    StepSelector,
  },
  props: [
    'task',
  ],
  data: () => ({
    stepList: [],
    menuEstimatedStart: false,
    menuEstimatedEnd: false,
  }),
  computed: {
    estimatedStartDate() {
      try {
        const formattedDate = moment(this.task.dates.find((date) =>
          date.name === 'Date de début estimée').value).format('DD/MM/YYYY');
        if (formattedDate === 'Invalid date')
          return 'Aucune date';
        return formattedDate;
      } catch (e) {
        return 'Aucune date';
      }
    },
    estimatedEndDate() {
      try {
        const formattedDate = moment(this.task.dates.find((date) =>
          date.name === 'Date de fin estimée').value).format('DD/MM/YYYY');
        if (formattedDate === 'Invalid date')
          return 'Aucune date';
        return formattedDate;
      } catch (e) {
        return 'Aucune date';
      }
    },
    realStartDate() {
      try {
        const formattedDate = moment(this.task.dates.find((date) =>
          date.name === 'Date de début réelle').value).format('DD/MM/YYYY');
        if (formattedDate === 'Invalid date')
          return 'Aucune date';
        return formattedDate;
      } catch (e) {
        return 'Aucune date';
      }
    },
    realEndDate() {
      try {
        const formattedDate = moment(this.task.dates.find((date) =>
          date.name === 'Date de fin réelle').value).format('DD/MM/YYYY');
        if (formattedDate === 'Invalid date')
          return 'Aucune date';
        return formattedDate;
      } catch (e) {
        return 'Aucune date';
      }
    },
  },
  async mounted() {
    const wid = this.task.workflowId;
    const pid = this.task.processId;
    this.stepList = await step.getStepsByProcess(wid, pid);
  },
  methods: {
    async updateEstimatedStartDate(date) {
      const formattedDate = moment(date, 'YYYY-MM-DD').valueOf();
      this.task.dates.find((d) =>
        d.name === 'Date de début estimée').value = formattedDate;
      await dates.setEstimatedStart(this.task.ticketId, formattedDate);
    },
    async updateEstimatedEndDate(date) {
      const formattedDate = moment(date, 'YYYY-MM-DD').valueOf();
      this.task.dates.find((d) =>
        d.name === 'Date de fin estimée').value = formattedDate;
      await dates.setEstimatedEnd(this.task.ticketId, formattedDate);
    },
  },
};
</script>

<style scoped>
.edit-details-container {
  display: flex;
  flex-direction: column;
  width: 350px !important;
  min-width: 350px;
}
.edit-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 0;
  border-bottom: 1px solid #E0E0E0;
}
.edit-row {
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 10px;
  width: 100%;
  padding-left: 10px;
}
.label {
  font-size: 12px;
  color: #747474;
  font-weight: 700;
  width: 150px !important;
  max-width: 200px;
}
.action {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  flex-grow: 1;
  border-radius: 5px;
  font-size: 12px;
  height: 30px;
  color: #575757;
}
.action:hover {
  background: #F5F5F5;
}
.danger-zone {
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;
  color: #FF0000 !important;
  font-weight: 700;
  border-radius: 5px;
  transition: background 0.3s;
}
.danger-zone:hover {
  background: #F5F5F5;
}
.icon {
  color: #FF0000 !important;
  font-size: 16px !important;
}
</style>

