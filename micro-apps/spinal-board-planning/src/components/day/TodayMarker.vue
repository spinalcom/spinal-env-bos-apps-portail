
<template>
  <div class="marker" :style="{ 'left': this.offset + 'px' }">
    <div class="line" 
      :style="[
        { 'height': height + 'px' },
        { 'left': (dayWidth / 2 - 1) + 'px' },
      ]"></div>
  </div>
</template>

<script>
export default {
  name: 'TodayMarker',
  props: [
    'dayWidth',
    'height',
    'offset',
  ],
  mounted() {
  }
}
</script>

<style scoped>
.marker {
  position: absolute;
  top: -30px;
  height: 30px;
  width: 30px;
  min-height: 100%;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.dot {
  position: absolute;
  top: 25px;
  left: 10px;
  height: 7px;
  width: 7px;
  border-radius: 10px;
  background: #FF3A3A;
  z-index: 400;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.line {
  position: absolute;
  top: 25px;
  width: 1px;
  background: #FF3A3A;
  z-index: 100;
  min-height: 100%;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
</style>

