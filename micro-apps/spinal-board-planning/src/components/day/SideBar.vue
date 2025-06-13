
<template>
  <div class="side-bar" ref="sideBar"
    :style="[
    { width: sidebarWidth + 'px !important'},
    ]">
    <div class="sidebar-resize"
      :style="[
      { 'cursor': isResizing ? 'ew-resize !important' : 'normal'},
      { 'border-right': isResizing ? '2px solid grey' : '1px solid #E2E2E2'},
      ]"
      @mousedown="startresize">
    </div>

    <!-- Workflow Container -->
    <div
      v-for="(workflow, wIndex) in nestedList"
      :key="workflow.workflowName + wIndex"
      :style="[
        { height: workflowHeight(workflow) + 'px' },
        { 'z-index': wIndex },
      ]"
      class="workflow-container">

      <!-- WORKFLOW TITLE -->
      <div
        :style="[
          { 'font-size': fontSize.big + 'px' },
          { height: taskHeight + 'px' },
          { 'min-height': taskHeight + 'px' },
        ]"
        class="workflow">

        <span class="group-flex ellipsis">
          <div class="rect"></div>
          {{ workflow.workflowName }}
        </span>
        <v-icon 
          :class="[
            { 'open': workflow.state === 'open' },
            { 'close': workflow.state === 'close' },
          ]"
          :style="[
            { 'font-size': fontSize.big + 'px' },
            { height: taskHeight - 4 + 'px' },
            { width: taskHeight - 4 + 'px' },
            { minWidth: taskHeight - 4 + 'px !important' },
          ]"
          class="goto-icon icon dropdown"
          @click="toggle('workflow', workflow)">
          mdi-chevron-down
        </v-icon>
      </div>

      <!-- PROCESS CONTAINER -->
      <template v-if="workflow.state === 'open'"> 
        <div
          v-for="(process, pIndex) in workflow.processes"
          :key="process.processName + pIndex"
          :style="[
            { 'font-size': fontSize.medium + 'px' },
            { height: processHeight(process) + 'px' },
            { 'z-index': pIndex },
          ]"
          class="workflow-container">
          <!-- PROCESS TITLE -->
          <div
            :style="[
              { height: taskHeight + 'px' },
              { 'min-height': taskHeight + 'px' },
            ]"
            class="process">
            <span class="ellipsis">
              {{ process.processName }}
            </span>
            <v-icon 
              :class="[
                { 'open': process.state === 'open' },
                { 'close': process.state === 'close' },
              ]"
              :style="[
                { 'font-size': fontSize.medium + 'px' },
                { height: taskHeight - 4 + 'px' },
                { width: taskHeight - 4 + 'px !important' },
                { minWidth: taskHeight - 4 + 'px !important' },
              ]"
              class="goto-icon icon dropdown"
              @click="toggle('process', process)">
              mdi-chevron-down
            </v-icon>
          </div>

          <!-- TICKETS -->
          <template v-if="process.state === 'open'">
            <div
              v-for="(ticket, index) in process.ticketList"
              :key="ticket.name + index"
              :style="[
                { 'font-size': fontSize.medium + 'px' },
                { height: taskHeight + 'px' },
                { 'z-index': index },
              ]"
              class="ticket">
              <!-- STATUS COMPONENT -->
              <Status 
                :fontSize="fontSize"
                :status="ticket.status"
                />
              <span class="ellipsis clickable-ticket"
                @click="logTicketDetails(ticket)">
                {{ ticket.name }}
              </span>
              <div
                v-if="fallingIn(startDate(ticket))"
                :style="[
                  { height: (taskHeight - 5) + 'px' },
                ]"
                class="goto-ticket"
                @click="bringDay(ticket, fallingIn(startDate(ticket)))">
                <v-icon 
                  :style="[{ 'font-size': fontSize.medium + 'px' }]"
                  class="goto-icon icon">
                  {{ fallingIn(startDate(ticket)) }}
                </v-icon>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash';
import moment from 'moment';
moment.locale('fr');
import Status from './Status.vue';
import { setStartEndLimits } from '../../services/tickets/dates';
export default {
  name: 'SideBar',
  props: [
    'ticketList',
    'nestedList',
    'viewPortEdges',
    'dayWidth',
    'taskHeight',
    'fontSize',
    'selectedDateFields',
  ],
  components: {
    Status
  },
  data: () => ({
    sidebarWidth: 300,
    endOfResizeWidth: 300,
    startX: 0,
    isResizing: false,
  }),
  mounted() {
    this.$emit('taskListChanged', this.flattenedList(this.nestedList));
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const contentRect = entry.contentRect.width;
        this.$emit('resizedSideBar', this.sidebarWidth);
      }
    });
    this.resizeObserver.observe(this.$refs.sideBar);
  },
  methods:{
    logTicketDetails(ticket) {
      this.$emit('showTicketDetails', ticket);
    },
    startDate(ticket) {
      if (!ticket.dates || !Array.isArray(ticket.dates)) {
        return null;
      }
      try {
        const date = ticket.dates
          .find(date => date.name === this.selectedDateFields.selectedStart);
        if (ticket.name === 'démo') {
        }
        return ticket.dates
          .find(date => date.name === this.selectedDateFields.selectedStart).value;
      } catch (error) {
        return null;
      }
    },
    endDate(ticket) {
      return ticket.dates
        .find(date => date.name === this.selectedDateFields.selectedEnd).value;
    },
    toggle(type, item) {
      if (type === 'workflow') {
        item.state = item.state === 'open' ? 'close' : 'open';
      }
      else if (type === 'process') {
        item.state = item.state === 'open' ? 'close' : 'open';
      }
      this.$emit('taskListChanged', this.flattenedList(this.nestedList));
    },
    flattenedList(nestedList) {
      setStartEndLimits(nestedList, this.selectedDateFields);
      const flatRes = nestedList.reduce((acc, workflow) => {
        acc.push(workflow);
        if (workflow.state === 'open') {
          workflow.processes.forEach(process => {
            acc.push(process);
            if (process.state === 'open') {
              acc.push(...process.ticketList);
            }
          });
        }
        return acc;
      }, []);
      console.log('Flat res:', flatRes);
      return flatRes;
    },
    workflowHeight(workflow) {
      if (!Array.isArray(workflow.processes) || workflow.state === 'close') {
        return this.taskHeight;
      }

      return (workflow.processes.reduce((acc, process) =>
        acc + 1 + (process.ticketList && process.state === 'open'
          ? process.ticketList.length : 0)
        , 0) + 1) * this.taskHeight;
    },
    processHeight(process) {
      if (!Array.isArray(process.ticketList) || process.state === 'close') {
        return this.taskHeight;
      }

      return (process.ticketList.length + 1) * this.taskHeight;
    },
    startresize: throttle( function (event) {
      this.startX = event.clientX;
      this.isResizing = true;
      window.addEventListener('mousemove', this.resizeSidebar);
      window.addEventListener('mouseup', this.stopResize);
    }, 10),
    resizeSidebar(event) {
      this.sidebarWidth = this.endOfResizeWidth + event.clientX - this.startX;
      if (this.sidebarWidth <= 42) {
        this.sidebarWidth = 42;
      }
    },
    stopResize(event) {
      this.endOfResizeWidth = this.sidebarWidth;
      this.isResizing = false;
      window.removeEventListener('mousemove', this.resizeSidebar);
      window.removeEventListener('mouseup', this.stopResize);
    },
    bringDay(ticket, positionIconName) {
      if (positionIconName === 'mdi-plus') {
        const today = moment().startOf('day');
        const estimatedStartDate = today.valueOf();
        ticket.dates.find(date => date.name === 'Date de début estimée').value = estimatedStartDate;
        // ticket.endDate = nextDay;
        this.$emit('startTicket', ticket, estimatedStartDate);
        return;
      }

      const position = positionIconName.split('-')[2];
      this.$emit('bringDay', { ...ticket, position });
    },
    goToTicket(ticket) {
      this.$emit('goto', ticket);
    },
    fallingIn(date) {
      if (moment(date).isAfter(this.viewPortEdges.end)) {
        return 'mdi-arrow-right';
      }
      else if (moment(date).isBefore(this.viewPortEdges.start)) {
        return 'mdi-arrow-left';
      }
      else if (!date) {
        if (this.selectedDateFields.selectedStart === 'Date de début estimée') {
          return 'mdi-plus';
        }
      }
      return null;
    },
    reEmitNestedList() {
      this.$emit('taskListChanged', this.flattenedList(this.nestedList));
    },
  },
  watch: {
    selectedDateFields() {
      this.flattenedList(this.nestedList);
    }, 
    nestedList(value) {
      this.$emit('taskListChanged', this.flattenedList(value));
    },
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
}
</script>

<style scoped>
.side-bar {
  position: sticky;
  top: 0;
  left: 0;
  background: white;
  height: 100%;
  min-width: 42px;
  z-index: 101;
  transition: left .3s ease-in-out, height .3s ease-in-out, font-size .3s ease-in-out;
}

.workflow-container {
  background: white;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  color: #14202C;
  letter-spacing: 1.1px;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
  letter-spacing: 1.1px;
  transition: width .1s ease-in-out, height .3s ease-in-out, font-size .3s ease-in-out;
}

.workflow {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #14202C;
  letter-spacing: 1.1px;
  padding: 0 10px;
  width: 100%;
  border-bottom: 1px solid #E2E2E2;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
  letter-spacing: 1.1px;
  transition: width .1s ease-in-out, height .3s ease-in-out, font-size .3s ease-in-out;
}

.process {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #14202C;
  letter-spacing: 1.1px;
  padding: 0 10px 0 20px;
  width: 100%;
  border-bottom: 1px solid #E2E2E2;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
  letter-spacing: 1.1px;
  transition: width .1s ease-in-out, height .3s ease-in-out, font-size .3s ease-in-out;
}

.ticket {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #14202C;
  letter-spacing: 1.1px;
  padding: 0 10px 0 30px;
  width: 100%;
  border-bottom: 1px solid #E2E2E2;
  white-space: nowrap;
  font-weight: normal;
  text-overflow: ellipsis;
  transition: width 0.1s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.goto-ticket {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: -25px;
  width: 20px;
  min-height: 6px;
  border: 1px solid #E2E2E2;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  transition: width 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.sidebar-resize {
  cursor: ew-resize;
  position: absolute;
  right: 0;
  height: 100%;
  width: 2px;
  z-index: 110;
  transition: all .1s;
}
.sidebar-resize:hover {
  border-right: 2px solid grey !important;
  width: 5px;
}
.dropdown {
  border-radius: 5px;
  cursor: pointer;
}
.dropdown:hover {
  background-color: #edeff0;
  color: #14202C;
}
.open {
  transform: rotate(-180deg) !important;
}
.close {
  transform: rotate(0deg) !important;
}
.clickable-ticket {
  cursor: pointer;
  transition: all 0.1s;
}
.clickable-ticket:hover {
  color: #0033ce;
}
.group-flex {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
}
.rect {
  width: 5px;
  height: 9px;
  background: green;
  border-radius: 3px;
}
.goto-icon {
}
</style>

