<template>
  <div class="panel govuk-!-margin-bottom-9">
    <span class="govuk-caption-m long-text">Selection Exercise Manager</span>
    <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
      <span class="capitalize long-text">{{ selectionExerciseManager }}</span>
    </h2>
  </div>
</template>
<script>
import _has from 'lodash/has';
export default {
  name: 'SelectionExerciseManager',
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    selectionExerciseManager() {
      return (_has(this.exercise, 'selectionExerciseManager') && this.exercise.selectionExerciseManager.length) ?
        this.exercise.selectionExerciseManager[0].name :
        '';
    },
  },
};
</script>
