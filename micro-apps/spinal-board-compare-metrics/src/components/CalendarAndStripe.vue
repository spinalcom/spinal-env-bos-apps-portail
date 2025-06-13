<template>
  <div class="MAINCOMPONENT">
    <!-- <div class="MCTITLE">
      <p class="MCTEXT">DIAGNOSTIC PAR JOUR</p>
    </div> -->

    <div class="CALHEAT">
      <table class="CALTABLE">
        <tr>
          <td width="70"></td>
          <td class="CALHEAD">Jan</td>
          <td class="CALHEAD">Fev</td>
          <td class="CALHEAD">Mar</td>
          <td class="CALHEAD">Avr</td>
          <td class="CALHEAD">Mai</td>
          <td class="CALHEAD">Jui</td>
          <td class="CALHEAD">Jui</td>
          <td class="CALHEAD">Aou</td>
          <td class="CALHEAD">Sep</td>
          <td class="CALHEAD">Oct</td>
          <td class="CALHEAD">Nov</td>
          <td class="CALHEAD">Dec</td>
        </tr>
        <tr>
          <td class="WEEKDAYS" width="70">
            <p class="CALDAY mb-0">Lundi</p>
            <p class="CALDAY mb-0">Dimanche</p>
          </td>
          <td v-for="j in 12" :key="j">
            <div class="CALMONTH">
              <span v-for="i in monthOffset(j)" :key="'o' + i">
                <div class="RECT"></div>
              </span>
              <span v-for="i in monthDays(j)" :key="'d' + i">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      <div class="RECT unset" :class="colorCalc(results.d[j - 1][i - 1])"></div>
                    </span>
                  </template>
                  <span v-if="(results.d[j - 1][i - 1] != -1)">{{ `${i}/${j}/${results.y} :` }}
                    <b>{{ results.d[j - 1][i - 1].toFixed(1) }}</b> {{ unit
                    }}</span>
                  <span v-else>{{ `${i}/${j}/${results.y} :` }} <b>-</b> {{ unit }}</span>
                </v-tooltip>
              </span>
            </div>
          </td>
        </tr>
      </table>
      <p class="CALMAX">{{ config.calendarLegend }} <b>{{ maxDate }}</b></p>
    </div>
    <MonthlyStripe :values="monthlyValues" />
  </div>
</template>

<script>
import MonthlyStripe from './MonthlyStripe.vue';
import moment from 'moment';
import { Store } from 'vuex';
// import env from '../../config';
export default {
  name: 'CalHeat',
  components: {
    MonthlyStripe
  },
  props: ['results', 'unit'],
  data: () => ({
    d: 0,
    max: 0,
    min: 0,
    interval: 0,
    maxDate: '',
    // legend: env.calendarLegend,
    $store : Store

  }),
  mounted() {
    console.warn('salut 1');
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
    // console.log('Min:',this.min, ', Max:', this.max, ', Interval:', this.interval);

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
    this.maxDate = moment(maxIndex[1] + 1 + ' ' + maxIndex[0] + 1, 'DD MM').format('DD MMMM');
  },
  computed: {
    config() {
      return this.$store.state.appDataStore.appConfig;
    },
    monthlyValues() {
      let m = [];
      let missing;
      let sum;
      let res = 0;
      let maxPos = [];
      let monthSum = [];
      for (let i = 0; i < 12; i++) {
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
        // console.log(`${sum}/${this.results.d[i].length}-${missing}`);
        res = sum / (this.results.d[0].length - missing);
        // console.log('Pushing:', res);
        m.push(res);
      }
      return [m, maxPos.indexOf(Math.max(...maxPos)), monthSum, this.results.y];
    }
  },
  methods: {
    colorCalc(val) {
      if (val < 0) return 'E';
      else if (val < this.min + this.interval || val == 0) return 'G3';
      else if (val < this.min + this.interval * 2) return 'G2';
      else if (val < this.min + this.interval * 3) return 'G1';
      else if (val < this.min + this.interval * 4) return 'Y';
      else if (val < this.min + this.interval * 5) return 'O2';
      else if (val < this.min + this.interval * 6) return 'O1';
      else return 'R';
    },
    monthOffset(month) {
      return (6 + new Date(this.results.y, month - 1, 1).getDay()) % 7;
    },
    monthDays(month) {
      return new Date(this.results.y, month, 0).getDate();
    }
  },
  watch: {
    results() {
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
      // console.log('Min:',this.min, ', Max:', this.max, ', Interval:', this.interval);

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
  }
}
</script>

<style>
.MAINCOMPONENT {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;

  width: 100%;
  flex-grow: 1;
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
  font-size: 16px !important;
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
  font-size: 10px;
  line-height: 13px;

  color: #214353;
}

.WEEKDAYS {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 172px;
  padding-left: 10px;
}

.CALMONTH {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 3px;
  height: 172px !important;
  width: 7.7% !important;
}

.RECT {
  width: 17px;
  height: 22px;
  background: transparent;
  border-radius: 5px;
}

.unset {
  background: #D9D9D9;
}

.CALDAY {
  font-family: "Charlevoix Pro";
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 13px;
  color: #214353;
}

.CALMAX {
  font-family: "Charlevoix Pro";
  padding-left: 7.6%;
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 17px;
  letter-spacing: 1.1px;
  color: #14202C;
  width: 100%;
}
</style>