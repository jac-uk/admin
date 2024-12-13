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
        No applications found with status '{{ $filters.lookup(entryStatus) }}'.
      </strong>
    </div>
  </div>
</template>

<script>
import defaultView from './default.vue';
export default {
  extends: defaultView,
};
</script>
