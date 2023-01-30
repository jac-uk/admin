<template>
  <div class="panel govuk-!-margin-bottom-9">
    <span class="govuk-caption-m long-text">Assigned Comissioner</span>
    <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
      <span class="capitalize long-text">{{ assignedCommissioner }}</span>
    </h2>
  </div>
</template>
<script>
import _has from 'lodash/has';
export default {
  name: 'AssignedCommissioner',
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    assignedCommissioner() {
      return (_has(this.exercise, 'assignedCommissioner') && this.exercise.assignedCommissioner.length) ?
        this.exercise.assignedCommissioner[0].name :
        '';
    },
  },
};
</script>
