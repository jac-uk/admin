<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <h2 class="govuk-heading-l">Overview</h2>
    </div>
    <div class="govuk-grid-column-one-half">
      <div class="panel govuk-!-margin-bottom-4">
        <span class="govuk-caption-m">
          Total applications
        </span>
        <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
          <span class="hard-coded">1000</span>
        </h2>
      </div>
      <div class="panel govuk-!-margin-bottom-9">
        <span class="govuk-caption-m">
          Number of vacancies
        </span>
        <span class="govuk-caption-s color-middle">
          <span class="hard-coded-border">Immediate start (s87)</span>
        </span>
        <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
          <span class="hard-coded">Up to five</span>
        </h2>
      </div>
    </div>
    <div class="govuk-grid-column-one-half">
      <div class="panel govuk-!-margin-bottom-4">
        <span class="govuk-caption-m">Type of exercise</span>
        <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
          <span class="hard-coded">Legal</span>
        </h2>
      </div>
      <div class="panel govuk-!-margin-bottom-9">
        <span class="govuk-caption-m">
          Timeline - where we are
        </span>
        <span class="govuk-caption-s color-middle">
          <span class="hard-coded-border">Return date for independent assessments</span>
        </span>
        <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
          <span class="hard-coded">25 May 2022</span>
        </h2>
      </div>
    </div>

    <div class="govuk-grid-column-full">
      <h2 class="govuk-heading-l">Distribution of scores</h2>
    </div>
    <div class="govuk-grid-column-one-third  govuk-!-margin-bottom-9">
      <div class="panel">
        <h3 class="govuk-heading-m">Qualifying Test</h3>
        <div class="govuk-body">
          <span class="govuk-!-font-size-36 color-brand govuk-!-font-weight-bold hard-coded">
            48%
          </span>
          <span class="govuk-caption-s">pass</span>
        </div>
        <div class="flex-line">
          <span>Candidates passed:</span>
          <span class="value-m hard-coded">477</span>
        </div>
        <div class="flex-line">
          <span>Candidates entered:</span>
          <span class="value-m hard-coded">1000</span>
        </div>
        <div class="flex-line">
          <div>
            <span>Pass Mark:</span> <span class="value-m hard-coded">34</span>
          </div>
          <div>
            <span>Score out of:</span> <span class="value-m hard-coded">60</span>
          </div>
        </div>
      </div>
    </div>
    <div class="govuk-grid-column-one-third  govuk-!-margin-bottom-9">
      <div class="panel">
        <h3 class="govuk-heading-m">Scenario Test</h3>
        <div class="govuk-body">
          <span class="govuk-!-font-size-36 color-brand govuk-!-font-weight-bold hard-coded">
            34%
          </span>
          <span class="govuk-caption-s">pass</span>
        </div>
        <div class="flex-line">
          <span>Candidates passed:</span>
          <span class="value-m hard-coded">162</span>
        </div>
        <div class="flex-line">
          <span>Candidates entered:</span>
          <span class="value-m hard-coded">477</span>
        </div>
        <div class="flex-line">
          <div>
            <span>Pass Mark:</span> <span class="value-m hard-coded">34</span>
          </div>
          <div>
            <span>Score out of:</span> <span class="value-m hard-coded">60</span>
          </div>
        </div>
      </div>
    </div>
    <div class="govuk-grid-column-one-third  govuk-!-margin-bottom-9">
      <div class="panel">
        <h3 class="govuk-heading-m">Selection Day</h3>
        <div class="govuk-body">
          <span class="govuk-!-font-size-36 color-brand govuk-!-font-weight-bold hard-coded">
            14%
          </span>
          <span class="govuk-caption-s">pass</span>
        </div>
        <div class="flex-line">
          <span>Candidates passed:</span>
          <span class="value-m hard-coded">50</span>
        </div>
        <div class="flex-line">
          <span>Candidates entered:</span>
          <span class="value-m hard-coded">162</span>
        </div>
        <div class="flex-line">
          <div>
            <span>Pass Mark:</span> <span class="value-m hard-coded">34</span>
          </div>
          <div>
            <span>Score out of:</span> <span class="value-m hard-coded">60</span>
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-grid-column-two-thirds">
      <h2 class="govuk-heading-l">Candidate Breakdown at Each Stage</h2>
    </div>
    <div class="govuk-grid-column-one-third govuk-!-text-align-right">
      <ActionButton
        class="govuk-!-margin-right-3 hard-coded hard-coded-border"
        @click="exportData"
      >
        Export Data
      </ActionButton>
      <button
        class="govuk-button govuk-!-margin-right-3 hard-coded hard-coded-border"
        @click="refresh"
      >
        Refresh
      </button>
    </div>

    <div class="govuk-grid-column-full">
      <TabsList
        :tabs="tabs"
        :active-tab.sync="activeTab"
      />
      <GChart
        type="ComboChart"
        :data="chartData"
        :options="chartOptions"
      />
      <Table
        data-key="id"
        :data="chartGender"
        :page-size="50"
        :columns="tableColumns"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
              {{ row.name }}
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.status }}
          </TableCell>
        </template>
      </Table>
    </div>

  </div>
</template>

<script>
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';
import exerciseTimeline from '@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import { lookup } from '@/filters';
import { functions } from '@/firebase';
import { GChart } from 'vue-google-charts/legacy';
import { logEvent } from '@/helpers/logEvent';
import { authorisedToPerformAction }  from '@/helpers/authUsers';
import { isApproved, isProcessing, applicationCounts } from '@/helpers/exerciseHelper';
import { ADVERT_TYPES } from '@/helpers/constants';

export default {
  components: {
    ActionButton,
    GChart,
    TabsList,
    Table,
    TableCell,
  },
  data() {
    return {
      tabs: [
        {
          ref: 'gender',
          title: 'Gender',
        },
        {
          ref: 'ethnicity',
          title: 'Ethnicity',
        },
        {
          ref: 'current-legal-role',
          title: 'Current Legal Role',
        },
        {
          ref: 'disability',
          title: 'Disability',
        },
        {
          ref: 'social-mobility',
          title: 'Social Mobility',
        },
      ],
      activeTab: 'gender',
      tableColumns: [
        { title: 'All gender', sort: 'name', direction: 'asc', default: true },
        { title: 'Status' },
      ],
    };
  },
  computed: {
    isProduction() {
      return this.$store.getters['isProduction'];
    },
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    applicationCounts() {
      return applicationCounts(this.exercise);
    },
    draftApplications() {
      return this.applicationCounts.draft || 0;
    },
    appliedApplications() {
      return this.applicationCounts.applied || 0;
    },
    totalApplications() {
      return this.applicationCounts._total || 0;
    },
    isPublished() {
      return this.exercise.published;
    },
    canPublish() {
      return this.exercise.progress && this.exercise.progress.vacancySummary;
    },
    isDraft() {
      // returns true unless exercise has a state that other than draft
      if (this.exercise && this.exercise.state && this.exercise.state !== 'draft') {
        return false;
      }
      return true;
    },
    isReadyForApproval() {
      const returnReadyForApproval = this.exercise
        && this.exercise.state
        && this.exercise.state === 'ready';
      return returnReadyForApproval;
    },
    isReadyForApprovalFromAdvertType() {
      const returnReady = this.exercise
        && (!this.exercise.advertType || this.exercise.advertType === ADVERT_TYPES.FULL || this.exercise.advertType === ADVERT_TYPES.EXTERNAL);
      return returnReady;
    },
    isApproved() {
      return isApproved(this.exercise);
    },
    isTesting() {
      return this.exercise && this.exercise.testingState && this.exercise.testingState === 'testing';
    },
    isTested() {
      return this.exercise && this.exercise.testingState && this.exercise.testingState === 'tested';
    },
    isReadyForTesting() {
      return this.isPublished && this.isApproved && !this.isTesting && !this.isTested;
    },
    isProcessing() {
      return isProcessing(this.exercise);
    },
    isReadyForProcessing() {
      return this.isApproved && !this.isProcessing;
      // @TODO perhaps also check that exercise has closed
    },
    hasOpened() {
      if (this.exercise) {
        switch (this.exercise.state) {
        case 'draft':
        case 'ready':
        case 'approved':
        case 'pre-launch':
          return false;
        default:
          return true;
        }
      }
      return false;
    },
    timeline() {
      const timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline, 2);
    },
    exerciseProgress() {
      if (this.exercise && this.exercise.progress) {
        return this.exercise.progress;
      } else {
        return {};
      }
    },
    approvalProgress() {
      if (this.exercise && this.exercise.approval) {
        return this.exercise.approval;
      } else {
        return {};
      }
    },
    taskList() {
      const data = [];
      if (!this.exercise.state || this.exercise.state === 'draft' || this.exercise.state === 'ready') {
        if (this.exerciseProgress) {
          data.push({ title: 'Website listing', id: 'exercise-details-summary', done: this.exerciseProgress.vacancySummary, approved: this.approvalProgress['vacancySummary'] });
          data.push({ title: 'Vacancy information', id: 'exercise-details-vacancy', done: this.exerciseProgress.vacancyInformation, approved: this.approvalProgress['vacancyInformation'] });
          data.push({ title: 'Contacts', id: 'exercise-details-contacts', done: this.exerciseProgress.contacts, approved: this.approvalProgress['contacts'] });
          data.push({ title: 'Timeline', id: 'exercise-details-timeline', done: this.exerciseProgress.timeline, approved: this.approvalProgress['timeline'] });
          data.push({ title: 'Shortlisting', id: 'exercise-details-shortlisting', done: this.exerciseProgress.shortlisting, approved: this.approvalProgress['shortlisting'] });
          data.push({ title: 'Eligibility information', id: 'exercise-details-eligibility', done: this.exerciseProgress.eligibility, approved: this.approvalProgress['eligibility'] });
          data.push({ title: 'Working preferences', id: 'exercise-details-preferences', done: this.exerciseProgress.workingPreferences, approved: this.approvalProgress['workingPreferences'] });
          data.push({ title: 'Assessment options', id: 'exercise-details-assessments', done: this.exerciseProgress.assessmentOptions, approved: this.approvalProgress['assessmentOptions'] });
          data.push({ title: 'Exercise downloads', id: 'exercise-details-downloads', done: this.exerciseProgress.downloads, approved: this.approvalProgress['downloads'] });
          if (this.exercise.inviteOnly) {
            data.splice(1, 0, { title: 'Exercise invitations', id: 'exercise-details-invitations' , done: this.exerciseProgress.invitations, approved: this.approvalProgress['invitations'] });
          }
        }
      }
      return data;
    },
    isReadyToSubmit() {
      return this.exerciseProgress
        && this.exerciseProgress.vacancySummary
        && this.exerciseProgress.vacancyInformation
        && this.exerciseProgress.contacts
        && this.exerciseProgress.timeline
        && this.exerciseProgress.shortlisting
        && this.exerciseProgress.eligibility
        && this.exerciseProgress.workingPreferences
        && this.exerciseProgress.assessmentOptions
        && this.exerciseProgress.downloads;
    },
    approveErrorMessage() {
      const msg = `You can only approve exercises with the advertType '${ lookup(ADVERT_TYPES.FULL) }' or '${ lookup(ADVERT_TYPES.EXTERNAL) }'.`;
      return msg;
    },
    chartData() {
      return [
        ['Total Candidates', 'All', 'Male', 'Female', 'Other', 'Average'],
        ['Total Candidates', 1000, 524, 457, 2, 256],
        ['Qualifying Test', 477, 251, 224, 2, 156],
        ['Scenario Test', 162, 79, 81, 2, 300],
        ['Selection Day', 50, 23, 25, 2, 1],
      ];
    },
    chartOptions() {
      return {
        vAxis: { title: 'Applicant (number)' },
        seriesType: 'bars',
        series: { 4: { type: 'line' } },
        height: 300,
      };
    },
    chartGender () {
      return [
        {
          id: 1234567,
          name: 'Américo Luiz Vieira',
          status: 'odd',
        },
        {
          id: 1234568,
          name: 'Sebastião Amaro Louback',
          status: 'odd',
        },
      ];
    },
  },
  methods: {
    submitForApproval() {
      this.$store.dispatch('exerciseDocument/submitForApproval');
    },
    approve() {
      this.$store.dispatch('exerciseDocument/approve');
    },
    refresh() {
      // this.$store.dispatch('exerciseDocument/unlock');
    },
    async exportData() {
      const exercise = await this.$store.dispatch('exerciseDocument/getDocumentData', this.exerciseId);
      await this.$store.dispatch('clipboard/write', {
        environment: this.$store.getters.appEnvironment,
        type: 'exercise',
        title: `${exercise.referenceNumber} ${exercise.name}`,
        content: exercise,
      });
    },
    async publish() {
      await this.$store.dispatch('exerciseDocument/publish');
      logEvent('info', 'Exercise published', {
        exerciseId: this.exerciseId,
        exerciseRef: this.exercise.referenceNumber,
      });
    },
    async unPublish() {
      await this.$store.dispatch('exerciseDocument/unpublish');
      logEvent('info', 'Exercise unpublished', {
        exerciseId: this.exerciseId,
        exerciseRef: this.exercise.referenceNumber,
      });
    },
    async startProcessing() {
      await functions.httpsCallable('initialiseApplicationRecords')({ exerciseId: this.exerciseId });
    },
    async updateProcessing() {
      // this is temporary function to cover late applications to existing exercises. It can be removed when we automatically create applicationRecords and existing exercises have been processed
      await functions.httpsCallable('initialiseMissingApplicationRecords')({ exerciseId: this.exerciseId });
    },
    changeState() {
      this.$refs['modalChangeExerciseState'].openModal();
    },
    refreshApplicationCounts() {
      if (authorisedToPerformAction(this.$store.getters['auth/getEmail'])) {
        this.$store.dispatch('exerciseDocument/refreshApplicationCounts');
      }
    },
    changeNoOfTestApplications() {
      this.$refs['modalChangeNoOfTestApplications'].openModal();
      this.$store.dispatch('exerciseDocument/testing');
    },
    cancelChangeNoOfTestApplications() {
      this.$refs['modalChangeNoOfTestApplications'].closeModal();
      this.$store.dispatch('exerciseDocument/isReadyForTest');
    },
    confirmedNoOfTestApplications() {
      this.$refs['modalChangeNoOfTestApplications'].closeModal();
      this.$refs['createTestApplicationsBtn'].$el.click();
    },
    async createTestApplications() {
      const noOfTestApplications = this.$store.getters['exerciseDocument/noOfTestApplications'];
      if (!noOfTestApplications) return;
      await functions.httpsCallable('createTestApplications')({ exerciseId: this.exerciseId, noOfTestApplications });
      this.$store.dispatch('exerciseDocument/tested');
      this.$store.dispatch('exerciseDocument/changeNoOfTestApplications', 0);
    },
    getTableData(params) {
      return params;
    },
  },
};
</script>

<style lang="scss" scoped>
$govuk-mid-grey:	#b1b4b6;
$govuk-brand-colour:	#1d70b8;

.background-blue .govuk-link {
  cursor: pointer;
}
.color-middle {
  color: $govuk-mid-grey;
}
.color-brand {
  color: $govuk-brand-colour;
}

.flex-line {
  display: flex;
  justify-content: space-between;
}

.value-m {
  font-size: 24px;
  font-weight: bold;
}
</style>
