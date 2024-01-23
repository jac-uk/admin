<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
        class="govuk-link"
        :to="{name: 'exercise-details-preferences-edit'}"
      >
        Update working preferences
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Working preferences
    </h2>

    <dl class="govuk-summary-list">
      <template 
        v-for="(item, index) in exercise.locationPreferences"
        :key="item"
      >
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Location question {{ index + 1 }}
          </dt>
          <dd class="govuk-summary-list__value">
            {{ item.question }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            {{ $filters.lookup(item.questionType) }}
          </dt>
          <dd class="govuk-summary-list__value">
            <ViewAnswers 
              :answers="item.answers" 
              :grouped="item.groupAnswers" 
            />
          </dd>
        </div>
      </template>
    </dl>

    <dl class="govuk-summary-list">
      <template 
        v-for="(item, index) in exercise.jurisdictionPreferences"
        :key="item"
      >
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Jurisdiction question {{ index + 1 }}
          </dt>
          <dd class="govuk-summary-list__value">
            {{ item.question }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            {{ $filters.lookup(item.questionType) }}
          </dt>
          <dd class="govuk-summary-list__value">
            <ul 
              v-if="item.answerSource == 'jurisdictions'"
              class="govuk-list"
            >
              <li
                v-for="jurisdiction in exercise.jurisdiction"
                :key="jurisdiction"
              >
                {{ $filters.lookup(jurisdiction) }}
              </li>
            </ul>   
            <ViewAnswers
              v-else 
              :answers="item.answers" 
              :grouped="item.groupAnswers" 
            />
          </dd>
        </div>
      </template>
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
          {{ $filters.lookup(additionalWorkingPreference.questionType) }}
        </dt>
        <dd class="govuk-summary-list__value">
          <ViewAnswers 
            :answers="additionalWorkingPreference.answers" 
            :grouped="additionalWorkingPreference.groupAnswers" 
          />
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import { isEditable } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import ViewAnswers from './_ViewAnswers.vue';

export default {
  name: 'PreferencesView',
  components: {
    ViewAnswers,
  },
  mixins: [permissionMixin],
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isEditable() {
      return isEditable(this.exercise);
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
