<template>
  <div v-if="legend.length > 0" class="draggable-box">
    <div class="header">
      <div><span>{{ name }}</span></div>
      <div>
        <v-icon @click="toggleShowLegend" v-if="showLegend">mdi-chevron-up</v-icon>
        <v-icon @click="toggleShowLegend" v-else>mdi-chevron-down</v-icon>
      </div>
    </div>

    <div
        v-if="showLegend"

      class="legend-content"
    >
      <v-expansion-panels>
        <v-expansion-panel  
            v-for="(item, index) in legend" :key="index"
        >
        <v-expansion-panel-header>
            {{ item.column }}
        </v-expansion-panel-header>

        <v-expansion-panel-content>
            <div v-if="item.type == 'regex'">
                <li
                 v-for="(data, index) in item.data" :key="index"
                 class="legend-item"
                >
                 <span class="spin-color" :style="{ backgroundColor: data.color }"></span>
                 <span class="legend-label">{{ data.name }}</span>
                </li>
                
            </div>
            <div v-if="item.type == 'number'">
                <li
                 v-for="(data, index) in item.range" :key="index"
                 class="legend-item"
                >
                 <span class="spin-color" :style="{ backgroundColor: data.color }"></span>
                    <span class="legend-label">{{ data.name }}</span>
                 </li>

            </div>
        </v-expansion-panel-content>
            
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Legend',
  props: {
    name: {
      type: String,
      default: 'Legend'
    },
    legend: {
      type: Array as () => Array<{ column: string; type: string; data?: {name: string, color: string}[] ; range?: { name: string; color: string; value: number}[] }>,
      default: () => []
    }
  },

    mounted() {
        console.log('Legend component mounted: ', this.legend)
    },  



  data() {
    return {
      pos: { x: 200, y: 200 },
      offset: { x: 0, y: 0 },
      showLegend: false
    };
  },

  computed: {
    boxStyle(): Record<string, string> {
      return {
        position: 'absolute',
        left: `${this.pos.x}px`, // Positionne à droite
        top: `${this.pos.y}px`,
        // transform: `translateY(${this.pos.y}px)`, 
        zIndex: '1000'
      };
    }
  },

  methods: {
   
    toggleShowLegend() {
      this.showLegend = !this.showLegend;
    }
  }
});
</script>

<style scoped>
.draggable-box {
  width: 300px;
  background-color: #ffffff;
  padding: 5px;
  border: 2px dashed #14202C;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  cursor: default;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.legend-content {
  max-height: 300px;
  overflow-y: auto;
  position: absolute;
  top: 40px; /* Adjust based on header height */
  left: 0;
  right: 0;
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.icon-drag {
  cursor: grab;
  font-size: 24px;
  color: #666;
}

.icon-drag:active {
  cursor: grabbing;
}

.icon-drag:hover {
  color: #333;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.legend-label {
  margin-left: 5px;
  font-size: 12px;
  text-transform: lowercase;
}
.legend-label::first-letter {
  text-transform: uppercase;
  font-weight: bold;
}

.spin-color {
  width: 20px;
  height: 20px;
  border-radius: 5px;
}
</style>
