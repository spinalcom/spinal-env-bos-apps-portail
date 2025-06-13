<template>
    <div class="loader-content">
        <div class="loader"></div>
    </div>
</template>



<script lang="ts">


export default {
    name: 'loader',
}
</script>


<style scoped>

    .loader-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        background-color: #ffffffd0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .loader {
 width: 60px;
 height: 60px;
 background-color: transparent;
}

.loader::before {
 content: "";
 box-sizing: border-box;
 position: absolute;
 width: 60px;
 height: 60px;
 background-color: transparent;
 border-radius: 50%;
 border-top: 2px solid #14202C;
 border-right: 2px solid transparent;
 animation: spinner8217 0.8s linear infinite;
}

@keyframes spinner8217 {
 to {
  transform: rotate(360deg);
 }
}
</style>