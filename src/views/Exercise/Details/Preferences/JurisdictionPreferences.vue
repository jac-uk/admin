<template>
  <div class="govuk-summary-list__row">
    <dt class="govuk-summary-list__key govuk-heading-m">
      Jurisdiction question{{ exercise.jurisdictionPreferences ? 's' : '' }}
    </dt>
  </div>
  <div class="govuk-summary-list__row">
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
            :exercise="exercise"
            :index="index"
            :review="false"
          />
        </li>
      </ul>
    </div>
    <dl class="govuk-summary-list">
      <div
        v-if="exercise.jurisdictionQuestion"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          {{ exercise.jurisdictionQuestion }}
          <br>
          <span
            class="govuk-hint"
          >
            {{ $filters.lookup(exercise.jurisdictionQuestionType) }}
          </span>
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
    </dl>
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
