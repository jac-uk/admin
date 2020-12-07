<template>
  <div>
    <!-- diversity header -->
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Diversity
          </h2>
          <span
            v-if="diversity"
            class="govuk-body govuk-!-font-size-14"
          >
            {{ diversity.createdAt | formatDate('longdatetime') }}
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
        v-if="diversity"
        class="govuk-grid-row"
      >
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">
              Total applications
            </span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ diversity.totalApplications }}
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
      v-if="diversity"
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

      <div v-else>
        <table class="govuk-table table-with-border">
          <caption class="govuk-table__caption hidden">
            Gender by exercise stage
          </caption>
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Gender
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
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Male
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].gender.male" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Female
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].gender.female" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Gender Neutral
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].gender.genderNeutral" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Prefer not to say
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].gender.preferNotToSay" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Other
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].gender.other" />
              </td>
            </tr>
          </tbody>
        </table>

        <table class="govuk-table">
          <caption class="govuk-table__caption hidden">
            Ethnicity by exercise stage
          </caption>
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Ethnicity
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
            <tr class="govuk-table__row">
              <th
                scope="row"
                class="govuk-table__header"
              >
                BAME
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].ethnicity.bame" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="row"
                class="govuk-table__header"
              >
                White
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].ethnicity.white" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="row"
                class="govuk-table__header"
              >
                Prefer not to say
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].ethnicity.preferNotToSay" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="row"
                class="govuk-table__header"
              >
                Other
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].ethnicity.other" />
              </td>
            </tr>
          </tbody>
        </table>

        <table class="govuk-table">
          <caption class="govuk-table__caption hidden">
            Disability by exercise stage
          </caption>
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Disability
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
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Yes
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].disability.yes" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                No
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].disability.no" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Prefer not to say
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].disability.preferNotToSay" />
              </td>
            </tr>
          </tbody>
        </table>

        <table class="govuk-table">
          <caption class="govuk-table__caption hidden">
            Professional background by exercise stage
          </caption>
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Professional background
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
            <tr class="govuk-table__row">
              <th
                scope="row"
                class="govuk-table__header"
              >
                Barrister
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].professionalBackground.barrister" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                CILEx
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].professionalBackground.cilex" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Solicitor
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].professionalBackground.solicitor" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Prefer not to say
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].professionalBackground.preferNotToSay" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Other
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].professionalBackground.other" />
              </td>
            </tr>
          </tbody>
        </table>

        <table class="govuk-table">
          <caption class="govuk-table__caption hidden">
            Social mobility by selected stage
          </caption>
          <thead class="govuk-table__header">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Social mobility
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
            <tr class="govuk-table__row">
              <th
                scope="row"
                class="govuk-table__header"
              >
                Attended UK state school
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].socialMobility.attendedUKStateSchool" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="row"
                class="govuk-table__header"
              >
                First generation to attend University
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].socialMobility.firstGenerationUniversity" />
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
      diversity: null,
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
      return this.diversity && this.diversity.shortlisted;  // .shortlisted indicates we have stages reports
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
    this.unsubscribe = firestore.doc(`exercises/${this.exercise.id}/reports/diversity`)
      .onSnapshot((snap) => {
        this.diversity = vuexfireSerialize(snap);
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
      await functions.httpsCallable('generateDiversityReport')({ exerciseId: this.exercise.id });
      this.refreshingReport = false;
    },
    gatherReportData(stage) {
      const data = [];
      let stages = ['applied', 'shortlisted', 'selected', 'recommended', 'handover'];
      if (stage) {
        stages = [stage];
      }
      data.push(['Statistic'].concat(stages));
      Object.keys(this.diversity.applied).forEach((report) => {
        Object.keys(this.diversity.applied[report]).forEach((stat) => {
          const columns = [];
          columns.push(`${report}:${stat}`);
          stages.forEach((stage) => {
            if (stat === 'total') {
              columns.push(this.diversity[stage][report][stat]);
            } else {
              columns.push(this.diversity[stage][report][stat].total);
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
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.govuk-table__header, .govuk-table__cell {
    vertical-align: middle;
}
</style>
