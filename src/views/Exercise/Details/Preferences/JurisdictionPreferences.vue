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

    <template
      v-if="exercise.jurisdictionPreferences"
    >
      <QuestionRenderer
        v-for="(item, index) in exercise.jurisdictionPreferences"
        :key="item"
        section="jurisdictionPreferences"
        :exercise="exercise"
        :index="index"
        :review="false"
      />
    </template>

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
</template>
<script>
import QuestionRenderer from '@jac-uk/jac-kit/draftComponents/Page/QuestionRendererAdmin.vue';

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
