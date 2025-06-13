// This component exist to expose the chartJs instance since the vue-chartjs wrapper does not expose it in 4.x
<template>
    <canvas ref="chartCanvas"></canvas>
</template>
  
  <script>
  import { defineComponent, onMounted, ref } from 'vue';
  import { Chart as ChartJS } from 'chart.js';
  import { Line as LineChart} from 'vue-chartjs';
  
  export default defineComponent({
    components: { LineChart },
    props: {
      chartData: Object,
      chartOptions: Object
    },

    setup(props, { emit }) {
      const chartInstance = ref(null);
      const chartCanvas = ref(null);
  
      onMounted(() => {
        if (chartCanvas.value) {
          chartInstance.value = new ChartJS(chartCanvas.value, {
            type: 'line',
            data: props.chartData,
            options: props.chartOptions
          });
  
          emit('chart-mounted', chartInstance.value); // Emit event for parent
        }
      });
  
      return { chartCanvas, chartInstance };
    }
  });
  </script>