<template>
  <button
    v-if="fullScreen"
    type="button"
    class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
    @click="exitFullScreen"
  >
    Exit full screen
  </button>
  <button
    v-else
    type="button"
    class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
    @click="enterFullScreen"
  >
    Full screen
  </button>
</template>

<script>
export default {
  computed: {
    fullScreen() {
      return this.$store.state.ui.fullScreen;
    },
  },
  methods: {
    enterFullScreen() {
      this.$store.dispatch('ui/enterFullScreen');
    },
    exitFullScreen() {
      this.$store.dispatch('ui/exitFullScreen');
    },
  },
};
</script>
