<template>
  <div class="govuk-grid-column-two-thirds">
    <a
      :id="id"
      class="govuk-back-link"
      @click="$router.back()"
    >
      Back
    </a>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      default: '',
      type: String,
    },
  },
};
</script>
