<template>
  <div class="govuk-summary-list__row">
    <dt class="govuk-summary-list__key govuk-heading-m">
      Additional Working Preference{{ exercise.additionalWorkingPreferences.length > 1 ? 's' : '' }}
    </dt>
  </div>
  <div class="govuk-summary-list__row">
    <div
      v-if="isNewQuestionType"
      class="govuk-summary-list__value"
    >
      <!-- new questions -->
      <ul
        class="govuk-list"
      >
        <li
          v-for="(additionalWorkingPreference, index) in exercise.additionalWorkingPreferences"
          :key="additionalWorkingPreference"
        >
          <QuestionRenderer
            section="additionalWorkingPreferences"
            :exercise="exercise"
            :index="index"
            :review="false"
          />
        </li>
      </ul>
    </div>
    <template
      v-else
    >
      <dd
        v-for="additionalWorkingPreference in exercise.additionalWorkingPreferences"
        :key="additionalWorkingPreference"
        class="govuk-summary-list__value"
      >
        <!-- old working prefs -->
        <div class="govuk-summary-list__row">
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
          <!-- <dt class="govuk-summary-list__key">
            <br>
            <span
              class="govuk-hint"
            >
            </span>
          </dt> -->
          <dd class="govuk-summary-list__value">
            <ViewAnswers
              :answers="additionalWorkingPreference.answers"
              :grouped="additionalWorkingPreference.groupAnswers"
            />
          </dd>
        </div>
      </dd>
    </template>
  </div>
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
