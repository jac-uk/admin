<template>
  <div>
    <h1 class="govuk-heading-l">
      Handover checks
    </h1>
    <dl class="govuk-summary-list govuk-!-margin-bottom-7">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Contact date
        </dt>
        <dd class="govuk-summary-list__value">
          <template>
            {{ exercise.handoverChecksDate | formatDate('long') }}
          </template>
        </dd>
        <dd class="govuk-summary-list__actions" />
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Due date
        </dt>
        <dd class="govuk-summary-list__value">
          <template>
            {{ exercise.handoverChecksReturnDate | formatDate('long') }}
          </template>
        </dd>
        <dd class="govuk-summary-list__actions" />
      </div>
    </dl>

    <Banner
      :message="handoverChecksMessage"
      :status="handoverChecksStatus"
    />

    <button
      v-if="!handoverChecksEnabled && hasPermissions([
        PERMISSIONS.exercises.permissions.canReadExercises.value,
        PERMISSIONS.exercises.permissions.canUpdateExercises.value,
        PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
        PERMISSIONS.applicationRecords.permissions.canUpdateApplicationRecords.value
      ])"
      class="govuk-button"
      @click="enableHandoverChecks()"
    >
      {{ buttonText }}
    </button>

    <div v-if="handoverChecksEnabled">
      <TabsList
        ref="tabs"
        class="print-none"
        :tabs="tabs"
        :active-tab.sync="activeTab"
      />

      <div
        v-if="activeTab == 'notrequested'"
        class="application-details"
      >
        <Banner
          :message="message"
          :status="status"
        />

        <Modal ref="modalRefRequests">
          <component
            :is="`HandoverChecksRequests`"
            :selected-items="selectedItems"
            :type="`request`"
            :exercise-mailbox="exerciseMailbox"
            :exercise-manager-name="exerciseManagerName"
            :due-date="dueDate"
            @close="closeModal('modalRefRequests')"
            @setmessage="setMessage"
            @reset="resetSelectedItems"
          />
        </Modal>

        <ActionButton
          type="primary"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests')"
        >
          Send requests
        </ActionButton>

        <Table
          key="notrequested"
          data-key="id"
          :data="applicationRecordsHandoverChecksNotRequested"
          :columns="tableColumns"
          :search="['candidate.fullName']"
          multi-select
          :selection.sync="selectedItems"
          :page-size="50"
          :filters="[
            {
              title: 'Stage',
              field: 'stage',
              type: 'checkbox',
              options: exerciseStages,
            },
          ]"
          @change="getApplicationRecordsHandoverChecksNotRequested"
        >
          <template #row="{row}">
            <TableCell :title="tableColumns[0].title">
              <RouterLink
                :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
              >
                {{ row.application.referenceNumber }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumns[1].title">
              <RouterLink
                :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
                target="_blank"
              >
                {{ row.candidate.fullName }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumns[2].title">
              {{ row.stage }}
            </TableCell>
            <TableCell :title="tableColumns[3].title">
              {{ row.handoverChecks.status }}
            </TableCell>
          </template>
        </Table>
        <p
          v-if="!applicationRecordsHandoverChecksNotRequested.length"
          class="govuk-body govuk-!-margin-top-6"
        >
          No applications found.
        </p>
      </div>

      <div
        v-if="activeTab == 'requested'"
      >
        <Banner
          :message="message"
          :status="status"
        />

        <Modal ref="modalRefRequests">
          <component
            :is="`HandoverChecksRequests`"
            :selected-items="selectedItems"
            :type="`reminder`"
            :exercise-mailbox="exerciseMailbox"
            :exercise-manager-name="exerciseManagerName"
            :due-date="dueDate"
            @close="closeModal('modalRefRequests')"
            @setmessage="setMessage"
            @reset="resetSelectedItems"
          />
        </Modal>

        <ActionButton
          type="primary"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests')"
        >
          Send reminders
        </ActionButton>

        <Table
          key="requested"
          data-key="id"
          :data="applicationRecordsHandoverChecksRequested"
          :columns="tableColumnsHandoverChecksRequested"
          :search="['candidate.fullName']"
          multi-select
          :selection.sync="selectedItems"
          :page-size="50"
          :filters="[
            {
              title: 'Stage',
              field: 'stage',
              type: 'checkbox',
              options: exerciseStages,
            },
          ]"
          @change="getApplicationRecordsHandoverChecksRequested"
        >
          <template #row="{row}">
            <TableCell :title="tableColumnsHandoverChecksRequested[0].title">
              <RouterLink
                :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
              >
                {{ row.application.referenceNumber }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumnsHandoverChecksRequested[1].title">
              <RouterLink
                :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
                target="_blank"
              >
                {{ row.candidate.fullName }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumnsHandoverChecksRequested[2].title">
              {{ row.stage }}
            </TableCell>
            <TableCell :title="tableColumnsHandoverChecksRequested[3].title">
              {{ row.handoverChecks.status }}
            </TableCell>
            <TableCell :title="tableColumnsHandoverChecksRequested[4].title">
              {{ row.handoverChecks.requestedAt | formatDate }}
            </TableCell>
            <TableCell :title="tableColumnsHandoverChecksRequested[5].title">
              {{ getDate(row.handoverChecks.reminderSentAt) || 'n/a' }}
            </TableCell>
          </template>
        </Table>
        <p
          v-if="!applicationRecordsHandoverChecksRequested.length"
          class="govuk-body govuk-!-margin-top-6"
        >
          No applications found.
        </p>
      </div>

      <div
        v-if="activeTab == 'completed'"
      >
        <Table
          key="completed"
          data-key="id"
          :data="applicationRecordsHandoverChecksCompleted"
          :columns="tableColumns"
          :search="['candidate.fullName']"
          multi-select
          :selection.sync="selectedItems"
          :page-size="50"
          :filters="[
            {
              title: 'Stage',
              field: 'stage',
              type: 'checkbox',
              options: exerciseStages,
            },
          ]"
          @change="getApplicationRecordsHandoverChecksCompleted"
        >
          <template #row="{row}">
            <TableCell :title="tableColumns[0].title">
              <RouterLink
                :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
              >
                {{ row.application.referenceNumber }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumns[1].title">
              <RouterLink
                :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
                target="_blank"
              >
                {{ row.candidate.fullName }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumns[2].title">
              {{ row.stage }}
            </TableCell>
            <TableCell :title="tableColumns[3].title">
              {{ row.handoverChecks.status }}
            </TableCell>
          </template>
        </Table>
        <p
          v-if="!applicationRecordsHandoverChecksCompleted.length"
          class="govuk-body govuk-!-margin-top-6"
        >
          No applications found.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import HandoverChecksRequests from '@/components/ModalViews/HandoverChecksRequests';
import { formatDate } from '@jac-uk/jac-kit/filters/filters';
import { functions } from '@/firebase';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'HandoverChecks',
  components: {
    Banner,
    ActionButton,
    Table,
    TableCell,
    TabsList,
    Modal,
    HandoverChecksRequests,
  },
  mixins: [permissionMixin],
  data() {
    return {
      tabs: [
        {
          ref: 'notrequested',
          title: 'Not requested',
        },
        {
          ref: 'requested',
          title: 'Requested',
        },
        {
          ref: 'completed',
          title: 'Completed',
        },
      ],
      activeTab: 'notrequested',
      handoverChecksStatus: null,
      handoverChecksMessage: null,
      message: null,
      status: null,
      processing: false,
      selectedItems: [],
      exerciseStages: ['shortlisted', 'selected', 'recommended', 'handover'],
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Stage' },
        { title: 'Status' },
      ],
      tableColumnsHandoverChecksRequested: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Stage' },
        { title: 'Status' },
        { title: 'Date requested' },
        { title: 'Date reminder sent' },
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseMailbox() {
      return this.exercise.exerciseMailbox;
    },
    exerciseManagerName() {
      return this.exercise.emailSignatureName;
    },
    dueDate(){
      const date = this.exercise.handoverChecksReturnDate;
      return formatDate(date);
    },
    applicationRecordsHandoverChecksRequested() {
      return this.$store.state.handoverChecks.checksRequestedRecords;
    },
    applicationRecordsHandoverChecksNotRequested() {
      return this.$store.state.handoverChecks.checksNotRequestedRecords;
    },
    applicationRecordsHandoverChecksCompleted() {
      return this.$store.state.handoverChecks.checksCompletedRecords;
    },
    handoverChecksEnabled() {
      return (this.exercise.handoverChecksEnabled && this.exercise.handoverChecksEnabled === true);
    },
    buttonText() {
      if (this.processing === true) {
        return 'Processing...';
      }
      return 'Enable handover checks';
    },
  },
  watch: {
    activeTab() {
      this.resetSelectedItems();
    },
  },
  methods: {
    openModal(modalRef){
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
    },
    enableHandoverChecksStatus(value, status) {
      this.handoverChecksMessage = value;
      this.handoverChecksStatus = status;
    },
    setMessage(value, type, status) {
      if (value === true) {
        this.status = status;
        this.message = `Sent ${type}(s) to ${this.selectedItems.length} candidate(s).`;
      } else {
        this.status = status;
        this.message = `Failed to send ${type}(s).`;
      }
      setTimeout(() => {
        this.message = '';
      },20000);
    },
    getDate(value) {
      return formatDate(value);
    },
    getApplicationRecordsHandoverChecksNotRequested(params) {
      this.$store.dispatch(
        'handoverChecks/bind',
        {
          exerciseId: this.exercise.id,
          requested: false,
          ...params,
        }
      );
    },
    getApplicationRecordsHandoverChecksRequested(params) {
      this.$store.dispatch(
        'handoverChecks/bind',
        {
          exerciseId: this.exercise.id,
          requested: true,
          ...params,
        }
      );
    },
    getApplicationRecordsHandoverChecksCompleted(params) {
      this.$store.dispatch(
        'handoverChecks/bind',
        {
          exerciseId: this.exercise.id,
          completed: true,
          ...params,
        }
      );
    },
    resetSelectedItems() {
      this.selectedItems = [];
    },
    async enableHandoverChecks() {
      try {
        this.processing = true;
        const response = await functions.httpsCallable('enableHandoverChecks')({
          exerciseId: this.exercise.id,
        });
        if (response === false) {
          this.enableHandoverChecksStatus('Request could not be processed', 'warning');
        }
      } catch (error) {
        this.enableHandoverChecksStatus('Handover checks could not be enabled', 'warning');
      }
      this.processing = false;
    },
  },
};
</script>
