<template>
  <div style="display: flex; transform: translate(-1%);">
    <div v-if="activable && commandName == 'COMMAND_BLIND'" class="hide_controle">
      <span style="font-size: 85px;" class="mdi mdi-lock-outline"></span>
      Store bloqué pour cause de météo ou d’entretien


    </div>
    <div class="temperature-control">

      <div :style="{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2px',
        fontSize: '60px',
        borderRadius: '10px',
        backgroundColor: color,
        width: '90px',
        height: '90px',
        marginBottom: '20px',
        transform: 'translate(40%)',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px'
      }">

        <img :src="svgPath" alt="icon" style="width: 60px; height: 60px;" />
      </div>



      <div style="margin-top: 20px;" class="triangle" @click="increaseTemperature">
        <div class="shodowbox"></div>
        <div class="showdowbox2"></div>
        <div class="showdowbox3"></div>
        <div :style="{
          all: 'unset',
          zIndex: 99,
          width: '20px',
          height: '20px',
          position: 'absolute',
          backgroundColor: color,
          borderRadius: '50px',
          transform: 'translate(27px, 11px) skewX(26deg) scale(1, -1.1)',
        }"></div>
      </div>

      <div id="sliderContainer" ref="sliderContainer" class="slider-container">
        <div id="slider" class="slider"></div>
        <div id="sliderHandle" class="slider-handle" :style="{ top: sliderPosition + 'px', ...sliderStyle }"
          @mousedown="startDrag" @touchstart="startDrag"></div>
      </div>


      <div v-if="!modeString"
        style="position: absolute;position: absolute;top: 58%;margin-right: 150px;font-size: 25px;">
        <div>{{ currentTemperature }}{{ unit }}</div>
      </div>

      <!-- Affichage de la température actuelle -->
      <div class="temperature-display"></div>

      <div class="inverse_triangle" @click="decreaseTemperature">
        <div :style="{
          position: 'absolute',
          backgroundColor: lastColor,
          width: '20px',
          height: '20px',
          borderRadius: '20px',
          zIndex: 99,
          transform: 'translate(29px, 11px) skewX(11deg) skewY(20deg)'
        }"></div>
      </div>
    </div>
    <div>

      <div class="button_selection">
        <div class="btn_clic" style="">
          <div v-for="(item, index) in objet" :key="index" :style="{
            cursor: 'pointer',
            backgroundColor: 'white',
            width: '100px',
            // height: '32px',
            borderRadius: '15px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            fontSize: '21px',
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '10px',
            color: '#bdbdbd',
            fontWeight: 'bold',
            border: item.value === currentTemperature ? '2px solid rgb(76 189 243)' : 'none'
          }">
            <div @click="editvalue(item.value)"
              style="width: 30%; justify-content: center;align-items: center;display: flex;padding-top: 12px;">
              <v-badge :color="item.color"></v-badge>
            </div>
            <div @click="editvalue(item.value)" style="width: 70%; margin-left: 13px;">
              <div v-if="symbole && !modeString">
                {{ valueWithSymbole(item.value) }}{{ unit }}
              </div>
              <div v-else-if="modeString">
                {{ objet[index].string }}
                <!-- {{ index === objet.length - 1 ? '0' : '*'.repeat(objet.length - 1 - index) }} -->
              </div>
              <div v-else>
                {{ item.value }}{{ unit }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,

    commandName: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: "ampoule"
    },
    objet: {
      type: Array,
      required: true
    },
    unit: {
      type: String,
      default: "%"
    },
    step: {
      type: Number,
      default: 1
    },
    color: {
      type: String,
      default: "#ff9b9b"
    },
    currentData: {
      type: [Number, String],
      default: 0
    },
    activable: {
      type: Boolean,
      default: true
    },
    symbole: {
      type: Boolean,
      default: false
    },
    modeString: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    currentTemperature: null, // Température initiale
    temperatureTop: 0,
    isDragging: false,
    sliderPosition: 0,
    resizeObserver: null,
  }),
  computed: {


    lastColor() {
      return this.objet.length > 0 ? this.objet[this.objet.length - 1].color : '';
    },
    minTemperature() {
      return Math.min(...this.objet.map(item => item.value));
    },
    maxTemperature() {
      return Math.max(...this.objet.map(item => item.value));
    },
    svgPath() {
      const svgMap = {
        ampoule: require('../../assets/ampoule.svg'),
        thermometer: require('../../assets/temp.svg'),
        store: require('../../assets/store.svg'),
      };
      return svgMap[this.icon] || '';
    },


    sliderStyle() {
      const closestItem = this.objet.reduce((prev, curr) => {
        return (Math.abs(curr.value - this.currentTemperature) < Math.abs(prev.value - this.currentTemperature) ? curr : prev);
      });

      return {
        '--slider-thumb-color': closestItem.color
      };
    }

  },

  mounted() {


    if (this.modeString == true) {
      const currentData = this.currentData;
      const getValueFromString = (currentData) => {
        const foundObject = this.objet.find(item => item.string === currentData);
        return foundObject ? foundObject.value : null;
      };
      const result = getValueFromString(currentData);
      this.currentTemperature = result
    }
    else
      this.currentTemperature = this.currentData;

    const sliderContainer = this.$refs.sliderContainer;
    const rect = sliderContainer.getBoundingClientRect();

    console.log('Hauteur du sliderContainer:', rect.height);
    const percentage = (this.currentTemperature - this.minTemperature) / (this.maxTemperature - this.minTemperature);
    this.sliderPosition = percentage * (rect.height - 30);

    this.updateSliderPosition();

    this.initTemperature(); // Pour forcer l'initialisation ici aussi

    this.$nextTick(() => {
      const container = this.$refs.sliderContainer;
      if (container) {
        this.resizeObserver = new ResizeObserver(() => {
          this.updateSliderPosition();
        });
        this.resizeObserver.observe(container);
      }
    });
  },
  methods: {

    sendDataToparent() {

      if (this.modeString == true) {

        const result = this.objet.find(item => item.value === this.currentTemperature);
        const stringResult = result ? result.string : null;

        this.$emit('update', {
          command: this.commandName,
          value: stringResult
        });

      } else {

        this.$emit('update', {
          command: this.commandName,
          value: this.currentTemperature
        });

      }

    },

    valueWithSymbole(item) {
      return item > 0 ? `+${item}` : `${item}`;
    },
    updateSliderPosition() {
      const sliderContainer = this.$refs.sliderContainer;
      if (!sliderContainer) return;

      const rect = sliderContainer.getBoundingClientRect();
      const range = this.maxTemperature - this.minTemperature;

      if (!range || isNaN(this.currentTemperature)) return;

      const percentage = (this.currentTemperature - this.minTemperature) / range;
      const top = (1 - percentage) * (rect.height - 30);

      // On garde une valeur safe dans les bornes
      this.sliderPosition = Math.max(0, Math.min(top, rect.height - 30));
    },
    startDrag(event) {
      this.isDragging = true;
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);
      document.addEventListener('touchmove', this.onDrag);
      document.addEventListener('touchend', this.stopDrag);
    },
    stopDrag() {
      this.isDragging = false;
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDrag);
      document.removeEventListener('touchmove', this.onDrag);
      document.removeEventListener('touchend', this.stopDrag);

      this.sendDataToparent()
    },
    onDrag(event) {
      if (!this.isDragging) return;

      const sliderContainer = this.$refs.sliderContainer;
      const rect = sliderContainer.getBoundingClientRect();

      let clientY = event.clientY || event.touches[0].clientY;
      let newTop = clientY - rect.top;

      newTop = Math.max(0, Math.min(newTop, rect.height - 30));

      const percentage = 1 - (newTop / (rect.height - 30));
      const temperature = this.minTemperature + percentage * (this.maxTemperature - this.minTemperature);

      this.sliderPosition = newTop;
      this.currentTemperature = Math.round(temperature);
    }
    ,

    // onSliderChange() {
    //   this.$emit('update', {
    //     command: this.commandName,
    //     value: this.currentTemperature
    //   });
    // },

    editvalue(value) {
      this.currentTemperature = value;
      this.updateSliderPosition();
      this.sendDataToparent()
    },

    increaseTemperature() {
      if (this.currentTemperature + Number(this.step) <= this.maxTemperature) {
        this.currentTemperature += Number(this.step);
      } else {
        this.currentTemperature = this.maxTemperature;
      }
      this.updateSliderPosition();
      this.sendDataToparent()
    },
    decreaseTemperature() {
      if (this.currentTemperature - Number(this.step) >= this.minTemperature) {
        this.currentTemperature -= Number(this.step);
      } else {
        this.currentTemperature = this.minTemperature;
      }
      this.updateSliderPosition();
      this.sendDataToparent()
    },
    initTemperature() {
      if (!this.objet || this.objet.length === 0) return;

      if (this.modeString === true) {
        const found = this.objet.find(item => item.string === this.currentData);
        this.currentTemperature = found ? found.value : null;
      } else {
        this.currentTemperature = Math.round(parseFloat(this.currentData));
      }

      this.$nextTick(() => {
        this.updateSliderPosition();
      });
    },
    close() {
      this.$emit('close');
    }
  },
  watch: {
    objet: {
      handler() {
        this.initTemperature();
      },
      immediate: true,
      deep: true
    },
    currentData(newVal) {
      this.initTemperature();
    },
    currentTemperature(newVal) {
      this.updateSliderPosition();
    }
  }
};
</script>

<style scoped>
.hide_controle {
  backdrop-filter: blur(15px);
  z-index: 99;
  color: red;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 110%;
  height: 82%;
  margin-top: 120px;
  padding-top: 20px;
  font-size: 25px;
  display: flex;
  position: absolute;
  transform: translate(-30px);
  padding-bottom: 115px;
}

.slider-container {
  position: relative;
  width: 30px;
  background-color: rgba(10, 10, 10, 0);
  border-radius: 5px;
  margin-bottom: 15px;
  margin-top: 25px;
  height: 21.2vh;
}

.slider-container::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  /* Épaisseur de la ligne */
  height: 100%;
  border-left: 2px dashed black;
  /* Ligne pointillée */
  transform: translateX(-50%);
  margin-top: 5px;
}

.slider-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--slider-thumb-color);
  border: 2px solid black;
  cursor: pointer;
  transform: translate(5px, 10px);
  /* transform: translateY(-50%); */
}



.btn_clic {
  flex-direction: column;
    place-content: space-between;
    align-items: center;
    width: 100px;
    height: 22vh;
    display: flex;
    align-self: flex-end;
}


.slider {
  -webkit-appearance: none;
  appearance: none;
  margin-top: 14vh;
  margin-bottom: 116px;
  transform: rotate(-90deg);
  width: 25vh;
}

.dashedline {
  content: "";
  z-index: -1;
  border-left: 2px dashed #444;
  height: 28vh;
  margin-top: 32vh;
  position: relative;
  top: 0;
  bottom: 0;
  transform: translate(100px, -100px);
}


@media (max-height: 910px) {
  .dashedline {
    height: 29vh;
    margin-top: 34vh;
  }
}

@media (max-height: 842px) {
  .dashedline {
    height: 19vh;
    margin-top: 38vh;
  }

  .slider {
    width: 14vh;
    margin-top: 9vh;
    margin-bottom: 6vh;
  }
}

.button_selection {
  /* padding-top: 240px; */
  height: calc(100% - 100px);
  transform: translate(-10px);
  display: flex;
}

@media (min-height: 1000px) {
  .dashedline {
    height: 25vh;
    margin-top: 26vh;
  }



  .slider {
    appearance: none;
    width: 17vh;
    margin-top: 10vh;
    margin-bottom: 110px;
    transform: rotate(-90deg);
  }


}

@media (min-height: 1070px) {
  .dashedline {
    height: 19vh;
    margin-top: 23vh;
  }

}

/* @media (max-height: 832px) {
  .dashedline {
    margin-top: 38vh;
  }
} */

@media (max-height: 701px) {
  .dashedline {
    height: 14vh;
    margin-top: 38vh;
  }

  .slider {
    margin-bottom: -2vh;
    width: 11vh;
    margin-top: 7vh;
  }
}

.temperature-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 100px; */
  /* Largeur de votre composant */
  padding: 20px;

  border-radius: 10px;
  width: 150px;
}

.temperature-control2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 100px; */
  /* Largeur de votre composant */
  padding: 20px;

  border-radius: 10px;
  width: 50px;
}

.icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.triangle {
  position: relative;
  background-color: rgb(255, 255, 255);
  text-align: left;
}

.triangle:before,
.triangle:after {
  content: '';
  position: absolute;
  background-color: inherit;
}

.triangle,
.triangle:before,
.triangle:after {
  width: 60px;
  height: 60px;
  border-top-right-radius: 50%;
}

.triangle {
  transform: rotate(-60deg) skewX(-30deg) scale(1, .866);
  /* box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px; */
  /* box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset; */
  z-index: 1;
}

.triangle:before {
  transform: rotate(-135deg) skewX(-45deg) scale(1.414, .707) translate(0, -50%);
}

.triangle:after {
  transform: rotate(135deg) skewY(-45deg) scale(.707, 1.414) translate(50%);
}

.up-button:hover {
  transform: scale(1.1);
  /* Effet au survol */
}


.showdowbox2 {
  z-index: -1;
  background-color: #981c1c00;
  border-radius: 50px;
  width: 130%;
  height: 2px;
  position: absolute;
  top: 63px;
  left: 22px;
  rotate: 270deg;
  box-shadow: 0 2px 8px #00000040;
}

.showdowbox3 {
  z-index: -1;
  background-color: #0000;
  border-radius: 50px;
  width: 160%;
  height: 2px;
  position: absolute;
  top: 36px;
  left: -32px;
  rotate: 45deg;
  box-shadow: 0 2px 8px #00000040;
}

.shodowbox {
  z-index: -1;
  background-color: #0000;
  border-radius: 50px;
  width: 130%;
  height: 2px;
  position: absolute;
  top: -1px;
  left: -43px;
  rotate: 180deg;
  box-shadow: 0 2px 8px #00000040;
}

.temperature-display {
  font-size: 18px;
  margin: 10px 0;
  margin-left: 30px;
}


.inverse_triangle {
  position: relative;
  background-color: rgb(255, 255, 255);
  text-align: left;
}

.inverse_triangle:before,
.inverse_triangle:after {
  content: '';
  position: absolute;
  background-color: inherit;
}

.inverse_triangle,
.inverse_triangle:before,
.inverse_triangle:after {
  width: 60px;
  height: 60px;
  border-top-right-radius: 50%;
}

.inverse_triangle {
  transform: rotate(120deg) skewX(-30deg) scale(1, .866);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
}

.inverse_triangle:before {
  transform: rotate(-135deg) skewX(-45deg) scale(1.414, .707) translate(0, -50%);
}

.inverse_triangle:after {
  transform: rotate(135deg) skewY(-45deg) scale(.707, 1.414) translate(50%);
}
</style>
