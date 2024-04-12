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
    <template v-if="exercise.locationPreferences">
      <QuestionRenderer
        v-for="(item, index) in exercise.locationPreferences"
        :key="item"
        section="locationPreferences"
        :exercise="exercise"
        :index="index"
        :review="false"
        :is-admin-site="true"
      />
    </template>
    <div
      v-else-if="exercise.locationQuestion"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        {{ exercise.locationQuestion }}
        <br>
        <span
          class="govuk-hint"
        >
          {{ $filters.lookup(exercise.locationQuestionType) }}
        </span>
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
  </dl>
</template>

<script>
import QuestionRenderer from '@/draftComponents/Page/QuestionRendererAdmin.vue';

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
