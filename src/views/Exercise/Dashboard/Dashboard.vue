<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <h2 class="govuk-heading-l">
        Overview
      </h2>
    </div>

    <div class="govuk-grid-column-one-half">
      <TotalApplications />
      <NumberVacancies />
      <SelectionExerciseManager />
    </div>

    <div class="govuk-grid-column-one-half">
      <TypeOfExercise />
      <Timeline />
      <AssignedCommissioner />
    </div>

    <!--
    <div
      class="govuk-grid-column-full"
    >
      <h2 class="govuk-heading-l">
        Distribution of scores
      </h2>
    </div>

    <QualifyingTest />
    <ScenarioTest />
    <SelectionDay />
    -->

    <div class="govuk-grid-column-two-thirds">
      <h2 class="govuk-heading-l">
        Candidate Breakdown at Each Stage
      </h2>
    </div>

    <div class="govuk-grid-column-one-third govuk-!-text-align-right">
      <button
        v-if="report"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="exportData"
      >
        Export data
      </button>
      <ActionButton
        v-if="report"
        type="primary"
        @click="refreshReport"
      >
        Refresh
      </ActionButton>
    </div>

    <div
      v-if="report"
      class="govuk-grid-column-full"
    >
      <Select
        id="diversityReport"
        v-model="selectedDiversityReportType"
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
      <Chart
        chart-id="app-stage-diversity-chart"
        chart-type="Bar"
        :chart-data="chartData"
        :chart-options="chartOptions"
        :make-accessible="true"
        :display-patterned-labels="true"
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
          <TableCell
            :title="tableColumns[0].title"
            class="long-text"
          >
            {{ row.name }}
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.val.percent | formatNumber(2) }}% ({{ row.val.total | formatNumber }})
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
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import { lookup } from '@/filters';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { applicationCounts } from '@/helpers/exerciseHelper';
//import { EXERCISE_STAGE } from '@/helpers/constants';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import router from '@/router';
//import QualifyingTest from './ScoresDistribution/QualifyingTest';
//import ScenarioTest from './ScoresDistribution/ScenarioTest';
//import SelectionDay from './ScoresDistribution/SelectionDay';
import TotalApplications from './OverviewPanels/TotalApplications';
import NumberVacancies from './OverviewPanels/NumberVacancies';
import SelectionExerciseManager from './OverviewPanels/SelectionExerciseManager';
import TypeOfExercise from './OverviewPanels/TypeOfExercise';
import Timeline from './OverviewPanels/Timeline';
import AssignedCommissioner from './OverviewPanels/AssignedCommissioner';
import _has from 'lodash/has';
import _map from 'lodash/map';
import _find from 'lodash/find';
import Chart from '@/components/Chart';
import { getReports } from '@/reports';
export default {
  name: 'Dashboard',
  components: {
    ActionButton,
    TabsList,
    Table,
    TableCell,
    Select,
    //QualifyingTest,
    //ScenarioTest,
    //SelectionDay,
    TotalApplications,
    NumberVacancies,
    SelectionExerciseManager,
    TypeOfExercise,
    Timeline,
    AssignedCommissioner,
    Chart,
  },
  data() {
    return {
      activeTab: 'applied',
      timelineSelected: 0,
      timelineTotal: 0,
      selectedDiversityReportType: 'gender',
      report: null,
    };
  },
  computed: {
    tableColumns() {
      const totalCandidates = this.$options.filters.formatNumber(this.getTotalCandidates(this.selectedDiversityReportType, this.activeTab));
      return [
        { title: `${lookup(this.selectedDiversityReportType)} (${lookup(this.activeTab)} ${totalCandidates} candidates)` },
        { title: 'Percentage (Total)' },
      ];
    },
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    applicationOpenDate() {
      return this.exercise.applicationOpenDate;
    },
    applicationCounts() {
      return applicationCounts(this.exercise);
    },
    diversityReportType() {
      return [
        'gender',
        'ethnicity',
        'disability',
        'professionalBackground',
        'socialMobility',
        'emp',
      ];
    },
    tabs() {
      return _map(this.labels, item => {
        return {
          ref: item.key,
          title: item.title,
        };
      });
    },
    labels() {
      return getReports(this.applicationOpenDate).ApplicationStageDiversity.labels;
    },
    legend() {
      if (this.selectedDiversityReportType) {
        // Add the count to the legend, so the items are numbered
        const items = getReports(this.applicationOpenDate).ApplicationStageDiversity.legend[this.selectedDiversityReportType];
        let count = 0;
        return _map(items, item => {
          ++count;
          const updatedTitle = `${count}. ${item.title}`;
          return {
            key: item.key,
            title: updatedTitle,
          };
        });
      }
      return [];
    },
    chartData() {
      const returnChart = {
        labels: [],
        datasets: [],
      };
      if (this.selectedDiversityReportType && this.labels) {
        const dataValues = {};
        // Get the top level and second level key mappings from the report
        const labelKeys = this.labels.map(o => o.key);
        const legendKeys = this.legend.map(o => o.key);
        // Set the labels
        const labels = this.labels.map(o => o.title);
        returnChart.labels = labels;
        // Populate the data values for the selected diversity report
        for (const labelKey of labelKeys) {
          const element = this.report[labelKey][this.selectedDiversityReportType];
          for (const legendKey of legendKeys) {
            if (!_has(dataValues, legendKey)) {
              dataValues[legendKey] = [];
            }
            let percentage = 0;
            if (_has(element[legendKey], 'percent')) {
              percentage = this.$options.filters.formatNumber(element[legendKey].percent, 2);
            }
            dataValues[legendKey].push(percentage);
          }
        }
        // Set the datasets (background colour gets passed to the Chart component separately and merged into the data)
        for (const obj of this.legend) {
          returnChart.datasets.push({
            label: obj.title,
            data: dataValues[obj.key],
          });
        }
      }
      return returnChart;
    },
    chartOptions() {
      return {
        animation: false, // Ensures the chart appears immediately
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {  // Add a % sign after each label in the tooltip
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += `${context.parsed.y}%`;
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
            },
            grid: {
              display: false,
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Applicant %',
            },
          },
        },
      };
    },
    chartDetail () {
      let returnChart = [];
      if (this.report) {
        const dataApplied = this.report[this.activeTab][this.selectedDiversityReportType];
        returnChart = this.getOrderedKeys(this.selectedDiversityReportType).map(item => {
          const legendList = getReports(this.applicationOpenDate).ApplicationStageDiversity.legend[this.selectedDiversityReportType];
          const legend = _find(legendList, o => {
            return o.key === item;
          });
          return { 'name': `${legend.title}`, 'val': dataApplied[item] };
        });
      }
      return returnChart;
    },
    reportCreatedAt() {
      return this.report && this.report.createdAt;
    },
  },
  created() {
    if (this.applicationCounts._total) {
      this.unsubscribe = firestore.doc(`exercises/${this.exerciseId}/reports/diversity`)
        .onSnapshot((snap) => {
          if (snap.exists) {
            this.report = vuexfireSerialize(snap);
          }
        });
    } else {
      router.push('details');
    }
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    getTotalCandidates(diversity, tab) {
      if (this.report) {
        const dataApplied = this.report[tab][diversity];
        return dataApplied.total;
      }
    },
    getOrderedKeys(selectedDiversityReportType) {
      const list = getReports(this.applicationOpenDate).ApplicationStageDiversity.legend[selectedDiversityReportType];
      return list.map(item => item.key);
    },
    async refreshReport() {
      try {
        if (this.applicationCounts._total) {
          await functions.httpsCallable('generateDiversityReport')({ exerciseId: this.exerciseId });
        }
        return true;
      } catch (error) {
        return;
      }
    },
    getDataTotal(stage, titles) {
      const dataApplied = this.report[stage][this.selectedDiversityReportType];
      const dataTotal = titles.reduce((ret, val) => {
        ret.push(dataApplied[val].percent); //total
        return ret;
      }, []);
      return dataTotal;
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
.long-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.long-text-margin {
  margin-right: 50px;
}
.vh {
  visibility: hidden;
}

</style>
