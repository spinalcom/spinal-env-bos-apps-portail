<template>
  <v-card class="d-flex align-center justify-center rounded-lg" elevation="5" outlined style="background: #f9f9f9">
        <div v-if="noData" class="d-flex justify-center align-center flex-grow-1">
          <v-icon style="color: red !important; ">mdi-alert-circle-outline</v-icon>
          <span style="font-size: 24px; margin-left: 10px;">NO DATA</span>
        </div>
        <v-progress-circular
        v-else
        :size="50"
        color="#14202c"
        indeterminate
        />
  </v-card>
</template>

<script>
export default {
  props: {
    noData: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>