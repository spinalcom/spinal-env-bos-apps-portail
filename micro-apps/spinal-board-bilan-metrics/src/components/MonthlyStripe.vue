<template>
  <div style="width: 100%">
    <div class="MCTITLE">
      <p class="MCTEXT">Bilan par mois</p>
    </div>

    <div class="MONTHSTRIPE">
      <div v-for="i in calMonths.length" :key="i" class="MONTHRECT" :class="colorCalc(values[0][i - 1])">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              style="width: 100%; height: 100%; display: flex; align-items: center; padding-left: 10px; justify-content: center;"
              v-bind="attrs" v-on="on">
              <span v-if="values[2][i - 1] !== -1" class="MONTHLEGEND">{{ shortNumberCall(values[2][i - 1]) }} {{
                unit.shortName }}</span>
            </span>
          </template>
          <span v-if="values[2][i - 1] >= 0">{{ months[i - 1].slice(0, 1).toUpperCase() + months[i - 1].slice(1) }}/{{
            values[3] }}: {{
              values[2][i - 1].toFixed(1) }} {{ unit.name }}</span>
          <!-- <span v-if="(results.d[j-1][i-1]!=-1)">{{`${i}/${j}/${results.y} :`}} <b>{{results.d[j-1][i-1].toFixed(1)}}</b> {{ unit.name }}</span> -->
          <span v-else>{{ months[i - 1].slice(0, 1).toUpperCase() + months[i - 1].slice(1) }}/{{ values[3] }}: - {{
            unit.name
            }}</span>
        </v-tooltip>
      </div>
    </div>
    <p class="CALMAX LP">{{ legend }} <b>{{ months[values[1]] }}.</b></p>
  </div>
</template>

<script>
// import env from '../../config';
export default {
  props: ['values', 'unit', 'results', 'calMonths'],
  data: () => ({
    months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    max: 0,
    min: 0,
    interval: 0,
    // legend: env.stripLegend
  }),
  mounted() {
    console.log(this.values);
    const flattenedArr = this.values[0].filter(val => val >= 0)
    if (typeof this.results.max !== 'undefined' && typeof this.results.max === 'number') {
      if (this.unit.name === '%')
        this.max = this.results.max;
      else {
        this.max = this.results.capacity;
      }
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
  },
  computed: {
    legend() {
      return this.$store.state.appDataStore.appConfig?.stripLegend || [];
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
    legendCalc(val) {
      if (val < 0) return '';
      else if (val < this.min + this.interval) return 'A';
      else if (val < this.min + this.interval * 2) return 'B';
      else if (val < this.min + this.interval * 3) return 'C';
      else if (val < this.min + this.interval * 4) return 'D';
      else if (val < this.min + this.interval * 5) return 'E';
      else if (val < this.min + this.interval * 6) return 'F';
      else return 'G';
    },
    shortNumberCall(n) {
      if (Math.abs(n) >= 1000000000) return Math.round(n / 100000000) / 10 + "Md";
      if (Math.abs(n) >= 1000000) return Math.round(n / 100000) / 10 + "M";
      if (Math.abs(n) >= 1000) return Math.round(n / 100) / 10 + "K";
      return n === Math.floor(n) ? n : n.toFixed(1);
    }
  },
  watch: {
    values(v) {
      console.log(v);
      const flattenedArr = this.values[0].filter(val => val >= 0)
      if (typeof this.results.max !== 'undefined' && typeof this.results.max === 'number') {
        if (this.unit.name === '%')
          this.max = this.results.max;
        else {
          this.max = this.results.capacity;
        }
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
    }
  }
}
</script>
<style>
.MONTHSTRIPE {
  font-family: "Charlevoix Pro";
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px 0 10px 7.6%;
  gap: 10px;
  width: calc(100% - 10px);
  height: 50px;
}

.MONTHRECT {
  font-family: "Charlevoix Pro";
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* padding: 10px; */
  gap: 10px;

  width: 100%;
  height: 30px;

  background: #D9D9D9;
  border-radius: 5px;
}

.MONTHLEGEND {
  font-family: "Charlevoix Pro";
  font-style: normal;
  font-weight: 700;
  font-size: 0.875em;
  line-height: 100%;
  /* or 20px */

  letter-spacing: 1.1px;
  color: #FFFFFF;
}
</style>