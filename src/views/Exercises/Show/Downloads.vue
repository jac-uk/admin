<template>
  <div>
    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'exercise-edit-downloads'}"
      >
        Update downloads
      </router-link>
    </div>
    <h2 class="govuk-heading-l">
      Downloads
    </h2>
    <p class="govuk-body-l">
      [links to files: independent assessor template, candidate assessment form, Ts and Cs, Job Description]
    </p>
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
