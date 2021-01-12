<template>
  <div>
    <!-- report header -->
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Outreach
          </h2>
          <span
            v-if="report"
            class="govuk-body govuk-!-font-size-14"
          >
            {{ report.createdAt | formatDate('longdatetime') }}
          </span>
        </div>
        <div
          class="moj-page-header-actions__actions float-right"
        >
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
                data-module="govuk-button"
                @click="exportData(activeTab)"
              >
                Export stage data
              </button>
              <button
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
                data-module="govuk-button"
                @click="exportData()"
              >
                Export all data
              </button>
              <button
                class="govuk-button moj-button-menu__item moj-page-header-actions__action"
                data-module="govuk-button"
                @click="refreshReport"
              >
                <span
                  v-if="refreshingReport"
                  class="spinner-border spinner-border-sm"
                /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="report"
        class="govuk-grid-row"
      >
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">
              Total applications
            </span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ report.totalApplications }}
            </h2>
          </div>
        </div>
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">Type of exercise</span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ exercise.typeOfExercise | lookup }}
            </h2>
          </div>
        </div>
      </div>
    </div>

    <!-- results -->
    <div
      v-if="report"
      class="govuk-grid-column-full"
    >
      <TabsList
        v-if="showTabs"
        class="print-none"
        :tabs="tabs"
        :active-tab.sync="activeTab"
      />

      <h3 class="govuk-heading-m">
        {{ activeTabTitle }}
      </h3>

      <p v-if="activeTab == 'summary'">
        Summary report coming soon
      </p>

      <div 
        v-else 
      >
        <table class="govuk-table table-with-border">
          <caption class="govuk-table__caption hidden">
            Oureach by exercise stage
          </caption>
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Answer
              </th>
              <th
                scope="col"
                class="govuk-table__header govuk-table__header--numeric"
              >
                Applications
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr 
              v-for="(answer, key, answerIndex) in reduceReport(report[activeTab].outreach)" 
              :key="answerIndex"
              class="govuk-table__row"
            >
              <th
                scope="col"
                class="govuk-table__header"
              >
                {{ key | lookup }}
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="answer" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Stat from '@/components/Report/Stat';

export default {
  components: {
    TabsList,
    Stat,
  },
  data() {
    return {
      report: null,
      refreshingReport: false,
      unsubscribe: null,
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
        {
          ref: 'summary',
          title: 'Summary',
        },
      ],
      activeTab: 'applied',
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    showTabs() {
      return this.report && this.report.shortlisted;  // .shortlisted indicates we have stages reports
    },
    activeTabTitle() {
      for (let i = 0, len = this.tabs.length; i < len; ++i) {
        if (this.tabs[i].ref === this.activeTab) {
          return this.tabs[i].title;
        }
      }
      return '';
    },
  },
  created() {
    this.unsubscribe = firestore.doc(`exercises/${this.exercise.id}/reports/outreach`)
      .onSnapshot((snap) => {
        this.report = vuexfireSerialize(snap);
      });
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async refreshReport() {
      this.refreshingReport = true;
      await functions.httpsCallable('generateOutreachReport')({ exerciseId: this.exercise.id });
      this.refreshingReport = false;
    },
    gatherReportData(stage) {
      const data = [];
      let stages = ['applied', 'shortlisted', 'selected', 'recommended', 'handover'];
      if (stage) {
        stages = [stage];
      }
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
    exportData(stage) {
      let title = 'Diversity Report';
      if (stage) {
        title = `${title} - ${stage}`;
      }

      const data = this.gatherReportData(stage);

      downloadXLSX(
        data,
        {
          title: `${this.exercise.referenceNumber} ${title}`,
          sheetName: title,
          fileName: `${this.exercise.referenceNumber} - ${title}.xlsx`,
        }
      );
    },
    reduceReport(obj) {
      const returnObj = {};
      let keys = Object.keys(obj);
      keys = keys.filter( item => !item.startsWith('total'));
      keys.map(item => {
        returnObj[item] = obj[item];
      });
      return returnObj;
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.govuk-table__header, .govuk-table__cell {
    vertical-align: middle;
}
</style>
