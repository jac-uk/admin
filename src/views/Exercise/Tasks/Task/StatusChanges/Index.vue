<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="text-right govuk-grid-column-one-half">
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <p
      v-if="hasApplicationsWithoutStatus"
      class="govuk-body"
    >
      Please set the new status of each application.
    </p>
    <p
      v-else
      class="govuk-body govuk-!-margin-bottom-4"
    >
      {{ $filters.lookup(type) }} can now be completed. {{ totalApplications }} applications will be updated.
    </p>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
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
        v-if="hasApplicationsWithoutStatus"
        class="govuk-grid-column-one-half"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
            <span class="govuk-caption-m">Status not yet assigned</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ applicationsWithoutStatus.length }}
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
            :action="btnComplete"
          >
            Complete
          </ActionButton>
        </div>
      </div>
    </div>

    <Table
      v-model:selection="selectedItems"
      data-key="id"
      :data="filteredApplications"
      :columns="tableColumns"
      multi-select
      :custom-search="{
        placeholder: 'Search candidate name or reference number',
        handler: searchHandler,
        field: 'candidate.id',
      }"
      :search-map="$searchMap.applications"
      :filters="[
        {
          title: 'Status',
          field: 'status',
          type: 'checkbox',
          options: availableStatuses.concat(['']),
        },
      ]"
      local-data
      @change="updateTableState"
    >
      <template #actions>
        <button
          class="govuk-button govuk-!-margin-bottom-3"
          :disabled="!hasSelectedItems"
          @click="$refs['setStatusModal'].openModal()"
        >
          Set status
        </button>
      </template>
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ row.ref }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.fullName }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          <StatusTag
            v-if="task.outcomeMap[row.id]"
            :pass-statuses="task.applicationPassStatuses"
            :status="task.outcomeMap[row.id]"
          />
          <span v-else />
        </TableCell>
      </template>
    </Table>

    <Modal ref="setStatusModal">
      <TitleBar>
        Set status
      </TitleBar>
      <SetStatusForm
        class="govuk-!-margin-6"
        :statuses="availableStatuses"
        @save="setStatus"
        @cancel="$refs['setStatusModal'].closeModal()"
      />
    </Modal>
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from '../helper';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import TitleBar from '@/components/Page/TitleBar.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { getTaskSteps } from '@/helpers/exerciseHelper';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import SetStatusForm from './SetStatus.vue';
import StatusTag from './StatusTag.vue';
import { functions } from '@/firebase';
import { getTableData } from '@/helpers/tableHelper';

export default {
  components: {
    Table,
    TableCell,
    Modal,
    TitleBar,
    ActionButton,
    FullScreenButton,
    ProgressBar,
    SetStatusForm,
    StatusTag,
  },
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      selectedItems: [],
      tableColumns: [
        { title: 'Reference number', sort: 'ref' },
        { title: 'Name', sort: 'fullName', defualt: true },
        { title: 'New status', sort: 'status' },
      ],
      tableState: null,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
    totalApplications() {
      return this.task ? this.task.applications.length : 0;
    },
    applicationsWithoutStatus() {
      return this.task.applications.filter(application => !this.task.outcomeMap[application.id]);
    },
    hasApplicationsWithoutStatus() {
      return this.applicationsWithoutStatus.length > 0;
    },
    filteredApplications() {
      const applications = this.task.applications.map(application => {
        return {
          ...application,
          status: this.task.outcomeMap[application.id],
        };
      });
      if (!this.tableState)  return applications;
      return getTableData(applications, this.tableColumns, this.tableState);
    },
    availableStatuses() {
      if (!this.task) return [];
      return this.task.applicationPassStatuses.concat(this.task.applicationFailStatuses);
    },
    hasSelectedItems() {
      return this.selectedItems && this.selectedItems.length;
    },
  },
  methods: {
    btnNext,
    async btnComplete() {
      await functions.httpsCallable('updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
    updateTableState(params) {
      this.tableState = params;
    },
    searchHandler() {
      return [];
    },
    async setStatus(params) {
      const saveData = {};
      this.selectedItems.forEach(item => saveData[`outcomeMap.${item}`] = params.status);
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.task.type, data: saveData } );
      this.$refs['setStatusModal'].closeModal();
    },
  },
};
</script>
