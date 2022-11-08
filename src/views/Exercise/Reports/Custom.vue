<template>
  <div>
    <!-- diversity header -->
    <div
      v-if="hasPermissions([
        PERMISSIONS.applications.permissions.canReadApplications.value
      ])"
      class="govuk-grid-column-full"
    >
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Custom report
          </h2>
        </div>
        <div
          class="moj-page-header-actions__actions float-right"
        >
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <p>Load saved report:</p>
              <select
                v-if="customReports.length > 0"
                class="govuk-select govuk-!-margin-right-3"
                :disabled="isLoading"
                @change="selectReport($event)"
              >
                <option>
                  Select a saved report...
                </option>
                <optgroup label="Your saved reports">
                  <option
                    v-for="(report, reportIndex) in customReports"
                    :key="reportIndex"
                    :value="reportIndex"
                  >
                    {{ report.name }}
                  </option>
                </optgroup>
              </select>
              <button
                class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
                @click="openModal('modalRefSaveReport')"
              >
                Save Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <Banner
        v-if="warnings"
        :message="warnings"
      />
      <div class="govuk-inset-text govuk-!-margin-bottom-7">
        <p class="govuk-body">
          This report is experimental. Please provide feedback if something doesn't look right.
        </p>
      </div>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-3">
            <span class="govuk-caption-m govuk-!-margin-bottom-2"> Select a column to display: </span>
            <div class="govuk-heading-m govuk-!-margin-bottom-0">
              <div>
                <select
                  v-model="selectedColumn"
                  class="govuk-select"
                  :disabled="isLoading"
                  @change="selectColumn($event)"
                >
                  <option value="">
                    Select...
                  </option>
                  <optgroup
                    v-for="(keyGroup, keyGroupIndex) in groups"
                    :key="keyGroupIndex"
                    :label="keyGroup.name"
                  >
                    <option
                      v-for="(key, keyIndex) in keyGroup.keys"
                      :key="keyIndex"
                      :value="key"
                    >
                      {{ keys[key].label }}
                    </option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="govuk-grid-column-one-half">
          <div class="govuk-!-margin-bottom-3">
            <div class="govuk-heading-m govuk-!-margin-bottom-0">
              <div class="govuk-radios__item-container govuk-!-margin-bottom-2 govuk-!-margin-top-2">
                <div class="govuk-radios__item">
                  <input
                    id="showData"
                    v-model="type"
                    type="radio"
                    value="showData"
                    class="govuk-radios__input"
                    :disabled="isLoading"
                  >
                  <label
                    for="showData"
                    class="govuk-label govuk-radios__label"
                  >Show Individual Records</label>
                </div>
              </div>
              <div class="govuk-radios__item-container">
                <div class="govuk-radios__item">
                  <input
                    id="count"
                    v-model="type"
                    type="radio"
                    value="count"
                    class="govuk-radios__input"
                    :disabled="isLoading"
                  >
                  <label
                    for="count"
                    class="govuk-label govuk-radios__label"
                  >Count Records</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="columns.length > 0"
        class="panel govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-!-margin-bottom-0 govuk-!-margin-top-0">
          Show columns:
        </h2>
        <draggable
          v-model="columns"
          @click.native="removeColumn($event)"
        >
          <div
            v-for="(column, columnIndex) in columns"
            :key="columnIndex"
            :data-index="columnIndex"
            class="govuk-!-margin-right-3 moj-filter__tag"
          >
            {{ keys[column].label }}
          </div>
        </draggable>
        <div class="govuk-hint govuk-!-margin-top-3 govuk-!-margin-bottom-0">
          Click to remove, drag to re-order
        </div>
      </div>

      <div
        v-if="whereClauses.length > 0"
        class="panel govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-!-margin-bottom-0 govuk-!-margin-top-0">
          Only show records where:
        </h2>

        <div
          v-for="(whereClause, whereClauseIndex) in whereClauses"
          :key="whereClauseIndex"
          :data-index="whereClauseIndex"
          class="govuk-!-margin-right-3 moj-filter__tag"
          @click="removeWhereClause($event)"
        >
          '{{ keys[whereClause.column].label }}' IS '{{ whereClause.value }}'
        </div>
      </div>
      <LoadingMessage
        v-if="isLoading"
        :load-failed="loadFailed"
      />
      <div
        v-if="data && type === 'showData'"
        class="govuk-!-margin-top-9"
      >
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                v-for="(column, columnIndex) in columns"
                :key="columnIndex"
                class="govuk-table__header"
              >
                {{ keys[column].label }}
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr
              v-for="(row, rowIndex) of data.data"
              :key="rowIndex"
              class="govuk-table__row"
            >
              <td
                v-for="(column, columnIndex) in columns"
                :key="columnIndex"
                class="govuk-table__cell"
              >
                {{ row[column] }}
              </td>
            </tr>
          </tbody>
        </table>
        <button
          class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
          @click="downloadReport"
        >
          Download Report
        </button>
      </div>
      <div
        v-if="data && type === 'count'"
        class="govuk-!-margin-top-9"
      >
        <div
          v-for="(column, columnIndex) in columns"
          :key="columnIndex"
        >
          <table class="govuk-table table-with-border">
            <thead class="govuk-table__head">
              <tr>
                <th class="govuk-table__header">
                  {{ keys[column].label }}
                </th>
                <th class="govuk-table__header govuk-table__header govuk-table__header--numeric">
                  Applications
                </th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              <tr
                v-for="(row, rowIndex) in data.data[column]"
                :key="rowIndex"
                class="govuk-table__row"
              >
                <th
                  scope="col"
                  class="govuk-table__header"
                  style="cursor: pointer"
                  @click="addWhereClause(column, '==', rowIndex)"
                >
                  {{ rowIndex }}
                </th>
                <td
                  class="govuk-table__cell govuk-table__cell--numeric"
                >
                  {{ row | formatNumber }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Modal
      ref="modalRefSaveReport"
    >
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Save report
      </div>
      <div class="modal__content govuk-!-margin-6">
        <label>Enter a name for the report</label>
        <input
          v-model="customReportName"
          class="govuk-input"
        ><br><br>
        <button
          class="govuk-button govuk-!-margin-right-3"
          @click="saveReport()"
        >
          Save
        </button>
        <button
          class="govuk-button govuk-button--secondary"
          @click="closeModal('modalRefSaveReport')"
        >
          Cancel
        </button>
      </div>
    </Modal>
    <Modal
      ref="modalRefReportSaved"
    >
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Save report
      </div>
      <div class="modal__content govuk-!-margin-6">
        <p>The report has been saved.</p>
        <button
          class="govuk-button govuk-!-margin-right-3"
          @click="closeModal('modalRefReportSaved')"
        >
          OK
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import draggable from 'vuedraggable';
import _ from 'lodash';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'CustomReport',
  components: {
    Modal,
    draggable,
    LoadingMessage,
    Banner,
  },
  mixins: [permissionMixin],
  data() {
    return {
      type: 'showData',
      data: null,
      isLoading: null,
      loadFailed: null,
      customReports: [],
      customReportName: null,
      selectedColumn: '',
      whereClauses: [],
      columns: [],
      warnings: '',
      warningTimeout: null,
      groups: [
        {
          name: 'Application Info',
          keys: [
            'referenceNumber',
            'personalDetails.dateOfBirth',
            'personalDetails.title',
            'personalDetails.citizenship',
            'personalDetails.lastName',
            'personalDetails.fullName',
            'personalDetails.phone',
            'personalDetails.nationalInsuranceNumber',
            'personalDetails.firstName',
            'personalDetails.reasonableAdjustmentsDetails',
            'personalDetails.email',
            'personalDetails.reasonableAdjustments',
            'status',
            'appliedAt',
            'interestedInPartTime',
            'applyingUnderSchedule2d',
            'canGiveReasonableLOS',
            'applyingUnderSchedule2Three',
            '_processing.status',
            '_processing.stage',
          ],
        },
        {
          name: 'Working Preferences',
          keys: [
            'jurisdictionPreferences',
            'locationPreferences',
          ],
        },
        {
          name: 'Welsh',
          keys: [
            'applyingForWelshPost',
            'canReadAndWriteWelsh',
            'canSpeakWelsh',
          ],
        },
        {
          name: 'Qualifications and Experience',
          keys: [
            'qualifications',
            'skillsAquisitionDetails',
            'feePaidOrSalariedJudge',
            'feePaidOrSalariedSatForThirtyDays',
            'experience',
            'experienceUnderSchedule2Three',
            'quasiJudicialSittingDaysDetails',
            'quasiJudicialSatForThirtyDays',
          ],
        },
        {
          name: 'Character Issues',
          keys: [
            'employmentGaps',
          ],
        },
        {
          name: 'Memberships',
          keys: [
            'professionalMemberships',
            'otherProfessionalMemberships',
            'otherProfessionalMembershipsNumber',
            'otherProfessionalMembershipsInformation',
            'otherProfessionalMembershipsDate',
            'royalInstituteBritishArchitectsNumber',
            'royalInstituteBritishArchitectsInformation',
            'royalInstituteBritishArchitectsDate',
            'royalInstitutionCharteredSurveyorsDate',
            'royalInstitutionCharteredSurveyorsNumber',
            'royalCollegeOfPsychiatristsDate',
            'generalMedicalCouncilConditional',
            'generalMedicalCouncilConditionalDetails',
            'generalMedicalCouncilConditionalEndDate',
            'generalMedicalCouncilDate',
            'charteredAssociationBuildingEngineersNumber',
            'charteredInstituteBuildingInformation',
            'charteredInstituteBuildingNumber',
            'charteredInstituteEnvironmentalHealthInformation',
            'charteredInstituteEnvironmentalHealthDate',
          ],
        },
        {
          name: 'Assessor',
          keys: [
            'firstAssessorEmail',
            'firstAssessorTitle',
            'firstAssessorFullName',
            'firstAssessorPhone',
            'secondAssessorEmail',
            'secondAssessorTitle',
            'secondAssessorFullName',
            'secondAssessorPhone',
          ],
        },
      ],
      keys: {
        referenceNumber: { label: 'Candidate reference number', type: String },
        applyingForWelshPost: { label: 'Applying for Welsh Post?', type: Boolean },
        canReadAndWriteWelsh: { label: 'Can read and write Welsh?', type: Boolean },
        canSpeakWelsh: { label: 'Can speak Welsh?', type: Boolean },
        employmentGaps: { label: 'Employment gaps', type: 'Array of objects' },
        firstAssessorEmail: { label: 'First Assessor Email', type: String },
        firstAssessorTitle: { label: 'First Assessor Title', type: String },
        firstAssessorFullName: { label: 'First Assessor Full Name', type: String },
        firstAssessorPhone: { label: 'First Assessor Phone', type: String },
        secondAssessorEmail: { label: 'Second Assessor Email', type: String },
        secondAssessorTitle: { label: 'Second Assessor Title', type: String },
        secondAssessorFullName: { label: 'Second Assessor Full Name', type: String },
        secondAssessorPhone: { label: 'Second Assessor Phone', type: String },
        royalInstitutionCharteredSurveyorsDate: { label: 'Royal Institution Chartered Surveyors Date', type: Date },
        royalInstituteBritishArchitectsInformation: { label: 'Royal Institute of British Architects Information', type: String },
        otherProfessionalMemberships: { label: 'Other Professional Memberships', type: String },
        otherProfessionalMembershipsNumber: { label: 'Other Professional Memberships Number', type: String },
        otherProfessionalMembershipsInformation: { label: 'Other Professional Memberships Information', type: String },
        generalMedicalCouncilConditional: { label: 'General Medical Council Conditional', type: String },
        charteredAssociationBuildingEngineersNumber: { label: 'Chartered Association Building Engineers Number', type: String },
        charteredInstituteBuildingInformation: { label: 'Chartered Institute Building Information', type: String },
        generalMedicalCouncilConditionalDetails: { label: 'General Medical Council Conditional Details', type: String },
        royalInstituteBritishArchitectsNumber: { label: 'Royal Institute of British Architects Number', type: String },
        charteredInstituteEnvironmentalHealthInformation: { label: 'Chartered Institute Environmental Health Information', type: String },
        royalCollegeOfPsychiatristsDate: { label: 'Royal College of Psychiatrists Date', type: Date },
        royalInstituteBritishArchitectsDate: { label: 'Royal Institute of British Architects Date', type: Date },
        charteredInstituteBuildingNumber: { label: 'Chartered Institute Building Number', type: String },
        generalMedicalCouncilDate: { label: 'General Medical Council Date', type: Date },
        otherProfessionalMembershipsDate: { label: 'Other Professional Memberships Date', type: Date },
        generalMedicalCouncilConditionalEndDate: { label: 'General Medical Council Condition End Date', type: Date },
        professionalMemberships: { label: 'Professional memberships', type: 'Array of strings' },
        charteredInstituteEnvironmentalHealthDate: { label: 'Chartered Institute Environmental Health Date', type: Date },
        royalInstitutionCharteredSurveyorsNumber: { label: 'Royal Institution of Chartered Surveyors Number', type: String },
        status: { label: 'Application status', type: String },
        appliedAt: { label: 'Application date', type: Date },
        interestedInPartTime: { label: 'Interested in part time?', type: Boolean },
        applyingUnderSchedule2d: { label: 'Applying under schedule 2d?', type: Boolean },
        canGiveReasonableLOS: { label: 'Can give reasonable LOS?', type: Boolean },
        applyingUnderSchedule2Three: { label: 'Applying under schedule 2 3?', type: Boolean },
        '_processing.status': { label: 'Status (admin)', type: String },
        '_processing.stage': { label: 'Stage', type: String },
        'personalDetails.phone': { label: 'Phone', type: String },
        'personalDetails.nationalInsuranceNumber': { label: 'National insurance number', type: String },
        'personalDetails.firstName': { label: 'first name', type: String },
        'personalDetails.reasonableAdjustmentsDetails': { label: 'reasonable adjustments details', type: String },
        'personalDetails.email': { label: 'Email', type: String },
        'personalDetails.reasonableAdjustments': { label: 'Reasonable adjustments', type: Boolean },
        'personalDetails.dateOfBirth': { label: 'Date of birth', type: Date },
        'personalDetails.title': { label: 'Title', type: String },
        'personalDetails.citizenship': { label: 'Citizenship', type: String },
        'personalDetails.lastName': { label: 'Last Name', type: String },
        'personalDetails.fullName': { label: 'Full name', type: String },
        qualifications: { label: 'Qualifications', type: 'Array of objects' },
        skillsAquisitionDetails: { label: 'Skills aquisition details', type: String },
        feePaidOrSalariedJudge: { label: 'Fee paid or salaried judge?', type: Boolean },
        feePaidOrSalariedSatForThirtyDays: { label: 'Fee paid or salaried sat for thirty days?', type: Boolean },
        experience: { label: 'Post-qualification experience', type: String },
        experienceUnderSchedule2Three: { label: 'Experience under schedule 2 three?', type: Boolean },
        quasiJudicialSittingDaysDetails: { label: 'Quasi judicial sitting days details', type: String },
        quasiJudicialSatForThirtyDays: { label: 'Quasi judicial sat for thirty days?', type: Boolean },
        jurisdictionPreferences: { label: 'Jurisdiction Preferences', type: String },
        locationPreferences: { label: 'Location Preferences', type: String },
      },
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  watch: {
    columns: {
      handler: function() {
        this.getApplicationRecords();
      },
      deep: true,
    },
    type: {
      handler: function() {
        this.getApplicationRecords();
      },
      deep: true,
    },
    whereClauses: {
      handler: function() {
        this.getApplicationRecords();
      },
      deep: true,
    },
  },
  created() {
    this.getReports();
  },
  methods: {
    async getApplicationRecords() {
      this.isLoading = true;
      this.data = null;
      if (this.columns.length > 0) {
        this.data = await functions.httpsCallable('getApplicationData')({
          exerciseId: this.exercise.id,
          columns: this.columns,
          type: this.type,
          whereClauses: this.whereClauses,
        });
      }
      this.isLoading = false;
    },
    selectColumn(event) {
      if (!_.includes(this.columns, event.target.value)) {
        this.columns.push(event.target.value);
      }
      this.selectedColumn = '';
    },
    removeColumn(event) {

      const index = event.target.getAttribute('data-index');
      this.columns.splice(index, 1);

    },
    addWhereClause(column, operator, value) {
      this.whereClauses.push(
        {
          column: column,
          operator: operator,
          value: value,
        }
      );
    },
    removeWhereClause(event) {
      const index = event.target.getAttribute('data-index');
      this.whereClauses.splice(index, 1);
    },
    openModal(modalRef){
      if (this.columns.length === 0) {
        clearTimeout(this.warningTimeout);
        this.warnings = 'You have select no columns to save the report';
        this.warningTimeout = window.setTimeout(() => this.warnings = '', 5000);
        return;
      }
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
      this.customReportName = null;
    },
    async saveReport() {
      if (this.customReports.map(r => r.name).includes(this.customReportName)) {
        this.closeModal('modalRefSaveReport');
        clearTimeout(this.warningTimeout);
        this.warnings = 'Your report has not been saved. There is already a report with that name';
        this.warningTimeout = window.setTimeout(() => this.warnings = '', 5000);
        return;
      }
      const reports = await functions.httpsCallable('customReport')({
        columns: this.columns,
        whereClauses: this.whereClauses,
        name: this.customReportName,
      });
      this.customReports = reports.data;
      this.closeModal('modalRefSaveReport');
      this.openModal('modalRefReportSaved');
    },
    async getReports() {
      const reports = await functions.httpsCallable('customReport')({});
      this.customReports = reports.data;
    },
    selectReport(event) {
      const report = this.customReports[event.target.value];
      this.columns = report.columns;
      this.whereClauses = report.whereClauses;
    },
    downloadReport() {
      const header = [...this.columns].map(col => this.keys[col].label);
      const csv = [[...header]];
      for (let i = 0; i < this.data.data.length; i++) {
        csv.push([...this.columns.map(col => this.data.data[i][col])]);
      }
      const csvContent = `data:text/csv;charset=utf-8,${
        csv.map(e => e.join(',')).join('\n')}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'custom_report.csv');
      document.body.appendChild(link);
      link.click();
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
th:first-letter {
  text-transform: capitalize
}
td:first-letter {
  text-transform: capitalize
}
.moj-filter__tag {
  cursor: pointer;
}
</style>
