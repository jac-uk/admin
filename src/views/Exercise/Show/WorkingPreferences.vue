<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
        class="govuk-link"
        :to="{name: 'exercise-edit-working-preferences'}"
      >
        Update working preferences
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Working preferences
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Location question
        </dt>
        <dd 
          v-if="exercise.locationQuestion"
          class="govuk-summary-list__value"
        >
          {{ exercise.locationQuestion }}
        </dd>
        <dd 
          v-else
          class="govuk-summary-list__value"
        >
          None
        </dd>
      </div>
      <div 
        v-if="exercise.locationQuestion"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          {{ exercise.locationQuestionType | lookup }}
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
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Jurisdiction question
        </dt>
        <dd 
          v-if="exercise.jurisdictionQuestion"
          class="govuk-summary-list__value"
        >
          {{ exercise.jurisdictionQuestion }}
        </dd>
        <dd 
          v-else
          class="govuk-summary-list__value"
        >
          None
        </dd>
      </div>
      <div 
        v-if="exercise.jurisdictionQuestion"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          {{ exercise.jurisdictionQuestionType | lookup }}
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
    <dl 
      v-for="(additionalWorkingPreference, index) in exercise.additionalWorkingPreferences"
      :key="index"
      class="govuk-summary-list"
    >
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          {{ additionalWorkingPreference.topic }}
        </dt>
        <dd class="govuk-summary-list__value">
          {{ additionalWorkingPreference.question }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          {{ additionalWorkingPreference.questionType | lookup }}
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="(answer, answerIndex) in additionalWorkingPreference.answers"
              :key="answerIndex"
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
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('exerciseDocument', {
      isEditable: 'isEditable',
    }),
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.govuk-summary-list {
  > .govuk-summary-list__row:last-child {
    > .govuk-summary-list__key,
    > .govuk-summary-list__value {
      border-bottom: none;
    }
  }
}

</style>
