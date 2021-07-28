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
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          HMRC check
        </dt>
        <dd class="govuk-summary-list__value">
          <span
            v-if="exercise.characterChecks"
          >
            {{ hmrcCheckRequired | toYesNo }}
          </span>
        </dd>
        <dd class="govuk-summary-list__actions">
          <RouterLink
            class="govuk-link govuk-body-m change-link"
            style="display:inline-block;"
            :to="{name: 'exercise-tasks-character-checks-edit'}"
          >
            Change
          </RouterLink>
        </dd>
      </div>
    </dl>

    <Banner
      :message="characterChecksMessage"
      :status="characterChecksStatus"
    />

    <ActionButton
      v-if="!characterChecksEnabled"
      type="primary"
      @click="enableCharacterChecks()"
    >
      {{ buttonText }}
    </ActionButton>

    <div v-if="characterChecksEnabled">
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
            :is="`CharacterChecksRequests`"
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
          data-key="id"
          :data="applicationRecordsCharacterChecksNotRequested"
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
          @change="getApplicationRecordsCharacterChecksNotRequested"
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
              {{ row.candidate.fullName }}
            </TableCell>
            <TableCell :title="tableColumns[2].title">
              {{ row.stage }}
            </TableCell>
            <TableCell :title="tableColumns[3].title">
              {{ row.characterChecks.status }}
            </TableCell>
          </template>
        </Table>
        <p
          v-if="!applicationRecordsCharacterChecksNotRequested.length"
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
            :is="`CharacterChecksRequests`"
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
          data-key="id"
          :data="applicationRecordsCharacterChecksRequested"
          :columns="tableColumnsCharacterChecksRequested"
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
          @change="getApplicationRecordsCharacterChecksRequested"
        >
          <template #row="{row}">
            <TableCell :title="tableColumnsCharacterChecksRequested[0].title">
              <RouterLink
                :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
              >
                {{ row.application.referenceNumber }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumnsCharacterChecksRequested[1].title">
              {{ row.candidate.fullName }}
            </TableCell>
            <TableCell :title="tableColumnsCharacterChecksRequested[2].title">
              {{ row.stage }}
            </TableCell>
            <TableCell :title="tableColumnsCharacterChecksRequested[3].title">
              {{ row.characterChecks.status }}
            </TableCell>
            <TableCell :title="tableColumnsCharacterChecksRequested[4].title">
              {{ row.characterChecks.requestedAt | formatDate }}
            </TableCell>
            <TableCell :title="tableColumnsCharacterChecksRequested[5].title">
              {{ getDate(row.characterChecks.reminderSentAt) || 'n/a' }}
            </TableCell>
          </template>
        </Table>
        <p
          v-if="!applicationRecordsCharacterChecksRequested.length"
          class="govuk-body govuk-!-margin-top-6"
        >
          No applications found.
        </p>
      </div>

      <div
        v-if="activeTab == 'completed'"
      >
        <Table
          data-key="id"
          :data="applicationRecordsCharacterChecksCompleted"
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
          @change="getApplicationRecordsCharacterChecksCompleted"
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
              {{ row.candidate.fullName }}
            </TableCell>
            <TableCell :title="tableColumns[2].title">
              {{ row.stage }}
            </TableCell>
            <TableCell :title="tableColumns[3].title">
              {{ row.characterChecks.status }}
            </TableCell>
          </template>
        </Table>
        <p
          v-if="!applicationRecordsCharacterChecksCompleted.length"
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
import CharacterChecksRequests from '@/components/ModalViews/CharacterChecksRequests';
import { formatDate } from '@jac-uk/jac-kit/filters/filters';
import { functions } from '@/firebase';

export default {
  components: {
    Banner,
    ActionButton,
    Table,
    TableCell,
    TabsList,
    Modal,
    CharacterChecksRequests,
  },
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
      tableColumnsCharacterChecksRequested: [
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
    activeTab() {
      this.resetSelectedItems();
    },
  },
  async created() {
    if (!(this.exercise.characterChecks && typeof this.exercise.characterChecks.HMRC === 'boolean')) {
      this.$router.push({ name: 'exercise-tasks-character-checks-edit' });
    }
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
    getApplicationRecordsCharacterChecksNotRequested(params) {
      this.$store.dispatch(
        'characterChecks/bind',
        {
          exerciseId: this.exercise.id,
          requested: false,
          ...params,
        }
      );
    },
    getApplicationRecordsCharacterChecksRequested(params) {
      this.$store.dispatch(
        'characterChecks/bind',
        {
          exerciseId: this.exercise.id,
          requested: true,
          ...params,
        }
      );
    },
    getApplicationRecordsCharacterChecksCompleted(params) {
      this.$store.dispatch(
        'characterChecks/bind',
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
