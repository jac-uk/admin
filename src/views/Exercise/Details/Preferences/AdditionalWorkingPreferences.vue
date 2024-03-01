<template>
  <dl class="govuk-summary-list">
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key govuk-heading-m">
        Additional Working Preference{{ exercise.additionalWorkingPreferences.length > 1 ? 's' : '' }}
      </dt>
      <dd class="govuk-summary-list__key">
        &nbsp;
      </dd>
    </div>
    <template v-if="isNewQuestionType">
      <QuestionRenderer
        v-for="(additionalWorkingPreference, index) in exercise.additionalWorkingPreferences"
        :key="additionalWorkingPreference"
        section="additionalWorkingPreferences"
        :exercise="exercise"
        :index="index"
        :review="false"
      />
    </template>
    <div
      v-else
      class="govuk-summary-list__row"
    >
      <template
        v-for="additionalWorkingPreference in exercise.additionalWorkingPreferences"
        :key="additionalWorkingPreference"
        class="govuk-summary-list__value"
      >
        <!-- old working prefs -->
        <dt class="govuk-summary-list__key">
          {{ additionalWorkingPreference.topic }}:
          {{ additionalWorkingPreference.question }}
          <br>
          <span
            class="govuk-hint"
          >
            {{ $filters.lookup(additionalWorkingPreference.questionType) }}
          </span>
        </dt>
        <dd class="govuk-summary-list__value">
          <ViewAnswers
            :answers="additionalWorkingPreference.answers"
            :grouped="additionalWorkingPreference.groupAnswers"
          />
        </dd>
      </template>
    </div>
  </dl>
</template>
<script>
import QuestionRenderer from '@/components/Page/QuestionRenderer.vue';
import ViewAnswers from './_ViewAnswers.vue';

export default {
  name: 'AdditionalWorkingPreferences',
  components: {
    QuestionRenderer,
    ViewAnswers,
  },
  props: {
    exercise: {
      type: Object,
      default: null,
    },
  },
  computed: {
    isNewQuestionType(){
      return this.exercise.additionalWorkingPreferences.some((el) => 'groupAnswers' in el);
    },
  },
};
</script>
