<template>

<div v-if="showLoader" class="loader-content">

    <div class="load load1"></div>
    <div class=" load load2"></div>
    <div class=" load load3"></div>
    <div class=" load load4"></div>
    <div class=" load load5"></div>
</div>

</template>

<script lang="ts">


    export default {
        name: 'Loader',

        props: {
            showLoader: {
                type: Boolean,
                default: false
            },  
        },
      
    }
</script>

<style>

.loader-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  gap: 5px;
  width: 100%;
}
.load {
    width: 4px;
    height: 30px;
    border-radius: 5px;
    background-color: #14202C;
    
}
.loader {
 width: 8px;
 height: 100%;
 background-color: #14202C;
}

.load1 {
  animation: l1 1s 0s infinite ease;
}

.load2 {
  animation: l1 1s 0.1s infinite ease;
}

.load3 {
  animation: l1 1s 0.2s infinite ease;
}

.load4 {
  animation: l1 1s 0.3s infinite ease;
}

.load5 {
  animation: l1 1s 0.4s infinite ease;
}


@keyframes l1 {
  0% {
    height: 0px;
  }
  50% {
    height: 5px;
    background-color: rgba(0, 190, 16, 0);
  }

  100% {
    height: 30px;
  }
}


</style>