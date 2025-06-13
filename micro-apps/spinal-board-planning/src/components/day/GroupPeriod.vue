
<template>
  <div 
    ref="taskElement"
    v-if="estimatedStartDate || estimatedEndDate"
    @click=""
    :style="[
      { 'border': bgColor !== '#ffffff' ? '1px solid ' + bgColor : '1px solid #E2E2E2' },
      { 'color': textFit ? textColor : '#000000DE' },
      { 'font-weight': textFit && textColor !== '#000000DE' ? '700' : '400' },
      { 'background': bgColor },
      { 'font-size': fontSize.small + 'px' },
      { 'left': isResizingWhole ? (dayWidth * locate - diffLeft) + 'px' : dayWidth * locate + 'px' },
      { 'height': (taskHeight - 15) + 'px' },
      { 'width': isResizingRight ? (taskWidth + diffRight) + 'px !important' : taskWidth + 'px !important' },
      { 'min-width': dayWidth + 'px !important' },
    ]"
    :class="[
      { 'no-border-right': !estimatedEndDate },
      { 'no-border-left': !estimatedStartDate },
    ]"
    class="period"
    @mousedown="startResizeWholePeriod">
    <Status
      :dayWidth="dayWidth"
      :fontSize="fontSize"
      :status="task.status"
    />
    <span
      :style="[
        { 'left': textFit ? dayWidth + 'px' : 'calc(100% + 10px)' },
      ]"
      ref="textElement"
      class="text-position"
    >
      {{ task.name }}
    </span>
    <span class="resize-task-right"
      @mousedown="(e) => { e.stopPropagation(); startResizeRight(e); }"
    ></span>
    <!-- 
      <span class="resize-task-left"
      @mousedown="startResizeLeft"></span>
    -->
  </div>
</template>

<script>
import { throttle } from 'lodash';
import Status from './Status';
import moment from 'moment';
moment.locale('fr');
export default {
  name: 'GroupPeriod',
  props: [
    'task',
    'start',
    'dayWidth',
    'taskHeight',
    'fontSize',
    'selectedDateFields',
    'colorType',
  ],
  components: {
    Status,
  },
  data: () => ({
    resizeObserver: null,
    rectDim: { height: 0, width: 0 },
    textDim: { height: 0, width: 0 },
    startResizeWx: 0,
    startResizeRx: 0,
    startResizeLx: 0,
    isResizingWhole: false,
    isResizingRight: false,
    isResizingLeft: false,
    diffWhole: 0,
    diffRight: 0,
    diffLeft: 0,
    moveFlag: false,
    priorityColors: ['#6ae69e', '#ffcc7c', '#f46456'],
  }),
  computed: {
    bgColor() {
      if (this.task.type === 'workflow') {
        return '#ffffff';
      } else if (this.task.type === 'process') {
        return this.task.processColor ? this.task.processColor + '73' : '#ffffff';
      }
    },
    estimatedStartDate() {
      return this.task.dates.start;
    },
    estimatedEndDate() {
      return this.task.dates.end;
    },
    locate() {
      const taskStart = moment(this.estimatedStartDate);
      return taskStart.diff(this.start, 'days');
    },
    taskWidth() {
      if (this.estimatedEndDate) {
        const duration = (this.setToStartOfDay(this.estimatedEndDate)
          .diff(this.setToStartOfDay(this.estimatedStartDate), 'days') + 1) * this.dayWidth;
        return duration;
      }
      return this.dayWidth;
    },
    textFit() {
      return (this.textDim.width + this.dayWidth) < this.rectDim.width;
    },
    textColor() {
      return this.getContrastTextColor(this.bgColor);
    },
  },
  mounted() {
    if (this.estimatedStartDate || this.estimatedEndDate) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const contentRect = entry.contentRect.width;
          this.rectDim.width = contentRect;
          if (this.$refs.textElement && this.$refs.textElement.clientWidth) {
            this.textDim.width = this.$refs.textElement.clientWidth;
          }
        }
      });

      this.resizeObserver.observe(this.$refs.taskElement);
    }
  },
  methods: {
    log() {
      if (this.task.name === 'démo') {
        console.log('Start:', this.estimatedStartDate, 'End:', this.estimatedEndDate);
      }
    },
    startResizeWholePeriod: throttle(function(event) {
      this.startResizeWx = event.clientX;
      this.isResizingWhole = true;
      document.addEventListener('mousemove', this.resizeWholePeriod);
      document.addEventListener('mouseup', this.stopResizeWholePeriod);
    }, 10),
    resizeWholePeriod(event) {
      if (this.isResizingWhole) {
        this.diffWhole = event.clientX - this.startResizeWx;
        this.diffLeft = -this.diffWhole;
        this.diffRight = -this.diffWhole;
        if (this.diffWhole !== 0) {
          this.moveFlag = true;
        }
      }
    },
    stopResizeWholePeriod() {
      if (
        !this.moveFlag || 
        this.selectedDateFields.selectedStart !== 'Date de début estimée' ||
        this.selectedDateFields.selectedEnd !== 'Date de fin estimée'
      ) {
        this.isResizingWhole = false;
        this.diffWhole = 0;
        this.diffLeft = 0;
        this.diffRight = 0;
        this.startResizeWx = 0;
        document.removeEventListener('mousemove', this.resizeWholePeriod);
        document.removeEventListener('mouseup', this.stopResizeWholePeriod);
        if (!this.moveFlag) {
          this.showTicketDetails();
        }
        this.moveFlag = false;
        return;
      }
      let days;
      let newStartDate;
      let newEndDate;
      // No need to check if diffWhole is greater than or less than 0 or 0, just move the task
      days = Math.round(this.diffWhole / this.dayWidth);
      if (this.estimatedStartDate) {
        newStartDate = moment(this.estimatedStartDate).add(days, 'days').valueOf();
      } else {
        newStartDate = moment(this.setToStartOfDay(this.estimatedStartDate)).add(days, 'days').valueOf();
      }
      if (this.estimatedEndDate) {
        newEndDate = moment(this.estimatedEndDate).add(days, 'days').valueOf();
      } else {
        newEndDate = 0;
        // newEndDate = moment(this.setToStartOfDay(this.task.estimatedStartDate)).add(days, 'days');
      }
      this.isResizingWhole = false;
      this.diffWhole = 0;
      this.diffLeft = 0;
      this.diffRight = 0;
      this.startResizeWx = 0;
      this.moveFlag = false;
      this.$emit('resizeWholePeriod', this.task, newStartDate, newEndDate);
      document.removeEventListener('mousemove', this.resizeWholePeriod);
      document.removeEventListener('mouseup', this.stopResizeWholePeriod);
    },
    startResizeRight: throttle(function(event) {
      this.startResizeRx = event.clientX;
      this.isResizingRight = true;
      document.addEventListener('mousemove', this.resizeRight);
      document.addEventListener('mouseup', this.stopResizeRight);
    }, 10),
    resizeRight(event) {
      if (this.isResizingRight) {
        this.diffRight = event.clientX - this.startResizeRx;
        console.log('Resizing right:', this.diffRight);
      }
    },
    stopResizeRight() {
      if (this.selectedDateFields.selectedEnd !== 'Date de fin estimée') {
        this.isResizingRight = false;
        this.diffRight = 0;
        this.startResizeRx = 0;
        document.removeEventListener('mousemove', this.resizeRight);
        document.removeEventListener('mouseup', this.stopResizeRight);
        return;
      }
      let days;
      let newEndDate;
      if (this.diffRight > 0) {
        days = Math.round(this.diffRight / this.dayWidth);
        if (this.estimatedEndDate) {
          newEndDate = +moment(this.estimatedEndDate).add(days, 'days').valueOf();
        } else {
          newEndDate = +moment(this.setToStartOfDay(this.estimatedStartDate)).add(days, 'days').valueOf();
        }
        this.$emit('allChildsResizeEnd', this.task, newEndDate);
      } else if (this.diffRight < 0) {
        days = Math.round(this.diffRight / this.dayWidth);
        if (this.estimatedEndDate) {
          const currentDuration = (this.setToStartOfDay(this.estimatedEndDate).diff(this.setToStartOfDay(this.estimatedStartDate), 'days') + 1);
          newEndDate = +moment(this.estimatedEndDate).subtract(Math.abs(days), 'days').valueOf();
          const diff = (this.setToStartOfDay(newEndDate).diff(this.setToStartOfDay(this.estimatedStartDate), 'days') + 1);
          if (diff > 0) {
            // meaning the new end date is greater than the start date
            this.$emit('allChildsResizeEnd', this.task, newEndDate);
          } else {
            // meaning the new end date is less than the start date
            const valueToEmit = moment(this.estimatedStartDate).clone().endOf('day').valueOf();
            this.$emit('allChildsResizeEnd', this.task, valueToEmit);
          }
        }
      }
      this.isResizingRight = false;
      this.diffRight = 0;
      this.startResizeRx = 0;
      document.removeEventListener('mousemove', this.resizeRight);
      document.removeEventListener('mouseup', this.stopResizeRight);
    },
    startResizeLeft: throttle(function(event) {
      this.startResizeLx = event.clientX;
      this.isResizingLeft = true;
      document.addEventListener('mousemove', this.resizeLeft);
      document.addEventListener('mouseup', this.stopResizeLeft);
    }, 10),
    resizeLeft(event) {
      if (this.isResizingLeft) {
        this.diffLeft = this.startResizeLx - event.clientX;
      }
    },
    stopResizeLeft() {
      let days;
      let newStartDate;
      if (this.diffLeft > 0) {
        days = Math.round(this.diffLeft / this.dayWidth);
        if (this.estimatedStartDate) {
          newStartDate = moment(this.estimatedStartDate).subtract(days, 'days');
        } else {
          newStartDate = moment(this.setToStartOfDay(this.estimatedStartDate)).subtract(days, 'days');
        }
        this.$emit('resizeStart', this.task, newStartDate);
      } else if (this.diffLeft < 0) {
        days = Math.round(this.diffLeft / this.dayWidth);
        if (this.estimatedStartDate) {
          const currentDuration = (this.setToStartOfDay(this.estimatedEndDate).diff(this.setToStartOfDay(this.estimatedStartDate), 'days') + 1);
          newStartDate = moment(this.estimatedStartDate).add(Math.abs(days), 'days');
          const diff = (this.setToStartOfDay(this.estimatedEndDate).diff(this.setToStartOfDay(newStartDate), 'days') + 1);
          if (diff > 0) {
            this.$emit('resizeStart', this.task, newStartDate);
          } else {
            this.$emit('resizeStart', this.task, moment(this.estimatedStartDate).add(currentDuration - 1, 'days'));
          }
        }
      }
      this.isResizingLeft = false;
      this.diffLeft = 0;
      this.startResizeLx = 0;
      document.removeEventListener('mousemove', this.resizeLeft);
      document.removeEventListener('mouseup', this.stopResizeLeft);
    },
    setToStartOfDay(time) {
      return moment(time).startOf('day');
    },
    setToEndOfDay(time) {
      return moment(time).endOf('day');
    },
    showTicketDetails() {
      this.$emit('showTicketDetails', this.task);
    },
    getContrastTextColor(bgColor) {
      return '#000000DE';
      let r, g, b;

      if (!bgColor) {
        return '#000000';
      }
      if (bgColor.startsWith("#")) {
        const bigint = parseInt(bgColor.substring(1), 16);
        r = (bigint >> 16) & 255;
        g = (bigint >> 8) & 255;
        b = bigint & 255;
      } else {
        [r, g, b] = bgColor.match(/\d+/g).map(Number);
      }

      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#000000DE' : '#fff';
    },
  },
  watch: {
    selectedDateFields(v1) {
    },
  },
}
</script>

<style scoped>
.period {
  position: absolute;
  display: flex;
  align-items: center;
  color: #474747;
  background: white;
  left: 400px;
  border-radius: 10px;
  box-shadow: 4px 3px 5px 0px #A0A0A024;
  white-space: nowrap;
  transition: all 0.3s, width 0s, left 0s;
}
.period:hover {
  border: 1px solid #adadad !important;
  box-shadow: 4px 3px 5px 0px #A0A0A024;
  cursor: pointer;
}
.text-position {
  position: absolute;
}
.resize-task-right {
  position: absolute;
  cursor: ew-resize;
  right: 0px;
  height: 100%;
  width: 9px;
  background: transparent;
  border-radius: 0 5px 5px 0;
  transition: background 0.3s;
}
.resize-task-right:hover {
  background: #000;
}
.resize-task-left {
  position: absolute;
  cursor: ew-resize;
  left: 0px;
  height: 100%;
  width: 9px;
  background: transparent;
  border-radius: 5px 0 0 5px;
  transition: background 0.3s;
}
.resize-task-left:hover {
  background: #000;
}
/* flash red in right border */
@keyframes flash-right {
  0% {
    border-right: 2px solid #ff7070;
  }
  100% {
    border-right: 2px solid #E2E2E2;
  }
}
/* flash red in left border */
@keyframes flash-left {
  0% {
    border-left: 2px solid #ff7070;
  }
  100% {
    border-left: 2px solid #E2E2E2;
  }
}
.no-border-right {
  border-right: 2px solid #ff7070;
  animation: flash-right 1s infinite;
}
.no-border-left {
  border-left: 2px solid #ff7070;
  animation: flash-left 1s infinite;
}
</style>

