<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h2 class="govuk-heading-l govuk-!-margin-bottom-4">
        Working preferences
      </h2>
    </div>
    <div class="govuk-grid-column-one-third text-right">
      <router-link
        v-if="isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
        class="govuk-link"
        :to="{name: isV1 ? 'exercise-details-preferences-edit-v1' : 'exercise-details-preferences-edit' }"
      >
        Update working preferences
      </router-link>      
    </div>
  </div>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <LocationPreferences
        :exercise="exercise"
      />    

      <JurisdictionPreferences
        :exercise="exercise"
      />

      <AdditionalWorkingPreferences
        :exercise="exercise"
      />
    </div>
  </div>
</template>

<script>
import { isEditable } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import LocationPreferences from './LocationPreferences.vue';
import JurisdictionPreferences from './JurisdictionPreferences.vue';
import AdditionalWorkingPreferences from './AdditionalWorkingPreferences.vue';

export default {
  name: 'PreferencesView',
  components: {
    LocationPreferences,
    JurisdictionPreferences,
    AdditionalWorkingPreferences,
  },
  mixins: [permissionMixin],
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isEditable() {
      return isEditable(this.exercise);
    },
    isV1() {
      return this.exercise && (this.exercise.locationQuestion || this.exercise.jurisdictionQuestion);
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
// .govuk-summary-list {
//   > .govuk-summary-list__row:last-child {
//     > .govuk-summary-list__key,
//     > .govuk-summary-list__value {
//       border-bottom: none;
//     }
//   }
// }

</style>
