<template>
  <div v-if="!isPercent" ref="main" class="d-flex flex-row flex-wrap">


    
    <template   v-for="(n, i) in dotsList.length" >
      <div  v-for="j in dotsList[i]" :key="j+'.'+i" >
        <div class="circle" :style="{'background-color': '#'+dotsColor[i]}" v-once></div>
      </div>
    </template>
  </div>






  <div v-else class="d-flex flex-row flex-wrap" ref="main">
    <template   v-for="(n, i) in dotsPercentage.length">
      <div  v-for="j in dotsPercentage[i]" :key="j+'.'+i">
        <div class="circle" :style="{'background-color': '#'+dotsColor[i]}" v-once>
        </div>
      </div>
    </template>  
  </div>
</template>

<script>
export default {
  props: {
    givenHeight: {
      type: Number,
      required: true
    },
    givenWidth: {
      type: Number,
      required: false
    },
    isPercent: {
      type: Boolean,
      required: false,
      default: false
    },
    dotsList:{},
    dotsColor:{}
  },
  methods: {
    percentageHandler() {
      this.dotsPercentage = this.dotsList;
      const maxDots = this.dotsPercentage.reduce((x, y) => x+y);
      this.dotsPercentage = this.dotsPercentage.map((element) => parseInt((element*100/maxDots).toFixed(0)));
      this.dotsPercentage = this.dotsPercentage.map(element => parseInt((element*this.numberOfDots/100).toFixed(0)));
      const maxFromPercentage = this.dotsPercentage.reduce((x, y) => x+y);
      if(this.numberOfDots != maxFromPercentage) {
        const max = Math.max(...this.dotsPercentage);
        const index = this.dotsPercentage.indexOf(max);
        this.dotsPercentage[index] += (this.numberOfDots - maxFromPercentage);
      }
    }
  },
  computed: {
    numberOfDots(){
      return Math.trunc((this.givenHeight)/12) * Math.trunc((this.givenWidth)/12);
    },
  },
  data: () => ({
    counter: 0,
    dotsPercentage: [],
  }),
  mounted() {
    this.percentageHandler();
  },
  watch: {
    givenHeight() {
    this.percentageHandler();
    },
    givenWidth() {
    this.percentageHandler();
    },
    isPercent() {
      this.percentageHandler();
    }
  }
}
</script>
<style scoped>
.circle {
  margin-right: 6px;
  margin-bottom: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>