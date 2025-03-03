<template>
    <div class="status-filtre">
        <div v-for="(step, index) in list" :key="step.name" class="status-filtre-container">
            <!-- Names are always rendered with opacity 0 when hidden -->
            <div class="step-name" :style="getStepNameStyle(step, index, true)">
                <!-- {{ step.name }}! -->
                {{ step.name.length > 25 ? step.name.substring(0, 25) + '...' :
                    step.name }}
            </div>

            <div class="d-flex flex-row circle-holder">
                <div class="circle" :style="getCircleBorderStyle(step)" @click.left="toggleSelection(step, false)"
                    @click.right.prevent="toggleSelection(step, true)">
                    <div :style="getCircleStyle(step)"></div>
                </div>
                <div class="separator" v-if="index < list.length - 1"></div>
            </div>

            <div class="step-name" :style="getStepNameStyle(step, index, false)">
                <!-- {{ step.name }} -->
                {{ step.name.length > 25 ? step.name.substring(0, 25) + '...' :
                    step.name }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "StatusFiltre",
    props: {
        list: {
            type: Array,
            required: true,
        },
        modelValue: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            selectedSteps: new Set(this.list.map((step) => step.name)),
        };
    },
    methods: {
        toggleSelection(step, isolate) {
            if (isolate) {
                // Right-click isolates the step
                this.selectedSteps = new Set([step.name]);
            } else {
                // Left-click toggles selection without deselecting others
                if (this.selectedSteps.has(step.name)) {
                    const newSet = new Set(this.selectedSteps);
                    newSet.delete(step.name);
                    this.selectedSteps = newSet;
                } else {
                    this.selectedSteps = new Set(this.selectedSteps).add(step.name);
                }
            }
            const updatedSteps = Array.from(this.selectedSteps);
            this.$emit("update:modelValue", updatedSteps);
        },
        getCircleStyle(step) {
            return {
                backgroundColor: step.color,
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                display: "inline-block",
            };
        },
        getCircleBorderStyle(step) {
            const isSelected = this.selectedSteps.has(step.name);
            return {
                backgroundColor: "#fff",
                border: `2px solid ${isSelected ? step.color : "transparent"}`,
                margin: "4px",
                boxSizing: "border-box",
                width: "20px",
                height: "20px",
                padding: "2px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            };
        },
        getStepNameStyle(step, index, isAbove) {
            const isSelected = this.selectedSteps.has(step.name);
            const shouldShow = this.list.length <= 5 && ((isAbove && index % 2 !== 0) || (!isAbove && index % 2 === 0));
            return {
                fontWeight: isSelected ? "bold" : "normal",
                textDecoration: isSelected ? "none" : "line-through",
                opacity: shouldShow ? 1 : 0,
                height: "1em",
                lineHeight: "1em",
                visibility: shouldShow ? "visible" : "hidden",
            };
        },
    },
};
</script>

<style scoped>
.status-filtre {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 0px;
    width: 100%;
}

.status-filtre-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* Align the text container to the left */
    justify-content: start;
    gap: 2px;
    width: auto;
    /* Allow dynamic width */
    overflow: visible;
    /* Let the text overflow the parent */
    width: 90px;
}


.step-name {
    font-size: 10px;
    color: #14202c;
    text-align: left;
    /* Align text to the left */
    white-space: nowrap;
    /* Prevent text wrapping */
    overflow: visible;
    /* Allow overflow */
    text-overflow: clip;
    /* Show overflowing content (no ellipsis) */
    display: inline-block;
    /* Ensure it behaves like an inline element */
    width: auto;
    /* Allow the text to expand beyond the container */
    margin-left: 5px;
    /* Match the circle's alignment */
    direction: ltr;
    /* Ensure text flows left-to-right */
}


.circle {
    cursor: pointer;
}

.circle-holder {
    display: flex;
    align-items: center;
    justify-content: start;
}

.separator {
    width: 60px;
    height: 2px;
    background-color: #14202c20;
}
</style>
