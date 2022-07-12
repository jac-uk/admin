<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }} test
    </h1>

    <p
      v-if="hasApplicationsWithoutStatus"
      class="govuk-body-l"
    >
      Please choose a status for each application.
    </p>
    <p
      v-else
      class="govuk-body-l"
    >
      {{ type | lookup }} test can now be completed. All applications will be updated with
      their new
      status.
    </p>

    <!-- STATS -->
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ task.participants.length }}
          </h2>
        </div>
      </div>
      <div
        v-if="hasApplicationsWithoutStatus"
        class="govuk-grid-column-one-half"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Status not yet assigned
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ totalApplicationsWithoutStatus }}
          </h2>
        </div>
      </div>
      <div
        v-else
        class="govuk-grid-column-one-half"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-4">
            Next step
          </p>
          <ActionButton
            class="govuk-!-margin-bottom-1"
            type="primary"
            @click="btnComplete"
          >
            Complete {{ type | lookup }} test
          </ActionButton>
        </div>
      </div>
    </div>
    <!-- END STATS -->

    <!-- START: SCORE SHEET -->
    <Table
      ref="scoreSheet"
      data-key="id"
      :data="scoreSheetRows"
      :columns="scoreSheetColumns"
      :page-size="500"
      local-data
      class="merit-list"
    >
      <template #row="{row}">
        <TableCell class="table-cell-application">
          {{ row.referenceNumber }}
        </TableCell>
        <TableCell class="text-right">
          {{ row.score }}
        </TableCell>
        <TableCell class="govuk-!-padding-0 v-top">
          <Select
            :id="`status-${row.id}`"
            class="govuk-!-margin-bottom-0"
            :value="(task.outcome && task.outcome[row.id]) || ''"
            @input="updateStatus(row.id, $event)"
          >
            <option
              v-for="status in statuses"
              :key="status"
              :value="status"
            >
              {{ status | lookup }}
            </option>
          </Select>
        </TableCell>
      </template>
    </Table>
    <!-- END: SCORE SHEET -->
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';
import { functions } from '@/firebase';

export default {
  components: {
    Table,
    TableCell,
    Select,
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
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    statuses() {
      switch (this.type) {
      case QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS:
        return ['passedCA', 'failedCA'];
      case QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT:
        return ['passedSJ', 'failedSJ'];
      case QUALIFYING_TEST.TYPE.SCENARIO:
        return ['passedScenario', 'failedScenario'];
      }
      return [`passed-${this.type}`, `failed-${this.type}`];
    },
    scoreSheetRows() {
      return this.task.participants.map(row => {
        return {
          id: row.srcId,
          referenceNumber: row.ref,
          email: row.email,
          fullName: row.fullName,
          score: this.task.scores[row.srcId] || 0,
        };
      }).sort((a, b) => b.score - a.score);
    },
    scoreSheetColumns() {
      const columns = [];
      columns.push({ title: 'Application', class: 'table-cell-application' });
      columns.push({ title: 'Score', class: 'text-center table-cell-score' });
      columns.push({ title: 'Status', class: 'text-center' });
      return columns;
    },
    totalApplications() {
      return this.task.participants.length;
    },
    totalApplicationsWithStatus() {
      if (!this.task) return 0;
      if (!this.task.outcome) return 0;
      const applicationIdsWithStatus = Object.keys(this.task.outcome);
      return applicationIdsWithStatus.length;
    },
    totalApplicationsWithoutStatus() {
      return this.totalApplications - this.totalApplicationsWithStatus;
    },
    hasApplicationsWithoutStatus() {
      return this.totalApplicationsWithoutStatus !== 0;
    },
  },
  methods: {
    btnNext,
    async btnComplete() {
      await functions.httpsCallable('completeTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
    async updateStatus(applicationId, status) {
      const saveData = {};
      saveData[`outcome.${applicationId}`] = status;
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: saveData });
    },
  },
};
</script>
