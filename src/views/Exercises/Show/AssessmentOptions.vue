<template>
  <div>
    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'exercise-edit-assessment-options'}"
      >
        Update assessment options
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Assessment options
    </h2>
    [view]
  </div>
</template>

<script>
export default {
  // computed: {
  //   exercise() {
  //     return this.$store.state.exerciseDocument.record;
  //   },
  // },
};
</script>
