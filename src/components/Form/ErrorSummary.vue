<template>
  <div
    v-if="errors.length"
    class="govuk-error-summary"
    aria-labelledby="error-summary-title"
    role="alert"
    tabindex="-1"
    data-module="govuk-error-summary"
  >
    <h2
      id="error-summary-title"
      class="govuk-error-summary__title"
    >
      There is a problem
    </h2>
    <div class="govuk-error-summary__body">
      <ul class="govuk-list govuk-error-summary__list">
        <li
          v-for="error in errors"
          :key="error.id"
        >
          <a :href="`#${error.id}-error`">{{ error.message }}</a>
        </li>
      </ul>
    </div>
    <button
      v-if="showSaveButton"
      type="button"
      class="govuk-button govuk-!-margin-top-5 govuk-!-margin-bottom-1"
      @click="saveDraft"
    >
      Save and continue anyway
    </button>
  </div>  
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      required: true,
    },
    showSaveButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    saveDraft() {
      this.$emit('save');
    },
  },
};
</script>

<style>

</style>
