<template>
  <v-select :color="color" :background-color="backgroundColor" style="max-width: calc(50% - 4px)" solo flat @click.stop
    v-model="internalValue" :label="placeholder" :placeholder="placeholder" :items="items"
    append-icon="mdi-chevron-down" clearable clear-icon="mdi-close-circle-outline" multiple menu-props="offset-y">
    <template v-slot:selection="{ item, index }">
      <v-chip @click:close="removeItem(item)" close :close-icon="'mdi-close-circle'" style="
          font-size: 11px;
          height: 24px;
          max-width: calc(100% - 50px);
        " v-if="index < 1">
        <span style="max-width: 90%; overflow: hidden">{{ item }}</span>
      </v-chip>

      <span v-if="index === 1" class="text-grey text-caption align-self-center">
        (+{{ internalValue.length - 1 }})
      </span>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "FilterSelect",
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#14202C",
    },
    backgroundColor: {
      type: String,
      default: "#eaeef0",
    },
  },
  data() {
    return {
      internalValue: [...this.modelValue], // Create a local copy of the v-model value
    };
  },
  watch: {
    internalValue(newVal) {
      this.$emit("update:modelValue", newVal); // Sync with parent
    },
    modelValue(newVal) {
      this.internalValue = [...newVal]; // Update local copy if parent changes
    },
  },
  methods: {
    removeItem(item) {
      this.internalValue = this.internalValue.filter((val) => val !== item);
    },
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
