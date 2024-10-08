<template>
  <dl class="govuk-summary-list">
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key govuk-heading-m">
        Jurisdiction question{{ exercise.jurisdictionPreferences ? 's' : '' }}
      </dt>
      <dd class="govuk-summary-list__key">
        &nbsp;
      </dd>
    </div>

    <WorkingPreferencesQuestionView
      v-if="exercise.jurisdictionQuestion"
      :question="exercise.jurisdictionQuestion"
      :type="exercise.jurisdictionQuestionType"
      :answers="exercise.jurisdictionQuestionAnswers"
    />
    <template v-else-if="exercise.jurisdictionPreferences">
      <QuestionConfigView
        v-for="(item, index) in exercise.jurisdictionPreferences"
        :key="item"
        section="jurisdictionPreferences"
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
  name: 'JurisdictionPreferences',
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
