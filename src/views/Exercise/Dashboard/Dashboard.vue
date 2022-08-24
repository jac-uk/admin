<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <h2 class="govuk-heading-l">
        Overview
      </h2>
    </div>
    <div class="govuk-grid-column-one-half">
      <div class="panel govuk-!-margin-bottom-4">
        <span class="govuk-caption-m">
          Total applications
        </span>
        <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
          <span class="">{{ applicationCounts._total }}</span>
        </h2>
        <span class="govuk-caption-s color-middle">
          <span class="">Last Updated: {{ applicationCounts._lastUpdated | formatDate('datetime') }}</span>
        </span>
      </div>
      <div class="panel govuk-!-margin-bottom-9">
        <span class="govuk-caption-m">
          Number of vacancies
        </span>
        <span class="govuk-caption-s color-middle">
          <span class="">Immediate start (s87)</span>
        </span>
        <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
          <span class="">Up to {{ exercise.immediateStart }}</span>
        </h2>
      </div>
    </div>
    <div class="govuk-grid-column-one-half">
      <div class="panel govuk-!-margin-bottom-4">
        <span class="govuk-caption-m">Type of exercise</span>
        <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
          <span class="capitalize">{{ exercise.typeOfExercise }}</span>
        </h2>
      </div>
      <div class="panel govuk-!-margin-bottom-9">
        <span class="govuk-caption-m">
          Timeline - where we are
        </span>
        <div
          ref="carrousel"
          class="carrousel"
        >
          <div
            v-for="(time, index) in timeline"
            :key="index"
          >
            <span class="govuk-caption-s color-middle">
              <span class="">{{ time.entry }}</span>
            </span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              <span class="">{{ time.dateString }}</span>
            </h2>
          </div>
          <div class="carrousel_arrows">
            <button
              :disabled="timelineSelected <= 0"
              @click="btnPrevious"
            >
              &lt;
            </button>
            <button
              :disabled="timelineSelected >= (timelineTotal - 1)"
              @click="btnNext"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="false"
      class="govuk-grid-column-full"
    >
      <h2 class="govuk-heading-l">
        Distribution of scores
      </h2>
    </div>
    <div
      v-if="false"
      class="govuk-grid-column-one-third  govuk-!-margin-bottom-9"
    >
      <div class="panel">
        <h3 class="govuk-heading-m">
          Qualifying Test
        </h3>
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
    <div
      v-if="false"
      class="govuk-grid-column-one-third  govuk-!-margin-bottom-9"
    >
      <div class="panel">
        <h3 class="govuk-heading-m">
          Scenario Test
        </h3>
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
    <div
      v-if="false"
      class="govuk-grid-column-one-third  govuk-!-margin-bottom-9"
    >
      <div class="panel">
        <h3 class="govuk-heading-m">
          Selection Day
        </h3>
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
      <h2 class="govuk-heading-l">
        Candidate Breakdown at Each Stage
      </h2>
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
      <Select
        id="diversityReport"
        v-model="diversityReport"
        required
      >
        <option
          v-for="type in diversityReportType"
          :key="type"
          :value="type"
        >
          {{ type }}
        </option>
      </Select>
      <GChart
        type="ComboChart"
        :data="chartData"
        :options="chartOptions"
      />
      <TabsList
        :tabs="tabs"
        :active-tab.sync="activeTab"
      />
      <Table
        data-key="id"
        :data="chartGender"
        :page-size="50"
        :columns="tableColumns"
        local-data
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
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import { lookup } from '@/filters';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { GChart } from 'vue-google-charts/legacy';
import { logEvent } from '@/helpers/logEvent';
import { authorisedToPerformAction }  from '@/helpers/authUsers';
import { isApproved, isProcessing, applicationCounts } from '@/helpers/exerciseHelper';
import { ADVERT_TYPES, EXERCISE_STAGE } from '@/helpers/constants';

export default {
  components: {
    ActionButton,
    GChart,
    TabsList,
    Table,
    TableCell,
    Select,
  },
  data() {
    return {
      tabs: [
        {
          ref: 'applied',
          title: 'Applied',
        },
        {
          ref: 'shortlisted',
          title: 'Shortlisted',
        },
        {
          ref: 'selected',
          title: 'Selected',
        },
        {
          ref: 'recommended',
          title: 'Recommended',
        },
        {
          ref: 'handover',
          title: 'Handover',
        },
      ],
      activeTab: 'applied',
      tableColumns: [
        { title: 'All gender', sort: 'name', direction: 'asc', default: true },
        { title: 'Status' },
      ],
      timelineSelected: 0,
      timelineTotal: 0,
      diversityReport: 'gender',
      report: null,
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
      return createTimeline(timeline);
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
    diversityReportType() {
      let dataTitles = [];
      if (this.report) {
        const dataApplied = this.report[EXERCISE_STAGE.APPLIED];
        const dataKeys = Object.keys(dataApplied);
        dataTitles = dataKeys.filter(item => item !== 'totalApplications');
      }
      return dataTitles;
    },
    chartData() {
      let dataTitles = [];
      let returnChart = [];
      if (this.report) {
        const dataApplied = this.report[EXERCISE_STAGE.APPLIED][this.diversityReport];
        const dataKeys = Object.keys(dataApplied);
        dataTitles = dataKeys.filter(item => item !== 'total');

        returnChart = [
          ['All', ...dataTitles],
          ['Applied', ...this.getDataTotal(EXERCISE_STAGE.APPLIED, dataTitles)],
          ['Shorlisted', ...this.getDataTotal(EXERCISE_STAGE.SHORTLISTED, dataTitles)],
          ['Selected', ...this.getDataTotal(EXERCISE_STAGE.SELECTED, dataTitles)],
          ['Recommended', ...this.getDataTotal(EXERCISE_STAGE.RECOMMENDED, dataTitles)],
          ['Handover', ...this.getDataTotal(EXERCISE_STAGE.HANDOVER, dataTitles)],
        ];
      }

      return returnChart;
    },
    chartOptions() {
      return {
        vAxis: { title: 'Applicant (number)' },
        seriesType: 'bars',
        // series: { 4: { type: 'line' } },
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

  watch: {
    diversityReport: function(val, oldval) {
      console.log('diversity reports changed', val, oldval);
      console.log('report', this.report);
    },
  },
  created() {
    console.log('created', this.exerciseId);
    this.unsubscribe = firestore.doc(`exercises/${this.exerciseId}/reports/diversity`)
      .onSnapshot((snap) => {
        if (snap.exists) {
          this.report = vuexfireSerialize(snap);
        }
      });
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  mounted() {
    this.carouselChooseItemToShow(this.timeline);
  },
  methods: {
    getDataTotal(stage, titles) {
      const dataApplied = this.report[stage][this.diversityReport];
      const dataTotal = titles.reduce((ret, val) => {
        ret.push(dataApplied[val].total);
        return ret;
      }, []);
      return dataTotal;
    },
    carouselChooseItemToShow(timeline) {
      // choose the firtst item to show
      let timeItemToShow = 0;
      if (timeline) {
        timeline.map((time, index) => {
          if (time.date <= Date.now()) {
            timeItemToShow = index;
          }
        });
      } else {
        timeItemToShow = 0;
      }
      this.timelineSelected = timeItemToShow;
      this.timelineTotal = this.timeline.length;
      this.carouselShowItem(this.timelineSelected);
    },
    carouselShowItem(id) {
      const carrouselRef = this.$refs.carrousel;
      this.carrouselClean(carrouselRef); // remove previous selected
      const carrouselRefSelected = carrouselRef.querySelectorAll('div')[id];
      carrouselRefSelected.classList.add('carrousel__item-visible');
    },
    carrouselClean(obj) {
      const carrouselNodes = obj.querySelectorAll('div');
      [...carrouselNodes].map(el => {
        el.classList.remove('carrousel__item-visible');
      });
    },
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
    btnNext() {
      console.log('next', this.timelineSelected);
      if (this.timelineSelected >= (this.timelineTotal - 1)) {
        this.timelineSelected = this.timelineTotal - 1;
      } else {
        this.timelineSelected = this.timelineSelected + 1;
        console.log('next val', this.timelineSelected);
      }
      this.carouselShowItem(this.timelineSelected);
    },
    btnPrevious() {
      console.log('previous', this.timelineSelected);
      if (this.timelineSelected <= 0) {
        this.timelineSelected = 0;
      } else {
        this.timelineSelected = this.timelineSelected - 1;
        console.log('previous val', this.timelineSelected);
      }
      this.carouselShowItem(this.timelineSelected);
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

.capitalize {
  text-transform: capitalize;
}

.carrousel {
  position: relative;
}

.carrousel div {
  display: none;
}
.carrousel .carrousel_arrows {
  display: block;
  position: absolute;
  bottom: 0;
  right: 0;
}
.carrousel div.carrousel__item-visible {
  display: block;
}
</style>
