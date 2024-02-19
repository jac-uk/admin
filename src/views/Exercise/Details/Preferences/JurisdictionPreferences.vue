<template>
  <div class="govuk-summary-list__row">
    <dt class="govuk-summary-list__key">
      Jurisdiction question
    </dt>
    <div
      v-if="exercise.jurisdictionPreferences"
      class="govuk-summary-list__value"
    >
      <ul
        class="govuk-list"
      >
        <li
          v-for="(item, index) in exercise.jurisdictionPreferences"
          :key="item"
        >
          <QuestionRenderer
            section="jurisdictionPreferences"
            :application="application"
            :exercise="exercise"
            :index="index"
            :review="false"
          />
        </li>
      </ul>
    </div>
    <template
      v-else-if="exercise.jurisdictionQuestion"
    >
      <dd
        class="govuk-summary-list__value"
      >
        {{ exercise.jurisdictionQuestion }}
      </dd>
      <dd
        v-if="!exercise.jurisdictionQuestion"
        class="govuk-summary-list__value"
      >
        &nbsp;
      </dd>
    </template>
  </div>
  <div
    v-if="exercise.jurisdictionQuestion"
    class="govuk-summary-list__row"
  >
    <dt class="govuk-summary-list__key">
      {{ $filters.lookup(exercise.jurisdictionQuestionType) }}
    </dt>
    <dd class="govuk-summary-list__value">
      <ul class="govuk-list">
        <li
          v-for="(answer, index) in exercise.jurisdictionQuestionAnswers"
          :key="index"
        >
          {{ answer.answer }}
        </li>
      </ul>
    </dd>
  </div>
</template>
<script>
import QuestionRenderer from '@/components/Page/QuestionRenderer.vue';

export default {
  name: 'JurisdictionPreferences',
  components: {
    QuestionRenderer,
  },
  props: {
    exercise: {
      type: Object,
      default: null,
    },
  },
};
</script>
