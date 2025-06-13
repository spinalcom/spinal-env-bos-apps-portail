
<template>
  <div
    :class="['chip', status]"
    v-if="text">
    <p>{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'Chip',
  props: ['text', 'status'],
  mounted() {
  },
  data: () => ({
  }),
};
</script>

<style scoped>
p {
  margin-bottom: 0 !important;
}
.chip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
  border-radius: 20px;
  font-size: 12px;
  height: 30px;
  flex-grow: 0;
}
.open {
  color: white;
  background-color: #4CAF50;
  font-weight: 700;
}
.closed {
  background-color: #F44336;
  font-weight: 700;
}
.in-progress {
  background-color: #FFC107;
  font-weight: 700;
}
.pending {
  background-color: #2196F3;
  font-weight: 700;
}
.no-status {
  color: #14202C;
  background-color: white;
  border: 1px solid #E1E1E1;
  font-weight: 400 !important;
}
</style>
