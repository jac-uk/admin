<template>
  <div class="panel govuk-!-margin-bottom-4">
    <span class="govuk-caption-m">
      Number of vacancies
    </span>
    <span class="govuk-caption-s color-middle">
      <span class="">Immediate start (s87)</span>
    </span>
    <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
      <span class="">Up to {{ exercise.immediateStart }}</span>
    </h2>
  </div>
</template>
<script>
export default {
  name: 'NumberVacancies',
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
  },
};
</script>
