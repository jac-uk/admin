<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
        class="govuk-link"
        :to="{name: 'exercise-details-application-content-edit'}"
      >
        Update application process
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Application process
    </h2>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div
          v-for="(state, index) in applicationContentList"
          :key="index"
        >
          <div v-if="state.parts.length">
            <h3 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ state.ref | lookup }}
            </h3>
            <p class="govuk-body">
              <span
                v-for="part in state.parts"
                :key="part"
                class="display-block"
              >
                {{ part | lookup }}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="unselectedApplicationParts.length"
        class="govuk-grid-column-one-half"
      >
        <h3 class="govuk-heading-m govuk-!-margin-bottom-0">
          Not requested
        </h3>
        <p class="govuk-body">
          <span
            v-for="part in unselectedApplicationParts"
            :key="part"
            class="display-block"
          >
            {{ part | lookup }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import { isEditable, applicationContentList, unselectedApplicationParts } from '@/helpers/exerciseHelper';

export default {
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationContentList() {
      return applicationContentList(this.exercise);
    },
    isEditable() {
      return isEditable(this.exercise);
    },
    unselectedApplicationParts() {
      return unselectedApplicationParts(this.exercise);
    },
  },
};
</script>
