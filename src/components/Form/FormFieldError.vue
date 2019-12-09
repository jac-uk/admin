<template>
  <span
    v-if="errorMessage"
    :id="`${id}-error`"
    class="govuk-error-message"
  >
    <span class="govuk-visually-hidden">Error:</span> {{ errorMessage }}
  </span>  
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
};
</script>
