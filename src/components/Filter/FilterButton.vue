<template>
  <div>
    <button
      class="govuk-button govuk-button--secondary"
      @click="$emit('toggle-tab')"
    >
      {{ (showTab ? "Hide filters" : "Show filters") }}
    </button>
    <span 
      v-if="numOfFilters"
      class="badge"
    >
      {{ numOfFilters }}
    </span>
  </div>
</template>

<script>

export default {
  props: {
    numOfFilters: {
      type: Number,
      default: 0,
    },
    showTab: {
      type: Boolean,
    },
  },
};
</script>

<style scoped>
  .badge {
    position: absolute;
    transform: translate(-50%, 100%);
    padding: 0% 0.5%;
    border-radius: 50%;
    background-color: #bc0000;
    color: white;
  }
</style>
