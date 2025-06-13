<template>
  <div ref="container" class="equipmentApp_menu">
    <div
      class="equipmentApp_sprite_color"
      @click="onClick"
      style="cursor: pointer"
      :style="{ ...dynamicStyle }"
    ></div>

    <div class="equipmentApp_sprite_container" v-if="isClicked">
      <div
        ref="closeButton"
        @click="onClose"
        style="
          justify-content: center;
          align-items: center;
          display: flex;
          background-color: white;
          cursor: pointer;
          border-radius: 25px;
          width: 20px;
          height: 20px;
          position: absolute;
          right: -35px;
          font-size: 13px;
          z-index: 99999;
          top: 3px;
          font-weight: bold;
          border: 1px solid gray;
          color: #14202c;
        "
      >
        <span class="mdi mdi-close"></span>
      </div>
      <div class="equipmentApp_card">
        <div class="top-section">
          <div class="border"></div>
          <div class="icons">
            <div :title="data.name" class="logo">
              {{ data.name }}
            </div>
            <div
              ref="navigationButton"
              @click="onArrowClick"
              style="
                justify-content: center;
                align-items: center;
                display: flex;
                background-color: #14202c;
                cursor: pointer;
                width: 16px;
                height: 16px;
                position: absolute;
                right: 80px;
                font-size: 17px;
                transform: translateY(-3px);
                margin-top: 10px;
              "
            >
              &#x21AA;
            </div>
          </div>

          <div
            id="attr_id"
            style="
              display: flex;
              flex-wrap: wrap;
              overflow-y: scroll;
              justify-content: center;
              border-radius: 5px;
            "
          >
            <div
              v-for="attribut in [
                { label: 'Tickets', value: data.nbr_tickets },
                { label: 'Catégorie attributs', value: data.nbr_category_attributes },
                { label: 'Profiles insight', value: data.nbr_cp },
                { label: 'Points de mesures', value: data.nbr_ep },
                { label: 'Possède des documents', value: data.nbr_files > 0 ? 'Oui' : 'Non' },
                { label: 'Notes', value: data.nbr_notes },                
              ]"
              class="box-item"
            >
              <div
                class="box-item-title"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: white;
                  background: #14202c;
                "
              >
                {{ attribut.label.toUpperCase() }}
              </div>
              <div
                :title="attribut.value"
                class="box-item-value"
              >
                {{ attribut.value }}
              </div>
            </div>
          </div>
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            flex-direction: row;
            width: 100%;
            justify-content: center;
            transform: translate(0, 10px);
          "
        >
          <button
            v-for="app in {
              id: 'data.id',
              value: 'Détails sur étage ou pièce',
            }"
            style="
              background-color: #14202c;
              color: white;
              width: 50%;
              font-weight: bold;
              border-radius: 5px;
              font-size: 12px;
              margin: 4px;
            "
            @click.stop="changeRoute(app.id)"
          >
            {{ app.value }}
          </button>
        </div>

        <div class="bottom-section">

          <!-- <span v-if="true" class="title">Points de mesures</span> -->

          <div v-if="true" class="row row1">
            <div
              v-for="(item, index) in [
                { name: 'Etage', value: data.floor.name },
                { name: 'Pièce', value: data.room.name },
                { name: 'Groupe', value: data.group },
              ]"
              :key="index"
              :style="{
                borderRight: '1px solid rgb(215, 215, 215)',
                borderTop: '1px solid rgb(215, 215, 215)',
                backgroundColor: 'rgb(230, 230, 230)',
                fontWeight: 'bold',
              }"
              class="item"
            >
              <span class="big-text">{{ item.name }}</span>
              <span class="regular-text">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
} from 'spinal-viewer-event-manager';

export default {
  props: {
    data: {},
  },
  filters: {
    round(value) {
      try {
        if (typeof value === 'string' && value.length === 0) return '';
        var num = Number(value);
        var rounded = num.toFixed(2);
        return Number(rounded);
      } catch (error) {
        console.error(error);
        return '';
      }
    },
  },
  data: () => ({
    showAttr: false,
    fav: true,
    menu: false,
    message: false,
    hints: true,
    dynamicStyle: {
      border: '1px solid #F9F9F9',
      boxShadow: 'none',
      background: '#13a9e0',
    },
    isClicked: false,
  }),
  mounted() {
    // console.log('data sprite component :', this.data);
    this.dynamicStyle.background = this.data.color || '#13a9e0';
    document.addEventListener('click', (evt) => {
      const flyoutEl = this.$refs.container;
      let targetEl = evt.target;
      while (targetEl) {
        if (targetEl === flyoutEl) {
          return;
        } else if (
          targetEl.classList &&
          targetEl.classList.contains('equipmentApp_menu') &&
          targetEl !== flyoutEl
        ) {
          this._isNotSelected();
          return;
        }
        targetEl = targetEl.parentNode;
      }
    });

    setTimeout(() => {
      const button = this.$refs.container;
      if (button) {
        //button.addEventListener('click', this.onClick);
      }
    }, 1);
  },

  methods: {
    isUrl(value) {
      return (
        typeof value === 'string' &&
        (value.startsWith('http://') || value.startsWith('https://'))
      );
    },
    extrairePrefixe(str) {
      const dernierSlashIndex = str.lastIndexOf('/');
      if (dernierSlashIndex !== -1) {
        return str.substring(0, dernierSlashIndex);
      }
      return str;
    },
    findValueByLabel() {
      for (const category of this.data.categoryAttributes) {
        for (const attribute of category.attributs) {
          if (attribute.label === this.extrairePrefixe(this.data.attr)) {
            return attribute.value;
          } else if (this.data.attr === 'Nom') {
            return this.data.name;
          }
        }
      }
      return undefined;
    },

    shouldDisplayAttribute(attr) {
      // Liste des labels à exclure
      const excludedLabels = ['name', 'XYZ center'];
      return !excludedLabels.includes(attr.label);
    },
    onClose() {
      this.isClicked = false;
      this.showAttr = false;
      this._isNotSelected();
    },

    onClick() {
      this.isClicked = true;
      const emitterHandler = EmitterViewerHandler.getInstance();
      emitterHandler.emit(VIEWER_SPRITE_CLICK, {action:'dataViewSelect',  node: this.data });
      if (this.isClicked) this._isSelected();
      else {
        this._isNotSelected();
      }
    },

    onArrowClick(){
      this.isClicked = true;
      const emitterHandler = EmitterViewerHandler.getInstance();
      emitterHandler.emit(VIEWER_SPRITE_CLICK, {action:'itemSelection',  node: this.data });


    },
    _isSelected() {
      //this.data.color = 'cyan'
      this.isClicked = true;
      const enfant = this.$refs.container;
      if (enfant && enfant.parentElement) {
        enfant.parentElement.style.zIndex = '9999';
      }

      this.dynamicStyle = {
        background: this.data.color || '#13a9e0',
        border: '1px solid #00A2FF',
        boxShadow: '0px 0px 10px 2px #00A2FF',
      };
    },
    _isNotSelected() {
      this.showAttr = false;
      this.isClicked = false;
      const enfant = this.$refs.container;
      if (enfant && enfant.parentElement) {
        enfant.parentElement.style.zIndex = '1';
      }

      this.dynamicStyle = {
        border: '1px solid #F9F9F9',
        boxShadow: 'none',
        background: this.data.color || '#13a9e0',
      };
    },
  },
};
</script>

<style scoped>
#attr_id::-webkit-scrollbar {
  width: 7px;
  /* Width of the entire scrollbar */
}

#attr_id::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* Color of the track */
  border-radius: 10px;
}

#attr_id::-webkit-scrollbar-thumb {
  background: #dadada;
  /* Color of the scrollbar handle */
  border-radius: 10px;
  border: 1px solid gray;
}

#attr_id::-webkit-scrollbar-thumb:hover {
  background: #c5c5c5;
  /* Color of the scrollbar handle on hover */
}

#attr_id {
  z-index: 5;
  height: 220px;
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

.equipmentApp_sprite_container {
  /* overflow: hidden; */
  margin-left: 7px;
  width: 330px;
  /* border-radius: 100%; */
  z-index: 99999 !important;
}

.equipmentApp_sprite_color {
  /* background-color: #13A9E0; */
  width: 11px;
  height: 11px;
  border-radius: 100%;
  z-index: 0 !important;
}

.equipmentApp_menu {
  position: absolute;
  overflow: visible;
}

.equipmentApp_card {
  border: 1px solid rgb(179, 179, 179);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  width: 350px;
  border-bottom-left-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
  border-top-right-radius: 12px !important;
  background: #f1f1f1;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 20px 0px;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative !important;
}

/* 
  .card:hover {
    transform: scale(1.05);
  } */

.equipmentApp_card .top-section {
  height: 220px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  /* background: linear-gradient(45deg, #8d8d8d 0%, rgb(156, 156, 156) 100%); */
  position: relative;
}

.equipmentApp_card .top-section .border {
  height: 51px;
  /* width: 70%; */
  background: #fff;
  border-bottom-right-radius: 10px;
  position: relative;
  transform: skew(-40deg);
  box-shadow: -2px -20px #fff;
  left: -67px;
  top: -5px;
}

.equipmentApp_card .top-section .border::before {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  top: 0;
  right: -15px;
  background: rgba(255, 255, 255, 0);
  border-top-left-radius: 10px;
  box-shadow: -5px -5px 0 2px #ffffff;
}

.equipmentApp_card .top-section::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 0;
  background: rgba(255, 255, 255, 0);
  height: 15px;
  width: 15px;
  border-top-left-radius: 15px;
  box-shadow: -5px -5px 0 2px #ffffff;
}

.equipmentApp_card .top-section .icons {
  position: absolute;
  top: 0;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
}

.equipmentApp_card .top-section .box-item {
  border: 1px solid #14202c;
  border-radius: 5px;
  font-size: 11px;
  font-weight: bold;
  width: calc(50% - 20px);
  margin: 5px;
  max-height: 100px;
  flex-grow: 1;
  flex-basis: calc(50% - 20px);
}

.equipmentApp_card .top-section .box-item-title {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: #14202c;
}

.equipmentApp_card .top-section .box-item-value {
  margin-top: 10px;
  display: flex;
  justify-content: center; 
  align-items: center; 
  color: #14202c; 
  font-size: 13px; 
  /* background-color: white;  */
  border-bottom-left-radius: 5px; 
  border-bottom-right-radius: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}




.equipmentApp_card .top-section .icons .logo {
  height: 100%;
  aspect-ratio: 1;
  /* padding:  */
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 15px;
  color: #14202c;
  font-weight: bold;
  font-size: 15;
  margin-top: 6px;
  /* background-color: red; */

  overflow: hidden;
  width: 60%;
}

.equipmentApp_card .top-section .icons .logo .top-section {
  height: 100%;
}

.equipmentApp_card .top-section .icons .social-media {
  height: 100%;
  padding: 8px 0px;
  display: flex;
  gap: 7px;
  font-weight: bold;
  color: #14202c;
}

.equipmentApp_card .top-section .icons .social-media .svg {
  height: 100%;
  fill: #1b233d;
}

.equipmentApp_card .top-section .icons .social-media .svg:hover {
  fill: rgb(185, 185, 185);
}

.equipmentApp_card .bottom-section {
  margin-top: 15px;
  padding: 10px 5px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.equipmentApp_card .bottom-section .title {
  display: block;
  font-size: 14px;
  font-weight: bolder;
  color: #14202c;
  text-align: center;
  letter-spacing: 2px;
}

.equipmentApp_card .bottom-section .row {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.equipmentApp_card .bottom-section .row .item {
  flex: 30%;
  text-align: center;
  padding: 5px;
  color: #14202c;
}

.equipmentApp_card .bottom-section .row .item .big-text {
  font-size: 12px;
  display: block;
}

.equipmentApp_card .bottom-section .row .item .regular-text {
  font-size: 9px;
}

.equipmentApp_card .bottom-section .row .item:nth-child(2) {
  border-left: 1px solid rgba(255, 255, 255, 0.126);
  border-right: 1px solid rgba(255, 255, 255, 0.126);
}
</style>
