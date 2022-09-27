<template>
  <strong
    class="govuk-tag"
    :class="cssClass"
  >{{ status | lookup }}</strong>
</template>

<script>

export default {
  props: {
    passStatuses: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    cssClass() {
      if (this.passStatuses.indexOf(this.status) >= 0) {
        return 'govuk-tag--green';
      } else {
        return 'govuk-tag--red';
      }
    },
  },
};

</script>

<style lang="scss">
.govuk-tage--red {
  color: govuk-colour("red") !important;
}
</style>
