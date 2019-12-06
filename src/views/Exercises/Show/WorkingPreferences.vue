<template>
  <div>
    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'exercise-edit-working-preferences'}"
      >
        Update working preferences
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Working preferences
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
