<template>
  <div>
    <h1 class="govuk-heading-l">
      Character checks
    </h1>

    <Banner
      :message="message"
      :status="status"
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
            {{ exercise.characterChecks.HMRC | toYesNo }}
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

    <ActionButton
      type="primary"
      :disabled="!selectedItems.length"
      @click="sendRequests()"
    >
      Send requests
    </ActionButton>

    <Table
      data-key="id"
      :data="applicationRecords"
      :columns="tableColumns"
      multi-select
      :selection.sync="selectedItems"
      :page-size="50"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ row.application.referenceNumber }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.candidate.fullName }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          <span
            v-if="row.characterChecks"
          >
            {{ row.characterChecks.status | lookup }}
          </span>
        </TableCell>
      </template>
    </Table>
  </div>
</template>

<script>
import { functions } from '@/firebase';

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
  },
  data(){
    return {
      message: null,
      status: 'success',
      selectedItems: [],
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Status' },
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationRecords() {
      return this.$store.state.stageShortlisted.records;
    },
    totalApplicationRecords() {
      return this.exercise.applicationRecords.shortlisted || 0;
    },
  },
  async created() {
    if (! (this.exercise.characterChecks && typeof this.exercise.characterChecks.HMRC === 'boolean')) {
      this.$router.push({ name: 'exercise-tasks-character-checks-edit' });
    }
  },
  methods: {
    async sendRequests() {
      try {
        const response = await functions.httpsCallable('sendCharacterCheckRequests')({
          items: this.selectedItems,
        });

        if (response.result === false) {
          this.setMessage('Failed to send requests.', 'warning');
        } else {
          this.setMessage(`Sent requests to ${this.selectedItems.length} candidates.`);
        }
      }
      catch (error) {
        this.setMessage('Failed to send requests.', 'warning');
      }
    },
    setMessage(message, status = 'success') {
      this.status = status;
      this.message = message;
    },
    getTableData(params) {
      this.$store.dispatch(
        'stageShortlisted/bind',
        {
          exerciseId: this.exercise.id,
          ...params,
        }
      );
    },
  },
};
</script>
