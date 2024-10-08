<template>
  <div
    class="govuk-summary-list__row"
  >
    <dt class="govuk-summary-list__key">
      {{ question }}
      <br>
      <span
        class="govuk-hint"
      >
        {{ $filters.lookup(type) }}
      </span>
    </dt>
    <dd class="govuk-summary-list__value">
      <ul class="govuk-list">
        <li
          v-for="(answer, index) in answers"
          :key="index"
        >
          {{ answer.answer }}
        </li>
      </ul>
    </dd>
  </div>
</template>

<script>

export default {
  name: 'WorkingPreferencesQuestionView',
  props: {
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
  },
};
</script>
