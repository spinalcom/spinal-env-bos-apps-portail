
<template>
  <div class="main" v-if="loaded">
    <DayView
    v-if="temporality.name === 'Jour'"
    :ticketList="ticketList"
    :nestedList="nestedList"
    @resizeWholePeriod="resizeWholePeriod"
    @resizeStart="resizeStart"
    @resizeEnd="resizeEnd"
    @createTicket="createTicket"
    @startTicket="startTicket"
    />
  </div>
</template>

<script>
import tickets from '../services/tickets/index.js';
import dates from '../services/tickets/dates.js';
import DayView from './day/Main';

export default {
  name: 'MainComponent',
  components: {
    DayView,
  },
  props: ['temporality', 'space'],
  computed: {},
  data: () => ({
    freezedTicketList: [],
    freezedNestedList: [],
    loaded: false,
    ticketList: null,
    nestedList: [],
  }),
  created() {},
  async mounted () {
    const response = await tickets.getAll();
    this.ticketList = response.flat;
    this.nestedList = response.nested;
    this.freezedTicketList = response.flat;
    this.freezedNestedList = response.nested;
    this.loaded = true;
  },
  methods: {
    async startTicket(task, estimatedStartDate) {
      try {
        await dates.setEstimatedStart(task.ticketId, estimatedStartDate);
        this.resizeStart(task, estimatedStartDate);
      } catch (error) {
        console.error(`Error starting ticket ${task.ticketId}`, error);
      }
    },
    createTicket(task, estimatedStartDate, estimatedEndDate) {
      this.resizeWholePeriod(task, estimatedStartDate, estimatedEndDate);
    },
    async resizeWholePeriod(task, estimatedStartDate, estimatedEndDate) {
      try {
        this.ticketList = this.ticketList.map((ticket) => {
          if (ticket.ticketId === task.ticketId) {
            ticket.dates.find(date => date.name === 'Date de début estimée').value = estimatedStartDate;
            ticket.dates.find(date => date.name === 'Date de fin estimée').value = estimatedEndDate;
          }
          return ticket;
        });
        await dates.setEstimatedStart(task.ticketId, estimatedStartDate);
        await dates.setEstimatedEnd(task.ticketId, estimatedEndDate);
      } catch (error) {
        console.error(`Error resizing whole period for ticket ${task.ticketId}`, error);
      }
    },
    resizeStart(task, estimatedStartDate) {
      this.ticketList = this.ticketList.map((ticket) => {
        if (ticket.ticketId === task.ticketId) {
          ticket.dates.find(date => date.name === 'Date de début estimée').value = estimatedStartDate;
        }
        return ticket;
      });
    },
    async resizeEnd(task, estimatedEndDate) {
      try {
        this.ticketList = this.ticketList.map((ticket) => {
          if (ticket.ticketId === task.ticketId) {
            ticket.dates.find(date => date.name === 'Date de fin estimée').value = estimatedEndDate;
          }
          return ticket;
        });
        await dates.setEstimatedEnd(task.ticketId, estimatedEndDate);
      } catch (error) {
        console.error(`Error resizing end for ticket ${task.ticketId}`, error);
      }
    },
  },
  watch: {
    space: {
      handler: async function (space) {
        if (space.type === 'building') {
          this.ticketList = this.freezedTicketList;
          this.nestedList = this.freezedNestedList;
        } else if (space.type === 'floor') {
          try {
            this.ticketList = this.freezedTicketList.filter((ticket) =>
              ticket.location && ticket.location.floor === space.dynamicId);
            this.nestedList = this.freezedNestedList.map((w) => ({
              ...w,
              processes: w.processes.map((p) => ({
                ...p,
                ticketList: p.ticketList.filter((t) =>
                  t.location &&
                  t.location.floor === space.dynamicId
                )
              }))
            }));
            this.nestedList = tickets.removeProcessWithNoTickets(this.nestedList);
          } catch (error) {
            console.error('Error filtering tickets by floor', error);
          }
        } else if (space.type === 'room') {
          try {
            this.ticketList = this.freezedTicketList.filter((ticket) =>
              ticket.location && ticket.location.room === space.dynamicId);
            this.nestedList = this.freezedNestedList.map((w) => ({
              ...w,
              processes: w.processes.map((p) => ({
                ...p,
                ticketList: p.ticketList.filter((t) =>
                  t.location &&
                  t.location.room === space.dynamicId
                )
              }))
            }));
            this.nestedList = tickets.removeProcessWithNoTickets(this.nestedList);
          } catch (error) {
            console.error('Error filtering tickets by room', error);
          }
        }
      },
      deep: true,
    },
  },
}
</script>

<style>
.RC {
  font-family: Charlevoix;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 80px 10px 10px;
  gap: 10px;
  height: 100vh;
  width: 100%;
  background: linear-gradient(111.34deg, #F8FAFA 0%, #D6E2E6 100%);
}
.main {
  background: linear-gradient(111.34deg, #F8FAFA 0%, #D6E2E6 100%) !important;
  margin-top: 80px !important;
  margin-bottom: 10px;
  margin-right: auto;
  margin-left: auto;
  width: calc(100% - 20px);
  height: 0;
  flex-grow: 1;
  background: white;
  border-radius: 10px;
}
</style>

