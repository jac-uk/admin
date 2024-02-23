<template>
  <div class="govuk-summary-list__row">
    <dt class="govuk-summary-list__key govuk-heading-m">
      Location question{{ exercise.locationPreferences ? 's' : '' }}
    </dt>
  </div>
  <div class="govuk-summary-list__row">
    <div
      v-if="exercise.locationPreferences"
      class="govuk-summary-list__value"
    >
      <!-- new questions -->
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
    <div
      v-else-if="exercise.locationQuestion"
      class="govuk-summary-list__value"
    >
      <!-- old questions -->
      <dl class="govuk-summary-list">
        <div
          v-if="exercise.locationQuestion"
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
    </div>
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
