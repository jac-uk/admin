<template>
  <div>
    <h1 class="govuk-heading-l">
      Character checks
    </h1>
    <dl class="govuk-summary-list govuk-!-margin-bottom-7">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Contact date
        </dt>
        <dd class="govuk-summary-list__value">
          <template
            v-if="exercise.characterChecks"
          >
            {{ exercise.characterChecksDate | formatDate('long') }}
          </template>
        </dd>
        <dd class="govuk-summary-list__actions" />
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Due date
        </dt>
        <dd class="govuk-summary-list__value">
          <template
            v-if="exercise.characterChecks"
          >
            {{ exercise.characterChecksReturnDate | formatDate('long') }}
          </template>
        </dd>
        <dd class="govuk-summary-list__actions" />
      </div>
    </dl>

    <Banner
      :message="characterChecksMessage"
      :status="characterChecksStatus"
    />

    <button
      v-if="!characterChecksEnabled && hasPermissions([
        PERMISSIONS.exercises.permissions.canReadExercises.value,
        PERMISSIONS.exercises.permissions.canUpdateExercises.value,
        PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
        PERMISSIONS.applicationRecords.permissions.canUpdateApplicationRecords.value
      ])"
      class="govuk-button"
      @click="enableCharacterChecks()"
    >
      {{ buttonText }}
    </button>

    <div v-if="characterChecksEnabled">
      <TabsList
        ref="tabs"
        class="print-none"
        :tabs="tabs"
        :active-tab.sync="activeTab"
      />

      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-third clearfix">
          <div class="govuk-button-group">
            <Select
              id="exercise-stage"
              v-model="exerciseStage"
              class="govuk-!-margin-right-2"
            >
              <option value="all">
                All applications
              </option>
              <option
                v-if="applicationRecordCounts.shortlisted"
                value="shortlisted"
              >
                Shortlisted
              </option>
              <option
                v-if="applicationRecordCounts.selected"
                value="selected"
              >
                Selected
              </option>
              <option
                v-if="applicationRecordCounts.recommended"
                value="recommended"
              >
                Recommended
              </option>
              <option
                v-if="applicationRecordCounts.handover"
                value="handover"
              >
                Handover
              </option>
            </Select>
          </div>
        </div>

        <div class="govuk-grid-column-one-third text-right">
          <Select
            v-if="availableStatuses && availableStatuses.length > 0"
            id="availableStatuses"
            v-model="candidateStatus"
          >
            <option
              value="all"
            >
              All Statuses
            </option>
            <option
              v-for="item in availableStatuses"
              :key="item"
              :value="item"
            >
              {{ item | lookup }}
            </option>
          </Select>
        </div>

        <div
          v-if="activeTab !== 'completed'"
          class="govuk-grid-column-one-third text-right"
        >
          <Banner
            :message="message"
            :status="status"
          />

          <Modal ref="modalRefRequests">
            <component
              :is="`CharacterChecksRequests`"
              :selected-items="selectedItems"
              :type=" activeTab == 'requested' ? 'reminder' : 'request'"
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
            {{ activeTab == 'requested' ? 'Send reminders' : 'Send requests' }}
          </ActionButton>
        </div>
      </div>

      <Table
        :key="activeTab"
        data-key="id"
        :data="characterCheckData"
        :columns="activeTab === 'notrequested' ? tableColumns : tableColumnsCharacterChecksRequested"
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
        @change="getApplicationRecordsCharacterChecks"
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
            {{ row.stage | lookup }}
          </TableCell>
          <TableCell :title="tableColumns[3].title">
            {{ row.status | lookup }}
            <strong>
              {{ row.status }}
            </strong>
          </TableCell>
          <TableCell :title="tableColumns[4].title">
            {{ row.characterChecks.status }}
          </TableCell>
          <template v-if="activeTab !== 'notrequested'">
            <TableCell :title="tableColumnsCharacterChecksRequested[5].title">
              {{ row.characterChecks.requestedAt | formatDate }}
            </TableCell>
            <TableCell :title="tableColumnsCharacterChecksRequested[6].title">
              {{ getDate(row.characterChecks.reminderSentAt) || 'n/a' }}
            </TableCell>
          </template>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import CharacterChecksRequests from '@/components/ModalViews/CharacterChecksRequests';
import { formatDate } from '@jac-uk/jac-kit/filters/filters';
import { functions } from '@/firebase';
import permissionMixin from '@/permissionMixin';
import { availableStatuses, applicationRecordCounts } from '@/helpers/exerciseHelper';
import { APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';

export default {
  name: 'CharacterChecks',
  components: {
    Banner,
    ActionButton,
    Table,
    TableCell,
    Select,
    TabsList,
    Modal,
    CharacterChecksRequests,
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
      characterChecksStatus: null,
      characterChecksMessage: null,
      candidateStatus: 'all',
      exerciseStage: 'all',
      message: null,
      status: null,
      processing: false,
      selectedItems: [],
      exerciseStages: ['shortlisted', 'selected', 'recommended', 'handover'],
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Stage' },
        { title: 'Application Status' },
        { title: 'Status' },
      ],
      tableColumnsCharacterChecksRequested: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Stage' },
        { title: 'Application Status' },
        { title: 'Character Check Status' },
        { title: 'Date requested' },
        { title: 'Date reminder sent' },
      ],
    };
  },
  computed: {
    characterCheckData() {
      let result;
      if (this.activeTab === 'notrequested') {
        result = this.applicationRecordsCharacterChecksNotRequested;
      }
      if (this.activeTab === 'requested') {
        result = this.applicationRecordsCharacterChecksRequested;
      }
      if (this.activeTab === 'completed') {
        result = this.applicationRecordsCharacterChecksCompleted;
      }
      return result;
    },
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
      const date = this.exercise.characterChecksReturnDate;
      return formatDate(date);
    },
    applicationRecordsCharacterChecksRequested() {
      return this.$store.state.characterChecks.checksRequestedRecords;
    },
    applicationRecordsCharacterChecksNotRequested() {
      return this.$store.state.characterChecks.checksNotRequestedRecords;
    },
    applicationRecordsCharacterChecksCompleted() {
      return this.$store.state.characterChecks.checksCompletedRecords;
    },
    hmrcCheckRequired() {
      return this.exercise.characterChecks.HMRC;
    },
    applicationRecordCounts() {
      return applicationRecordCounts(this.exercise);
    },
    availableStatuses() {
      return availableStatuses(this.exercise, this.exerciseStage);
    },
    characterChecksEnabled() {
      return (this.exercise.characterChecksEnabled && this.exercise.characterChecksEnabled === true);
    },
    buttonText() {
      if (this.processing === true) {
        return 'Processing...';
      }
      return 'Enable character checks';
    },
  },
  watch: {
    candidateStatus: function (newValue) {
      console.log(newValue);
      this.getApplicationRecordsCharacterChecks();
    },
    exerciseStage: function () {
      this.getApplicationRecordsCharacterChecks();
    },
    activeTab() {
      this.resetSelectedItems();
    },
  },
  mounted() {
    console.log(APPLICATION_STATUS.hasOwnProperty('INVITED_TO_SELECTION_DAY'));
  },
  methods: {
    openModal(modalRef){
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
    },
    enableCharacterChecksStatus(value, status) {
      this.characterChecksMessage = value;
      this.characterChecksStatus = status;
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
    getApplicationRecordsCharacterChecks(params) {
      const tabDetail = this.activeTab == 'notrequested' ? { requested: false } :
        this.activeTab == 'requested' ? { requested: true } :
        { completed: true };
      this.$store.dispatch(
        'characterChecks/bind',
        {
          exerciseId: this.exercise.id,
          stage: this.exerciseStage,
          status: this.candidateStatus,
          ...params,
          ...tabDetail,
        }
      );
    },
    resetSelectedItems() {
      this.selectedItems = [];
    },
    async enableCharacterChecks() {
      try {
        this.processing = true;
        const response = await functions.httpsCallable('enableCharacterChecks')({
          exerciseId: this.exercise.id,
        });
        if (response === false) {
          this.enableCharacterChecksStatus('Request could not be processed', 'warning');
        }
      } catch (error) {
        this.enableCharacterChecksStatus('Character checks could not be enabled', 'warning');
      }
      this.processing = false;
    },
  },
};
</script>
