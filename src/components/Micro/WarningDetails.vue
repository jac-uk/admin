<template>
  <div>
    <div class="govuk-warning-text">
      <span
        class="govuk-warning-text__icon"
        aria-hidden="true"
      >!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        {{ title }}
      </strong>
      <div class="govuk-body govuk-!-margin-top-3 govuk-!-margin-left-8 govuk-!-margin-bottom-0">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WarningDetails',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
