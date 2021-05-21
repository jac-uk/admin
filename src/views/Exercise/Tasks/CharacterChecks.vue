<template>
  <div>
    <h1 class="govuk-heading-l">
      Character checks
    </h1>

    <Banner
      :message="message"
    />

    <dl
      class="govuk-summary-list"
    >
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
      <ActionButton
        type="primary"
        :disabled="!selectedItems.length"
        @click="sendRequests()"
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
          <TableCell :title="tableColumns[1].title">
            {{ row.stage }}
          </TableCell>
          <TableCell :title="tableColumns[2].title">
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
      <ActionButton
        type="primary"
        :disabled="!selectedItems.length"
        @click="sendReminders()"
      >
        Send reminders
      </ActionButton>

      <Table
        data-key="id"
        :data="applicationRecordsCharacterChecksRequested"
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
        @change="getApplicationRecordsCharacterChecksRequested"
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
          <TableCell :title="tableColumns[1].title">
            {{ row.stage }}
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ row.characterChecks.status }}
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
  </div>
</template>

<script>
//import { functions } from '@/firebase';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';

export default {
  components: {
    Banner,
    ActionButton,
    Table,
    TableCell,
    TabsList,
  },
  data(){
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
      ],
      activeTab: 'notrequested',
      message: null,
      selectedItems: [],
      exerciseStages: ['shortlisted', 'selected', 'recommended', 'handover'],
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Stage' },
        { title: 'Status' },
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationRecordsCharacterChecksRequested() {
      return this.$store.state.characterChecks.checksRequestedRecords;
    },
    applicationRecordsCharacterChecksNotRequested() {
      return this.$store.state.characterChecks.checksNotRequestedRecords;
    },
    hmrcCheckRequired() {
      return this.exercise.characterChecks.HMRC;
    },
  },
  async created() {
    if (! (this.exercise.characterChecks && typeof this.exercise.characterChecks.HMRC === 'boolean')) {
      this.$router.push({ name: 'exercise-tasks-character-checks-edit' });
    }
  },
  methods: {
    async sendRequests() {
      this.message = 'Request has been sent';
      setTimeout(() => {
        this.message = '';
      },3000);

    //   try {
    //     const response = await functions.httpsCallable('sendCharacterCheckRequests')({
    //       items: this.selectedItems,
    //     });
    //
    //     if (response.result === false) {
    //       this.setMessage('Failed to send requests.', 'warning');
    //     } else {
    //       this.setMessage(`Sent requests to ${this.selectedItems.length} candidates.`);
    //     }
    //   }
    //   catch (error) {
    //     this.setMessage('Failed to send requests.', 'warning');
    //   }
    // },
    // setMessage(message, status = 'success') {
    //   this.status = status;
    //   this.message = message;
    // },
    },
    sendReminders () {
      this.message = 'Reminder has been sent';
      setTimeout(() => {
        this.message = '';
      },3000);
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
  },
};
</script>
