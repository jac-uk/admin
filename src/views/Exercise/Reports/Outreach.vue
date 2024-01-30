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
            {{ $filters.formatDate(report.createdAt, 'longdatetime') }}
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
        v-if="report"
        class="govuk-grid-row"
      >
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">
              Total applications
            </span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ $filters.formatNumber(report.totalApplications) }}
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
    </div>

    <!-- results -->
    <div
      v-if="report"
      class="govuk-grid-column-full"
    >
      <TabsList
        v-if="showTabs"
        v-model:active-tab="activeTab"
        :tabs="tabs"
        class="print-none"
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
        <table
          v-if="('outreach' in report[activeTab])"
          class="govuk-table"
        >
          <caption class="govuk-table__caption hidden">
            Outreach by exercise stage
          </caption>
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                How did you hear about the vacancy?
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
              v-for="item in reportKeys"
              :key="item"
              class="govuk-table__row"
            >
              <th class="govuk-table__header">
                {{ $filters.lookup(item) }}
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="report[activeTab].outreach[item]" />
              </td>
            </tr>

            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="report[activeTab].outreach.declaration"
                  :report-total="report[activeTab].outreach.total"
                  :is-declaration-total="true"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <table
          v-if="('attended' in report[activeTab])"
          class="govuk-table"
        >
          <caption class="govuk-table__caption hidden">
            Attended outreach events by exercise stage
          </caption>
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Attended outreach events
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
                <Stat :stat="report[activeTab].attended.yes" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                No
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="report[activeTab].attended.no" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="report[activeTab].attended.declaration"
                  :report-total="report[activeTab].attended.total"
                  :is-declaration-total="true"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <template v-if="isLegal">
          <table
            v-if="('workshadowing' in report[activeTab])"
            class="govuk-table"
          >
            <caption class="govuk-table__caption hidden">
              Participated in judicial workshadowing scheme by exercise stage
            </caption>
            <thead class="govuk-table__head">
              <tr class="govuk-table__row">
                <th
                  scope="col"
                  class="govuk-table__header"
                >
                  Participated In Judicial Workshadowing Scheme
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
                  <Stat :stat="report[activeTab].workshadowing.yes" />
                </td>
              </tr>
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  No
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat :stat="report[activeTab].workshadowing.no" />
                </td>
              </tr>
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Declaration total
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat
                    :stat="report[activeTab].workshadowing.declaration"
                    :report-total="report[activeTab].workshadowing.total"
                    :is-declaration-total="true"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <table
            v-if="('hasTakenPAJE' in report[activeTab])"
            class="govuk-table"
          >
            <caption class="govuk-table__caption hidden">
              Has taken PAJE by exercise stage
            </caption>
            <thead class="govuk-table__head">
              <tr class="govuk-table__row">
                <th
                  scope="col"
                  class="govuk-table__header"
                >
                  Has taken PAJE
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
                  <Stat :stat="report[activeTab].hasTakenPAJE.yes" />
                </td>
              </tr>

              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Online only
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat :stat="report[activeTab].hasTakenPAJE['online-only']" />
                </td>
              </tr>
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Online and judge-led
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat :stat="report[activeTab].hasTakenPAJE['online-and-judge-led']" />
                </td>
              </tr>
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  No
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat :stat="report[activeTab].hasTakenPAJE.no" />
                </td>
              </tr>
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Declaration total
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat
                    :stat="report[activeTab].hasTakenPAJE.declaration"
                    :report-total="report[activeTab].hasTakenPAJE.total"
                    :is-declaration-total="true"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </template>
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
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import Stat from '@/components/Report/Stat.vue';
import permissionMixin from '@/permissionMixin';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { isLegal } from '@/helpers/exerciseHelper';

export default {
  name: 'Outreach',
  components: {
    TabsList,
    Stat,
    ActionButton,
  },
  mixins: [permissionMixin],
  data() {
    return {
      report: null,
      unsubscribe: null,
      activeTab: 'applied',
      reportKeys: [
        'jac-website',
        'professional-body-website-or-email',
        'professional-body-magazine',
        'judicial-office-extranet',
        'judging-your-future-newsletter',
        'twitter',
        'linked-in',
        'word-of-mouth',
        'other',
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    tabs() {
      const tabs = [
        {
          ref: 'applied',
          title: 'Applied',
        },
        {
          ref: 'shortlisted',
          title: 'Shortlisted',
        },
      ];

      if (this.exercise?._processingVersion >= 2) {
        tabs.push({
          ref: 'selectable',
          title: 'Selectable',
        });
      } else {
        tabs.push({
          ref: 'selected',
          title: 'Selected',
        });
      }

      tabs.push(
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
        }
      );
      return tabs;
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
    isLegal() {
      return isLegal(this.exercise);
    },
  },
  created() {
    this.unsubscribe = onSnapshot(
      doc(firestore, `exercises/${this.exercise.id}/reports/outreach`),
      (snap) => {
        if (snap.exists) {
          this.report = vuexfireSerialize(snap);
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
        return await httpsCallable(functions, 'generateOutreachReport')({ exerciseId: this.exercise.id });
      } catch (error) {
        return;
      }
    },
    gatherReportData(stage) {
      const data = [];
      let stages = [
        'applied',
        'shortlisted',
        this.exercise?._processingVersion >= 2 ? 'selectable' : 'selected',
        'recommended',
        'handover',
      ];
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
      let title = 'Outreach Report';
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
