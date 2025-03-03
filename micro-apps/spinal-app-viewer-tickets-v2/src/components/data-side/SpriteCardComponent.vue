<template>
  <div v-if="isopen" class="sprite-card-container"
    :class="{ 'floor-card': isPositionFloor, 'sprite-card-container-no-file': !data.data[currentIndex].file_list || data.data[currentIndex].file_list.length == 0, 'floor-card-no-file': isPositionFloor && (!data.data[currentIndex].file_list || data.data[currentIndex].file_list.length == 0) }"
    style="z-index:9999;">
    <!-- Carousel for multiple elements -->
    <div v-if="isCarousel" class="carousel-container">

      <button class="nav-button left" @click="prevCard"></button>
      <div class="carousel-item">
        <!-- <div class="card-preview">
          <h3>{{ data.data[currentIndex].name }}</h3>
          <p>ID: {{ data.data[currentIndex].dynamicId }}</p>
          <button @click="openDetails(data[currentIndex])">Details</button>
        </div> -->

        <div class="simple-card"
          :class="{ 'simple-card-no-file': !data.data[currentIndex].file_list || data.data[currentIndex].file_list.length == 0 }">
          <div @click="close()" class="sprite-card-close" :class="{
            'margin-top-20px': !data.data[currentIndex].file_list || data.data[currentIndex].file_list.length === 0
          }">
            X
          </div>
          <div v-if="data.data[currentIndex].file_list && data.data[currentIndex].file_list.length > 0"
            class="card-photo"></div>
          <div class="card-header">
            <div class="d-flex flex-column" style="align-items: start; width: 70%;">
              <div class="sprite-card-title"> {{ data.data[currentIndex].name.length > 25 ?
                data.data[currentIndex].name.substring(0, 25) +
                '...'
                :
                data.data[currentIndex].name }}</div>

              <div class="sprite-card-descrption"> {{ data.data[currentIndex].process.name.length > 60 ?
                data.data[currentIndex].process.name.substring(0, 60) + '...' :
                data.data[currentIndex].process.name }}</div>
            </div>
            <div class="d-flex flex-row row-style" style="width: 30%;">
              <div class="priority-indicator"
                :style="{ background: getPriorityColor(data.data[currentIndex].priority) }">
              </div>
              <div style="color: #14202c;">#{{ data.data[currentIndex].dynamicId.length > 10 ?
                data.data[currentIndex].dynamicId.substring(0, 8) + '...' :
                data.data[currentIndex].dynamicId }}
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-desc-container">
              <div v-if="data.data[currentIndex].description == ''" style="background-color: #14202c20;">
                Pas de description disponible ! 😢
              </div>
              <p class="card-description">{{ data.data[currentIndex].description.length > 50 ?
                data.data[currentIndex].description.substring(0,
                  50)
                + '...' :
                data.data[currentIndex].description }}</p>
            </div>
            <div class="status-filtre">
              <div v-for="(step, index) in data.steps" :key="index" class="step-container">
                <!-- Circle for Step -->
                <div v-if="step.name != data.data[currentIndex].step.name" class="d-flex flex-row"
                  style="justify-content: center; align-items: center; background-color: white; padding:2px;border-radius: 50%;"
                  :style="{ border: `2px solid ${step.color}` }">
                  <div class="circle" :style="{
                    background: step.color,
                  }">
                  </div>
                </div>
                <div class="separator"
                  v-if="index < data.steps.length - 1 && step.name != data.data[currentIndex].step.name"></div>

                <!-- Selected Status -->
                <div v-if="step.name === data.data[currentIndex].step.name"
                  class="d-flex flex-row justify-content-start status-indicator"
                  :style="{ background: `${step.color}20` }">
                  <div class="status-indicator-point" :style="{ background: step.color }"></div>
                  <span>
                    {{ step.name.length > 15 ? step.name.substring(0, 15) + '...' :
                      step.name }}
                  </span>
                </div>
                <div class="separator"
                  v-if="index < data.steps.length - 1 && step.name === data.data[currentIndex].step.name"></div>
              </div>
            </div>

          </div>
          <div class="card-footer">
            <a href="#" class="details-link" @click="handleClickOfDetails(data.data[currentIndex])">Voir en
              détails...</a>
          </div>
        </div>
      </div>
      <button class="nav-button right" @click="nextCard"></button>
    </div>

    <!-- Detailed card for a single element -->
    <div v-else-if="selectedCard" class="carousel-container">

      <button class="nav-button left disable-btn"></button>
      <div class="carousel-item">

        <div class="simple-card"
          :class="{ 'simple-card-no-file': !data.data[currentIndex].file_list || data.data[currentIndex].file_list.length == 0 }">
          <div @click="close()" class="sprite-card-close" :class="{
            'margin-top-20px': !data.data[currentIndex].file_list || data.data[currentIndex].file_list.length === 0
          }">
            X
          </div>
          <div v-if="data.data[currentIndex].file_list && data.data[currentIndex].file_list.length > 0"
            class="card-photo"></div>
          <div class="card-header">
            <div class="d-flex flex-column" style="align-items: start; width: 70%;">
              <div class="sprite-card-title"> {{ selectedCard.name.length > 25 ? selectedCard.name.substring(0, 25) +
                '...'
                :
                selectedCard.name }}</div>

              <div class="sprite-card-descrption"> {{ selectedCard.process.name.length > 25 ?
                selectedCard.process.name.substring(0, 25) + '...' :
                selectedCard.process.name }}</div>
            </div>
            <div class="d-flex flex-row row-style" style="width: 30%;">
              <div class="priority-indicator" :style="{ background: getPriorityColor(selectedCard.priority) }">
              </div>
              <div style="color: #14202c;">#{{ selectedCard.dynamicId }}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-desc-container">
              <div v-if="selectedCard.description == ''" style="background-color: #14202c20;">
                Pas de description disponible ! 😢
              </div>
              <p class="card-description">{{ selectedCard.description.length > 50 ?
                selectedCard.description.substring(0,
                  50)
                + '...' :
                selectedCard.description }}</p>
            </div>
            <div class="status-filtre">
              <div v-for="(step, index) in data.steps" :key="index" class="step-container">
                <!-- Circle for Step -->
                <div v-if="step.name != selectedCard.step.name" class="d-flex flex-row"
                  style="justify-content: center; align-items: center; background-color: white; padding:2px;border-radius: 50%;"
                  :style="{ border: `2px solid ${step.color}` }">
                  <div class="circle" :style="{
                    background: step.color,
                  }">
                  </div>
                </div>
                <div class="separator" v-if="index < data.steps.length - 1 && step.name != selectedCard.step.name">
                </div>

                <!-- Selected Status -->
                <div v-if="step.name === selectedCard.step.name"
                  class="d-flex flex-row justify-content-start status-indicator"
                  :style="{ background: `${step.color}20` }">
                  <div class="status-indicator-point" :style="{ background: step.color }"></div>
                  <span>
                    {{ step.name.length > 15 ? step.name.substring(0, 15) + '...' :
                      step.name }}
                  </span>
                </div>
                <div class="separator" v-if="index < data.steps.length - 1 && step.name === selectedCard.step.name">
                </div>
              </div>
            </div>

          </div>
          <div class="card-footer">
            <a href="#" class="details-link">Voir en détails...</a>
          </div>
        </div>
      </div>
      <button class="nav-button right disable-btn"></button>
    </div>

    <!-- Fallback message for no data -->
    <div v-else>
      <p>Aucune donnée disponible</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {

    return {
      currentIndex: 0, // For carousel navigation
      selectedCard: null, // For detailed view

      isopen: true,
    };
  },
  computed: {
    // Check if the data contains multiple elements
    isCarousel() {
      return Array.isArray(this.data.data) && this.data.data.length > 1;
    },
    isPositionFloor() {
      if (!this.data.position) {
        console.log("Position is undefined or null.");
        return false;
      }

      // Check if position is a THREE.Vector3 object
      const { x, y, z } = this.data.position;
      // console.log("Position values:", { x, y, z });

      // Check if all coordinates are zero
      return x === 0 && y === 0 && z === 0;
    },
  },
  methods: {
    // Navigate to the next card in the carousel
    nextCard() {
      this.currentIndex =
        (this.currentIndex + 1) % this.data.data.length;
    },
    close() {
      this.isopen = false;
    },
    // Navigate to the previous card in the carousel
    prevCard() {
      this.currentIndex =
        (this.currentIndex - 1 + this.data.data.length) %
        this.data.data.length;
    },
    // Open the detailed view of a card
    openDetails(card) {
      this.selectedCard = card;
    },
    getPriorityColor(priority) {
      const colors = ["red", "orange", "green"];
      return colors[priority] || "gray";
    },

    handleClickOfDetails(ticket) {
      this.$emit("display", ticket);
    },
  },

  mounted() {
    // console.log("Data from sprite card:", this.data);
    if (this.data.data.length === 1) {
      this.selectedCard = this.data.data[0];
    }
  },


};
</script>

<style scoped>
.sprite-card-container {
  flex-direction: column;
  align-items: center;
  margin-top: 102%;
  margin-left: 90%;
  font: 11px / 13px Charlevoix Pro;
  display: flex;
  font-size: 13px !important;
}

.sprite-card-container-no-file {
  margin-top: 60%;
}

.floor-card {
  margin-top: 88% !important;
  margin-left: 150% !important;
}

.floor-card-no-file {
  margin-top: 50% !important;
}

.carousel-container {
  display: flex;
  align-items: center;
  gap: 0px;
}

.carousel-item {
  /* border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
  text-align: center; */
}

.card-preview h3 {
  margin: 0;
  font-size: 1.1rem;
}

.card-preview p {
  margin: 8px 0;
  font-size: 0.9rem;
  color: #555;
}

.nav-button {
  width: 25px;
  height: 25px;
  background: #14202c;
  background-image: url(./assets/arrow.svg);
  background-position: center;
  background-size: 60%;
  background-repeat: no-repeat;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #fff;
  border-radius: 5px;
}

.nav-button:hover {

  width: 29px;
  height: 29px;
  background-color: #305983 !important;
  margin-top: -2px;
}

.right {
  transform: rotate(180deg);
  margin-left: -3px;
}

.right:hover {
  margin-left: -5px;
}

.left {
  margin-right: -3px;
  z-index: 3;
}

.left:hover {
  margin-right: -5px;
}

.disable-btn {
  /* background: #14202c20; */
  opacity: 0;
  /* cursor: not-allowed; */
}

.simple-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 300px;
  height: 335px;
  /* padding: 16px; */
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.simple-card-no-file {
  height: 190px;
  padding-top: 10px;
}

.card-photo {
  height: 130px;
  width: (100%-4px);
  background-color: #14202c;
  border: 2px solid #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding: 0px 10px;
}

.sprite-card-descrption {

  color: #14202c;
  opacity: 0.5;
  font: normal normal normal 11px/13px Charlevoix Pro;
  font-size: 11px;
}

.sprite-card-title {
  font: normal normal normal 11px/13px Charlevoix Pro;
  font-size: 12px;
  color: #14202c;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-indicator {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: capitalize;
}

.status-warning {
  background-color: #ffebd4;
  color: #f49700;
}

.card-body {
  margin-bottom: 12px;
  padding: 0px 10px;
  text-align: justify;
  font: normal normal normal 11px/13px Charlevoix Pro !important;
  font-size: 11px;
  color: #14202c;
}

.card-description {
  font-size: 0.8rem;
  color: #555;
  line-height: 1.4;
}

.card-footer {
  text-align: right;
  padding: 10px 10px;
}

.details-link {
  font-size: 0.8rem;
  color: #007bff;
  text-decoration: none;
}

.details-link:hover {
  text-decoration: underline;
}

.card-desc-container {
  padding: 4px 2px;
  text-align: justify;
  font-size: 11px;
  height: 60px;
  border: 0.5px solid #14202c20;
  color: #14202c;
  border-radius: 5px;
}

.card-status-container {
  margin-top: 10px;
  height: 30px;
  width: 100%;
  /* color: #14202c; */
}

.status-filtre {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 0px;
  margin-top: 10px;
  height: 30px;
  width: 100%;
}

.step-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 3px;
  /* Space between the circle and the name */
}

.circle {
  width: 10px;
  /* Adjust size as needed */
  height: 10px;
  border-radius: 50%;
  /* Makes it a circle */
}

.step-name {
  font-size: 14px;
  color: #14202c;
}

.status-indicator {
  padding: 5px;
  border-radius: 5px;
  color: #14202c;
  font-size: 11px;
  align-items: center;
}

.status-indicator-point {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

.separator {
  width: 20px;
  height: 2px;
  background-color: #14202c20;
  margin-right: 2px;
}

.sprite-card-close {
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: #14202c;
  cursor: pointer;
  border-radius: 25px;
  width: 20px;
  height: 20px;
  position: absolute;
  font-size: 13px;
  z-index: 9;
  font-weight: bold;
  border: 1px solid gray;
  color: white;
  margin-top: -10px;
  margin-left: -10px;
}

.margin-top-20px {
  margin-top: -20px;
}
</style>
