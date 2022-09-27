<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
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
