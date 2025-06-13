<template>
    <div class="sprite_container" @click="onClick">
      <div
        class="sprite_color"
        :style="{ background: data.color, ...dynamicStyle }"
      ></div>
      <div class="sprite_value_unit" :style="dynamicStyle">
        {{ (data.displayValue | round) + " °C" }}
      </div>
    </div>
  </template> 
  <script>
  import {
    EmitterViewerHandler,
    VIEWER_SPRITE_CLICK,
  } from "spinal-viewer-event-manager";
  
  export default {
    props: {
      data: {},
    },
    filters: {
      round(value) {
        try {
          if (typeof value === "string" && value.length === 0) return "";
          var num = Number(value);
          var rounded = num.toFixed(2);
          return Number(rounded);
        } catch (error) {
          console.error(error);
          return "";
        }
      },
    },
    data: () => ({
      fav: true,
      menu: false,
      message: false,
      hints: true,
      dynamicStyle: {
        border: "3px solid #F9F9F9",
        boxShadow: "none",
      },
    }),
    mounted() {},
    methods: {
      onClick() {
        // console.log(this.data);
        const emitterHandler = EmitterViewerHandler.getInstance();
        emitterHandler.emit(VIEWER_SPRITE_CLICK, { node: this.data });
        // this._isSelected();
      },
      _isSelected() {
        console.log(this.data.name);
        this.dynamicStyle = {
          border: "3px solid #00A2FF",
          boxShadow: "0px 0px 10px 2px #00A2FF",
        };
      },
      _isNotSelected() {
        this.dynamicStyle = {
          border: "3px solid #F9F9F9",
          boxShadow: "none",
        };
      },
    },
  };
  
  </script>
  
  <style scoped>
  .sprite_container {
    width: "fit-content";
    height: "fit-content";
    background: none;
    box-shadow: none;
    color: transparent;
    /* border-radius: 100%; */
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 99999;
  }
  .sprite_color {
    width: 20px;
    height: 20px;
    border-radius: 100%;
    /* border: 3px solid #F9F9F9; */
    /* border: 3px solid; */
    z-index: 2;
  }
  .sprite_value_unit {
    /* border: 2px solid #F9F9F9; */
    /* border: 2px solid;  */
    border-radius: 100px;
    color: #14202c;
    margin-left: -15px;
    padding-left: 15px;
    padding-right: 5px;
    padding-bottom: 1px;
    height: 15px;
    font-size: 14px;
    background: #f9f9f9;
    z-index: 1;
  }
  /* 
  .sprite_container:hover {
    cursor: pointer;
  } */
  </style>