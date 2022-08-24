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
        class="govuk-!-margin-right-3"
        @click="exportData()"
      >
        Export Data
      </ActionButton>
      <button
        class="govuk-button govuk-!-margin-right-3"
        @click="refreshReport"
      >
        <span
          v-if="refreshingReport"
          class="spinner-border spinner-border-sm"
        />
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
          {{ type | lookup }}
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
        :data="chartDetail"
        :page-size="50"
        :columns="tableColumns"
        local-data
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            {{ row.name | lookup }}
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.val.total }} ({{ row.val.percent | formatNumber(2) }}%)
          </TableCell>
        </template>
      </Table>
      <p class="govuk-caption-s color-middle">
        <span class="">Diversity Report Last Updated: {{ reportCreatedAt | formatDate('datetime') }}</span>
      </p>
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
import { applicationCounts } from '@/helpers/exerciseHelper';
import { EXERCISE_STAGE } from '@/helpers/constants';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';

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
      timelineSelected: 0,
      timelineTotal: 0,
      diversityReport: 'gender',
      report: null,
      refreshingReport: false,
    };
  },
  computed: {
    tableColumns() {
      return [
        { title: `${lookup(this.diversityReport)} (${lookup(this.activeTab)})` },
        { title: 'Total (Percentage)' },
      ];
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
    timeline() {
      const timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline);
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
        const dataKeys = Object.keys(dataApplied).filter(item => item !== 'total');
        dataTitles = dataKeys.reduce((ret, item) => {
          if (item !== 'total') {
            ret.push(lookup(item));
          }
          return ret;
        }, []);

        returnChart = [
          ['All', ...dataTitles],
          ['Applied', ...this.getDataTotal(EXERCISE_STAGE.APPLIED, dataKeys)],
          ['Shorlisted', ...this.getDataTotal(EXERCISE_STAGE.SHORTLISTED, dataKeys)],
          ['Selected', ...this.getDataTotal(EXERCISE_STAGE.SELECTED, dataKeys)],
          ['Recommended', ...this.getDataTotal(EXERCISE_STAGE.RECOMMENDED, dataKeys)],
          ['Handover', ...this.getDataTotal(EXERCISE_STAGE.HANDOVER, dataKeys)],
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
    chartDetail () {
      // this.activeTab
      let returnChart = [];
      if (this.report) {
        const dataApplied = this.report[this.activeTab][this.diversityReport];
        returnChart = Object.keys(dataApplied).reduce((ret, item) => {
          if (item !== 'total') {
            ret.push({ 'name': item, 'val': dataApplied[item] });
          }
          return ret;
        }, []);
      }
      return returnChart;
    },
    reportCreatedAt() {
      return this.report && this.report.createdAt;
    },
  },
  created() {
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
    async refreshReport() {
      this.refreshingReport = true;
      await functions.httpsCallable('generateDiversityReport')({ exerciseId: this.exerciseId });
      this.refreshingReport = false;
    },
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
    btnNext() {
      if (this.timelineSelected >= (this.timelineTotal - 1)) {
        this.timelineSelected = this.timelineTotal - 1;
      } else {
        this.timelineSelected = this.timelineSelected + 1;
      }
      this.carouselShowItem(this.timelineSelected);
    },
    btnPrevious() {
      if (this.timelineSelected <= 0) {
        this.timelineSelected = 0;
      } else {
        this.timelineSelected = this.timelineSelected - 1;
      }
      this.carouselShowItem(this.timelineSelected);
    },
    gatherReportData() {
      const data = [];
      const stages = ['applied', 'shortlisted', 'selected', 'recommended', 'handover'];
      data.push(['Statistic'].concat(stages));
      Object.keys(this.report.applied).forEach((report) => {
        Object.keys(this.report.applied[report]).forEach((stat) => {
          const columns = [];
          columns.push(`${report}:${stat}`);
          stages.forEach((stage) => {
            if (stat === 'total') {
              columns.push(this.report[stage][report][stat]);
            } else {
              columns.push(this.report[stage][report][stat].total);
            }
          });
          data.push(columns);
        });
      });
      return data;
    },
    exportData() {
      const title = 'Diversity Report';
      const data = this.gatherReportData();

      downloadXLSX(
        data,
        {
          title: `${this.exercise.referenceNumber} ${title}`,
          sheetName: title,
          fileName: `${this.exercise.referenceNumber} - ${title}.xlsx`,
        }
      );
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
