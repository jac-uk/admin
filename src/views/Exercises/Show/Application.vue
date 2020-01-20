<template>
  <div>
    <pre>{{ application }}</pre>
  </div>
</template>

<script>
export default {
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    application() {
      return this.$store.state.application.record;
    },
  },
  created() {
    if (this.$route.params.applicationId) {
      this.$store.dispatch('application/bind', this.$route.params.applicationId);
    }
  },
  destroyed() {
    this.$store.dispatch('application/unbind');
  },
};
</script>
