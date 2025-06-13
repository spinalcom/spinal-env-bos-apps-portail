
<template>
  <div class="task"
    ref="wideTask"
    :style="[
      { 'top': level * taskHeight + 'px' },
      { 'height': taskHeight + 'px' },
    ]"
    @mouseenter="startListening"
    @mouseleave="stopListening"
  >
    <div
      v-if="!estimatedStartDate && task.state === 'ticket' && mouseMoveHandler && selectedDateFields.selectedStart === 'Date de début estimée'"
      :style="[
        { 'left': Math.floor(mouseX / dayWidth) * dayWidth + 'px' },
        { 'height': (taskHeight - 8) + 'px' },
        { 'width': dayWidth + 'px' },
        { 'min-width': dayWidth + 'px' },
      ]"
      @click="startTicket"
      class="hovered-task">
      <v-icon
        :style="[{ 'font-size': fontSize.medium + 'px' }]"
        class="goto-icon icon">
        mdi-plus
      </v-icon>
    </div>
    <Period
      v-if="task.type === 'ticket'"
      :dayWidth="dayWidth"
      :taskHeight="taskHeight"
      :task="task"
      :start="start"
      :fontSize="fontSize"
      :selectedDateFields="selectedDateFields"
      :colorType="colorType"
      @resizeWholePeriod="resizeWholePeriod"
      @resizeStart="resizeStart"
      @resizeEnd="resizeEnd"
      @showTicketDetails="showTicketDetails"
      @resetTaskDetails="$emit('resetTaskDetails')"
    />
    <GroupPeriod
      v-else
      :dayWidth="dayWidth"
      :taskHeight="taskHeight"
      :task="task"
      :start="start"
      :fontSize="fontSize"
      :selectedDateFields="selectedDateFields"
      :colorType="colorType"
      @resizeWholePeriod="resizeWholePeriod"
      @resizeStart="resizeStart"
      @resizeEnd="resizeEnd"
      @showTicketDetails="showTicketDetails"
      @resetTaskDetails="$emit('resetTaskDetails')"
    />
  </div>
</template>

<script>
import Period from './TaskPeriod';
import GroupPeriod from './GroupPeriod';

export default {
  name: 'TaskItem',
  props: [
    'task',
    'level',
    'start',
    'dayWidth',
    'taskHeight',
    'fontSize',
    'selectedDateFields',
    'colorType',
  ],
  components: {
    Period,
    GroupPeriod,
  },
  mounted() {
    // client width of the task container
    const taskContainer = this.$refs.wideTask.clientWidth;
  },
  computed: {
    estimatedStartDate() {
      try {
        const selectedStartDate = this.selectedDateFields.selectedStart;
        const date = this.task.dates.find(date => date.name === selectedStartDate);
        const value = date ? date.value : null;
        if (value) {
          return value;
        } else {
          const selectedEndDate = this.selectedDateFields.selectedEnd;
          const endDate = this.task.dates.find(date => date.name === selectedEndDate);
          const endValue = endDate ? endDate.value : null;
          if (endValue) {
            return moment(endValue).startOf('day').valueOf();
          }
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    estimatedEndDate() {
      try {
        const selectedEndDate = this.selectedDateFields.selectedEnd;
        const d = this.task.dates.find(date => date.name === selectedEndDate);
        return d ? d.value : null;
      } catch (error) {
        return null;
      }
    },
  },
  data: () => ({
    mouseX: null,
    mouseMoveHandler: null,
  }),
  methods: {
    startTicket() {
      const startClick = Math.floor(this.mouseX / this.dayWidth);
      const estimatedStartDate = this.start
        .clone().add(startClick, 'days')
        .startOf('day').valueOf();
      // const estimatedEndDate = estimatedStartDate.clone().endOf('day');
      this.$emit('startTicket', this.task, estimatedStartDate);
    },
    startListening() {
      if (this.estimatedStartDate || this.task.state !== 'ticket') {
        return;
      }

      // Define the mousemove event handler
      this.mouseMoveHandler = (event) => {
        const taskElement = this.$refs.wideTask;

        // Calculate the X position relative to the task component
        const rect = taskElement.getBoundingClientRect();
        this.mouseX = event.clientX - rect.left;
      };

      // Add the event listener
      window.addEventListener('mousemove', this.mouseMoveHandler);
    },
    stopListening() {
      // Remove the mousemove event listener
      if (this.mouseMoveHandler) {
        window.removeEventListener('mousemove', this.mouseMoveHandler);
        this.mouseMoveHandler = null; // Clear the handler
      }
    },
    showTicketDetails(task) {
      this.$emit('showTicketDetails', task);
    },
    resizeWholePeriod(task, estimatedStartDate, estimatedEndDate) {
      this.$emit('resizeWholePeriod', task, estimatedStartDate, estimatedEndDate);
    },
    resizeStart(task, estimatedStartDate) {
      this.$emit('resizeStart', task, estimatedStartDate);
    },
    resizeEnd(task, estimatedEndDate) {
      this.$emit('resizeEnd', task, estimatedEndDate);
    },
  },
  watch: {
  },
}
</script>

<style scoped>
.task {
  position: absolute;
  z-index: 80;

  display: flex;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  width: calc(100% - 10px);

  align-items: center;

  background: transparent;

  transition: width 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out, background .1s ease-in-out;
}
.task:hover {
  background: #d5d7d62b;
}
.hovered-task {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #474747;
  background: white;
  border-radius: 5px;
  border: 1px solid #E2E2E2;
  box-shadow: 4px 3px 5px 0px #A0A0A024;
  transition: all 0.3s, width 0s, left 0s ease-in-out;
  cursor: pointer;
}
</style>

