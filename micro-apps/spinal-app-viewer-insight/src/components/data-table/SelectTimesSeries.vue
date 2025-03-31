<template>
  <v-container class="content-wrapper">
      <v-autocomplete 
      dense
      outlined
      rounded
      :label="label"
      v-model="selected" :items="timesSeries" item-text="label" item-value="value"
      @change="TimeSeriesChange"
     >

      </v-autocomplete>
  </v-container>
</template>

<script lang="ts">
import moment from 'moment';

/**
 * 
 * @name SelectTimesSeries
 * This component is used to select the time series
 * The time series can be selected by month, year, week, day or hour
 * The time series is selected based on the temporality selected on Store
 */

export default {
  name: "SelectTimesSeries",

  data() {
    return {
      timesSeries: [] as any[],
      timesSeriesofWeek: [] as Array<{ label: string, value: number }>,
      selectWeek: [] as any,
      selected: '' as any,
      tIndex: this.$store.state.appDataStore.t_index,
      label: '',
    };
  },

  mounted() {
    this.checkData();
  },
  watch: {
    selected: {
      handler(val) {
        this.$emit("selected", val);
      },
      deep: true
    },
    '$store.state.appDataStore.temporalitySelected': {
      handler(val) {
        this.checkData();
        // else if(temporality === 'Semaine') {
        //   this.timesSeries = this.getWeek();
        // }
      },
      deep: true
    },
    '$store.state.appDataStore.t_index': {
      handler(val) {
        this.tIndex = val;
        this.checkData();
      },
      deep: true
    },
   
  },
  methods: {
    checkData() {
      const temporality = this.$store.state.appDataStore.temporalitySelected;
      if(temporality.name === 'Mois') {
        this.getMonths();
      }
      else if(temporality.name === 'Année') {
         this.getYears();
      }
      else if(temporality.name === 'Semaine') {
        this.getWeeksByMonth();
      }
      else if(temporality.name === 'Journée') {
        this.getDays();
      }
      else if(temporality.name === 'Heure') {
        this.getHours();
      }
    },
    getMonths() {
  this.timesSeries = [];
  this.tIndex = this.$store.state.appDataStore.t_index;
  let current = moment();

  current = this.tIndex < 0 ? current.add(this.tIndex, 'months') : current.subtract(this.tIndex, 'months');
  let months = moment.months();
  const valueSelected = {
    label: `${current.format('MMMM')} ${current.format('YYYY')}`,
    value: {
      name: 'Mois',
      day: current.format('DD'),
      month: current.format('MM'),
      year: current.format('YYYY')
    }
  };
  this.selected = valueSelected;
  this.label = "Mois";
  const currentYear = moment().format('YYYY');
  if (currentYear === current.format('YYYY')) {
    const monthsLength = parseInt(moment().format('MM'));
    months = months.slice(0, monthsLength);
    months.forEach((month, index) => {
      const label = `${month} ${current.format('YYYY')}`;
      const value = {
        label: label,
        value: {
          name: 'Mois',
          day: current.format('DD'),
          month: (index + 1).toString().padStart(2, '0'),
          year: current.format('YYYY')
        }
      };
      this.timesSeries.push(value);
    });
  } else {
    months.forEach((month, index) => {
      const label = `${month} ${current.format('YYYY')}`;
      const value = {
        label: label,
        value: {
          name: 'Mois',
          day: current.format('DD'),
          month: (index + 1).toString().padStart(2, '0'),
          year: current.format('YYYY')
        }
      };
      this.timesSeries.push(value);
    });
  }
},
    getYears() {
  this.timesSeries = [];
  if (this.timesSeries.length === 0) {
    let currentTime = moment();
    const createValueObject = (time) => ({
      label: time.format('YYYY'),
      value: {
        name: 'Année',
        day: time.format('DD'),
        month: time.format('MM'),
        year: time.format('YYYY')
      }
    });

    const currentYearValue = createValueObject(currentTime);
    this.selected = currentYearValue;
    this.timesSeries.push(currentYearValue);
    this.label = "Year";
    const currentYearInt = parseInt(currentTime.format('YYYY'));
    for (let i = 1; currentYearInt - i >= 2002; i++) {
      const yearTime = currentTime.clone().subtract(i, 'year');
      this.timesSeries.push(createValueObject(yearTime));
    }
  }

  this.tIndex = this.$store.state.appDataStore.t_index;
  let currentTime = moment();
  currentTime = this.tIndex < 0 ? currentTime.add(this.tIndex, 'year') : currentTime.subtract(this.tIndex, 'year');
  const createValueObject = (time) => ({
    label: time.format('YYYY'),
    value: {
      name: 'Année',
      day: time.format('DD'),
      month: time.format('MM'),
      year: time.format('YYYY')
    }
  });
  const currentYearValue = createValueObject(currentTime);
  this.selected = currentYearValue;
  this.label = "Année";
},
 
     getWeeksByMonth() {
      this.timesSeriesofWeek = [];
      const currentTime = moment();
      
      this.tIndex = this.$store.state.appDataStore.t_index;
      let current = moment();
      this.tIndex < 0  ? current = current.add(this.tIndex, 'week') : current = current.subtract(this.tIndex, 'week');
      const currentYear = current.format('YYYY');
      const month = current.month() + 1;
     
      let startOfWeek = current.startOf('isoWeek').format('YYYY-MM-DD'); // Lundi
      let endOfWeek = current.endOf('isoWeek').format('YYYY-MM-DD'); // Dimanche
      let weekNumber = current.isoWeek(); // Numéro de la semaine ISO
      const label = `Semaine ${weekNumber} (${startOfWeek} - ${endOfWeek})`;
      const currentWeekInfo =  {
        label: label,
        value: {
          name : 'Semaine',
          day: current.format('DD'),
          start: current.startOf("isoWeek").format("DD"),
          end: current.endOf("isoWeek").format("DD"),
          month: current.format('MM'),
          year: current.format('YYYY')
        }
      }
      this.selected = currentWeekInfo;
      this.label = "Semaine";
      const lastMonth = current.subtract(1, 'month').month() + 1;
      const months = [lastMonth, month];
      let weeks: Array<{ label: string, value: {} }> = [];

      months.forEach((month) => {
        let firstDay = moment({ year: parseInt(currentYear) , month: month - 1, day: 1 }).startOf("isoWeek");
        let lastDay = moment({ year: parseInt(currentYear) , month: month - 1 }).endOf("month").endOf("isoWeek");

        let currentWeek = firstDay.clone();

        while (currentWeek.isSameOrBefore(lastDay)) {
          const value = {
              label: `Semaine ${currentWeek.isoWeek()} (${currentWeek.startOf("isoWeek").format("DD MMM")} - ${currentWeek.endOf("isoWeek").format("DD MMM")})`,
              value : {
                name: 'Semaine',
                day: currentWeek.format('DD'),
                start: currentWeek.startOf("isoWeek").format("DD"),
                end: currentWeek.endOf("isoWeek").format("DD"),
                month: currentWeek.format('MM'),
                year: currentWeek.format('YYYY')
              }
          }
          weeks.push(value);
          currentWeek.add(1, "week");
        }
      });
      this.timesSeries = weeks;
    },
    getDays() {
    this.timesSeries = [];
    let days: Array<{ label: string, value: { day: string, month: string, year: string } }> = [];
    let currentTime = moment();
    this.tIndex = this.$store.state.appDataStore.t_index;
    this.tIndex < 0  ? currentTime = currentTime.add(this.tIndex, 'days') : currentTime = currentTime.subtract(this.tIndex, 'days');
    let currentMonth = currentTime.month();
    let currentYear = currentTime.year();
    let firstDay = moment({ year: currentYear, month: currentMonth, day: 1 });
    let lastDay = moment({ year: currentYear, month: currentMonth }).endOf("month");
    const currentTimeDay = currentTime.format('DD/MM/YYYY');
    const currentDayalt = moment().format('DD/MM/YYYY');
    const value = {
      label : `${currentTime.format('DD MMMM YYYY')} `,
      value : {
        name: 'Journée',
        day: currentTime.format('DD'),
        month: currentTime.format('MM'),
        year: currentTime.format('YYYY')
      }
    }
    this.selected = value;
    this.label = "Journée";
    let currentDay = firstDay.clone();

    while (currentDay.isSameOrBefore(lastDay)) {
      const value = {
        label: currentDay.format("DD MMM YYYY"),
        value: {
          name: 'Journée',
          day: currentDay.format("DD"),
          month: currentDay.format("MM"),
          year: currentDay.format("YYYY"),
        }
      }
      days.push(value);
      currentDay.add(1, "day");
    }

    this.timesSeries =  days;
  },

  getHours() {
  this.tIndex = this.$store.state.appDataStore.t_index;
  let currentTime = moment();
  currentTime = this.tIndex < 0 ? currentTime.add(this.tIndex, 'hours') : currentTime.subtract(this.tIndex, 'hours');
  
  let hours: Array<{ label: string, value: { name: string, day: string, month: string, year: string, start_hour: string, end_hour: string } }> = [];
  let end = moment(currentTime).add(1, 'hours');
  let day = currentTime;
  let dayAlt = day.format('DD/MM/YYYY');
  
  const label = `${dayAlt} ${currentTime.format('HH[h]')} - ${end.format('HH[h]')}`;
  const value = {
    label: label,
    value: {
      name: 'Heure',
      day: currentTime.format('DD'),
      month: currentTime.format('MM'),
      year: currentTime.format('YYYY'),
      start_hour: currentTime.format('HH'),
      end_hour: end.format('HH')
    }
  };
  this.selected = value;
  
  this.label = "Heure";
  
  let startOfDay = moment().startOf('day');
  let endOfDay = moment().endOf('day');
  let currentHour = startOfDay.clone();

  while (currentHour.isBefore(endOfDay) || currentHour.isSame(endOfDay)) {
    const hourLabel = `${dayAlt} ${currentHour.format('HH[h]')} - ${currentHour.clone().add(1, 'hour').format('HH[h]')}`;
    const hourValue = {
      label: hourLabel,
      value: {
        name: 'Heure',
        day: currentHour.format('DD'),
        month: currentHour.format('MM'),
        year: currentHour.format('YYYY'),
        start_hour: currentHour.format('HH'),
        end_hour: currentHour.clone().add(1, 'hour').format('HH')
      }
    };
    hours.push(hourValue);
    currentHour.add(1, 'hour');
  }
  this.timesSeries = hours;
},
      TimeSeriesChange(value) {
        this.$emit('selected', value);
      }
  }
};
</script>

<style scoped>
.content-wrapper {
  min-width: 220px !important;
  max-width: 220px !important;
  height: max-content;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;

}

.content-wrapper .v-autocomplete {
  width: 220px;
  height: 50px;
  padding: 2px;
  user-select: none !important;
  /* margin: auto; */
}
</style>