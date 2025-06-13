
<template>
  <div class="calendar-plan" ref="calendar" @scroll="onScroll"
    :class="{ 'smooth-scroll': isScrolling }">
    <TaskDetails
      :task="selectedTaskDetails"
      @resetTaskDetails="selectedTaskDetails = null"
      />

    <div class="action-bar">
      <div class="icon-action-group">
        <v-icon class="action-icon icon" @click="verticalScroll('left')">mdi-chevron-left</v-icon>
        <v-icon class="action-icon icon" @click="verticalScroll('right')">mdi-chevron-right</v-icon>
      </div>
      <div class="slider-container">
        <v-icon class="action-icon icon" @click="zoomAction('out')">mdi-magnify-minus-outline</v-icon>
          <v-slider
            v-model="zoom"
            :min="minZoom"
            :max="maxZoom"
            ticks="always"
            tick-size="1"
            thumb-color="#14202c"
            track-fill-color="grey darken-1"
            track-color="grey lighten-3"
            class="slider"
            ></v-slider>
        <v-icon class="action-icon icon" @click="zoomAction('in')">mdi-magnify-plus-outline</v-icon>
      </div>

      <div class="action-group action-button pointer-hover" @click="bringToday()">
        Aujourd'hui
      </div>

      <DateField
        ref="dateField"
        @start="selectedStart = $event"
        @end="selectedEnd = $event"
        />

      <div class="action-group">
        <v-icon class="action-icon icon">mdi-sort</v-icon>
        Trier
      </div>
      <div class="action-group">
        <v-icon class="action-icon icon">mdi-filter</v-icon>
        Filter
      </div>
      <ColorSelector
        @close="closeMenus" 
        @select-color-type="selectColorType"/>
    </div>

    <div :style="[
      { 'width': planWidth + dayWidth + 'px' },
      { 'height': planHeight + (taskHeight * 3) + 'px' },
      { 'min-height': planHeight + (taskHeight * 3) + 'px' },
      ]" class="plan">

      <div 
        :style="[
        { 'font-size': fontSize.medium + 'px' },
        ]"
        class="month-strip top-bar">
        <div
          v-for="(month, index) in monthList"
          :key="month.name + '/' + month.year"
          class="month-placement"
          :style="[
          { 'width': month.days * dayWidth + 'px' },
          { 'font-size': fontSize.medium + 'px' },
          { 'z-index': index },
          ]">
        </div>
      </div>

      <div 
        :style="[
        { 'font-size': fontSize.medium + 'px' },
        ]"
        class="month-strip secondary-bar">
        <div
          v-for="(month, index) in monthList"
          :key="month.name + '/' + month.year"
          class="month-placement"
          :style="[
          { 'width': month.days * dayWidth + 'px' },
          { 'font-size': fontSize.medium + 'px' },
          { 'z-index': index },
          ]">
          {{ month.name.charAt(0).toUpperCase() + month.name.slice(1) }} {{ month.year }}
        </div>
      </div>

      <div class="month-strip third-bar bottom-divider">
        <div
          v-for="month in monthList"
          :key="month.name + '/' + month.year"
          class="day-strip"
          :style="{ 'width': month.days * dayWidth + 'px' }">
          <div
            v-for="day in month.days"
            :key="day + '/' + month.name + '/' + month.year"
            :class="{ today: currentMarker === day + '/' + month.name + '/' + month.year }"
            :style="[
            { 'font-size': fontSize.small + 'px' },
            { 'width': dayWidth + 'px !important' },
            ]"
            class="day full-center">
            {{ day }}
            <div
              v-if="isMonday(`${day}/${month.name}/${month.year}`)"
              :style="{ 'height': separator + 'px' }"
              class="week-separator"></div>
          </div>
        </div>
        <div class="dot" 
          :style="[
            { 'left': markerOffset + (dayWidth / 2 - 3) + 'px' },
          ]">
        </div>
      </div>

      <div class="plan-background" :style="{ 'height': planHeight  + 'px' }">
        <!-- CalendarContent component -->
          <CalendarContent
            :ticketList="ticketList"
            :nestedList="nestedList"
            :separator="separator"
            :start="start"
            :end="end"
            :selectedDateFields="{ selectedStart, selectedEnd }"
            :viewPortEdges="viewPortEdges"
            :dayWidth="dayWidth"
            :taskHeight="taskHeight"
            :fontSize="fontSize"
            :colorType="colorType"
            @bringDay="bringDay"
            @goto="bringTheDay"
            @planHeight="planH"
            @resizedSideBar="resizedSideBar"
            @resizeWholePeriod="(task, estimatedStartDate, estimatedEndDate) => $emit('resizeWholePeriod', task, estimatedStartDate, estimatedEndDate)"
            @resizeStart="(task, estimatedStartDate) => $emit('resizeStart', task, estimatedStartDate)"
            @resizeEnd="(task, estimatedEndDate) => $emit('resizeEnd', task, estimatedEndDate)"
            @showTicketDetails="showTicketDetails"
            @startTicket="(task, estimatedStartDate) => $emit('startTicket', task, estimatedStartDate)"
            @createTicket="(task, estimatedStartDate, estimatedEndDate) => $emit('createTicket', task, estimatedStartDate, estimatedEndDate)"
            />
      </div>
    </div>
  </div>
</template>

<script>
import CalendarContent from './CalendarContent.vue';
import TaskDetails from './TaskDetails.vue';
import DateField from '../components/date-fields/DateField.vue';
import ColorSelector from '../components/color-selector/ColorSelector.vue';
import { throttle } from 'lodash';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');
export default {
  name: 'MonthView',
  props: [ 'ticketList', 'nestedList' ],
  components: {
    CalendarContent,
    TaskDetails,
    DateField,
    ColorSelector,
  },
  data: () => ({
    selectedTaskDetails: null,
    isScrolling: false,
    currentMarker: null,
    planHeight: 0,
    PERIODINTERVAL: 3, // 3 months
    current: null,
    start: null,
    end: null,
    diff: 0, // Days between the start and the end of the displayed calendar
    monthList: [],
    planDimensions: {},
    viewPortEdges: { start: null, end: null },
    sidebarWidthInDays: 0,
    viewPortWidthInDays: 0,
    margin: 300,
    sidebarWidth: 300,
    scrollLeft: 0,
    zoom: 30,
    minZoom: 8,
    maxZoom: 50,
    taskHeight: 30,
    dayWidth: 30,
    fontSize: {
      big: 14,
      medium: 12,
      small: 10,
    },
    selectedStart: 'Date de début estimée',
    selectedEnd: 'Date de fin estimée',
    colorType: null,
    centeredDateCheckpoints: null, // this where the date is centered and where it should be after zooming in or out,
  }),
  created() {
    this.current = moment();
    this.start = this.current;
    this.end = this.current;
    this.monthList.push({
      name: this.getMonthName(this.current),
      year: this.current.format('YYYY'),
      days: this.countDaysInMonth(this.current),
    })
    this.appendPeriod();
    this.prependPeriod();
  },
  async mounted() {
    this.currentMarker = moment().format('DD/MMMM/YYYY');
    this.updatePlanDimensions()
    this.bringToday(false);

    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    markerOffset() {
      return moment().diff(this.start, 'days') * this.dayWidth;
    },
    separator() {
      return this.planDimensions.height - this.taskHeight - this.planDimensions.height * .02;
      // return this.planDimensions.height - 5;
    },
    planWidth() {
      return this.diff * this.dayWidth;
    },
    scrollWidth() {
      return Math.floor((this.planDimensions.width - this.sidebarWidth) / this.dayWidth) * this.dayWidth;
    }
  },
  methods: {
    getYear(time) {
      return moment(time).year();
    },
    getMonth(time) {
      return moment(time).month() + 1;
    },
    getDay(time) {
      return moment(time).date();
    },
    addMonths(time, value) {
      return moment(time).add(value, 'months');
    },
    subtractMonths(time, value) {
      return moment(time).subtract(value, 'months');
    },
    setToStartOfMonth(time) {
      return moment(time).startOf('month');
    },
    setToEndOfMonth(time) {
      return moment(time).endOf('month');
    },
    countDaysInMonth(time) {
      return this.getDay(this.setToEndOfMonth(time));
    },
    getMonthName(time) {
      return moment(time).format('MMMM');
    },
    isMonday(date) {
      return moment(date, 'DD/MMMM/YYYY').format('ddd') === 'lun.';
    },
    appendPeriod() {
      for(let i = 0; i < this.PERIODINTERVAL; i++) {
        this.end = this.setToEndOfMonth(this.addMonths(this.end, 1));
        this.monthList.push({
          name: this.getMonthName(this.end),
          year: this.end.format('YYYY'),
          days: this.countDaysInMonth(this.end),
        })
        this.diff = this.end.diff(this.start, 'days');
      }
    },
    async prependPeriod() {
      let daysPrepended = 0;
      for(let i = 0; i < this.PERIODINTERVAL; i++) {
        this.start = this.setToStartOfMonth(this.subtractMonths(this.start, 1));
        this.monthList.unshift({
          name: this.getMonthName(this.start),
          year: this.start.format('YYYY'),
          days: this.countDaysInMonth(this.start),
        })
        daysPrepended += this.monthList[0].days;
        this.diff = this.end.diff(this.start, 'days');
      }
      this.isScrolling = false;
      await this.$nextTick();
      this.$refs.calendar.scrollLeft += daysPrepended * this.dayWidth;
      this.isScrolling = true;
      return daysPrepended;
    },
    onScroll: throttle(function (event) {

      const parent = event.target;
      const child = parent.querySelector('.plan-background');
      
      this.scrollLeft = parent.scrollLeft;
      const parentWidth = parent.clientWidth;
      const childWidth = child.offsetWidth;
      // TODO: WRITE DOCUMENTATION
      this.sidebarWidthInDays = this.sidebarWidth / this.dayWidth;
      this.viewPortWidthInDays = Math.floor((this.planDimensions.width - (this.dayWidth)/3) / this.dayWidth) - this.sidebarWidthInDays;

      this.viewPortEdges.start = moment(this.start).add(Math.ceil(this.scrollLeft / this.dayWidth) + this.sidebarWidthInDays, 'days');
      this.viewPortEdges.end = moment(this.viewPortEdges.start).add(this.viewPortWidthInDays, 'days');

      if (this.scrollLeft <= this.margin) {
        this.triggerNearLeftEdge();
      } else if (this.scrollLeft + parentWidth >= childWidth - this.margin) {
        this.triggerNearRightEdge();
      }
    }, 500),
    triggerNearLeftEdge() {
      const tempStart = this.start;
      this.prependPeriod();
      // this.$refs.calendar.scrollLeft = tempStart.diff(this.start, 'days') * 30;
    },
    triggerNearRightEdge() {
      this.appendPeriod();
    },
    resizedSideBar(sidebarWidth) {
      this.sidebarWidth = sidebarWidth;
      this.updateViewport();
    },
    updateViewport() {
      // TODO: WRITE DOCUMENTATION
      this.sidebarWidthInDays = this.sidebarWidth / this.dayWidth;
      this.viewPortWidthInDays = Math.floor((this.planDimensions.width - this.sidebarWidthInDays) / this.dayWidth) - this.sidebarWidthInDays;
      this.viewPortEdges.start = moment(this.start).add(Math.ceil(this.scrollLeft / this.dayWidth) + this.sidebarWidthInDays, 'days');
      this.viewPortEdges.end = moment(this.viewPortEdges.start).add(this.viewPortWidthInDays, 'days');
    },
    planH(event) {
      this.planHeight = event;
    },
    async bringToday(animation = true) {
      const date = this.current
      this.isScrolling = animation;
      await this.$nextTick();
      this.$refs.calendar.scrollLeft = 
        date.diff(this.start, 'days') * this.dayWidth - this.sidebarWidth 
        - ((this.$refs.calendar.offsetWidth - this.sidebarWidth) / 2);
      await this.$nextTick();
      this.isScrolling = true;
    },
    async bringTheDay(date, position) {
      if (position === 'right') {
        const diff = moment(date).diff(this.end, 'months');
        if (diff > 0) {
          for (let i = 0; i < (diff + 6); i += 3) {
            await this.appendPeriod();
          }
        }
      }
      else if (position === 'left') {
        const diff = moment(date).diff(this.start, 'months');
        if (diff < 0) {
          for (let i = 0; i < -(diff - 6); i += 3) {
            await this.prependPeriod();
          }
        }
      }
      this.$refs.calendar.scrollLeft = moment(date)
        .diff(this.start, 'days') * this.dayWidth
        - this.sidebarWidth
        - ( (this.$refs.calendar.offsetWidth - this.sidebarWidth) / 2 );
    },
    async bringDay(ticket) {
      const { position } = ticket;
      const estimatedStartDate = moment(ticket.dates
        .find(date => date.name === this.selectedStart).value);
      if (position === 'right') {
        const diff = moment(estimatedStartDate).diff(this.end, 'months');
        if (diff > 0) {
          for (let i = 0; i < (diff + 6); i += 3) {
            await this.appendPeriod();
          }
        }
      }
      else if (position === 'left') {
        const diff = moment(estimatedStartDate).diff(this.start, 'months');
        if (diff < 0) {
          for (let i = 0; i < -(diff - 6); i += 3) {
            await this.prependPeriod();
          }
        }
      }
      this.$refs.calendar.scrollLeft = moment(estimatedStartDate).diff(this.start, 'days') * this.dayWidth - this.sidebarWidth - ( (this.$refs.calendar.offsetWidth - this.sidebarWidth) / 2 );
    },
    async verticalScroll(direction) {

      if (direction === 'right') {
        if ((this.end.diff(this.viewPortEdges.end, 'days') - this.viewPortWidthInDays) < this.viewPortWidthInDays) {
          await this.appendPeriod();
        }
        await this.$nextTick();
        this.$refs.calendar.scrollLeft += this.viewPortEdges.end.diff(this.viewPortEdges.start, 'days') * this.dayWidth;
      }
      else if (direction === 'left') {
        if ((this.viewPortEdges.start.diff(this.start, 'days') - this.viewPortWidthInDays) < this.viewPortWidthInDays) {
          await this.prependPeriod();
        }

        await this.$nextTick();
        this.$refs.calendar.scrollLeft -= this.viewPortEdges.end.diff(this.viewPortEdges.start, 'days') * this.dayWidth;
      }
    },
    fallingIn(date) {
      if (moment(date).isAfter(this.end)) {
        return 'after';
      }
      else if (moment(date).isBefore(this.start)) {
        return 'before';
      }
      else if (moment(date).isBetween(this.start, this.end)) {
        return 'between';
      }
      else {
        return 'unknown';
      }
    },
    updatePlanDimensions() {
      this.planDimensions = {
        height: this.$refs.calendar.offsetHeight,
        width: this.$refs.calendar.offsetWidth
      };
    },
    handleResize() {
      this.updatePlanDimensions();
    },
    async zoomAction(type) {
      if (type === 'in') {
        this.zoom += 5;
      }
      else if (type === 'out') {
        this.zoom -= 5;
      }
    },
    showTicketDetails(task) {
      this.selectedTaskDetails = task;
    },
    closeMenus() {
      this.$refs.dateField.closeDateFields();
    },
    selectColorType(color) {
      this.colorType = color;
    }
  },
  watch: {
    async zoom(v1, v2) {
      this.isScrolling = false;
      const checkPointStart = this.viewPortEdges.start;
      const checkPointEnd = this.viewPortEdges.end;
      const center = moment(checkPointStart).add(this.viewPortWidthInDays / 2, 'days');
      const position = v1 > v2 ? 'right' : 'left';
      this.taskHeight = v1;
      this.dayWidth = v1;
      const minBigFontSize = 8;
      const maxBigFontSize = 20;
      this.fontSize.big = minBigFontSize + ((v1 - this.minZoom) / (this.maxZoom - this.minZoom)) * (maxBigFontSize - minBigFontSize);
      this.fontSize.big = Math.max(minBigFontSize, Math.min(this.fontSize.big, maxBigFontSize));

      const minFontSize = 6;
      const maxFontSize = 18;

      // Calculate font size with a linear relationship between zoom and font size
      this.fontSize.medium = minFontSize + ((v1 - this.minZoom) / (this.maxZoom - this.minZoom)) * (maxFontSize - minFontSize);

      // Ensure the fontSize is within the bounds of 6 and 18
      this.fontSize.medium = Math.max(minFontSize, Math.min(this.fontSize.medium, maxFontSize));

      // Calculate the smaller font size, starting from 10
      const minSmallFontSize = 6;
      const maxSmallFontSize = 12;
      this.fontSize.small = minSmallFontSize + ((v1 - this.minZoom) / (this.maxZoom - this.minZoom)) * (maxSmallFontSize - minSmallFontSize);

      // Ensure the fontSizeSmall is within the bounds of 6 and 12
      this.fontSize.small = Math.max(minSmallFontSize, Math.min(this.fontSize.small, maxSmallFontSize));

      await this.$nextTick();
      this.bringTheDay(center, position);
      await this.$nextTick();
      this.isScrolling = true;
      this.updateViewport();
    }
  },
}
</script>

<style>
.month-placement {
  position: sticky;
  left: 0;
  display: flex;
  align-items: center;
  padding-left: 10px;
  background: linear-gradient(to left, white 98.5%, transparent);
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.full-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.calendar-plan {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100%);
  border-radius: 10px;
  overflow-x: auto;
  overflow-y: auto;
  background: #f6f8fa;
  max-width: 100%;
}
.smooth-scroll {
  scroll-behavior: smooth;
}
.plan {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.month-strip {
  position: sticky;
  display: flex;
  flex-direction: row;
  gap: 0px;
  height: 30px;
  min-height: 30px !important;
  width: 100%;
  color: #888888;
  z-index: 110;
  background: white;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.day-strip {
  display: flex;
  height: 30px;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.bottom-divider {
  border-bottom: 2px solid #DDDDDD;
}
.day {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 30px;
  z-index: 100;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.top-bar {
  top: 0;
}
.secondary-bar {
  top: 30px;
}
.third-bar {
  top: 60px;
}
.plan-background {
  height: 0;
  flex-grow: 1;
  width: 100%;
  z-index: 100;
  background: #F6F8FA;
}
.week-separator {
  position: absolute;
  top: 0;
  left: 0;
  height: 30px !important;
  width: 1px;
  /*border-left: 1px solid #E2E2E2;*/
  border-left: 1px solid transparent;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.dot {
  background: #FF3A3A;
  border-radius: 10px;
  height: 5px;
  position: absolute;
  top: 26px;
  width: 5px;
  z-index: 400;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.today {
  font-weight: bold;
  color: #FF3A3A;
}
.calendar-plan::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
.calendar-plan::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 1px;
}
.calendar-plan::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
.calendar-plan::-webkit-scrollbar-track {
  background-color: #e0e0e0;
  border-radius: 1px;
}

.action-bar {
  display: flex;
  position: fixed;
  flex-direction: row-reverse;
  align-items: center; 
  gap: 10px;
  padding: 0 10px;
  right: 17px;
  height: 30px;
  z-index: 111;
  background: linear-gradient(to left, #fff 96%, transparent);
  font-size: 12px;
  letter-spacing: 1.1px;
}
.icon-action-group {
  display: flex;
  align-items: center; 
  justify-content: center;
  gap: 5px;
}
.icon-action-group:hover {
  cursor: pointer;
}
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
.action-button {
  display: flex;
  align-items: center; 
  justify-content: center;
}
.action-icon {
  font-size: 14px !important;
}
.slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 150px;
}
.slider {
  height: 33px !important;
}
.pointer-hover {
  cursor: pointer;
}
.date-fields-selector {
  cursor: normal;
}
.active {
  background: #d9d9d9;
}
.rainbow-text {
  /*background: linear-gradient(90deg, #000000DE, #000000DE, #000000DE, red, orange, #ff0, green, #000000DE, #000000DE, #000000DE, #000000DE, #000000DE, #000000DE, #000000DE) 0 0 / 200% 100%;*/
  background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: 10s cubic-bezier(1, 0, 0, 1.01) infinite rainbow-animation;
}
@keyframes rainbow-animation {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
.v-slider__thumb:before {
  background: transparent !important;
}
.v-slider__thumb-container--active .v-slider__thumb:before {
  display: none !important;
}
.v-slider__thumb-container--active .v-slider__thumb:after {
  display: none !important;
}
.v-slider__thumb-container--focused .v-slider__thumb:before {
  display: none !important;
}
.v-slider__thumb-container--focused .v-slider__thumb:after {
  display: none !important;
}
</style>

