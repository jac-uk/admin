<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-three-quarters">
        <h1 class="govuk-heading-l">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="govuk-grid-column-one-quarter text-right">
        <ActionButton
          class="govuk-!-margin-bottom-1 govuk-!-margin-right-2"
          type="primary"
          @click="btnComplete"
        >
          Complete
        </ActionButton>
      </div>
    </div>

    <p class="govuk-body-l govuk-!-margin-bottom-4">
      {{ $filters.lookup(type) }} can now be completed. {{ totalApplicationsProgressing }} <span v-if="totalApplicationsProgressing === 1">application</span><span v-else>applications</span> will be progressed to {{ $filters.lookup(nextProcessingStage) }}
    </p>

    <!-- OVERVIEW -->
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <div class="govuk-caption-m">
            {{ $filters.lookup(entryStage) }}
          </div>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ totalApplications }}
          </h2>
        </div>
      </div>
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <div class="govuk-caption-m">
            {{ $filters.lookup(exitStage) }}
          </div>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ totalApplicationsProgressing }}
          </h2>
        </div>
      </div>
    </div>
    <!-- END OVERVIEW -->
  </div>
</template>

<script>
import { btnNext } from '../helper';
import { functions } from '@/firebase';
import defaultView from '../New/default';
import { APPLICATION_STATUS } from '@/helpers/constants';
import { getNextProcessingStage, previousTaskType, getTaskTypes, getProcessingEntryStage, getProcessingExitStage } from '@/helpers/exerciseHelper';

export default {
  extends: defaultView,
  data() {
    const passStatus = APPLICATION_STATUS.ELIGIBILITY_SCC_PASSED;
    const failStatuses = [
      APPLICATION_STATUS.CRITICAL_ANALYSIS_FAILED,
      APPLICATION_STATUS.SITUATIONAL_JUDGEMENT_FAILED,
      APPLICATION_STATUS.QUALIFYING_TEST_FAILED,
      APPLICATION_STATUS.SCENARIO_TEST_FAILED,
      APPLICATION_STATUS.SIFT_FAILED,
      APPLICATION_STATUS.TELEPHONE_ASSESSMENT_FAILED,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL,
      APPLICATION_STATUS.REJECTED_CHARACTER,
      APPLICATION_STATUS.WITHDRAWN,
    ];
    return {
      tableColumns: [
        { title: 'Ref', sort: 'referenceNumber' },
        { title: 'Full name', sort: 'personalDetails.fullName' },
        { title: 'Status', sort: 'status' },
      ],
      tableState: null,
      passStatus: passStatus,
      availableStatuses: failStatuses.concat(passStatus),
      // applications: applications,
      currentApplication: null,
      isCheck: false,
      newCheckType: null,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    currentProcessingStage() {
      return this.$route.params.stage;  // processing stage
    },
    nextProcessingStage() {
      return getNextProcessingStage(this.currentProcessingStage);
    },
    entryStage() {
      return getProcessingEntryStage(this.exercise, this.currentProcessingStage);  // exercise stages
    },
    exitStage() {
      return getProcessingExitStage(this.exercise, this.currentProcessingStage);
    },
    processingStageTasks() {
      return getTaskTypes(this.exercise, this.currentProcessingStage);
    },
    firstTask() {
      return this.$store.getters['tasks/getTask'](this.processingStageTasks[0]);
    },
    lastTask() {
      return this.$store.getters['tasks/getTask'](previousTaskType(this.exercise, this.type));
    },
    applications() {
      if (!this.firstTask) return [];
      return this.firstTask.applications;
    },
    totalApplications() {
      return this.applications.length;
    },
    totalApplicationsProgressing() {
      if (!this.lastTask) return null;
      return this.lastTask._stats.totalForEachOutcome[this.task.applicationEntryStatus];
    },
  },
  methods: {
    btnNext,
    async btnComplete() {
      await functions.httpsCallable('updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
        nextStage: this.exitStage,
      });
      this.btnNext();
    },
  },
};
</script>

<style>
.modal-large > .modal {
  max-width: 90%;
  width: 900px;
  min-height: 80%;
}
</style>