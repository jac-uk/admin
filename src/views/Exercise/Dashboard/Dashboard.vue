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

    <div
      v-if="report"
      class="govuk-grid-column-two-thirds"
    >
      <h2 class="govuk-heading-l">
        Candidate Breakdown at Each Stage
      </h2>
    </div>

    <div
      v-if="report"
      class="govuk-grid-column-one-third govuk-!-text-align-right"
    >
      <button
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="exportData"
      >
        Export data
      </button>
      <ActionButton
        type="primary"
        :action="refreshReport"
      >
        Refresh
      </ActionButton>
    </div>

    <div
      v-if="report && showTabs"
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
          {{ $filters.lookup(type) }}
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
        v-model:active-tab="activeTab"
        :tabs="tabs"
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
            <Stat
              :stat="row.val"
              :is-declaration-total="row.name === 'Declaration Total'"
              :report-total="row.total"
            />
          </TableCell>
        </template>
      </Table>
      <p class="govuk-caption-s color-middle">
        <span class="">Diversity Report Last Updated: {{ $filters.formatDate(reportCreatedAt, 'datetime') }}</span>
      </p>
    </div>
    <div
      v-else
      class="govuk-grid-column-full"
    >
      <p class="govuk-body">
        Please refresh the report.
      </p>
    </div>
  </div>
</template>
<script>
import { httpsCallable } from '@firebase/functions';
import { onSnapshot, doc } from '@firebase/firestore';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import { lookup } from '@/filters';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { applicationCounts, availableStages } from '@/helpers/exerciseHelper';
//import { EXERCISE_STAGE } from '@/helpers/constants';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import router from '@/router';
//import QualifyingTest from './ScoresDistribution/QualifyingTest';
//import ScenarioTest from './ScoresDistribution/ScenarioTest';
//import SelectionDay from './ScoresDistribution/SelectionDay';
import TotalApplications from './OverviewPanels/TotalApplications.vue';
import NumberVacancies from './OverviewPanels/NumberVacancies.vue';
import SelectionExerciseManager from './OverviewPanels/SelectionExerciseManager.vue';
import TypeOfExercise from './OverviewPanels/TypeOfExercise.vue';
import Timeline from './OverviewPanels/Timeline.vue';
import AssignedCommissioner from './OverviewPanels/AssignedCommissioner.vue';
import _has from 'lodash/has';
import _map from 'lodash/map';
import _find from 'lodash/find';
import Chart from '@/components/Chart.vue';
import { getReports } from '@/reports';
import Stat from '@/components/Report/Stat.vue';
import { mapGetters } from 'vuex';
import { ADVERT_TYPES } from '@/helpers/constants';

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
    Stat,
  },
  data() {
    return {
      activeTab: '',
      timelineSelected: 0,
      timelineTotal: 0,
      selectedDiversityReportType: 'gender',
      report: null,
    };
  },
  computed: {
    ...mapGetters({
      applicationOpenDatePost01042023: 'exerciseDocument/applicationOpenDatePost01042023',
    }),
    tableColumns() {
      const totalCandidates = this.$filters.formatNumber(this.getTotalCandidates(this.selectedDiversityReportType, this.activeTab));
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
    availableStages() {
      return availableStages(this.exercise);
    },
    isAdvertTypeExternal() {
      return this.exercise && this.exercise.advertType === ADVERT_TYPES.EXTERNAL;
    },
    applicationOpenDate() {
      return this.exercise.applicationOpenDate;
    },
    applicationCounts() {
      return applicationCounts(this.exercise);
    },
    diversityReportType() {
      const types = [
        'gender',
        'ethnicity',
        'disability',
        'professionalBackground',
        'attendedUKStateSchool',
      ];
      if (this.applicationOpenDatePost01042023) {
        types.push('parentsNotAttendedUniversity');
      }
      else {
        types.push('firstGenerationUniversity');
      }
      types.push('emp');
      return types;
    },
    showTabs() {
      return this.report && this.availableStages?.length && this.report?.[this.availableStages[0]];  // check if report data is available
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
      return this.availableStages.map(stage => ({
        key: stage,
        title: this.$filters.lookup(stage),
      }));
    },
    legend() {
      if (this.selectedDiversityReportType) {
        // Add the count to the legend, so the items are numbered
        const items = getReports(this.applicationOpenDate, this.exercise.referenceNumber).ApplicationStageDiversity.legend[this.selectedDiversityReportType];
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
        const filteredLegend = this.legend.filter(o => !(this.ignoreKeys).includes(o.key));
        const legendKeys = filteredLegend.map(o => o.key);

        // Set the labels
        const labels = this.labels.map(o => o.title);
        returnChart.labels = labels;

        // Populate the data values for the selected diversity report
        for (const labelKey of labelKeys) {
          // check if the label exists in the report
          const element = this.report[labelKey] ? this.report[labelKey][this.selectedDiversityReportType] : null;
          if (element) {
            for (const legendKey of legendKeys) {
              if (!_has(dataValues, legendKey)) {
                dataValues[legendKey] = [];
              }
              let percentage = 0;
              if (_has(element[legendKey], 'percent')) {
                percentage = this.$filters.formatNumber(element[legendKey].percent, 2);
              }
              dataValues[legendKey].push(percentage);
            }
          }
        }
        // Set the datasets (background colour gets passed to the Chart component separately and merged into the data)
        for (const obj of filteredLegend) {
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
        const total = dataApplied.total;
        returnChart = this.getOrderedKeys(this.selectedDiversityReportType)
          .filter(item => !this.ignoreKeys.includes(item))
          .map(item => {
            const legendList = getReports(this.applicationOpenDate, this.exercise.referenceNumber).ApplicationStageDiversity.legend[this.selectedDiversityReportType];
            const legend = _find(legendList, o => {
              return o.key === item;
            });
            return { 'name': `${legend.title}`, 'val': dataApplied[item], total: null };
          });
        // Append declaration total
        returnChart.push({
          name: 'Declaration Total',
          val: dataApplied.declaration,
          total: total,
        });
      }
      return returnChart;
    },
    reportCreatedAt() {
      return this.report && this.report.createdAt;
    },
    ignoreKeys() {
      const ignoreKeys = ['genderNeutral', 'preferNotToSay', 'other', 'noAnswer'];
      if (this.selectedDiversityReportType === 'professionalBackground') {
        return ignoreKeys.filter((item) => {
          return item !== 'other';
        });
      }
      return ignoreKeys;
    },
  },
  watch: {
    availableStages: {
      immediate: true,
      handler() {
        if (this.availableStages.length && !this.activeTab && this.activeTab !== this.availableStages[0]) {
          this.activeTab = this.availableStages[0];
        }
      },
    },
  },
  created() {
    if (this.isAdvertTypeExternal) {
      router.push('externals');
      return;
    }

    if (this.applicationCounts._total) {
      this.unsubscribe = onSnapshot(
        doc(firestore, `exercises/${this.exerciseId}/reports/diversity`),
        (snap) => {
          if (snap.exists) {
            this.report = vuexfireSerialize(snap);
          }
        });
      if (this.$route.hash && this.$route.hash.slice(1)) {
        this.activeTab = this.$route.hash.slice(1);
      }
    } else {
      router.push('details');
    }
  },
  unmounted() {
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
      const list = getReports(this.applicationOpenDate, this.exercise.referenceNumber).ApplicationStageDiversity.legend[selectedDiversityReportType];
      return list.map(item => item.key);
    },
    async refreshReport() {
      try {
        if (this.applicationCounts._total) {
          await httpsCallable(functions, 'generateDiversityReport')({ exerciseId: this.exerciseId });
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
      const stages = this.availableStages;
      data.push(['Statistic'].concat(stages.map(s => this.$filters.lookup(s))));
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
