<template>
  <div class="MAINCOMPONENT">
    <!-- <div class="MCTITLE">
      <p class="MCTEXT">DIAGNOSTIC PAR JOUR</p>
    </div> -->

    <div class="CALHEAT">
      <table class="CALTABLE">

        <!-- <span :class="lines[0] === true ? 'draw-line' : ''" class="line l0"></span>
        <span :class="lines[1] === true ? 'draw-line' : ''" class="line l1"></span>
        <span :class="lines[2] === true ? 'draw-line' : ''" class="line l2"></span>
        <span :class="lines[3] === true ? 'draw-line' : ''" class="line l3"></span>
        <span :class="lines[4] === true ? 'draw-line' : ''" class="line l4"></span>
        <span :class="lines[5] === true ? 'draw-line' : ''" class="line l5"></span>
        <span :class="lines[6] === true ? 'draw-line' : ''" class="line l6"></span> -->
        <tr>
          <td></td>
          <td v-for="m of calMonths" class="CALHEAD">{{ m }}</td>
        </tr>
        <tr>
          <td class="WEEKDAYS CALHEAD">
            <p class="CALDAY mb-0" @click="lineUp(0)">
              Lundi
            </p>
            <div style="height: 2px;"></div>
            <p class="mb-0 CALDAY fade-effect" @click="lineUp(1)">Mardi</p>
            <div style="height: 2px;"></div>
            <p class="mb-0 CALDAY fade-effect" @click="lineUp(2)">Mercredi</p>
            <div style="height: 2px;"></div>
            <p class="mb-0 CALDAY fade-effect" @click="lineUp(3)">Jeudi</p>
            <p class="mb-0 CALDAY fade-effect" @click="lineUp(4)">Vendredi</p>
            <div style="height: 2px;"></div>
            <p class="mb-0 CALDAY fade-effect" @click="lineUp(5)">Samedi</p>
            <div style="height: 2px;"></div>
            <p class="CALDAY mb-0" @click="lineUp(6)">Dimanche</p>
          </td>
          <td v-for="j in calMonths.length" :key="j">
            <div class="CALMONTH">
              <span v-for="i in monthOffset(calMonths[j - 1], j - 1)" :key="'o' + i">
                <div class="RECT"></div>
              </span>
              <span v-for="i in monthDays(calMonths[j - 1], j - 1)" :key="'d' + i">
                <v-tooltip bottom :open-delay="0">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      <div style="position: relative;" class="RECT unset"
                        :class="[colorCalc(results.d[j - 1][i - 1], i, j, results.y)]"
                        @click="toggle(i + '/' + j + '/' + results.y, colorCalc(results.d[j - 1][i - 1]))">
                        <!-- <span class="upper line-x1" v-if="shouldDisplayLine(i, j, results.y)"></span> -->
                        <span class="upper line-x2" v-if="shouldDisplayLine(i, j, results.y)"></span>
                      </div>
                    </span>
                  </template>
                  <span v-if="results.d[j - 1][i - 1] && results.d[j - 1][i - 1] != -1">{{ `${i}/${monthToNumber(j)}/${results.y}
                    :`}}
                    <b>{{ results.d[j - 1][i - 1].toFixed(1) }}</b> {{ unit.name }}</span>
                  <span v-else>{{ `${i}/${monthToNumber(j)}/${results.y} :` }} <b>-</b> {{ unit.name }}</span>
                </v-tooltip>
              </span>
            </div>
          </td>
        </tr>
      </table>
      <p class="CALMAX">{{ legend }} <b>{{ maxDate }}</b></p>
    </div>
    <MonthlyStripe :results="results" :values="monthlyValues" :calMonths="calMonths" :unit="unit" />
  </div>
</template>

<script>
import MonthlyStripe from './MonthlyStripe.vue';
import moment from 'moment';
// import env from '../../config';
export default {
  name: 'CalHeat',
  components: {
    MonthlyStripe
  },
  props: ['results', 'unit', 'calc', 'calMonths'],
  data: () => ({
    d: 0,
    max: 0,
    min: 0,
    interval: 0,
    maxDate: '',
    // legend: env.calendarLegend,
    lines: [false, false, false, false, false, false, false],
    toggleSet: new Set(),
    monthsArr: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
  }),
  mounted() {
    let exportDate = this.generateDatesArray(this.results.y);
    let exportValues = this.results.d.flat().map(e => e === -1 ? '' : e);
    let output = [{}];
    for (let i = 0; i < exportDate.length; i++) {
      output[i] = { date: exportDate[i], ['Valeur' + `(${this.unit.name})`]: exportValues[i] };
    }
    this.$emit('chart-sent', output);
    const flattenedArr = this.results.d.flat().filter(val => val !== -1);
    if (typeof this.results.max !== 'undefined' && typeof this.results.max === 'number') {
      this.max = this.results.max;
    }
    else {
      this.max = Math.max(...flattenedArr);
    }
    if (typeof this.results.min !== 'undefined' && typeof this.results.min === 'number') {
      this.min = this.results.min;
    }
    else {
      this.min = Math.min(...flattenedArr);
      this.min = this.min < 0 ? 0 : this.min;
    }
    this.interval = (this.max - this.min) / 7;

    let max = this.results.d[0][0];
    let maxIndex = [0, 0];

    for (let i = 0; i < this.results.d.length; i++) {
      for (let j = 0; j < this.results.d[i].length; j++) {
        if (this.results.d[i][j] > max) {
          max = this.results.d[i][j];
          maxIndex = [i, j];
        }
      }
    }
    this.maxDate = moment(maxIndex[1] + 1 + ' ' + (maxIndex[0] + 1), 'DD MM').format('DD MMMM');
  },
  computed: {
    legend() {
      return this.$store.state.appDataStore.appConfig?.calendarLegend || [];
    },
    monthlyValues() {
      if (this.calc === 'Somme') {
        let m = [];
        let missing;
        let sum;
        let res = 0;
        let maxPos = [];
        let monthSum = [];
        for (let i = 0; i < this.calMonths.length; i++) {
          missing = 0;
          sum = 0;
          sum += this.results.d[i].reduce((a, b) => {
            if (b != -1) {
              return a + b;
            }
            else {
              missing++;
              return a;
            }
          })
          monthSum.push(sum);
          maxPos.push(sum);
          res = sum / (this.results.d[0].length - missing);
          m.push(res);
        }
        return [m, maxPos.indexOf(Math.max(...maxPos)), monthSum, this.results.y];
      }
      else if (this.calc === 'Maximum') {
        let m = Array.from({ length: this.calMonths.length }, () => -1);
        let monthmax = Array.from({ length: this.calMonths.length }, () => -1);
        for (let i = 0; i < this.calMonths.length; i++) {
          const filteredArr = this.results.d[i].filter((value) => value !== -1);
          if (filteredArr.length > 0) {
            m[i] = Math.max(...filteredArr);
            monthmax[i] = Math.max(...filteredArr);
          }
        }
        return [m, monthmax.indexOf(Math.max(...monthmax)), monthmax, this.results.y];
      }
      else if (this.calc === 'Minimum') {
        let m = Array.from({ length: this.calMonths.length }, () => -1);
        let missing;
        let min;
        let res = 0;
        let minValues = [];
        let monthMin = Array.from({ length: this.calMonths.length }, () => -1);
        for (let i = 0; i < 12; i++) {

          missing = 0;
          min = 500; // Initialize min to the largest possible integer value
          const filteredArr = this.results.d[i].filter((value) => value !== -1);
          if (filteredArr.length > 0) {
            m[i] = Math.min(...filteredArr);
            monthMin[i] = Math.min(...filteredArr);
          }
          minValues.push(min);
          res = min;
        }
        return [m, minValues.indexOf(Math.min(...minValues)), monthMin, this.results.y];
      }
      else if (this.calc === 'Moyenne') {
        let m = [];
        let missing;
        let sum;
        let res = 0;
        let monthAverage = [];

        for (let i = 0; i < this.calMonths.length; i++) {
          missing = 0;
          sum = 0;

          sum += this.results.d[i].reduce((a, b) => {
            if (b !== -1) {
              return a + b;
            } else {
              missing++;
              return a;
            }
          });

          monthAverage.push(sum / (this.results.d[i].length - missing));
          res = sum / (this.results.d[0].length - missing);
          m.push(res);
        }

        return [m, monthAverage.indexOf(Math.max(...monthAverage)), monthAverage, this.results.y];
      }
    }
  },
  methods: {
    colorCalc(val, i, j, y) {
      const dayOfWeek = moment(`${y}-${j}-${i}`, 'YYYY-MM-DD').isoWeekday();
      if (val < 0 || (this.lines[dayOfWeek - 1] && !this.toggleSet.has(`${i}/${j}/${y}`)) || (this.lines[dayOfWeek - 1] === false && this.toggleSet.has(`${i}/${j}/${y}`))) return 'E';
      else if (val < this.min + this.interval || val == 0) return 'G3';
      else if (val < this.min + this.interval * 2) return 'G2';
      else if (val < this.min + this.interval * 3) return 'G1';
      else if (val < this.min + this.interval * 4) return 'Y';
      else if (val < this.min + this.interval * 5) return 'O2';
      else if (val < this.min + this.interval * 6) return 'O1';
      else return 'R';
    },
    monthOffset(MMM, j) {
      const month = this.monthsArr.findIndex(e => e === MMM);
      // console.log(`Month: ${MMM}, offset: ${(6 + new Date (this.results.y, month, 1).getDay()) % 7}`);
      return (6 + new Date(this.results.y, month, 1).getDay()) % 7;
    },
    monthDays(MMM, j) {
      const month = this.monthsArr.findIndex(e => e === MMM);
      return new Date(this.results.y, month + 1, 0).getDate();
    },
    generateDatesArray(year) {
      const startDate = moment(`${year}-01-01`, 'YYYY-MM-DD');
      const endDate = moment(`${year}-12-31`, 'YYYY-MM-DD');
      const datesArray = [];

      while (startDate.isSameOrBefore(endDate)) {
        datesArray.push(startDate.format('DD/MM/YYYY'));
        startDate.add(1, 'days');
      }

      return datesArray;
    },
    lineUp(n) {
      const oldLines = this.lines.slice();
      this.$set(this.lines, n, !this.lines[n]);
      for (const [key, value] of this.toggleSet.entries()) {
        if (this.lines[moment(key, 'DD/MM/YYYY').isoWeekday() - 1] !== oldLines[moment(key, 'DD/MM/YYYY').isoWeekday() - 1]) {
          this.toggleSet.delete(key);
        }
      }
      this.$emit('dayFilter', this.lines);
    },
    shouldDisplayLine(day, month, year) {
      month = this.monthsArr.findIndex(e => e === this.calMonths[month - 1]) + 1;
      const dayOfWeek = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').isoWeekday();
      // (dayFilter[isoDayOfWeek - 1] === false && !toggleSet.has(moment(date).format('D/M/YYYY'))) || (dayFilter[isoDayOfWeek - 1] === true && toggleSet.has(moment(date).format('D/M/YYYY')));
      return (this.lines[dayOfWeek - 1] && !this.toggleSet.has(`${day}/${month}/${year}`)) || (this.lines[dayOfWeek - 1] === false && this.toggleSet.has(`${day}/${month}/${year}`));
    },
    toggle(d, val) {
      var splittedDate = d.split('/');
      splittedDate[1] = this.monthsArr.findIndex(e => e === this.calMonths[splittedDate[1] - 1]) + 1;
      d = splittedDate.join('/');
      if (this.toggleSet.has(d)) {
        this.toggleSet.delete(d);
      }
      else {
        this.toggleSet.add(d);
      }
      this.$emit('toggle', this.toggleSet);
    },
    monthToNumber(j) {
      // Example output: Got 1 month is Oct index is 10
      return this.monthsArr.findIndex(e => e === this.calMonths[j - 1]) + 1;
    }
  },
  watch: {
    calc: {
      handler(n, o) {

      }
    },
    results: {
      deep: true,
      handler(n, o) {
        let exportDate = this.generateDatesArray(this.results.y);
        let exportValues = this.results.d.flat().map(e => e === -1 ? '' : e);
        let output = [];
        for (let i = 0; i < exportDate.length; i++) {
          output[i] = { date: exportDate[i], ['Valeur' + `(${this.unit.name})`]: exportValues[i] };
        }
        this.$emit('chart-sent', output);
        const flattenedArr = this.results.d.flat().filter(val => val !== -1);
        if (typeof this.results.max !== 'undefined' && typeof this.results.max === 'number') {
          this.max = this.results.max;
        }
        else {
          this.max = Math.max(...flattenedArr);
        }
        if (typeof this.results.min !== 'undefined' && typeof this.results.min === 'number') {
          this.min = this.results.min;
        }
        else {
          this.min = Math.min(...flattenedArr);
          this.min = this.min < 0 ? 0 : this.min;
        }
        this.interval = (this.max - this.min) / 7;

        let max = this.results.d[0][0];
        let maxIndex = [0, 0];

        for (let i = 0; i < this.results.d.length; i++) {
          for (let j = 0; j < this.results.d[i].length; j++) {
            if (this.results.d[i][j] > max) {
              max = this.results.d[i][j];
              maxIndex = [i, j];
            }
          }
        }
        this.maxDate = moment((maxIndex[1] + 1) + ' ' + (maxIndex[0] + 1), 'DD MM').format('DD MMMM');
      }
    },
  }
}
</script>

<style>
.MAINCOMPONENT {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  width: 100%;
  min-height: max-content;
  height: 100%;
}

.MCTITLE {
  font-family: "Charlevoix Pro";
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #F9F9F9;
}

.MCTEXT {
  font-family: "Charlevoix Pro";
  font-size: 1em !important;
  margin-left: 23px;
}

.CALHEAT {
  font-family: "Charlevoix Pro";
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  width: 100%;
}

.CALTABLE {
  font-family: "Charlevoix Pro";
  width: 100%;
}

.CALHEAD {
  width: 7.7% !important;
  font-family: "Charlevoix Pro";
  font-style: normal;
  font-weight: 400;
  font-size: 0.625em;
  line-height: 13px;

  color: #214353;
}

.WEEKDAYS {
  width: 7.7% !important;
  /* display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between; */
  height: 172px;
  padding-left: 10px;
}

.CALMONTH {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 3px;
  height: 172px !important;
  width: max-content !important;
}

.RECT {
  width: 17px;
  height: 22px;
  background: transparent;
  border-radius: 5px;
  transition: background .3s ease-in-out;
}

.unset {
  background: #D9D9D9;
}

.CALDAY {
  height: 22px;
  font-family: "Charlevoix Pro";
  font-style: normal;
  font-weight: 400;
  font-size: 0.625em;
  line-height: 13px;
  color: #214353;
  cursor: pointer;
  display: flex;
  align-content: center;
}

.CALMAX {
  font-family: "Charlevoix Pro";
  padding-left: 7.6%;
  font-style: normal;
  font-weight: 400;
  font-size: 0.813em;
  line-height: 17px;
  letter-spacing: 1.1px;
  color: #14202C;
  width: 100%;
}

.fade-effect {
  height: 24px;
  cursor: pointer;
  font-family: "Charlevoix Pro";
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 0.625em;
  color: transparent;
  transition: all .3s ease-out;
}

.fade-effect:hover {
  color: #214353;
}

.line {
  width: 0;
  margin-left: auto;
  margin-right: auto;
  left: 50%;
  height: 0px;
  border: 2px solid rgba(255, 255, 255, 0);
  position: absolute;
  transition: all .1s ease-in-out;
}

.l0 {
  top: 144px;
}

.l1 {
  top: 171px;
}

.l2 {
  top: 196px;
}

.l3 {
  top: 221px;
}

.l4 {
  top: 245px;
}

.l5 {
  top: 271px;
}

.l6 {
  top: 296px;
}


.draw-line {
  left: 0;
  width: 100% !important;
  /* border: 2px solid orange; */
  border: 2px solid orange;
}

.upper {
  height: 1px;
  width: 24px;
  border: 1px solid #ff6f0000;
  transform: rotate(0deg);
  display: inline-block;
  top: 10px;
  left: -3px;
  position: absolute;
  border-radius: 144px;
  transition: all .1s ease-in-out;
}

.line-x1 {
  border: 1px solid #ff6f00;
  transform: rotate(56deg);
}

.line-x2 {
  border: 1px solid #ff6f00;
  transform: rotate(125deg);
}
</style>