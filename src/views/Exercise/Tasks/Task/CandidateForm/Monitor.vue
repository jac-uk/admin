<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="text-right govuk-grid-column-one-third">
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <dl class="govuk-summary-list govuk-!-margin-bottom-7">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Contact date
        </dt>
        <dd class="govuk-summary-list__value">
          <template v-if="exercise.preSelectionDayQuestionnaireReturnDate">
            {{ $filters.formatDate(exercise.preSelectionDayQuestionnaireReturnDate, 'long') }}
          </template>
        </dd>
        <dd class="govuk-summary-list__actions" />
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Due date
        </dt>
        <dd class="govuk-summary-list__value">
          <template v-if="exercise.preSelectionDayQuestionnaireReturnDate">
            {{ $filters.formatDate(exercise.preSelectionDayQuestionnaireReturnDate, 'long') }}
          </template>
        </dd>
        <dd class="govuk-summary-list__actions" />
      </div>
    </dl>

    <TabsList
      ref="tabs"
      v-model:active-tab="activeTab"
      :tabs="tabs"
      class="print-none"
    />

    <Banner
      :message="message"
      :status="status"
    />

    <div>
      <button
        v-if="isCreated && hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          PERMISSIONS.notifications.permissions.canCreateNotifications.value
        ])"
        class="govuk-button govuk-!-margin-right-3"
        :disabled="!selectedItems.length"
        @click="openModal('modalRefRequests', 'request')"
      >
        Send requests
      </button>
      <button
        v-if="isRequested && hasPermissions([
          PERMISSIONS.assessments.permissions.canReadAssessments.value,
          PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          PERMISSIONS.notifications.permissions.canCreateNotifications.value
        ])"
        class="govuk-button govuk-!-margin-right-3"
        :disabled="!selectedItems.length"
        @click="openModal('modalRefRequests', 'reminder')"
      >
        Send reminders
      </button>
    </div>

    <Modal ref="modalRefRequests">
      <component
        :is="`PreSelectionDayQuestionnairesRequests`"
        :selected-items="selectedItems"
        :type="modalType"
        :exercise-mailbox="exerciseMailbox"
        :exercise-manager-name="exerciseManagerName"
        :due-date="dueDate"
        @close="closeModal('modalRefRequests')"
        @setmessage="setMessage"
        @reset="resetSelectedItems"
      />
    </Modal>

    <Table
      :key="activeTab"
      v-model:selection="selectedItems"
      data-key="id"
      :data="records"
      :page-size="50"
      :columns="tableColumns"
      :multi-select="true"
      :search-map="$searchMap.characterChecks"
      :filters="filters"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          <RouterLink
            class="govuk-link"
            :to="{name: 'exercise-application', params: { applicationId: row.application.id }}"
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
          {{ $filters.lookup(row.stage) }}
        </TableCell>
        <TableCell :title="tableColumns[3].title">
          {{ $filters.lookup(row.preSelectionDayQuestionnaire?.status) }}
        </TableCell>
      </template>
    </Table>

    <ActionButton
      v-if="isOverdue"
      class="govuk-!-margin-bottom-1"
      type="primary"
      :action="btnContinue"
    >
      Continue
    </ActionButton>
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from '../helper';
import { getTaskSteps } from '@/helpers/exerciseHelper';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import { formatDate } from '@jac-uk/jac-kit/filters/filters';
import { isDateInFuture } from '@jac-uk/jac-kit/helpers/date';
import PreSelectionDayQuestionnairesRequests from '@/components/ModalViews/PreSelectionDayQuestionnairesRequests.vue';
import { functions } from '@/firebase';
import permissionMixin from '@/permissionMixin';

export default {
  components: {
    TabsList,
    Table,
    TableCell,
    ActionButton,
    Banner,
    Modal,
    PreSelectionDayQuestionnairesRequests,
    FullScreenButton,
    ProgressBar,
  },
  mixins: [permissionMixin],
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      tabs: [
        {
          ref: 'created',
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
      activeTab: 'created',
      tableColumns: [
        { title: 'Reference number', sort: 'application.referenceNumber' },
        { title: 'Candidate name', sort: 'candidate.fullName', default: true },
        { title: 'Stage' },
        { title: 'Status' },
      ],
      filters: [],
      selectedItems: [],
      modalType: '',
      message: null,
      status: null,
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
      const date = this.exercise.preSelectionDayQuestionnaireReturnDate;
      return formatDate(date);
    },
    isOverdue() {
      return !isDateInFuture(this.exercise.contactIndependentAssessors);
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
    isCreated() {
      return this.activeTab === 'created';
    },
    isRequested() {
      return this.activeTab === 'requested';
    },
    isCompleted() {
      return this.activeTab === 'completed';
    },
    records() {
      if (this.isCreated) {
        return this.$store.state.preSelectionDayQuestionnaires.preSelectionDayQuestionnairesCreatedRecords;
      } else if (this.isRequested) {
        return this.$store.state.preSelectionDayQuestionnaires.preSelectionDayQuestionnairesRequestedRecords;
      } else if (this.isCompleted) {
        return this.$store.state.preSelectionDayQuestionnaires.preSelectionDayQuestionnairesCompletedRecords;
      } else {
        return [];
      }
    },
  },
  watch: {
    activeTab() {
      this.resetSelectedItems();
      this.resetMessage();
    },
  },
  methods: {
    getTableData(params) {
      this.$store.dispatch('preSelectionDayQuestionnaires/bind', {
        exerciseId: this.exercise.id,
        status: this.activeTab,
        ...params,
      });
    },
    openModal(modalRef, type){
      this.$refs[modalRef].openModal();
      this.modalType = type;
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
      this.modalType = '';
    },
    resetSelectedItems() {
      this.selectedItems = [];
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
      }, 20000);
    },
    resetMessage() {
      this.status = null;
      this.message = null;
    },
    btnNext,
    async btnContinue() {
      await functions.httpsCallable('updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
  },
};
</script>
