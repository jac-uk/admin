<template>
  <div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
      <h2 class="govuk-heading-m">
        Qualifying Test Report
      </h2>
      <h3
        class="govuk-heading-l govuk-!-margin-bottom-0"
        @click="gotoView()"
      >
        {{ qualifyingTestReport.title }}
      </h3>
      <span
        class="govuk-body govuk-!-font-size-14"
      >
        {{ qualifyingTestReport.lastUpdated | formatDate('longdatetime') }}
      </span>

      <div
        class="govuk-grid-row govuk-!-margin-top-4 govuk-!-margin-bottom-4"
      >
        <div
          class="govuk-grid-column-one-half"
        >
          <div
            class="background-light-grey govuk-!-padding-4"
          >
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-one-third">
                <h2 class="govuk-heading-l">
                  <span class="govuk-caption-m">Score<br></span>
                  {{ score }}
                </h2>
              </div>
              <div class="govuk-grid-column-one-third text-center">
                <h2 class="govuk-heading-l">
                  <span class="govuk-caption-m">Rank<br></span>
                  {{ scoreReport.rank }}
                </h2>
              </div>
              <div class="govuk-grid-column-one-third text-right">
                <h2 class="govuk-heading-l">
                  <span class="govuk-caption-m">Count<br></span>
                  {{ scoreReport.count }}
                </h2>
              </div>
            </div>

            <div class="govuk-grid-row">
              <div class="govuk-grid-column-one-half">
                <span class="govuk-caption-m">Female<br></span>
                <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * scoreReport.diversity.female / scoreReport.count | formatNumber(2) }}%</span>
                <span class="govuk-caption-m">BAME<br></span>
                <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * scoreReport.diversity.bame / scoreReport.count | formatNumber(2) }}%</span>
              </div>
              <div class="govuk-grid-column-one-half">
                <span class="govuk-caption-m">Solicitor<br></span>
                <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * scoreReport.diversity.solicitor / scoreReport.count | formatNumber(2) }}%</span>
                <span class="govuk-caption-m">Disability<br></span>
                <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * scoreReport.diversity.disability / scoreReport.count | formatNumber(2) }}%</span>
              </div>
            </div>
          </div>

          <div class="govuk-!-margin-bottom-3">
            <ul class="moj-pagination__list">
              <li
                class="moj-pagination__item  moj-pagination__item--prev"
              >
                <RouterLink
                  :to="{ name: 'qualifying-test-report-view-score', params: { qualifyingTestReportId: qualifyingTestReportId, score: score-1 } }"
                  class="moj-pagination__link govuk-link"
                >
                  Lower score
                </RouterLink>
              </li>
              <li
                v-if="aboveScoreReport"
                class="moj-pagination__item  moj-pagination__item--next"
              >
                <RouterLink
                  :to="{ name: 'qualifying-test-report-view-score', params: { qualifyingTestReportId: qualifyingTestReportId, score: score+1 } }"
                  class="moj-pagination__link govuk-link"
                >
                  Higher score
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <div
          v-if="aboveScoreReport"
          class="govuk-grid-column-one-half"
        >
          <div
            class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
          >
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-two-thirds">
                <h2 class="govuk-heading-l">
                  <span class="govuk-caption-m">Score<br></span>
                  {{ score + 1 }} and above
                </h2>
              </div>
              <div class="govuk-grid-column-one-third text-right">
                <h2 class="govuk-heading-l">
                  <span class="govuk-caption-m">Count<br></span>
                  {{ scoreReport.rank - 1 }}
                </h2>
              </div>
            </div>

            <div class="govuk-grid-row">
              <div class="govuk-grid-column-one-half">
                <span class="govuk-caption-m">Female<br></span>
                <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * aboveScoreReport.cumulativeDiversity.female / (scoreReport.rank - 1) | formatNumber(2) }}%</span>
                <span class="govuk-caption-m">BAME<br></span>
                <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * aboveScoreReport.cumulativeDiversity.bame / (scoreReport.rank - 1) | formatNumber(2) }}%</span>
              </div>
              <div class="govuk-grid-column-one-half">
                <span class="govuk-caption-m">Solicitor<br></span>
                <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * aboveScoreReport.cumulativeDiversity.solicitor / (scoreReport.rank - 1) | formatNumber(2) }}%</span>
                <span class="govuk-caption-m">Disability<br></span>
                <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * aboveScoreReport.cumulativeDiversity.disability / (scoreReport.rank - 1) | formatNumber(2) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__actions">
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button
                class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                :disabled="true"
              >
                Set status
              </button>
            </div>
          </div>
        </div>
      </div>

      <Table
        v-if="scoreData"
        data-key="id"
        :data="scoreData"
        :columns="columns"
        multi-select
        :selection.sync="selectedItems"
      >
        <template #row="{row}">
          <TableCell :title="columns[0].title">
            {{ row.application.referenceNumber }}
          </TableCell>
          <TableCell
            v-for="test in qualifyingTestReport.qualifyingTests"
            :key="test.id"
            :title="columns[1].title"
          >
            {{ row.qualifyingTests[test.id].score }}
          </TableCell>
          <TableCell :title="columns[2].title">
            {{ row.diversity.female | toYesNo }}
          </TableCell>
          <TableCell :title="columns[3].title">
            {{ row.diversity.bame | toYesNo }}
          </TableCell>
          <TableCell :title="columns[4].title">
            {{ row.diversity.solicitor | toYesNo }}
          </TableCell>
          <TableCell :title="columns[5].title">
            {{ row.diversity.disability | toYesNo }}
          </TableCell>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';

export default {
  components: {
    Table,
    TableCell,
  },
  data() {
    return {
      selectedItems: [],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    qualifyingTestReportId() {
      return this.$route.params.qualifyingTestReportId;
    },
    qualifyingTestReport() {
      return this.$store.getters['qualifyingTestReport/data'];
    },
    score() {
      return this.$route.params.score;
    },
    scoreData() {
      const data = this.qualifyingTestReport.rawData.filter(row => row.score === this.score).map(row => {
        row.id = row.application.id;
        return row;
      });
      return data;
    },
    scoreReport() {
      const report = this.qualifyingTestReport.report.filter(row => row.score === this.score)[0];
      return report;
    },
    aboveScoreReport() {
      const report = this.qualifyingTestReport.report.filter(row => row.score === this.score + 1)[0];
      return report;
    },
    columns() {
      const data = [];
      data.push({ title: 'Application' });
      this.qualifyingTestReport.qualifyingTests.forEach(test => {
        data.push({ title: test.title });
      });
      data.push({ title: 'Female' });
      data.push({ title: 'BAME' });
      data.push({ title: 'Solicitor' });
      data.push({ title: 'Disability' });
      return data;
    },
  },
  methods: {
    gotoView() {
      this.$router.push({ name: 'qualifying-test-report-view', params: { qualifyingTestReportId: this.qualifyingTestReportId } });
    },
    checkForm() {
      // console.log('save selection');
    },
  },
};
</script>
