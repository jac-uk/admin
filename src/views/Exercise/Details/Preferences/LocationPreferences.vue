<template>
  <div class="govuk-summary-list__row">
    <dt class="govuk-summary-list__key">
      Location question
    </dt>
    <div
      v-if="exercise.locationPreferences"
      class="govuk-summary-list__value"
    >
      <ul
        class="govuk-list"
      >
        <li
          v-for="(item, index) in exercise.locationPreferences"
          :key="item"
        >
          <QuestionRenderer
            section="locationPreferences"
            :exercise="exercise"
            :index="index"
            :review="false"
          />
        </li>
      </ul>
    </div>
    <template
      v-else-if="exercise.locationQuestion"
    >
      <dd
        class="govuk-summary-list__value"
      >
        {{ exercise.locationQuestion }}
      </dd>
      <dd
        v-if="!exercise.locationQuestion"
        class="govuk-summary-list__value"
      >
        &nbsp;
      </dd>
    </template>
  </div>
  <div
    v-if="exercise.locationQuestion"
    class="govuk-summary-list__row"
  >
    <dt class="govuk-summary-list__key">
      {{ $filters.lookup(exercise.locationQuestionType) }}
    </dt>
    <dd class="govuk-summary-list__value">
      <ul class="govuk-list">
        <li
          v-for="(answer, index) in exercise.locationQuestionAnswers"
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
  name: 'LocationPreferences',
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
