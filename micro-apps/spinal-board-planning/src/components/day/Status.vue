
<template>
  <div 
    :style="[
      { 'font-size': iconSize },
      { 'width': dayWidth ? dayWidth + 'px !important' : 'auto' },
      { 'min-width': dayWidth ? dayWidth + 'px !important' : 'auto' },
    ]"
    class="icon">
    <v-icon v-if="status==='Clôturée' || status==='Solved'"
      :style="[{ 'font-size': iconSize }]"
      class="done icon"
      >mdi-check-circle-outline</v-icon>
    <v-icon v-else-if="status==='Réalisation partielle' || status === 'Raised'"
      :style="[{ 'font-size': iconSize }]"
      class="pending icon"
      >mdi-vanish</v-icon>
    <v-icon v-else-if="status==='Attente de lect.avant Execution'" 
      :style="[{ 'font-size': iconSize }]"
      class="in-progress icon"
      >mdi-circle-small</v-icon>
  </div>
</template>

<script>
export default {
  name: 'TaskStatus',
  props: [
    'dayWidth',
    'status',
    'fontSize',
  ],
  computed: {
    iconSize() {
      return (this.fontSize.medium) + 'px !important';
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out;
}
.icon {
}
.done {
  color: #8F62E2 !important;
}
.in-progress {
  color: #33A948 !important;
}
.pending {
  color: #B5B5B5 !important;
}
</style>

