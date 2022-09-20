<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-three-quarters">
        <h1 class="govuk-heading-l">
          {{ type | lookup }}
        </h1>
      </div>
      <div class="govuk-grid-column-one-quarter text-right">
        <FullScreenButton />
      </div>
    </div>

    <p
      v-if="hasApplicationsWithoutStatus"
      class="govuk-body-l"
    >
      Please set the new status of each application.
    </p>
    <p
      v-else
      class="govuk-body-l govuk-!-margin-bottom-4"
    >
      {{ type | lookup }} can now be completed. {{ totalApplications }} applications will be updated.
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
            @click="btnComplete"
          >
            Complete
          </ActionButton>
        </div>
      </div>
    </div>

    <Table
      data-key="id"
      :data="filteredApplications"
      :columns="tableColumns"
      multi-select
      :selection.sync="selectedItems"
      :custom-search="{
        placeholder: 'Search candidate name or reference number',
        handler: searchHandler,
        field: 'candidate.id',
      }"
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
import { beforeRouteEnter, btnNext } from './helper';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import TitleBar from '@/components/Page/TitleBar';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import FullScreenButton from '@/components/Page/FullScreenButton';
import SetStatusForm from './StatusChanges/SetStatus';
import StatusTag from './StatusChanges/StatusTag';
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
      this.$store.dispatch('ui/exitFullScreen');
    },
    updateTableState(params) {
      this.tableState = params;
    },
    searchHandler(params) {
      console.log('candidate search', params);
      return [];
    },
    async setStatus(params) {
      console.log('set status', params);
      const saveData = {};
      this.selectedItems.forEach(item => saveData[`outcomeMap.${item}`] = params.status);
      console.log('savedata', saveData);
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.task.type, data: saveData } );
      this.$refs['setStatusModal'].closeModal();
    },
  },
};
</script>
