<template>
  <div class="xgovuk-grid-row">
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
</template>

<script>
import { isEditable } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import LocationPreferences from '@/views/Exercise/Details/Preferences/LocationPreferences.vue';
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
