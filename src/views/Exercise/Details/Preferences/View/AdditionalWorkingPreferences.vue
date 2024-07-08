<template>
  <dl class="govuk-summary-list">
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key govuk-heading-m">
        Additional Working Preference{{ exercise.additionalWorkingPreferences && exercise.additionalWorkingPreferences.length > 1 ? 's' : '' }}
      </dt>
      <dd class="govuk-summary-list__key">
        &nbsp;
      </dd>
    </div>
    <template v-if="isNewQuestionType">
      <QuestionConfigView
        v-for="(additionalWorkingPreference, index) in exercise.additionalWorkingPreferences"
        :key="additionalWorkingPreference"
        section="additionalWorkingPreferences"
        :exercise="exercise"
        :index="index"
        :review="false"
        :is-admin-site="true"
      />
    </template>
    <template v-else>
      <WorkingPreferencesQuestionView
        v-for="(item, index) in exercise.additionalWorkingPreferences"
        :key="index"
        :question="item.question"
        :type="item.questionType"
        :answers="item.answers"
      />
    </template>
  </dl>
</template>
<script>
import QuestionConfigView from '@/components/QuestionConfig/View.vue';
import WorkingPreferencesQuestionView from '@/components/WorkingPreferencesQuestion/View.vue';

export default {
  name: 'AdditionalWorkingPreferences',
  components: {
    QuestionConfigView,
    WorkingPreferencesQuestionView,
  },
  props: {
    exercise: {
      type: Object,
      default: null,
    },
  },
  computed: {
    isNewQuestionType(){
      return this.exercise.additionalWorkingPreferences && this.exercise.additionalWorkingPreferences.some((el) => 'groupAnswers' in el);
    },
  },
};
</script>
