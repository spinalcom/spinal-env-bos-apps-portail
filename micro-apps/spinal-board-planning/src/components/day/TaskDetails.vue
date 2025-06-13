
<template>
  <div 
    :style="[
      { 'width': taskDetails ? 'calc(100% - 20px)' : '0px' },
      { 'max-width': taskDetails ? 'calc(100% - 20px)' : '0px' },
      { 'z-index': taskDetails ? '130' : '0' },
    ]"
    class="task-details-container">
    <div
      v-if="taskDetails"
      @click="resetTaskDetails()"
      class="task-details-close"></div>

    <div
      :style="[
        { 'padding': taskDetails ? '20px' : '0px' },
        { 'width': taskDetails ? '800px' : '0px' },
      ]"
      class="task-details">
      <div
        v-if="taskDetails">
        <div
          class="task-details-header">
          <h2 class="details-title">
            {{ taskDetails.name }}
          </h2>
          <div class="close-icon"
            @click="resetTaskDetails()">
            <v-icon
              class="icon close-icon-black">
              mdi-close
            </v-icon> 
          </div>
          <div class="sub-header">
            <Chip
              :text="'Ouvert'"
              :status="'open'" />
            <Chip
              :text="taskDetails.workflowName"
              :status="'no-status'" />
          </div>
        </div>
        <div class="main-details-container">
          <Description
            :task="taskDetails" />
          <EditDetails
            :task="taskDetails" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chip from '../components/details/Chip.vue';
import Description from '../components/details/Description.vue';
import EditDetails from '../components/details/EditDetails.vue';
export default {
  name: 'TaskDetails',
  components: {
    Chip,
    Description,
    EditDetails,
  },
  props: ['task'],
  data: () => ({
    taskDetails: null,
  }),
  mounted() {
    this.taskDetails = this.task;
    /*
    this.taskDetails = {
      "name": "démo",
      "description": "A demo task description placeholder text to show how the description will look like in the task details component.",
      "dates": [
        {
          "name": "Date de début estimée",
          "value": 1735340400000
        },
        {
          "name": "Date de fin estimée",
          "value": 1736636400000
        },
        {
          "name": "Aucne date de début",
          "value": null
        },
        {
          "name": "Aucne date de fin",
          "value": null
        },
        {
          "name": "Date de début réelle",
          "value": null
        },
        {
          "name": "Date de fin réelle",
          "value": null
        }
      ],
      "status": "Attente de lect.avant Execution",
      "workflowId": 74211712,
      "workflowName": "Demande d'intervention",
      "processId": 74209120,
      "processName": "BATIMENT/SECOND ŒUVRE/CLOS COU",
      "stepId": 74206624,
      "ticketId": 74203872,
      "state": "ticket",
    };
    */
  },
  methods: {
    resetTaskDetails() {
      this.$emit('resetTaskDetails');
    },
  },
  watch: {
    task: {
      handler: function (newVal, oldVal) {
        this.taskDetails = newVal;
      },
      deep: true,
    },
  },
}
</script>

<style>
.task-details-container {
  position: fixed;
  right: 10px;
  top: 80px;
  background: transparent;
  width: calc(100% - 20px);
  max-width: calc(100% - 20px);
  height: calc(100% - 96px);
  transition: background 0.3s;
}
.task-details {
  position: fixed;
  right: 10px;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  max-width: calc(100% - 20px);
  box-shadow: -20px 0px 20px 0px #c3c3c326;
  height: calc(100% - 96px);
  z-index: 9009;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  transition: width 0.3s;
}
.task-details-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  padding: 0 5px;
  border-radius: 5px;
}
.close-icon:hover {
  background: #f2f2f2;
}
.close-icon-black {
  color: #14202c !important;
  font-size: 16px !important;
}
.details-title {
  letter-spacing: 1.1px;
}
.task-details-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid #e2e2e2;
  padding-bottom: 10px;
}
.sub-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.main-details-container {
  display: flex;
  gap: 20px;
}
.indent-prevent {
}
</style>

