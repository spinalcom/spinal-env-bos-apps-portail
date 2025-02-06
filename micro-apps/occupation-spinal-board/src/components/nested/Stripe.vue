<template>
  <div class="STRP" v-if="percentage">
    <div v-if="percentage[index] != 0" v-for="(i, index) in stripeData.stripeValues" :key="index" class="BLCKS" :style="{'width': percentage[index]+'%'}">
      <div class="strpnms">{{stripeData.stripeNames[index]}}</div>
      <div class="CLRBLCK" :style="{'background-color': stripeData.stripeColors[index]}"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StripeLong',
  props: {
    stripeData: {
      required: true,
      type: Object
    },
  },
  data: () => ({
    percentage: null
  }),
  mounted() {
    if (this.stripeData.stripeValues[0] == 0 && this.stripeData.stripeValues[1] == 0 && this.stripeData.stripeValues[2] == 0 && this.stripeData.stripeValues[3] == 0) this.stripeData.stripeValues = [0, 0, 0, 1];
    const arraySum = this.stripeData.stripeValues.reduce((x, y) => x+y);
    this.percentage = this.stripeData.stripeValues.map((element) => parseInt((element * 100 / arraySum).toFixed(2)));
  },
  watch: {

  }
}
</script>
<style scoped>
.col-header {
  font: normal normal normal 11px/13px Charlevoix !important;
  letter-spacing: 1.1px;
  color: #949DA6;
  opacity: 1;
}



.STRP {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0 10px;
  gap: 5px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}

.BLCKS {
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 1;
}

.strpnms {
  overflow: hidden !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  background-color: transparent;
  font-size: 10px;
  color: #949DA6;
}

.BLCKS:hover .strpnms {
  overflow: visible !important;
  background-color: white !important;
  width: 70px;
  max-width: 160px;
  z-index: 2;
}

.BLCKS:hover {
  z-index: 2;
}

.CLRBLCK {
  width: 100%;
  height: 44px;
  border-radius: 5px;
}
</style>