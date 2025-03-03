
<template>
    <div
      v-if="image_list.length > 0"
      style="width: 100%"
      class="d-flex flex-column"
    >
      <div
        class="d-flex justify-center flex-shrink-1"
        style="background-color: rgba(0, 0, 0, 0.6)"
      >
        <div class="text-center my-2">
          <a
            style="color: white"
            :href="image_list[c_index].src"
            target="_blank"
            :download="image_list[c_index].name"
            >{{ image_list[c_index].name }}
            <v-icon class="ml-1" style="color: white">
              mdi-tray-arrow-down
            </v-icon>
          </a>
        </div>
      </div>
      <div
        class="d-flex flex-row flex-grow-1 justify-space-between"
        style="
          background-color: #bbb;
          background-size: contain;
          background-position: center center;
        "
        :style="{
          'background-image': 'url(' + image_list[c_index].src + ')',
        }"
      >
        <div class="d-flex align-center px-2">
          <v-btn
            style="color: white; background-color: rgba(0, 0, 0, 0.3)"
            fab
            @click="
              c_index = (c_index + image_list.length - 1) % image_list.length
            "
          >
            <v-icon large>mdi-chevron-left</v-icon>
          </v-btn>
        </div>
        <div class="d-flex align-center px-2">
          <v-btn
            style="color: white; background-color: rgba(0, 0, 0, 0.3)"
            fab
            @click="c_index = (c_index + 1) % image_list.length"
          >
            <v-icon large>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
      <div
        class="d-flex justify-center flex-shrink-1"
        style="background-color: rgba(0, 0, 0, 0.6)"
      >
        <div
          v-for="(img, i) in image_list"
          :key="i"
          class="d-flex align-center justify-center rounded-circle ma-1"
          style="width: 18px; height: 18px"
          :style="{
            'background-color': `rgba(255,255,255,${
              c_index === i ? '0.3' : '0'
            })`,
          }"
        >
          <v-btn
            fab
            style="background-color: white; width: 10px; height: 10px"
            @click="c_index = i"
          ></v-btn>
        </div>
      </div>
    </div>
    <div v-else id="carousel-vide" style="width: 100%"></div>
  </template>
  
  <script>
  export default {
    props: {
      image_list: {
        type: Array,
        default: () => [],
      },
    },
  
    data: () => ({
      c_index: 0,
    }),
  };
  </script>
  
  <style scoped>
  #carousel-vide {
    background-image: url("../assets/img/No-Image-Placeholder.png");
    background-color: #eee;
    background-size: contain;
    background-position: center center;
  }
  </style>
  