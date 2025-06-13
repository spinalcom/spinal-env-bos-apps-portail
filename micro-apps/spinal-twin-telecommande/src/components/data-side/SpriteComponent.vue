<template>
  <div
    :style="{
      position: 'relative',
      width: '100px',
      height: '100px',
      fontSize: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: data.color || '#F0715C',
    }"
  >
    <span class="mdi mdi-map-marker"></span>
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

  data: () => ({
    showAttr: false,
    fav: true,
    menu: false,
    message: false,
    hints: true,
    dynamicStyle: {
      border: "3px solid #F9F9F9",
      boxShadow: "none",
      background: this.data.color
    },
    isClicked: false,
  }),
  mounted() {

    console.error(1154, 'data', this.data);

    // document.addEventListener('click', this.handleOutsideClick);

  },

  // beforeDestroy() {
  //   document.removeEventListener('click', this.handleOutsideClick);
  // },
  methods: {
    // handleOutsideClick(event) {
    //   const container = this.$refs.container;
    //   if (container && !container.contains(event.target) && event.target.nodeName === 'CANVAS') {
    //     this.isClicked = false;
    //   }
    // },





  },
};

</script>

<style lang="scss">
#diamond-shield {
  width: 0;
  height: 0;
  border: 50px solid transparent;
  border-bottom: 20px solid red;
  position: relative;
  top: -50px;
}

#diamond-shield:after {
  content: '';
  position: absolute;
  left: -50px;
  top: 20px;
  width: 0;
  height: 0;
  border: 50px solid transparent;
  border-top: 70px solid red;
}




.category {
  background-color: rgb(245, 245, 245);
  margin-top: 8px;
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid rgb(220, 220, 220);

}

.attribute {
  font-size: 10px;
  margin-left: 10px;
}

.dropleft {
  position: absolute;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  left: 200px;
  -webkit-animation: scale-in-hor-left 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: scale-in-hor-left 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@-webkit-keyframes scale-in-hor-left {
  0% {
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

@keyframes scale-in-hor-left {
  0% {
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

.card-menu {
  left: 50%;
  top: 50%;
  border-bottom-left-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
  border-top-right-radius: 12px !important;
  position: absolute;
  background-color: white;
  width: 310px;
  min-height: 20px;
  height: auto;
  // -webkit-animation: scale-in-tl 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  // animation: scale-in-tl 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  z-index: 99999 !important;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  color: black;
  font-size: 10px;
  overflow: visible;
}







@-webkit-keyframes scale-in-tl {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

@keyframes scale-in-tl {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}



// .card {
//   width: 300px;
//   height: 300px;
//   overflow: hidden;
//   z-index: 99999;
// }

.sprite_container {
  overflow: hidden;
  border-radius: 100%;
  z-index: 2 !important;
}

.new-class {
  width: 200px;
  height: 200px;
}

.sprite_color {
  background-color: #13A9E0;
  width: 13px;
  height: 13px;
  border-radius: 100%;
  z-index: 0 !important;
  transition: 0.2s
}

.sprite_color:hover {
  transform: scale(1.5);
}

.sprite_value_unit {
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


.cards {
  padding-left: 0 !important;
}

.card {
  position: relative;
  // display: block;
  // height: 100%;
  border-radius: calc(var(--curve) * 1px);
  // background-color: white;
  // overflow: hidden;
  // text-decoration: none;

}

.card__image {
  width: 100%;
  height: auto;
}

.card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  border-radius: calc(var(--curve) * 1px);
  background-color: var(--surface-color);
  transform: translateY(100%);
  transition: .2s ease-in-out;

}

.card__header {
  position: relative;
  left: 0px;
  display: flex;
  align-items: center;
  gap: 2em;
  padding: 2em;
  border-radius: calc(var(--curve) * 1px) 0 0 0;
  background-color: var(--surface-color);
  transform: translateY(-100%);
  transition: .2s ease-in-out;
  background-color: rgb(244, 244, 244);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  cursor: pointer;
}

.card__header:hover {
  background-color: rgb(230, 230, 230);
}

.card__arc {
  width: 80px;
  height: 80px;
  position: absolute;
  bottom: 100%;
  right: 0;
  z-index: 1;

}

.card__arc path {
  fill: var(--surface-color);
  d: path("M 40 80 c 22 0 40 -22 40 -40 v 40 Z");
}

// .card:hover .card__header {
//   transform: translateY(0);
// }

.card__thumb {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.card__title {
  font-size: 1.5em;
  margin: 0 0 .3em;
  color: #000000;
}

.card__tagline {
  display: block;
  margin: 1em 0;
  font-family: "MockFlowFont";
  font-size: .8em;
  color: #D7BDCA;
}

.card__status {
  font-size: .9em;
  color: #616161;
}

.card__description {
  padding: 0 2em 2em;
  margin: 0;
  color: #000000;
  font-family: "MockFlowFont";
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  // background-color: rgb(138, 29, 29);
  border-bottom-left-radius: 15px;
  font-size: 11px;
  // background-color: rgb(244, 244, 244);
}
</style>