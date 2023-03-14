<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ $filters.lookup(type) }}
    </h1>
    <p
      class="govuk-body-l"
    >
      Please complete Critical Analysis and Situational Judgement tests
    </p>
  </div>
</template>

<script>
import defaultView from './default';
export default {
  extends: defaultView,
};
</script>
