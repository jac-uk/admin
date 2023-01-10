<template>
  <div class="background-light-grey govuk-!-margin-bottom-3 govuk-!-padding-left-4 govuk-!-padding-top-4 govuk-!-padding-bottom-4">
    <div class="govuk-warning-text">
      <span
        class="govuk-warning-text__icon"
        aria-hidden="true"
      >!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        This exercise is being checked by senior leaders. Please wait for it to be approved.
      </strong>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ApprovalCheckMessage',
};
</script>
