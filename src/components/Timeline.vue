<script setup>
import { defineProps, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

const defaultScale = 0.5; // default scale of the timeline actions (e.g. zoom in, zoom out, move left, move right)

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

const fitAll = () => {
  if (timelineInstance) {
    timelineInstance.fit();
  }
};

const zoomIn = (scale) => {
  if (timelineInstance) {
    timelineInstance.zoomIn(scale);
  }
};

const zoomOut = (scale) => {
  if (timelineInstance) {
    timelineInstance.zoomOut(scale);
  }
};

const move = (percentage) => {
  if (timelineInstance) {
    const range = timelineInstance.getWindow();
    const interval = range.end - range.start;

    timelineInstance.setWindow({
      start: range.start.valueOf() - interval * percentage,
      end: range.end.valueOf() - interval * percentage,
    });
  }
};

const moveToCurrent = () => {
  if (timelineInstance) {
    timelineInstance.moveTo(new Date(), { animate: true });
  }
};

const setWindow = (mode) => {
  const today = new Date();
  let start, end;
  if (mode === 'day') {
    start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    end = new Date(start);
    end.setDate(start.getDate() + 1);
  } else if (mode === 'month') {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = new Date(start);
    end.setMonth(start.getMonth() + 1);
  } else if (mode === 'year') {
    start = new Date(today.getFullYear(), 0, 1);
    end = new Date(today.getFullYear() + 1, 0, 1);
  }

  if (timelineInstance && start && end) {
    timelineInstance.setWindow(start, end);
  }
};
</script>

<template>
  <div>
    <div
      class="timeline-control-panel"
      style="display: flex; justify-content: space-between; align-items: end;"
    >
      <div class="govuk-body-s">
        Ctrl + Scroll to zoom in/out on the timeline
      </div>
      <div>
        <div style="display: flex; justify-content: end; gap: 8px;">
          <button
            class="govuk-button govuk-button--secondary"
            @click="fitAll"
          >
            Fit
          </button>
          <button
            class="govuk-button govuk-button--secondary"
            @click="() => zoomIn(defaultScale)"
          >
            Zoom in
          </button>
          <button
            class="govuk-button govuk-button--secondary"
            @click="() => zoomOut(defaultScale)"
          >
            Zoom out
          </button>
          <button
            class="govuk-button govuk-button--secondary"
            @click="() => move(defaultScale)"
          >
            Move left
          </button>
          <button
            class="govuk-button govuk-button--secondary"
            @click="() => move(-defaultScale)"
          >
            Move right
          </button>
        </div>
        <div style="display: flex; justify-content: end; gap: 8px;">
          <button
            class="govuk-button govuk-button--secondary"
            @click="moveToCurrent"
          >
            Now
          </button>
          <button
            class="govuk-button govuk-button--secondary"
            @click="() => setWindow('year')"
          >
            Year
          </button>
          <button
            class="govuk-button govuk-button--secondary"
            @click="() => setWindow('month')"
          >
            Month
          </button>
          <button
            class="govuk-button govuk-button--secondary"
            @click="() => setWindow('day')"
          >
            Day
          </button>
        </div>
      </div>
    </div>

    <div ref="timeline" />
  </div>
</template>

<style>
.timeline-control-panel button {
  margin-bottom: 16px;
}
</style>
