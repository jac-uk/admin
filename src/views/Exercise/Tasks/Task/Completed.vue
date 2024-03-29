<template>
  <div>
    <div class="govuk-grid-row">
      <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
        {{ $filters.lookup(type) }}
      </h1>
    </div>
    <div class="govuk-grid-row">
      <div class="text-right">
        <ActionButton
          v-if="showEmailButton && hasPermissions([
            PERMISSIONS.applications.permissions.canReadApplications.value,
            PERMISSIONS.exercises.permissions.canReadExercises.value,
          ])"
          type="primary"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          :action="notifyCandidates"
        >
          Send report notfication
        </ActionButton>

        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div
          v-if="totalApplications"
          class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey"
        >
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
            <span class="govuk-caption-m">Total</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ totalApplications }}
          </h2>
        </div>
      </div>
      <div
        v-if="task._stats.totalForEachOutcome"
        class="govuk-grid-column-one-half"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <Table
            data-key="id"
            :data="Object.entries(task._stats.totalForEachOutcome)"
            :columns="[{ title: 'Status' }, { title: 'Total' }]"
            :page-size="50"
            local-data
          >
            <template #row="{row}">
              <TableCell>
                {{ $filters.lookup(row[0]) }}
              </TableCell>
              <TableCell>
                {{ row[1] }}
              </TableCell>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <div
      v-if="applicationOutcomes.length"
      class="govuk-grid-row"
    >
      <div
        v-if="passed.length"
        class="govuk-grid-column-one-half"
        :class="{'float-right' : failed.length === 0}"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <Table
            data-key="id"
            :data="passed"
            :columns="[{ title: 'Candidate (passed)' }]"
            :page-size="50"
            local-data
          >
            <template #row="{row}">
              <TableCell>
                {{ row.fullName }}
              </TableCell>
            </template>
          </Table>
        </div>
      </div>
      <div
        v-if="failed.length"
        class="govuk-grid-column-one-half"
        :class="{'float-right' : passed.length === 0}"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <Table
            data-key="id"
            :data="failed"
            :columns="[{ title: 'Candidate (failed)' }]"
            :page-size="50"
            local-data
          >
            <template #row="{row}">
              <TableCell>
                {{ row.fullName }}
              </TableCell>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { beforeRouteEnter } from './helper';
import { getTaskSteps } from '@/helpers/exerciseHelper';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import _has from 'lodash/has';
import { functions } from '@/firebase';
import { TASK_TYPE } from '@/helpers/constants';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import permissionMixin from '@/permissionMixin';

export default {
  components: {
    Table,
    TableCell,
    FullScreenButton,
    ProgressBar,
    ActionButton,
  },
  mixins: [permissionMixin],
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
    exerciseId() {
      return this.exercise ? this.exercise.id : null;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
    totalApplications() {
      return this.task.applications ? this.task.applications.length : null;
    },
    applicationOutcomes() {
      // List of candidates with passed/failed
      const result = {};
      if (this.task && _has(this.task, 'applications') && _has(this.task, 'finalScores')) {
        const numApplications = this.task.applications.length;
        const numFinalScores = this.task.finalScores.length;
        if (numApplications === numFinalScores) {
          // Use just one loop to build the data for performance reasons on large datasets
          for (let i = 0; i < this.task.applications.length; i++) {
            // Get data from application
            const app = this.task.applications[i];
            const appCandidateId = app.id;
            const appFullname = app.fullName;
            if (!result[appCandidateId]) {
              result[appCandidateId] = {};
            }
            result[appCandidateId].fullName = appFullname;
            result[appCandidateId].id = appCandidateId;
            // Get data from finalScore
            const finalScore = this.task.finalScores[i];
            const scoreCandidateId = finalScore.id;
            const scorePass = finalScore.pass;
            if (!result[scoreCandidateId]) {
              result[scoreCandidateId] = {};
            }
            result[scoreCandidateId].pass = scorePass;
          }
        } else {
          // console.log('Application and final scores mismatch');
        }
      }
      // Convert the object to an array
      return Object.values(result);
    },
    passed() {
      return this.applicationOutcomes.filter(o => o.pass);
    },
    failed() {
      return this.applicationOutcomes.filter(o => !o.pass);
    },
    showEmailButton() {
      return [
        TASK_TYPE.CRITICAL_ANALYSIS,
        TASK_TYPE.QUALIFYING_TEST,
        TASK_TYPE.SCENARIO,
        TASK_TYPE.SITUATIONAL_JUDGEMENT,
      ].includes(this.type);
    },
  },
  methods: {
    notifyCandidates() {
      // Dont do this async as we just want to fire and forget
      functions.httpsCallable('sendPublishedFeedbackReportNotifications')({ exerciseId: this.exerciseId, type: this.type });
      return true;
    },
  },
};
</script>
