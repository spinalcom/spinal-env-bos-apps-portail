<template>
  <v-card class="line-card pa-1 rounded-lg d-flex flex-column flex-grow-1" elevation="5" outlined
    style="border-radius: 10px !important;width: 100%;min-height: 185px;">
    <div class="d-flex">
      <span class="v-card__title card-title pa-3 text-uppercase  flex-shrink-1 mb-8 mt-1">Capacité actuelle des étages
        et des services</span>
    </div>
    <div class="d-flex justify-space-around mt-1">
      <div v-if="totalPages > 1" class="arrow-container-left" @click="previousPage">
        <div class="round">
          <v-icon class="arrow-icon ">mdi-chevron-left</v-icon>
        </div>
      </div>
      <div
        :class="[paginatedItems.length >= 7 ? 'carrousel-container' : 'carrousel-container2', animate === 'right' ? 'container-animation-right' : animate === 'left' ? 'container-animation-left' : '']">

        <div v-for="(item, index) in paginatedItems" :key="item.id" class="item">
          <v-progress-circular style="transform: translate(0,30%);margin-right: 100px;"
            v-if="item.percentage === undefined" indeterminate color="primary" size="70"></v-progress-circular>
          <div style="margin-right: 50px;" v-if="item.percentage != 'NaN%'">
            <div class="title_capactity_card ml-1">{{ item.title }}</div>
            <div style="height: 45px; font-size: 36px; font-weight: 500;">{{ item.percentage }}</div>
            <div style="display: flex; align-items: center">
              <div class="rounded_square mr-1 ml-1" :style="{ backgroundColor: item.color }"></div>
              <div style="font-size: 22px;">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="totalPages > 1" class="arrow-container-right" @click="nextPage">
        <div class="round">
          <v-icon class="arrow-icon" width="32">mdi-chevron-right</v-icon>
        </div>
      </div>
    </div>
  </v-card>
</template>
<script>
import config from "../../config.js"
export default {
  name: 'NomDuComposant',
  props: ['tab', 'headers'],
  data() {
    return {
      currentPage: 1,
      animate: false,
      switchValue: false,
      item: [],
      config: config,
      capacityData: [],
    };
  },
  methods: {
    getCapacity() {
      const capacityValues = this.headers
        .filter(header => header.addToCapacityTab)
        .map(header => header.value);
      toto = []
      const elements = [];
      values = 0;
      capacityValues.forEach((value, index) => {

        count = 0;
        let countTrue = 0;

        this.tab.forEach(item => {
          Object.keys(item).forEach(key => {
            if (key === value) {
              count++;
              if (item[key] == true || item[key] == 1) {
                countTrue++;
              }
            }
          });
        });

        let percentage = (countTrue / count * 100).toFixed(2);
        const element = {
          id: index,
          title: value,
          color: 'red',
          percentage: percentage + "%",
          count: countTrue + "/" + count,
          description: ""
        };

        elements.push(element);
        values++;
      });
      elements;

      if (this.tab.length == count && capacityValues.length == values) {
        return elements;
      }
      for (i = 0; i < capacityValues.length; i++) {
        toto.push({})
      }
      return toto
    },

    updateCapacityData() {
      this.capacityData = this.getCapacity();
    },
    startInterval() {
      this.intervalId = setInterval(this.updateCapacityData, 2000);
    },

    //animation previous page
    previousPage() {
      this.animate = "left";
      if (this.currentPage === 1) {
        this.currentPage = this.totalPages;
      } else {
        this.currentPage--;
      }
      setTimeout(() => {
        this.animate = false;
      }, 500);
    },
    //animation next page
    nextPage() {
      this.animate = "right";
      if (this.currentPage === this.totalPages) {
        this.currentPage = 1;
      } else {
        this.currentPage++;
      }
      setTimeout(() => {
        this.animate = false;
      }, 600);
    },
  },

  computed: {

    lastItemIndex() {
      return (this.currentPage - 1) * 7 + 6;
    },
    paginatedItems() {
      if (this.capacityData) {
        const startIndex = (this.currentPage - 1) * 7;
        const endIndex = startIndex + 7;
        return this.capacityData.slice(startIndex, endIndex);
      } else {
        return []
      }
    },
    totalPages() {
      return Math.ceil(this.capacityData.length / 7);
    },

  },
  mounted() {
    this.updateCapacityData();  // initial update
    this.startInterval();
  }
};
</script>
  
<style scoped>
.container-animation-right {
  -webkit-animation: slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.container-animation-left {
  -webkit-animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@-webkit-keyframes slide-right {
  0% {
    -webkit-transform: translateX(1000px);
    transform: translateX(1000px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-right {
  0% {
    -webkit-transform: translateX(1000px);
    transform: translateX(1000px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}

@-webkit-keyframes slide-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}


.arrow-container-left,
.arrow-container-right {
  top: 0;
  height: 70%;
  position: absolute;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  top: 30%;
  /* background-color: red; */
}

.round {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  width: 35px;
  height: 35px;
  border-radius: 20px;
}

.arrow-container-right:hover .round,
.arrow-container-left:hover .round {
  background-color: rgb(236, 236, 236);
}


.arrow-container-left {
  left: 0;
}

.arrow-container-right {
  right: 0;
}

.line-card {
  background-color: #f9f9f9;
  max-height: 200px;
  overflow: hidden;
}

.rounded_square {
  width: 8px;
  height: 17px;
  border-radius: 2px;

}

.carrousel-container {
  display: flex;
  justify-content: space-between;
  width: 85%;
}

.carrousel-container2 {
  margin-left: 60px;
  display: flex;
  width: 95%;
}

.title_capactity_card {
  letter-spacing: 1.5px;
  color: gray;
  height: 14px;
  font-weight: 500;
  font-size: 14px;
}

.text_capactity_card {
  letter-spacing: 1.5px;
  color: gray;
  height: 12px;
  font-weight: 500;
  font-size: 10px;
}

.item:first-child {
  margin-left: 12px;
}
</style>
  