<template>
  <div class="govuk-grid-row">
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
                :disabled="isLoading || columns.length === 0"
                @click="generateReport"
              >
                Generate Report
              </button>
              <button
                class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
                :disabled="isLoading || !data"
                @click="downloadReport"
              >
                Download Report
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
          <!-- This report is experimental. Please provide feedback if something doesn't look right. -->
          Choose the fields you wish to include in your custom report from the dropdown below and then click 'generate' to produce your report on screen. Only candidates with the status 'Applied' will be included in the report.<br>Download the report when you are satisfied with the content.
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
        id="column-list"
        class="panel govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-!-margin-bottom-0 govuk-!-margin-top-0">
          Show columns:
        </h2>

        <draggable
          v-if="columns.length"
          v-model="columns"
          item-key="getDraggableKey"
          @click="removeColumn"
        >
          <template #item="{element, index}">
            <div
              :data-index="index"
              class="govuk-!-margin-right-3 moj-filter__tag"
            >
              {{ keys[element].label }}
            </div>
          </template>
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
        style="overflow: auto;"
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
                :style="{
                  'white-space': keys[column]?.nowrap ? 'nowrap' : ''
                }"
                class="govuk-table__cell"
              >
                {{ isUsingFilter(column) ? $filters.lookup(row[column]) : row[column] }}
              </td>
            </tr>
          </tbody>
        </table>
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
                  {{ $filters.formatNumber(row) }}
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
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';
import draggable from 'vuedraggable';
import _ from 'lodash';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage.vue';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
import { STATUS } from '@jac-uk/jac-kit/helpers/constants';
import { applicationRecordCounts, availableStages, availableStatuses } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { escapeValue } from '@/helpers/csv';

// Prevents warnings and errors associated with using @vue/compat
draggable.compatConfig = { MODE: 3 };

export default {
  name: 'CustomReport',
  components: {
    Modal,
    draggable,
    LoadingMessage,
    Banner,
    CheckboxGroup,
    CheckboxItem,
  },
  mixins: [permissionMixin],
  data() {
    return {
      STATUS,
      type: 'showData',
      data: null,
      statuses: [STATUS.APPLIED],
      selectedStage: 'all',
      selectedStageStatus: null,
      isLoading: null,
      loadFailed: null,
      customReports: [],
      customReportName: null,
      selectedColumn: '',
      whereClauses: [],
      columns: ['referenceNumber', 'personalDetails.fullName', 'status'],
      warnings: '',
      warningTimeout: null,
      groups: [
        {
          name: 'Application Info',
          keys: [
            'referenceNumber',
            'personalDetails.dateOfBirth',
            'personalDetails.placeOfBirth',
            'personalDetails.title',
            'personalDetails.citizenship',
            'personalDetails.firstName',
            'personalDetails.middleNames',
            'personalDetails.lastName',
            'personalDetails.fullName',
            'personalDetails.suffix',
            'personalDetails.previousNames',
            'personalDetails.professionalName',
            'personalDetails.phone',
            'personalDetails.nationalInsuranceNumber',
            'personalDetails.email',
            'personalDetails.reasonableAdjustments',
            'personalDetails.reasonableAdjustmentsDetails',
            'personalDetails.address.current',
            'personalDetails.address.currentMoreThan5Years',
            'personalDetails.address.previous',
            'personalDetails.VATNumbers',
            'status',
            'appliedAt',
            'applyingUnderSchedule2d',
            'applyingUnderSchedule2Three',
            '_processing.status',
            '_processing.stage',
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
          name: 'Equality and Diversity',
          keys: [
            'equalityAndDiversitySurvey.shareData',
            'equalityAndDiversitySurvey.professionalBackground',
            'equalityAndDiversitySurvey.currentLegalRole',
            'equalityAndDiversitySurvey.feePaidJudicialRole',
            'equalityAndDiversitySurvey.stateOrFeeSchool',
            'equalityAndDiversitySurvey.oxbridgeUni',
            'equalityAndDiversitySurvey.firstGenerationStudent',
            'equalityAndDiversitySurvey.ethnicGroup',
            'equalityAndDiversitySurvey.gender',
            'equalityAndDiversitySurvey.changedGender',
            'equalityAndDiversitySurvey.sexualOrientation',
            'equalityAndDiversitySurvey.disability',
            'equalityAndDiversitySurvey.disabilityDetails',
            'equalityAndDiversitySurvey.religionFaith',
            'equalityAndDiversitySurvey.attendedOutreachEvents',
            'equalityAndDiversitySurvey.participatedInJudicialWorkshadowingScheme',
            'equalityAndDiversitySurvey.hasTakenPAJE',
          ],
        },
        {
          name: 'Part Time Working Preferences',
          keys: [
            'interestedInPartTime',
            'partTimeWorkingPreferencesDetails',
          ],
        },
        {
          name: 'Qualifications and Experience',
          keys: [
            'qualifications',
            'feePaidOrSalariedJudge',
            'feePaidOrSalariedSatForThirtyDays',
            'feePaidOrSalariedSittingDaysDetails',
            'declaredAppointmentInQuasiJudicialBody',
            'experience',
            'experienceUnderSchedule2Three',
            'quasiJudicialSittingDaysDetails',
            'quasiJudicialSatForThirtyDays',
            'skillsAquisitionDetails',
          ],
        },
        {
          name: 'Gaps in Employment',
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
            'generalMedicalCouncilNumber',
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
          name: 'Reasonable Length of Service',
          keys: [
            'canGiveReasonableLOS',
            'cantGiveReasonableLOSDetails',
          ],
        },
        {
          name: 'Assessor',
          keys: [
            'firstAssessorType',
            'firstAssessorEmail',
            'firstAssessorTitle',
            'firstAssessorFullName',
            'firstAssessorPhone',
            'secondAssessorType',
            'secondAssessorEmail',
            'secondAssessorTitle',
            'secondAssessorFullName',
            'secondAssessorPhone',
          ],
        },
      ],
      keys: {
        referenceNumber: { label: 'Candidate reference number', type: String, nowrap: true },
        applyingForWelshPost: { label: 'Applying for Welsh Post?', type: Boolean },
        canReadAndWriteWelsh: { label: 'Can read and write Welsh?', type: Boolean },
        canSpeakWelsh: { label: 'Can speak Welsh?', type: Boolean },
        employmentGaps: { label: 'Employment gaps', type: 'Array of objects' },
        firstAssessorType: { label: 'First Assessor Type', type: String },
        firstAssessorEmail: { label: 'First Assessor Email', type: String, nowrap: true },
        firstAssessorTitle: { label: 'First Assessor Title', type: String, nowrap: true },
        firstAssessorFullName: { label: 'First Assessor Full Name', type: String, nowrap: true },
        firstAssessorPhone: { label: 'First Assessor Phone', type: String, nowrap: true },
        secondAssessorType: { label: 'Second Assessor Type', type: String },
        secondAssessorEmail: { label: 'Second Assessor Email', type: String, nowrap: true },
        secondAssessorTitle: { label: 'Second Assessor Title', type: String, nowrap: true },
        secondAssessorFullName: { label: 'Second Assessor Full Name', type: String, nowrap: true },
        secondAssessorPhone: { label: 'Second Assessor Phone', type: String, nowrap: true },
        royalInstitutionCharteredSurveyorsDate: { label: 'Royal Institution Chartered Surveyors Date', type: Date },
        royalInstituteBritishArchitectsInformation: { label: 'Royal Institute of British Architects Information', type: String },
        otherProfessionalMemberships: { label: 'Other Professional Memberships', type: String },
        otherProfessionalMembershipsNumber: { label: 'Other Professional Memberships Number', type: String },
        otherProfessionalMembershipsInformation: { label: 'Other Professional Memberships Information', type: String },
        generalMedicalCouncilConditional: { label: 'General Medical Council Conditional', type: String },
        charteredAssociationBuildingEngineersNumber: { label: 'Chartered Association Building Engineers Number', type: String },
        charteredInstituteBuildingInformation: { label: 'Chartered Institute Building Information', type: String },
        generalMedicalCouncilConditionalDetails: { label: 'General Medical Council Conditional Details', type: String },
        generalMedicalCouncilNumber: { label: 'General Medical Council Number', type: String },
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
        partTimeWorkingPreferencesDetails: { label: 'Salaried part-time work (SPTW) - Details', type: String },
        applyingUnderSchedule2d: { label: 'Applying under schedule 2d?', type: Boolean },
        canGiveReasonableLOS: { label: 'Can work a reasonable length of service', type: Boolean },
        cantGiveReasonableLOSDetails: { label: 'Can work a reasonable length of service (details)', type: String },
        applyingUnderSchedule2Three: { label: 'Applying under schedule 2 3?', type: Boolean },
        '_processing.status': { label: 'Status (admin)', type: String },
        '_processing.stage': { label: 'Stage', type: String },
        'personalDetails.phone': { label: 'Phone', type: String, nowrap: true },
        'personalDetails.nationalInsuranceNumber': { label: 'National insurance number', type: String, nowrap: true },
        'personalDetails.email': { label: 'Email', type: String, nowrap: true },
        'personalDetails.reasonableAdjustments': { label: 'Reasonable adjustments', type: Boolean },
        'personalDetails.reasonableAdjustmentsDetails': { label: 'Reasonable adjustments details', type: String },
        'personalDetails.dateOfBirth': { label: 'Date of birth', type: Date, nowrap: true },
        'personalDetails.placeOfBirth': { label: 'Place of birth', type: String, nowrap: true },
        'personalDetails.title': { label: 'Title', type: String, nowrap: true },
        'personalDetails.citizenship': { label: 'Citizenship', type: String, nowrap: true },
        'personalDetails.firstName': { label: 'First Name', type: String, nowrap: true },
        'personalDetails.middleNames': { label: 'Middle name(s)', type: String, nowrap: true },
        'personalDetails.lastName': { label: 'Last Name', type: String, nowrap: true },
        'personalDetails.fullName': { label: 'Full Name', type: String, nowrap: true },
        'personalDetails.suffix': { label: 'Suffix', type: String },
        'personalDetails.previousNames': { label: 'Previous known name(s)', type: String },
        'personalDetails.professionalName': { label: 'Professional name', type: String, nowrap: true },
        'personalDetails.address.current': { label: 'Current Address', type: String },
        'personalDetails.address.currentMoreThan5Years': { label: 'Has lived at this address for more than 5 years', type: Boolean },
        'personalDetails.address.previous': { label: 'Previous Addresses', type: String },
        'personalDetails.VATNumbers': { label: 'VAT registration number', type: String },
        qualifications: { label: 'Qualifications', type: 'Array of objects' },
        feePaidOrSalariedJudge: { label: 'Fee paid or salaried judge?', type: Boolean },
        feePaidOrSalariedSatForThirtyDays: { label: 'Fee paid or salaried sat for thirty days?', type: Boolean },
        feePaidOrSalariedSittingDaysDetails: { label: 'Fee paid or salaried sitting days details', type: String },
        declaredAppointmentInQuasiJudicialBody: { label: 'Have you declared an appointment or appointments in a quasi-judicial body in this application?', type: Boolean },
        quasiJudicialSatForThirtyDays: { label: 'Quasi judicial sat for thirty days?', type: Boolean },
        quasiJudicialSittingDaysDetails: { label: 'Quasi judicial sitting days details', type: String },
        skillsAquisitionDetails: { label: 'Skills acquisition details', type: String },
        experience: { label: 'Post-qualification experience', type: String },
        experienceUnderSchedule2Three: { label: 'Experience under schedule 2 three?', type: Boolean },
        // jurisdictionPreferences: { label: 'Jurisdiction Preferences', type: String },
        // locationPreferences: { label: 'Location Preferences', type: String },
        'equalityAndDiversitySurvey.shareData': { label: 'Agreed to share data', type: Boolean },
        'equalityAndDiversitySurvey.professionalBackground': { label: 'Professional background', type: String },
        'equalityAndDiversitySurvey.currentLegalRole': { label: 'Current legal role', type: String },
        'equalityAndDiversitySurvey.feePaidJudicialRole': { label: 'Held fee-paid judicial role', type: String },
        'equalityAndDiversitySurvey.stateOrFeeSchool': { label: 'Attended state or fee-paying school', type: String },
        'equalityAndDiversitySurvey.oxbridgeUni': { label: 'Attended Oxbridge universities', type: String },
        'equalityAndDiversitySurvey.firstGenerationStudent': { label: 'First generation to go to university', type: String },
        'equalityAndDiversitySurvey.ethnicGroup': { label: 'Ethnic group', type: String },
        'equalityAndDiversitySurvey.gender': { label: 'Sex', type: String },
        'equalityAndDiversitySurvey.changedGender': { label: 'Gender is the same as sex assigned at birth', type: String },
        'equalityAndDiversitySurvey.sexualOrientation': { label: 'Sexual orientation', type: String },
        'equalityAndDiversitySurvey.disability': { label: 'Disability', type: String },
        'equalityAndDiversitySurvey.disabilityDetails': { label: 'Disability details', type: String },
        'equalityAndDiversitySurvey.religionFaith': { label: 'Religion', type: String },
        'equalityAndDiversitySurvey.attendedOutreachEvents': { label: 'Attended outreach events', type: String },
        'equalityAndDiversitySurvey.participatedInJudicialWorkshadowingScheme': { label: 'Participated In judicial workshadowing Scheme', type: String },
        'equalityAndDiversitySurvey.hasTakenPAJE': { label: 'Participated in Pre-Application Judicial Education Programme', type: String },
      },
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationRecordCounts() {
      return applicationRecordCounts(this.exercise);
    },
    availableStages() {
      const stages = availableStages(this.exercise);
      return stages.filter(stage => this.applicationRecordCounts[stage]);
    },
    availableStatuses() {
      if (this.selectedStage === 'all') return null;
      const statuses = availableStatuses(this.exercise, this.selectedStage);
      return statuses;
    },
  },
  watch: {
    statuses: {
      handler: function() {
        this.getApplicationRecords();
      },
      deep: true,
    },
    selectedStage: function () {
      this.selectedStageStatus = 'all';
      this.getApplicationRecords();
    },
    selectedStageStatus: {
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
    // if report can include working prefs answers, add them under working prefs title
    if (this.exercise.jurisdictionQuestion || this.exercise.locationQuestion) {
      this.groups.splice(1, 0, { name: 'Working Preferences', keys: [] });
      const workingPrefsIndex = this.groups.findIndex((group) => group.name === 'Working Preferences');
      if (this.exercise.jurisdictionQuestion) {
        this.groups[workingPrefsIndex].keys.push('jurisdictionPreferences');
        this.keys['jurisdictionPreferences'] = { label: this.exercise.jurisdictionQuestion, type: String };
      }
      if (this.exercise.locationQuestion) {
        this.groups[workingPrefsIndex].keys.push('locationPreferences');
        this.keys['locationPreferences'] = { label: this.exercise.locationQuestion, type: String };
      }
      if (this.exercise.additionalWorkingPreferences) {
        this.exercise.additionalWorkingPreferences.forEach((question, i) => {
          this.groups[1].keys.push(`additionalWorkingPreferences ${i}`);
          this.keys[`additionalWorkingPreferences ${i}`] = { label: this.exercise.additionalWorkingPreferences[i].question, type: String };
        });
      }
    }
    this.getReports();
  },
  methods: {
    async getApplicationRecords() {
      this.isLoading = true;
      this.data = null;
      if (this.columns.length > 0) {
        this.data = await httpsCallable(functions, 'getApplicationData')({
          exerciseId: this.exercise.id,
          columns: this.columns,
          type: this.type,
          whereClauses: this.whereClauses,
          statuses: this.statuses,
          stage: this.selectedStage === 'all' ? null : this.selectedStage,
          stageStatus: this.selectedStageStatus === 'all' ? null : this.selectedStageStatus,
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
      const reports = await httpsCallable(functions, 'customReport')({
        columns: this.columns,
        whereClauses: this.whereClauses,
        name: this.customReportName,
      });
      this.customReports = reports.data;
      this.closeModal('modalRefSaveReport');
      this.openModal('modalRefReportSaved');
    },
    async getReports() {
      const reports = await httpsCallable(functions, 'customReport')({});
      this.customReports = reports.data;
    },
    selectReport(event) {
      const report = this.customReports[event.target.value];
      this.columns = report.columns;
      this.whereClauses = report.whereClauses;
    },
    generateReport() {
      this.getApplicationRecords();
      // Scroll to the list of columns
      const element = document.querySelector('#column-list'); // Replace with the actual element selector
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    downloadReport() {
      const header = [...this.columns].map(col => this.keys[col].label);
      const csv = [[...header]];
      for (let i = 0; i < this.data.data.length; i++) {
        csv.push([...this.columns.map(col => this.data.data[i][col])]);
      }

      // Convert the 2D array to CSV, ensuring values are properly escaped
      const mappedCSV = csv
        .map(row => row.map(escapeValue).join(',')) // Escape each value and join them with commas
        .join('\n'); // Join each row with a newline

      const csvContent = `data:text/csv;charset=utf-8,${mappedCSV}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'custom_report.csv');
      document.body.appendChild(link);
      link.click();
    },
    getDraggableKey(item) {
      // The internal index of the array isnt available in draggable so we have to use this fn to generate one so we can pass a
      // value to item-key
      const i = this.columns.indexOf(item);
      return i;
    },
    isUsingFilter(key) {
      // return true if the column is a filter column
      return ['_processing.stage', '_processing.status'].includes(key);
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
