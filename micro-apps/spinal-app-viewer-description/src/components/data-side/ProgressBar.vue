<template>
  <div class="font-loading">
    <span>Chargement des données</span>
    <div class="progress-circular" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg class="progress-svg" :width="size" :height="size" viewBox="0 0 120 120">
        <circle class="progress-bg" cx="60" cy="60" r="50" :stroke-width="strokeWidth" />
        <circle class="progress-bar" cx="60" cy="60" r="50" :stroke-width="strokeWidth"
          :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" stroke="#14202c" />
      </svg>
      <span class="progress-text">
        {{ value }}%
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      default: 100,
    },
    strokeWidth: {
      type: Number,
      default: 10, // Épaisseur du trait
    },
  },
  computed: {
    radius() {
      return 50; // Rayon du cercle
    },
    circumference() {
      return 2 * Math.PI * this.radius; // Circonférence
    },
    dashOffset() {
      return this.circumference * (1 - this.value / 100);
    },
  },
};
</script>

<style scoped>
.progress-circular {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
}

.progress-svg {
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: #e0e0e0;
}

.progress-bar {
  fill: none;
  stroke-linecap: round;
  /* Pour éviter les bords écrasés */
  transition: stroke-dashoffset 0.35s;
}

.progress-text {
  position: absolute;
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
}

.font-loading {
  font-family: Charlevoix Pro !important;
  font-size: 25px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-weight: bold;
}
</style>
