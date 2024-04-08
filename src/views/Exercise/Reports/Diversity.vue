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
            {{ $filters.formatDate(diversity.createdAt, 'longdatetime') }}
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
                :disabled="!showTabs"
                @click="exportData(activeTab)"
              >
                Export stage data
              </button>
              <button
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
                data-module="govuk-button"
                :disabled="!showTabs"
                @click="exportData()"
              >
                Export all data
              </button>
              <ActionButton
                v-if="hasPermissions([
                  PERMISSIONS.exercises.permissions.canReadExercises.value,
                  PERMISSIONS.applications.permissions.canReadApplications.value,
                  PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value
                ])"
                type="primary"
                :action="refreshReport"
              >
                Refresh
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="diversity && showTabs"
        class="govuk-grid-row"
      >
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">
              Total applications
            </span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ $filters.formatNumber(diversity.totalApplications) }}
            </h2>
          </div>
        </div>
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">Type of exercise</span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ $filters.lookup(exercise.typeOfExercise) }}
            </h2>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="govuk-body">
          Please refresh the report.
        </p>
      </div>
    </div>

    <!-- results -->
    <div
      v-if="diversity && showTabs"
      class="govuk-grid-column-full"
    >
      <Select
        id="tab-filter"
        v-model="activeTab"
        class="govuk-!-margin-right-2"
      >
        <option
          v-for="tab in tabs"
          :key="tab.ref"
          :value="tab.ref"
        >
          {{ tab.title }}
        </option>
      </Select>

      <h3 class="govuk-heading-m">
        {{ activeTabTitle }}
      </h3>

      <p v-if="activeTab == 'summary'">
        Summary report coming soon
      </p>

      <div v-else-if="diversity[activeTab]">
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
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].gender.declaration"
                  :report-total="diversity[activeTab].gender.total"
                  :is-declaration-total="true"
                />
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
                Ethnic minorities
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
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].ethnicity.declaration"
                  :report-total="diversity[activeTab].ethnicity.total"
                  :is-declaration-total="true"
                />
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
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].disability.declaration"
                  :report-total="diversity[activeTab].disability.total"
                  :is-declaration-total="true"
                />
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
                Other
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].professionalBackground.other" />
              </td>
            </tr>

            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].professionalBackground.declaration"
                  :report-total="diversity[activeTab].professionalBackground.total"
                  :is-declaration-total="true"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <table
          v-if="'attendedUKStateSchool' in diversity[activeTab]"
          class="govuk-table"
        >
          <caption class="govuk-table__caption hidden">
            Social mobility by selected stage
          </caption>
          <thead class="govuk-table__head">
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
              <th class="govuk-table__header">
                Attended UK state school
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].attendedUKStateSchool.attendedUKStateSchool" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].attendedUKStateSchool.declaration"
                  :report-total="diversity[activeTab].attendedUKStateSchool.total"
                  :is-declaration-total="true"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <template v-if="!applicationOpenDatePost01042023 && 'firstGenerationUniversity' in diversity[activeTab]">
          <table class="govuk-table">
            <caption class="govuk-table__caption hidden">
              Social mobility by selected stage
            </caption>
            <thead class="govuk-table__head">
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
                <th class="govuk-table__header">
                  First Generation University
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat :stat="diversity[activeTab].firstGenerationUniversity.firstGenerationUniversity" />
                </td>
              </tr>
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Declaration total
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat
                    :stat="diversity[activeTab].firstGenerationUniversity.declaration"
                    :report-total="diversity[activeTab].firstGenerationUniversity.total"
                    :is-declaration-total="true"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="applicationOpenDatePost01042023 && 'parentsNotAttendedUniversity' in diversity[activeTab]">
          <table class="govuk-table">
            <caption class="govuk-table__caption hidden">
              Social mobility by selected stage
            </caption>
            <thead class="govuk-table__head">
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
                <th class="govuk-table__header">
                  Parents did not attend University
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat :stat="diversity[activeTab].parentsNotAttendedUniversity.parentsNotAttendedUniversity" />
                </td>
              </tr>
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Declaration total
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat
                    :stat="diversity[activeTab].parentsNotAttendedUniversity.declaration"
                    :report-total="diversity[activeTab].parentsNotAttendedUniversity.total"
                    :is-declaration-total="true"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </template>

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
                EMP status
              </th>
              <th
                scope="col"
                class="govuk-table__header govuk-table__header--numeric"
              >
                Applications
              </th>
            </tr>
          </thead>
          <tbody
            v-if="diversity[activeTab].emp"
            class="govuk-table__body"
          >
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                EMP applied
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].emp.applied" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                EMP applied on basis of ethnicity
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].emp.ethnicity" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                EMP applied on basis of gender
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].emp.gender" />
              </td>
            </tr>
            <!-- <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].emp.declaration"
                  :report-total="diversity[activeTab].emp.total"
                />
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { onSnapshot, doc } from '@firebase/firestore';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import Stat from '@/components/Report/Stat.vue';
import permissionMixin from '@/permissionMixin';
import { mapGetters } from 'vuex';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { availableStages, getTaskTypes } from '@/helpers/exerciseHelper';
import { EXERCISE_STAGE, APPLICATION_STATUS, TASK_TYPE } from '@/helpers/constants';

export default {
  name: 'Diversity',
  components: {
    Select,
    Stat,
    ActionButton,
  },
  mixins: [permissionMixin],
  data() {
    return {
      diversity: null,
      unsubscribe: null,
      activeTab: '',
    };
  },
  computed: {
    ...mapGetters({
      applicationOpenDatePost01042023: 'exerciseDocument/applicationOpenDatePost01042023',
    }),
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isProcessingVersion2() {
      return this.exercise._processingVersion >= 2;
    },
    availableStages() {
      return availableStages(this.exercise);
    },
    tabs() {
      const stages = this.availableStages.filter(stage => ![EXERCISE_STAGE.SHORTLISTED, EXERCISE_STAGE.SELECTION].includes(stage));
      const tabs = stages.map((stage) => {
        const tab = {};
        tab.ref = stage;
        switch (stage) {
        case EXERCISE_STAGE.SHORTLISTING:
        case EXERCISE_STAGE.REVIEW:
          tab.title = 'Applied';
          break;
        case EXERCISE_STAGE.SELECTION:
          tab.title = 'Shortlisted';
          break;
        case EXERCISE_STAGE.SCC:
          tab.title = 'Passed SD';
          break;
        case EXERCISE_STAGE.RECOMMENDATION:
          tab.title = 'Recommended to JO';
          break;
        default:
          tab.title = this.$filters.lookup(stage);
        }
        return tab;
      });
      tabs.push({
        ref: 'summary',
        title: 'Summary',
      });

      // add additional tabs based on shortlisting methods
      const additionalTabs = this.additionalTabs.map(ref => ({ ref, title: this.$filters.lookup(ref) }));
      return [tabs[0], ...additionalTabs, ...tabs.slice(1)];
    },
    additionalTabs() {
      const taskTypes = getTaskTypes(this.exercise);
      const tabs = [];
      // qt
      if (taskTypes.some(method => [TASK_TYPE.CRITICAL_ANALYSIS, TASK_TYPE.SITUATIONAL_JUDGEMENT].includes(method))) {
        const ref = this.isProcessingVersion2 ? APPLICATION_STATUS.QUALIFYING_TEST_PASSED : APPLICATION_STATUS.PASSED_FIRST_TEST;
        tabs.push(ref);
      }
      // scenario test
      if (taskTypes.includes(TASK_TYPE.SCENARIO)) {
        const ref = this.isProcessingVersion2 ? APPLICATION_STATUS.SCENARIO_TEST_PASSED : APPLICATION_STATUS.PASSED_SCENARIO_TEST;
        tabs.push(ref);
      }
      // sift
      if (taskTypes.includes(TASK_TYPE.SIFT)) {
        const ref = this.isProcessingVersion2 ? APPLICATION_STATUS.SIFT_PASSED : APPLICATION_STATUS.PASSED_SIFT;
        tabs.push(ref);
      }

      return tabs;
    },
    showTabs() {
      return this.diversity && this.availableStages?.length && this.diversity?.[this.availableStages[0]];  // check if report data is available
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
    if (this.$route.hash && this.$route.hash.slice(1)) {
      this.activeTab = this.$route.hash.slice(1);
    }

    this.unsubscribe = onSnapshot(
      doc(firestore, `exercises/${this.exercise.id}/reports/diversity`),
      (snap) => {
        if (snap.exists) {
          this.diversity = vuexfireSerialize(snap);
        }
      });
  },
  unmounted() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async refreshReport() {
      try {
        return await httpsCallable(functions, 'generateDiversityReport')({ exerciseId: this.exercise.id });
      } catch (error) {
        return;
      }
    },
    gatherReportData(stage) {
      const data = [];
      let stageItems = this.tabs.slice(0, -1); // exclude summary tab
      if (stage) {
        stageItems = this.tabs.filter(tab => tab.ref === stage);
      }
      data.push(['Statistic'].concat(stageItems.map(item => item.title)));
      Object.keys(this.diversity.applied).forEach((report) => {
        Object.keys(this.diversity.applied[report]).forEach((stat) => {
          const columns = [];
          if (stat === 'bame') {
            columns.push(`${report}:ethnic minorities`);
          } else {
            columns.push(`${report}:${stat}`);
          }
          stageItems.forEach((item) => {
            const stage = item.ref;
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
