
<template>
  <div class="content-plan"
    :style="{ 'height': this.initialHeight * taskHeight  + 'px' }">
    <!-- TaskDetails component -->
    <TaskDetails
      :task="selectedTaskDetails"
      />
    <!-- TodayMarker component -->
    <TodayMarker
      :dayWidth="dayWidth"
      :height="markerHeight"
      :offset="markerOffset"/>
    <!-- Sidebar component -->
    <SideBar class="side-bar" ref="sideBar"
      :ticketList="ticketList"
      :nestedList="nestedList"
      :start="start"
      :end="end"
      :viewPortEdges="viewPortEdges"
      :dayWidth="dayWidth"
      :taskHeight="taskHeight"
      :fontSize="fontSize"
      :selectedDateFields="selectedDateFields"
      @startTicket="startTicket"
      @bringDay="bringDay"
      @resizedSideBar="resizedSideBar"
      @showTicketDetails="showTicketDetails"
      @goto="goto"
      @taskListChanged="updateTaskList"
      />
    <!-- Task component -->
    <Task
      v-for="(task, index) in taskList"
      :key="task.state + index"
      :level="index"
      :task="task"
      :start="start"
      :dayWidth="dayWidth"
      :taskHeight="taskHeight"
      :fontSize="fontSize"
      :selectedDateFields="selectedDateFields"
      :colorType="colorType"
      @resizeWholePeriod="resizeWholePeriod"
      @resizeStart="resizeStart"
      @resizeEnd="resizeEnd"
      @showTicketDetails="showTicketDetails"
      @resetTaskDetails="$emit('resetTaskDetails')"
      @startTicket="startTicket"
      class="task-container"
      />
    <div v-for="(offset, index) in weekLines"
      :key="index"
      :style="[
        { 'left': (offset - dayWidth * 2) + 'px' },
        { 'height': markerHeight - 5 + 'px' },
        { 'width': dayWidth * 2 + 'px'},
      ]"
      class="week-separator-long "
      ></div>
  </div>
</template>

<script>
import dates from '../../services/tickets/dates.js';
import SideBar from './SideBar';
import TodayMarker from './TodayMarker';
import Task from './Task';
import TaskDetails from './TaskDetails';
import moment from 'moment';
moment.locale('fr');
export default {
  name: 'CalendarContent',
  props: [
    'ticketList',
    'nestedList',
    'separator',
    'start',
    'end',
    'viewPortEdges',
    'dayWidth',
    'taskHeight',
    'fontSize',
    'selectedDateFields',
    'colorType',
  ],
  components: {
    Task,
    TaskDetails,
    SideBar,
    TodayMarker,
  },
  data: () => ({
    initialHeight: 0,
    taskList: [],
    selectedTaskDetails: null,
  }),
  computed: {
    weekLines() {
      const mondayLines = [];
      const diff = this.end.diff(this.start, 'days');
      for (let i = 8 - this.start.day(); i <= diff; i += 7) {
        mondayLines.push(i * this.dayWidth);
      }
      return mondayLines;
    },
    markerHeight() {
      const workflowLength = this.nestedList.length;
      const processLength = this.nestedList.reduce((acc, curr) => acc + curr.processes.length, 0);
      const taskLength = this.ticketList.length;
      const initialTasks = workflowLength + processLength + taskLength;
      return initialTasks * this.taskHeight + 5;
    },
    markerOffset() {
     return moment().diff(this.start, 'days') * this.dayWidth;
    },
  },
  mounted() {
    const stepNames = new Set();
    this.ticketList.forEach((ticket) => {
      stepNames.add(ticket.status);
    });
    const stepList = Array.from(stepNames);
    this.calculateHeight();
  },
  methods: {
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
    updateTaskList(event) {
      this.calculateHeight();
      this.taskList = event;
    },
    resizedSideBar(event) {
      this.$emit('resizedSideBar', event);
    },
    goto(event) {
      this.$emit('goto', event);
    },
    bringDay(ticket) {
      this.$emit('bringDay', ticket);
    },
    calculateHeight() {
      const workflowLength = this.nestedList.length;
      const processLength = this.nestedList.reduce((acc, curr) => acc + curr.processes.length, 0);
      const taskLength = this.ticketList.length;
      this.initialHeight = workflowLength + processLength + taskLength;
      this.$emit('planHeight', this.initialHeight * this.taskHeight);
    },
    async startTicket(task, estimatedStartDate) {
      this.$emit('startTicket', task, estimatedStartDate);
      // await dates.setEstimatedStart(task.ticketId, task.estimatedStartDate);
    },
  },
  watch: {
    nestedList(v1) {
    },
    taskHeight(v1) {
      this.calculateHeight();
    },
  }

}
</script>

<style scoped>
.content-plan {
  position: sticky;
  color: #888888;
  top: 0px;
  left: 0;
  min-height: 100%;
  width: calc(100%);
  z-index: 101;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}

.side-bar {
  position: sticky;
  top: 0;
  left: 0;
  background: white;
  height: 100%;
  z-index: 101;
  transition: left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}

.week-separator-long {
  background: #edeff0;
  border-left: 1px solid #E2E2E2;
  border-right: 1px solid #E2E2E2;
  min-height: 100%;
  position: absolute;
  top: 0;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
  z-index: 79;
}

.task-container{
  transition: top 0.3s ease-in-out;
}
</style>

