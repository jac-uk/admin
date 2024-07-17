<script setup>
import { defineProps, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

const props = defineProps({
  groups: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});

const timeline = ref(null);
let timelineInstance = null;

// Watch the groups prop for changes
watch(
  () => props.groups,
  (newItems) => {
    if (timelineInstance) {
      timelineInstance.setGroups(new DataSet(newItems));
    }
  },
  { deep: true }
);

// Watch the items prop for changes
watch(
  () => props.items,
  (newItems) => {
    if (timelineInstance) {
      timelineInstance.setItems(new DataSet(newItems));
    }
  },
  { deep: true }
);

// Watch the options prop for changes
watch(
  () => props.options,
  (newOptions) => {
    if (timelineInstance) {
      timelineInstance.setOptions(newOptions);
    }
  },
  { deep: true }
);

onMounted(() => {
  const container = timeline.value;
  timelineInstance = new Timeline(container, props.items, props.groups, props.options);
});

onBeforeUnmount(() => {
  if (timelineInstance) {
    timelineInstance.destroy();
  }
});
</script>

<template>
  <div ref="timeline" />
</template>

<style>
</style>
