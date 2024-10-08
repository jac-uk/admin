<template>
  <dl class="govuk-summary-list">
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key govuk-heading-m">
        Location question{{ exercise.locationPreferences ? 's' : '' }}
      </dt>
      <dd class="govuk-summary-list__key">
        &nbsp;
      </dd>
    </div>
    <WorkingPreferencesQuestionView
      v-if="exercise.locationQuestion"
      :question="exercise.locationQuestion"
      :type="exercise.locationQuestionType"
      :answers="exercise.locationQuestionAnswers"
    />
    <template v-else-if="exercise.locationPreferences">
      <QuestionConfigView
        v-for="(item, index) in exercise.locationPreferences"
        :key="item"
        section="locationPreferences"
        :exercise="exercise"
        :index="index"
        :review="false"
        :is-admin-site="true"
      />
    </template>
  </dl>
</template>

<script>
import QuestionConfigView from '@/components/QuestionConfig/View.vue';
import WorkingPreferencesQuestionView from '@/components/WorkingPreferencesQuestion/View.vue';

export default {
  name: 'LocationPreferences',
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
};
</script>
