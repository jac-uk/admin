<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>

    <p class="govuk-body-l">
      Please check the following details before continuing
    </p>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <div class="govuk-caption-m">
            Applications
          </div>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ totalApplications }}
          </h2>
        </div>
      </div>

      <div
        v-if="isSift"
        class="govuk-grid-column-one-half"
      >
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <span class="govuk-caption-m">{{ type | lookup }} dates</span>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ exercise.siftStartDate | formatDate | showAlternative("Unknown") }} to
            {{ exercise.siftEndDate | formatDate | showAlternative("Unknown") }}
          </h2>
        </div>
      </div>

      <template v-else-if="isSelection">
        <div
          v-for="(selectionDay, index) in exercise.selectionDays"
          :key="index"
          class="govuk-grid-column-one-half"
        >
          <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">Selection Day - {{ selectionDay.selectionDayLocation }}</span>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              {{ selectionDay.selectionDayStart | formatDate | showAlternative("Unknown") }} to
              {{ selectionDay.selectionDayEnd | formatDate | showAlternative("Unknown") }}
            </h2>
          </div>
        </div>
      </template>
    </div>

    <ActionButton
      class="govuk-!-margin-bottom-0"
      type="primary"
      :disabled="!totalApplications"
      @click="btnInitialise"
    >
      Continue
    </ActionButton>
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
import { taskApplicationsStageAndStatus, TASK_TYPE } from '@/helpers/exerciseHelper';
import { functions } from '@/firebase';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
export default {
  components: {
    ActionButton,
  },
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isSift() {
      return this.type === TASK_TYPE.SIFT;
    },
    isSelection() {
      return this.type === TASK_TYPE.SELECTION;
    },
    isScenario() {
      return this.type === TASK_TYPE.SCENARIO;
    },
    totalApplications() {
      if (!this.exercise) return 0;
      if (!this.exercise._applicationRecords) return 0;
      if (this.isSift) return this.exercise._applicationRecords.review || 0;
      if (this.isScenario) return this.exercise._applicationRecords.review || 0;
      if (this.isSelection) return this.exercise._applicationRecords.selected || 0;
      return 0;
    },
  },
  methods: {
    btnNext,
    async btnInitialise() {
      await functions.httpsCallable('initialiseTask')({
        exerciseId: this.exercise.id,
        type: this.type,
        ...taskApplicationsStageAndStatus(this.type),
      });
      this.btnNext();
    },
  },
};
</script>
