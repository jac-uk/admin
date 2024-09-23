<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
        class="govuk-link"
        :to="{name: 'exercise-details-selection-setup-edit'}"
      >
        Update selection set-up
      </router-link>
    </div>
    <h2 class="govuk-heading-l">
      Selection set-up
    </h2>
    <div class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Selection Criteria
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="capability in capabilities"
              :key="capability.value"
            >
              {{ capability.description }}
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Selection Tools
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in selectionCategories"
              :key="item"
            >
              {{ item.description }}
            </li>
          </ul>
        </dd>
      </div>
    </div>
  </div>
</template>

<script>
import { isEditable, CAPABILITIES, SELECTION_CATEGORIES } from '@/helpers/exerciseHelper';

export default {
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isEditable() {
      return isEditable(this.exercise);
    },
    capabilities() {
      if (!this.exercise) return [];
      if (!this.exercise.capabilities) return [];
      return Object.values(CAPABILITIES).filter(capability => this.exercise.capabilities.indexOf(capability.value) >= 0);
    },
    selectionCategories() {
      if (!this.exercise) return [];
      if (!this.exercise.selectionCategories) return [];
      return Object.values(SELECTION_CATEGORIES).filter(item => this.exercise.selectionCategories.indexOf(item.value) >= 0);
    },
  },
};
</script>
<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.govuk-summary-list__value,
.govuk-summary-list__value:last-child,
.govuk-summary-list__key {
  @include govuk-media-query($from: tablet) {
    width: auto;
  }
}
</style>
