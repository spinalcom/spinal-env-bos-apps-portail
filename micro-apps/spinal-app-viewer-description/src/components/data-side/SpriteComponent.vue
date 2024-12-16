<template>

  <div class="menu">
    <!-- <v-icon>mdi-chevron-left</v-icon> -->
    <!-- <span class="mdi mdi-abjad-arabic"></span> -->
    <div v-if="isopen" ref="container" class="container">

      <div ref="closeButton" @click="close()"
        style="justify-content: center;align-items: center;display: flex;background-color: white;cursor: pointer;border-radius: 25px;width: 20px; height: 20px;position: absolute;right: -8px;font-size: 13px;z-index: 99999;top: 3px;font-weight: bold;border: 1px solid gray;color: #14202c;">
        <span class="mdi mdi-close"></span>
      </div>
      <div class="card">
        <div class="top-section">
          <div class="border"></div>
          <div class="icons">
            <div :title="data.name" class="logo">
              {{ data.name }}
            </div>
            <div ref="navigationButton"
              style="justify-content: center;align-items: center;display: flex;background-color: #14202c;cursor: pointer;width: 16px; height: 16px;position: absolute;right: 80px;font-size: 17px;transform: translateY(-3px);margin-top: 10px ;">
              &#x21AA;
            </div>

            <div class="social-media">
              <div v-if="useFullDAta && useFullDAta.attributsList">
                <div v-for="attribut in useFullDAta.attributsList">
                  <div style="margin-top: 2px;" v-if="attribut.label === 'area'">
                    {{ parseFloat(attribut.value).toFixed(1) }}m²
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div id="attr_id"
            style="display: flex; flex-wrap: wrap; overflow-y: scroll; justify-content: center;  border-radius: 5px;  ">
            <div v-for="attribut in useFullDAta.attributsList"
              style="border: 1px solid #14202c; border-radius: 5px; font-size: 11px; font-weight: bold; width: calc(50% - 20px); margin: 5px; max-height: 100px; flex-grow: 1; flex-basis: calc(50% - 20px);">
              <div
                style="display: flex; justify-content: center; align-items: center; color: white; background: #14202c;">
                {{ attribut.label.toUpperCase() }}
              </div>
              <div
                v-if="typeof attribut.value === 'string' && (attribut.value.startsWith('http://') || attribut.value.startsWith('https://'))">
                <a :href="attribut.value" target="_blank" rel="noopener noreferrer" style="display: flex; justify-content: center; align-items: center; color: #14202c; font-size: 13px; background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;white-space: nowrap;
  text-overflow: ellipsis;overflow: hidden;">
                  {{ attribut.value }}
                </a>
              </div>
              <div v-else :title="attribut.value" style="display: flex; justify-content: center; align-items: center; color: #14202c; font-size: 13px; background-color: white; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;white-space: nowrap;
  text-overflow: ellipsis;overflow: hidden;">
                {{ attribut.value }}
              </div>
            </div>
          </div>



        </div>
        <div
          style="display: flex; align-items: center; flex-direction: row; width: 100%; justify-content: center; transform: translate(0, 10px);">

          <button v-for="app in useFullDAta.app"
            style="background-color: #14202c; color: white; width: 50%; font-weight: bold; border-radius: 5px; font-size: 12px; margin: 4px;"
            @click.stop="changeRoute(app.id)">
            {{ app.value }}
          </button>

        </div>


        <div class="bottom-section">

          <div v-if="useFullDAta.bimObjects"
            style="width: 98%;color: #14202c;border: 1px solid gray;border-radius: 5px;font-weight: bold;padding-left:5px ;">
            Nombre de BimObject : {{ useFullDAta.bimObjects }} </div>


          <span v-if="useFullDAta.controlEndpoint" class="title">Points de mesures</span>


          <div v-if="useFullDAta.controlEndpoint" class="row row1">
            <div v-for="(item, index) in useFullDAta.controlEndpoint" :key="index" :style="{
              borderRight: '1px solid rgb(215, 215, 215)',
              borderTop: '1px solid rgb(215, 215, 215)',
              backgroundColor: 'rgb(230, 230, 230)',
              fontWeight: 'bold'
            }" class="item">
              <span class="big-text">{{ roundValue(item.value) }}</span>
              <span class="regular-text">{{ item.name }} {{ item.unit }}</span>
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
    isopen: true,
    showAttr: false,
    fav: true,
    menu: false,
    message: false,
    hints: true,
    dynamicStyle: {
      border: "3px solid #F9F9F9",
      boxShadow: "none",
      background: '#13A9E0'
    },
    isClicked: false,
    useFullDAta: false,
  }),
  beforeDestroy() {

    const button = this.$refs.closeButton;
    const navigation = this.$refs.navigationButton;
    if (button) {
      button.removeEventListener('click', this.close);
    }
    if (navigation) {
      navigation.removeEventListener('click', this.onClickNavigate);
    }
  },
  mounted() {
    setTimeout(() => {
      const button = this.$refs.closeButton;
      const navigation = this.$refs.navigationButton;
      if (button) {
        button.addEventListener('click', this.close);
      }
      if (navigation) {
        navigation.addEventListener('click', this.onClickNavigate);
      }
    }, 1);

    this.extractUsefulData(this.data.config.SpriteComponent, this.data.data)


  },
  methods: {

    extractUsefulData(data, sourceData) {
      const usefulData = {};

      data.forEach(item => {
        if (item.name === 'attributsList') {
          sourceData.attributsList.forEach(attribut => {
            if (attribut.name === item.categorie) {
              if (item.value == null) {
                usefulData['attributsList'] = [...(usefulData['attributsList'] || []), ...attribut.attributs];
              } else {
                attribut.attributs.forEach(attr => {
                  if (item.value == attr.label) {
                    usefulData['attributsList'] = [...(usefulData['attributsList'] || []), attr];
                  }
                });
              }
            }
          });
        } else if (item.name === "bimObjects") {
          usefulData['bimObjects'] = sourceData.bimObjects?.length;
        } else if (item.name === "controlEndpoint") {

          sourceData.controlEndpoint.forEach(ctrEndpoints => {
            if (ctrEndpoints.profileName == item.categorie) {
              if (item.value == null) {
                usefulData['controlEndpoint'] = [...(usefulData['controlEndpoint'] || []), ...ctrEndpoints.endpoints];
              } else {
                ctrEndpoints.endpoints.forEach(endpoint => {
                  if (item.value == endpoint.name) {
                    usefulData['controlEndpoint'] = [...(usefulData['controlEndpoint'] || []), endpoint];
                  }
                });
              }
            }
          });
        } else if (item.name == "app") {
          usefulData['app'] = [...(usefulData['app'] || []), item]
        }
      });

      this.useFullDAta = usefulData;
    }
    ,
    roundValue(value) {
      return typeof value === 'number' ? value.toFixed(2) : value;
    }
    ,

    close() {
      this.isopen = false;
    },
    changeRoute(route) {
      const query = {}
      query.app = route
      query.buildingId = this.data.buildingId
      query.spaceSelectedId = this.data.dynamicId
      query.name = this.data.name
      window.parent.routerFontion.customReplace(window.parent.router.path, query);
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
          }
          else if (this.data.attr === "Nom") {
            return this.data.name
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

    onClickNavigate() {
      const emitterHandler = EmitterViewerHandler.getInstance();
      emitterHandler.emit(VIEWER_SPRITE_CLICK, { navigate: 'la page', node: this.data });
      const query = {
        app: window.parent.router.query.app,
        buildingId: this.data.buildingId,
        spaceSelectedId: this.data.dynamicId,
        name: this.data.name
      };

      window.parent.routerFontion.customPush(window.parent.router.path, query);
    },

    // onClick(ev) {
    //   ev.stopPropagation();
    //   ev.preventDefault();
    //   ev.stopImmediatePropagation();

    //   this.isClicked = true;
    //   const emitterHandler = EmitterViewerHandler.getInstance();
    //   emitterHandler.emit(VIEWER_SPRITE_CLICK, { node: this.data });
    //   if (this.isClicked)
    //     this._isSelected();
    //   else {
    //     this._isNotSelected();
    //   }
    //   return false;
    // },

    _isSelected() {
      this.data.color = 'cyan'
      this.isClicked = true;
      const enfant = this.$refs.container;
      if (enfant && enfant.parentElement) {
        enfant.parentElement.style.zIndex = '99';
      }

      this.dynamicStyle = {
        border: "3px solid #00A2FF",
        boxShadow: "0px 0px 10px 2px #00A2FF",
      };
    },
    _isNotSelected() {
      this.showAttr = false;
      this.data.color = 'blue'
      this.isClicked = false;
      const enfant = this.$refs.container;
      if (enfant && enfant.parentElement) {
        enfant.parentElement.style.zIndex = '1';
      }

      this.dynamicStyle = {
        border: "3px solid #F9F9F9",
        boxShadow: "none",
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
  height: 120px;
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
  min-width: 310px;
  /* min-height: 300px; */
  height: auto;
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




/* .sprite_container {
  overflow: hidden;
  border-radius: 100%;
  z-index: 2 !important;
} */
.container {
  z-index: 9999;
  width: 250px;
  /* background-color: red; */

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
  width: 360px;
}

/* .card {
  position: relative !important;

  border-radius: calc(var(--curve) * 1px);


} */

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
  background-color: rgb(211, 211, 211);
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
  border-bottom-left-radius: 15px;
  font-size: 11px;
}

.menu {
  position: absolute;
  overflow: visible;

}

.card {
  border: 1px solid rgb(179, 179, 179);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  width: 280px;
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

.card .top-section {
  height: 150px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  /* background: linear-gradient(45deg, #8d8d8d 0%, rgb(156, 156, 156) 100%); */
  position: relative;
}

.card .top-section .border {
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

.card .top-section .border::before {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  top: 0;
  right: -15px;
  background: rgba(255, 255, 255, 0);
  border-top-left-radius: 10px;
  box-shadow: -5px -5px 0 2px #ffffff;
}

.card .top-section::before {
  content: "";
  position: absolute;
  top: 30px;
  left: 0;
  background: rgba(255, 255, 255, 0);
  height: 15px;
  width: 15px;
  border-top-left-radius: 15px;
  box-shadow: -5px -5px 0 2px #ffffff;
}

.card .top-section .icons {
  position: absolute;
  top: 0;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
}

.card .top-section .icons .logo {
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

.card .top-section .icons .logo .top-section {
  height: 100%;
}

.card .top-section .icons .social-media {
  height: 100%;
  padding: 8px 0px;
  display: flex;
  gap: 7px;
  font-weight: bold;
  color: #14202c;
}

.card .top-section .icons .social-media .svg {
  height: 100%;
  fill: #1b233d;
}

.card .top-section .icons .social-media .svg:hover {
  fill: rgb(185, 185, 185);
}

.card .bottom-section {
  margin-top: 15px;
  padding: 10px 5px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card .bottom-section .title {
  display: block;
  font-size: 14px;
  font-weight: bolder;
  color: #14202c;
  text-align: center;
  letter-spacing: 2px;
}

.card .bottom-section .row {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.card .bottom-section .row .item {
  flex: 30%;
  text-align: center;
  padding: 5px;
  color: #14202c;
}

.card .bottom-section .row .item .big-text {
  font-size: 12px;
  display: block;
}

.card .bottom-section .row .item .regular-text {
  font-size: 9px;
}

.card .bottom-section .row .item:nth-child(2) {
  border-left: 1px solid rgba(255, 255, 255, 0.126);
  border-right: 1px solid rgba(255, 255, 255, 0.126);
}
</style>