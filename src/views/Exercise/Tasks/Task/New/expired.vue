<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ $filters.lookup(type) }}
    </h1>
    <div class="govuk-warning-text">
      <span
        class="govuk-warning-text__icon"
        aria-hidden="true"
      >!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        This task is overdue. Please change dates on the <RouterLink
          :to="{ name: 'exercise-details-timeline' }"
          class="govuk-link"
        >timeline</RouterLink> if you wish to carry out the task.
      </strong>
    </div>
  </div>
</template>

<script>
import defaultView from './default';
export default {
  extends: defaultView,
};
</script>
