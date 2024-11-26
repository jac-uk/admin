<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Agency Character Checks
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
              <ActionButton
                v-if="hasPermissions([
                  PERMISSIONS.applications.permissions.canReadApplications.value,
                  PERMISSIONS.exercises.permissions.canReadExercises.value
                ])"
                type="primary"
                :action="refreshReport"
              >
                Refresh
              </ActionButton>
            </div>
          </div>
        </div>

        <div class="govuk-inset-text govuk-!-margin-bottom-7">
          <p class="govuk-body">
            More information is available in the Excel files.
          </p>
        </div>

        <TabsList
          v-model:active-tab="activeTab"
          :tabs="tabs"
        >
          <div
            class="govuk-grid-column-full"
            style="overflow-x: auto;"
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
                      Reference number
                    </th>
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
                      style="min-width: 250px;"
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
                      <RouterLink
                        class="govuk-link"
                        :to="{name: 'exercise-applications-application', params: { applicationId: candidate.applicationId, status: candidate.applicationStatus }}"
                        target="_blank"
                      >
                        {{ $filters.showAlternative(candidate.applicationReferenceNumber, candidate.applicationId) }}
                      </RouterLink>
                    </td>
                    <td class="govuk-table__cell">
                      {{ candidate.fullName }}
                    </td>
                    <td class="govuk-table__cell">
                      {{ $filters.formatDate(candidate.dateOfBirth, 'long') }}
                    </td>
                    <td class="govuk-table__cell">
                      {{ candidate.placeOfBirth }}
                    </td>
                    <td class="govuk-table__cell">
                      {{ $filters.formatNIN(candidate.nationalInsuranceNumber) }}
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
                      Reference number
                    </th>
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
                      v-for="(header,index) in toSraQualificationTableHeaders(sraRows)"
                      :key="`qual_header_${index}`"
                      scope="col"
                      class="govuk-table__header"
                    >
                      {{ header }}
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
                      <RouterLink
                        class="govuk-link"
                        :to="{name: 'exercise-applications-application', params: { applicationId: candidate.applicationId, status: candidate.applicationStatus }}"
                        target="_blank"
                      >
                        {{ $filters.showAlternative(candidate.applicationReferenceNumber, candidate.applicationId) }}
                      </RouterLink>
                    </td>
                    <td class="govuk-table__cell">
                      {{ candidate.fullName }}
                    </td>
                    <td class="govuk-table__cell">
                      {{ $filters.formatDate(candidate.sraDate, 'long') }}
                    </td>
                    <td
                      v-for="(data, index) in toSraQualificationTableData(candidate.sraQualifications, sraRows)"
                      :key="`qual_td_${index}`"
                      class="govuk-table__cell"
                    >
                      {{ data }}
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
                      Reference number
                    </th>
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
                      v-for="(header,index) in toBsbQualificationTableHeaders(bsbRows)"
                      :key="`qual_header_${index}`"
                      scope="col"
                      class="govuk-table__header"
                    >
                      {{ header }}
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
                      <RouterLink
                        class="govuk-link"
                        :to="{name: 'exercise-applications-application', params: { applicationId: candidate.applicationId, status: candidate.applicationStatus }}"
                        target="_blank"
                      >
                        {{ $filters.showAlternative(candidate.applicationReferenceNumber, candidate.applicationId) }}
                      </RouterLink>
                    </td>
                    <td class="govuk-table__cell">
                      {{ candidate.fullName }}
                    </td>
                    <td
                      v-if="candidate.bsbDate"
                      class="govuk-table__cell"
                    >
                      {{ $filters.formatDate(candidate.bsbDate, 'long') }}
                    </td>
                    <td
                      v-else
                      class="govuk-table__cell"
                    >
                      None given
                    </td>
                    <td
                      v-for="(data, index) in toBsbQualificationTableData(candidate.bsbQualifications, bsbRows)"
                      :key="`qual_td_${index}`"
                      class="govuk-table__cell"
                    >
                      {{ data }}
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
                      Reference number
                    </th>
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
                      <RouterLink
                        class="govuk-link"
                        :to="{name: 'exercise-applications-application', params: { applicationId: candidate.applicationId, status: candidate.applicationStatus }}"
                        target="_blank"
                      >
                        {{ $filters.showAlternative(candidate.applicationReferenceNumber, candidate.applicationId) }}
                      </RouterLink>
                    </td>
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
                      Reference number
                    </th>
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
                      <RouterLink
                        class="govuk-link"
                        :to="{name: 'exercise-applications-application', params: { applicationId: candidate.applicationId, status: candidate.applicationStatus }}"
                        target="_blank"
                      >
                        {{ $filters.showAlternative(candidate.applicationReferenceNumber, candidate.applicationId) }}
                      </RouterLink>
                    </td>
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
                      Reference number
                    </th>
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
                      <RouterLink
                        class="govuk-link"
                        :to="{name: 'exercise-applications-application', params: { applicationId: candidate.applicationId, status: candidate.applicationStatus }}"
                        target="_blank"
                      >
                        {{ $filters.showAlternative(candidate.applicationReferenceNumber, candidate.applicationId) }}
                      </RouterLink>
                    </td>
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
                      Reference number
                    </th>
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
                      <RouterLink
                        class="govuk-link"
                        :to="{name: 'exercise-applications-application', params: { applicationId: candidate.applicationId, status: candidate.applicationStatus }}"
                        target="_blank"
                      >
                        {{ $filters.showAlternative(candidate.applicationReferenceNumber, candidate.applicationId) }}
                      </RouterLink>
                    </td>
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
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { onSnapshot, doc } from '@firebase/firestore';
import { mapState } from 'vuex';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'Agency',
  components: {
    TabsList,
    ActionButton,
  },
  mixins: [permissionMixin],
  data() {
    return {
      report: null,
      tabs: [
        { ref: 'acro', title: 'ACRO' },
        { ref: 'sra', title: 'SRA', header: 'Solicitors Regulation Authority' },
        { ref: 'bsb', title: 'BSB', header: 'Bar Standards Board' },
        { ref: 'jcio', title: 'JCIO', header: 'Judicial Conduct Investigations Office' },
        { ref: 'hmrc', title: 'HMRC' },
        { ref: 'other', title: 'Other' },
      ],
      activeTab: 'acro',
    };
  },
  computed: {
    ...mapState({
      exercise: state => state.exerciseDocument.record,
    }),
    activeTabDetails() {
      return this.tabs.find(tab => tab.ref === this.activeTab) || {};
    },
    filteredRows() {
      if (!this.report) return {};
      console.log(this.report.rows.filter(row => row.bsbQualifications?.length || row.bsbDate || row.bsbNumber));
      return {
        sra: this.report.rows.filter(row => row.sraQualifications?.length),
        bsb: this.report.rows.filter(row => row.bsbQualifications?.length || row.bsbDate || row.bsbNumber),
        jcio: this.report.rows.filter(row => row.jcioOffice === 'Yes'),
        hmrc: this.report.rows.filter(row => row.hmrcVATNumbers),
        gmc: this.report.rows.filter((e) => e.gmcDate),
        risc: this.report.rows.filter((e) => e.riscDate),
      };
    },
    hasReportData() {
      return this.report && this.report.headers;
    },
    sraRows(){
      return this.filteredRows.sra;
    },
    bsbRows(){
      return this.filteredRows.bsb;
    },
    acroRows(){
      return this.filteredRows.acro;
    },
    jcioRows(){
      return this.filteredRows.jcio;
    },
    hmrcRows(){
      return this.filteredRows.jcio;
    },
    gmcRows(){
      return this.filteredRows.gmc;
    },
    riscRows(){
      return this.filteredRows.risc;
    },
  },
  created() {
    this.unsubscribe = onSnapshot(
      doc(firestore, `exercises/${this.exercise.id}/reports/agency`),
      snap => {
        if (snap.exists) {
          this.report = vuexfireSerialize(snap);
        }
      },
      error => console.error('Failed to subscribe to report:', error)
    );
  },
  unmounted() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async refreshReport() {
      try {
        await httpsCallable(functions, 'generateAgencyReport')({ exerciseId: this.exercise.id });
      } catch (error) {
        console.error('Failed to refresh report:', error);
      }
    },
    gatherReportData(headers, rows) {
      const reportData = [];
      // Add headers
      reportData.push(headers.map(header => header.title));
      // Add rows
      rows.forEach(row => {
        reportData.push(headers.map(header => row[header.ref] || '')); // Direct access without accessorFn
      });
      return reportData;
    },
    gatherQualificationHeaders(type, maxLength) {
      const headers = [];
      for (let i = 1; i <= maxLength; i++) {
        headers.push(
          { title: `Qualification ${i}`, ref: `${type}Type${i}` },
          { title: `Region ${i}`, ref: `${type}Region${i}` },
          { title: `${type.toUpperCase()} Number ${i}`, ref: `${type}RegistrationNumber${i}` }
        );
      }
      return headers;
    },
    exportData() {
      const dataGenerators = {
        acro: this.gatherACROReportData,
        hmrc: this.gatherHMRCReportData,
        bsb: this.gatherBSBReportData,
        sra: this.gatherSRAReportData,
        jcio: this.gatherJCIOReportData,
        default: this.gatherFullReportData,
      };

      const dataTag = this.activeTab.toUpperCase();
      const title = 'Agency Report';
      const data = (dataGenerators[this.activeTab] || dataGenerators.default)();

      downloadXLSX(data, {
        title: `${this.exercise.referenceNumber} ${title} - ${dataTag}`,
        sheetName: `${title} - ${dataTag} Report`,
        fileName: `${this.exercise.referenceNumber} - ${title} - ${dataTag}.xlsx`,
      });
    },
    gatherACROReportData() {
      const headers = [
        { title: 'JAC Reference', ref: 'applicationReferenceNumber' },
        { title: '*Agency Reference', ref: '' },
        { title: '*Reason for Request', ref: '' },
        { title: 'If Other please specify', ref: '' },
        { title: 'Current or proposed role/profession', ref: '' },
        { title: 'Supervised or Unsupervised access', ref: '' },
        { title: 'Is this check for a company', ref: '' },
        { title: '*Surname or Company Name', ref: 'lastName' },
        { title: '*Forename', ref: 'firstName' },
        { title: '*Date of birth (DD/MM/YYYY)', ref: 'dateOfBirth' },
        { title: 'Place of Birth (County)', ref: 'placeOfBirth' },
        { title: 'Gender', ref: 'gender' },
        { title: 'Present Address', ref: 'currentAddress' },
      ];
      return this.gatherReportData(headers, this.report.rows);
    },
    gatherHMRCReportData() {
      const headers = [
        { title: 'JAC Reference', ref: 'applicationReferenceNumber' },
        { title: 'NI NO', ref: 'nationalInsuranceNumber' },
        { title: 'Surname', ref: 'lastName' },
        { title: 'Forename(s)', ref: 'firstName' },
        { title: 'VAT Reg', ref: 'hmrcVATNumbers' },
      ];
      return this.gatherReportData(headers, this.filteredRows.hmrc);
    },
    gatherBSBReportData() {
      const maxBsbLength = Math.max(...this.filteredRows.bsb.map(row => row.bsbQualifications?.length || 0));
      const headers = [
        { title: 'JAC Reference', ref: 'applicationReferenceNumber' },
        { title: 'Surname', ref: 'lastName' },
        { title: 'Forename(s)', ref: 'firstName' },
        ...this.gatherQualificationHeaders('bsb', maxBsbLength),
      ];
      return this.gatherReportData(headers, this.filteredRows.bsb);
    },
    gatherSRAReportData() {
      const maxSraLength = Math.max(...this.filteredRows.sra.map(row => row.sraQualifications?.length || 0));
      const headers = [
        { title: 'JAC Reference', ref: 'applicationReferenceNumber' },
        { title: 'Surname', ref: 'lastName' },
        { title: 'Forename(s)', ref: 'firstName' },
        ...this.gatherQualificationHeaders('sra', maxSraLength),
      ];
      return this.gatherReportData(headers, this.filteredRows.sra);
    },
    gatherJCIOReportData() {
      return this.gatherReportData(this.report.headers, this.filteredRows.jcio);
    },
    gatherFullReportData() {
      return this.gatherReportData(this.report.headers, this.report.rows);
    },
  },
};
</script>

<style scoped>
th {
  min-width: 210px;
}
</style>
