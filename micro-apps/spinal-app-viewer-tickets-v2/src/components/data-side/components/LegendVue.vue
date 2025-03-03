<template>
    <div class="legend-container">
        <div v-for="(item, index) in legendItems" :key="index" class="legend-item" @click="selectLegend(item, index)">
            <div :class="['legend-icon', item.type]" :style="{ borderColor: item.color }"></div>
            <div v-if="item.type == 'triangle'" class="triangle-border" :style="{ backgroundColor: item.color }">
                <div class="triangle-himself"></div>
            </div>
            <span class="legend-title">Tickets sur {{ item.title }} ({{ item.number }})</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "LegendVue",
    props: {
        legendItems: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            selectedIndex: 0,
        };
    },
    mounted() {
        // console.log("Legend items:", this.legendItems);
    },
    methods: {
        selectLegend(item, index) {
            this.selectedIndex = index;
            console.log("Selected legend:", item);
            this.$emit("legendSelected", item);
        },
    },
};
</script>

<style scoped>
.legend-container {
    width: 270px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    overflow: hidden;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    z-index: 2;
    height: 35px;
}

.legend-icon {
    width: 20px;
    height: 20px;
    border: 3px solid;
    background-color: #14202c;
}

.legend-icon.circle {
    border-radius: 50%;
}

.legend-icon.triangle {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    display: none;
}

.legend-icon.square {
    border-radius: 0;
}

.triangle-border {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    width: 22px;
    height: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.triangle-himself {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    width: 13px;
    height: 15px;
    background-color: #14202c;
    margin-top: 2px;
    /* margin-left: 0.5px; */
}

.selected-background {
    width: 280px;
    height: 40px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 0.3s ease;
    z-index: 1;
}

.legend-title {
    font-size: 14px;
    font-weight: 500;
}
</style>
