<template>
  <div class="govuk-grid-column-full">
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Agency
        </h2>
      </div>

      <div
        class="moj-page-header-actions__actions float-right"
      >
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              :disabled="!hasReportData"
              @click="exportData()"
            >
              Export data
            </button>
            <button
              v-if="hasPermissions([
                PERMISSIONS.applications.permissions.canReadApplications.value,
                PERMISSIONS.exercises.permissions.canReadExercises.value,
                PERMISSIONS.logs.permissions.canCreateLogs.value
              ])"
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

      <div class="govuk-inset-text govuk-!-margin-bottom-7">
        <p class="govuk-body">
          More information is available in the Excel files.
        </p>
      </div>

      <TabsList
        :tabs="tabs"
        :active-tab.sync="activeTab"
      >
        <div
          class="govuk-grid-column-full"
        >
          <h3 class="govuk-heading-m govuk-!-margin-top-4">
            {{ activeTabDetails.header || activeTabDetails.title }}
          </h3>

          <template
            v-if="activeTab === 'acro'"
          >
            <p
              v-if="!report || !report.totalApplications"
              class="govuk-body"
            >
              No candidates require this check.
            </p>

            <table
              v-else
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Date of Birth
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Place of Birth
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    National Insurance Number
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in report.rows"
                  :key="candidate.userId"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.dateOfBirth | formatDate('long') }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.placeOfBirth }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.nationalInsuranceNumber | formatNIN }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template
            v-if="activeTab === 'sra'"
          >
            <p
              v-if="!sraRows.length"
              class="govuk-body"
            >
              No candidates require this check.
            </p>

            <table
              v-else
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Admission to the roll
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Registration number
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in sraRows"
                  :key="candidate.id"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.sraDate | formatDate('long') }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.sraNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template
            v-if="activeTab === 'bsb'"
          >
            <p
              v-if="!bsbRows.length"
              class="govuk-body"
            >
              No candidates require this check.
            </p>

            <table
              v-else
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Called to the Bar
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Registration number
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in bsbRows"
                  :key="candidate.id"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.bsbDate | formatDate('long') }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.bsbNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template
            v-if="activeTab === 'jcio'"
          >
            <p
              v-if="!jcioRows.length"
              class="govuk-body"
            >
              No candidates require this check.
            </p>

            <table
              v-else
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Judicial Office
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Judicial posts
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in jcioRows"
                  :key="candidate.id"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.jcioOffice }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.jcioPosts }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template
            v-if="activeTab === 'hmrc'"
          >
            <p
              v-if="!hmrcRows.length"
              class="govuk-body"
            >
              No candidates require this check.
            </p>

            <table
              v-else
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Date of birth
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    VAT registration number(s)
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in hmrcRows"
                  :key="candidate.id"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.dateOfBirth }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.hmrcVATNumbers }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template
            v-if="activeTab === 'other'"
          >
            <h3 class="govuk-heading-s govuk-!-margin-top-4">
              General Medical Council
            </h3>
            <p
              v-if="!gmcRows.length"
              class="govuk-body"
            >
              No candidates require this check.
            </p>
            <table
              v-else
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Date of membership
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Membership number
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in gmcRows"
                  :key="candidate.id"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.gmcDate }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.gmcNumber }}
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 class="govuk-heading-s govuk-!-margin-top-4">
              Royal Institution Chartered Surveyors
            </h3>
            <p
              v-if="!riscRows.length"
              class="govuk-body"
            >
              No candidates require this check.
            </p>
            <table
              v-else
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Date of membership
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Membership number
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in riscRows"
                  :key="candidate.id"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.riscDate }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.riscNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </div>
      </TabsList>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import permissionMixin from '@/permissionMixin';

export default {
  components: {
    TabsList,
  },
  mixins: [permissionMixin],
  data() {
    return {
      report: null,
      refreshingReport: false,
      tabs: [
        {
          ref: 'acro',
          title: 'ACRO',
        },
        {
          ref: 'sra',
          title: 'SRA',
          header: 'Solicitors Regulation Authority',
        },
        {
          ref: 'bsb',
          title: 'BSB',
          header: 'Bar Standards Board',
        },
        {
          ref: 'jcio',
          title: 'JCIO',
          header: 'Judicial Conduct Investigations Office',
        },
        {
          ref: 'hmrc',
          title: 'HMRC',
        },
        {
          ref: 'other',
          title: 'Other',
        },
      ],
      activeTab: 'acro',
    };
  },
  computed: {
    ...mapState({
      exercise: state => state.exerciseDocument.record,
    }),
    activeTabDetails() {
      const activeTab = this.tabs.find((tab) => tab.ref === this.activeTab );
      return activeTab;
    },
    sraRows() {
      return this.report ? this.report.rows.filter((e) => e.sraDate) : [];
    },
    bsbRows() {
      return this.report ? this.report.rows.filter((e) => e.bsbDate) : [];
    },
    jcioRows() {
      return this.report ? this.report.rows.filter((e) => e.jcioOffice) : [];
    },
    hmrcRows() {
      return this.report ? this.report.rows.filter((e) => e.hmrcVATNumbers) : [];
    },
    gmcRows() {
      return this.report ? this.report.rows.filter((e) => e.gmcDate) : [];
    },
    riscRows() {
      return this.report ? this.report.rows.filter((e) => e.riscDate) : [];
    },
    hasReportData() {
      return this.report && this.report.headers;
    },
  },
  created() {
    this.unsubscribe = firestore.doc(`exercises/${this.exercise.id}/reports/agency`)
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
  methods: {
    async refreshReport() {
      this.refreshingReport = true;
      await functions.httpsCallable('generateAgencyReport')({ exerciseId: this.exercise.id });
      this.refreshingReport = false;
    },
    gatherReportData() {
      const reportData = [];

      // get headers
      reportData.push(this.report.headers.map(header => header.title));

      // get rows
      this.report.rows.forEach((row) => {
        reportData.push(this.report.headers.map(header => row[header.ref]));
      });

      return reportData;
    },
    exportData() {
      const title = 'Agency Report';
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
