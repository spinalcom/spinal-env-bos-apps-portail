<template>
  <div class="d-flex flex-row">
    <div class="rect align-self-center mr-2" :style="{'background-color': color}"></div>
    <div class="text align-self-center" :style="{'font-size': size+'px !important'}" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{text}}</div>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: false,
      default: 7,
    }
  }
}
</script>
<style scoped>
.rect{
  height: 13px;
  width: 6px;
  border-radius: 2px;
  vertical-align: bottom;
}

.text {

  font-size: 13px;
  font-family: 'Charlevoix Pro';
  letter-spacing: 0.7px;
  color: #000000DE;
  opacity: 1;
}
</style>