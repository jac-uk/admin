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
      <LocationPreferences
        :exercise="exercise"
      />
    </dl>

    <dl class="govuk-summary-list">
      <JurisdictionPreferences
        :exercise="exercise"
      />
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
import LocationPreferences from '@/views/Exercise/Details/Preferences/LocationPreferences.vue';
import JurisdictionPreferences from './JurisdictionPreferences.vue';

export default {
  name: 'PreferencesView',
  components: {
    ViewAnswers,
    LocationPreferences,
    JurisdictionPreferences,
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
