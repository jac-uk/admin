<template>
  <div class="govuk-grid-row">
    <h2 class="govuk-heading-l">
      Multiple Exercise Custom report
    </h2>
    <div
      class="moj-page-header-actions__actions float-right"
    >
      <div class="moj-button-menu">
        <div class="moj-button-menu__wrapper">
          <!-- <p>Load saved report:</p> -->
          <!-- <select
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
          </select> -->
          <button
            class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
            :disabled="isLoading || selectedColumns.length === 0"
            @click="generateReport"
          >
            Generate Report
          </button>
          <button
            class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
            :disabled="isLoading || !data || selectedColumns.length === 0"
            @click="downloadReport"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
    <div class="govuk-inset-text govuk-!-margin-bottom-2">
      <p class="govuk-body">
        <!-- This report is experimental. Please provide feedback if something doesn't look right. -->
        Choose the fields you wish to include in your custom report from the dropdown below and then click 'generate' to produce your report on screen. Only candidates with the status 'Applied' will be included in the report.<br>Download the report when you are satisfied with the content.
      </p>
    </div>
    <!-- Exercises -->
    <div class="govuk-grid-row panel govuk-!-margin-bottom-3">
      <span class="govuk-caption-m govuk-!-margin-bottom-2"> Select Exercises to display: </span>
      <div class="govuk-heading-m govuk-!-margin-bottom-0">
        <select
          v-model="selectedExercise"
          class="govuk-select"
          @change="selectExercise($event)"
        >
          <option
            value=""
            disabled
            selected
          >
            Select...
          </option>
          <option
            v-for="(exercise, index) in exerciseNames"
            :key="index"
            :label="exercise.name"
          >
            {{ exercise.referenceNumber + ": " + exercise.name }}
          </option>
        </select>
      </div>
    </div>
    <div
      v-if="selectedExercises.length > 0"
      id="exercise-list"
      class="panel govuk-!-margin-bottom-3"
    >
      <h2 class="govuk-!-margin-bottom-0 govuk-!-margin-top-0">
        Selected Exercises:
      </h2>

      <div
        v-if="selectedExercises.length"
      >
        <template
          v-for="(element, index) in selectedExercises"
          :key="index"
        >
          <div
            :data-index="index"
            class="govuk-!-margin-right-3 moj-filter__tag"
            @click="removeExercise"
          >
            {{ element }}
          </div>
        </template>
      </div>

      <div class="govuk-hint govuk-!-margin-top-3 govuk-!-margin-bottom-0">
        Click to remove
      </div>
    </div>

    <!-- Columns -->
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full-width">
        <div class="panel govuk-!-margin-bottom-3">
          <span class="govuk-caption-m govuk-!-margin-bottom-2"> Select a column to display: </span>
          <div class="govuk-heading-m govuk-!-margin-bottom-0">
            <div>
              <select
                v-model="selectedColumn"
                class="govuk-select"
                :disabled="isLoading || !selectedExercises.length"
                @change="selectColumn($event)"
              >
                <option value="">
                  {{ selectedExercises.length ? 'Select...' : 'Select at least one Exercise first' }}
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
      <!--
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
      -->
    </div>

    <div
      v-if="selectedColumns.length > 0"
      id="column-list"
      class="panel govuk-!-margin-bottom-3"
    >
      <h2 class="govuk-!-margin-bottom-0 govuk-!-margin-top-0">
        Show columns:
      </h2>

      <draggable
        v-if="selectedColumns.length"
        v-model="selectedColumns"
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

    <div v-if="data">
      {{ data }}
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import _ from 'lodash';
import { mapState } from 'vuex';

// Prevents warnings and errors associated with using @vue/compat
draggable.compatConfig = { MODE: 3 };

export default {
  name: 'MultipleExerciseCustomReport',
  components: {
    draggable,
  },
  data(){
    return {
      isLoading: null,
      data: null,
      selectedColumn: '',
      selectedColumns: [],
      selectedExercise: '',
      selectedExercises: [],
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
        {
          name: 'Resignation from the Department for Work and Pensions (DWP)',
          keys: [
            'resignationFromDWP.workingAtDWP',
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
        'resignationFromDWP.workingAtDWP': { label: 'Currently work at the Department for Work and Pensions (DWP)?', type: Boolean },
      },
    };
  },
  computed: {
    ...mapState({
      exerciseNames: state => state.exerciseCollection.records.map(record => {
        return {
          name: record.name,
          referenceNumber: record.referenceNumber,
          id: record.id,
        };
      }),
    }),
  },
  mounted(){
    this.fetchAllExercises();
  },
  methods: {
    fetchAllExercises() {
      this.$store.dispatch('exerciseCollection/getAll');
    },
    selectExercise(event) {
      if (!_.includes(this.selectedExercises, event.target.value)) {
        this.selectedExercises.push(event.target.value);
      }
      this.selectedExercise = '';
    },
    removeExercise(event) {
      const index = event.target.getAttribute('data-index');
      this.selectedExercises.splice(index, 1);
    },
    selectColumn(event) {
      if (!_.includes(this.selectedColumns, event.target.value)) {
        this.selectedColumns.push(event.target.value);
      }
      this.selectedColumn = '';
    },
    removeColumn(event) {
      const index = event.target.getAttribute('data-index');
      this.selectedColumns.splice(index, 1);
    },
    generateReport() {
      console.log('generateReport');
      // this.getApplicationRecords();
      // // Scroll to the list of columns
      // const element = document.querySelector('#column-list'); // Replace with the actual element selector
      // if (element) {
      //   element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // }
    },
    async getApplicationRecords() {
      console.log('getApplicationRecords');
      // this.isLoading = true;
      // this.data = null;
      // if (this.columns.length > 0) {
      //   this.data = await httpsCallable(functions, 'getApplicationData')({
      //     exerciseId: this.exercise.id,
      //     columns: this.columns,
      //     type: this.type,
      //     whereClauses: this.whereClauses,
      //     statuses: this.statuses,
      //     stage: this.selectedStage === 'all' ? null : this.selectedStage,
      //     stageStatus: this.selectedStageStatus === 'all' ? null : this.selectedStageStatus,
      //   });
      // }
      // this.isLoading = false;
    },
    downloadReport() {
      const header = [...this.columns].map(col => this.keys[col].label);
      const csv = [[...header]];

      for (let i = 0; i < this.data.data.length; i++) {
        csv.push([...this.columns.map(col => this.data.data[i][col])]);
      }

      // Convert the 2D array to CSV, ensuring values are properly escaped
      const escapeValue = value => {
        if (value == null) return ''; // Handle null or undefined
        const escaped = String(value).replace(/"/g, '""'); // Escape double quotes
        return `"${escaped}"`; // Enclose in double quotes
      };

      const mappedCSV = csv
        .map(row => row.map(escapeValue).join(',')) // Escape each value and join with commas
        .join('\n'); // Join rows with a newline

      const csvContent = `data:text/csv;charset=utf-8,${mappedCSV}`;
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
  text-transform: capitalize;
}
td:first-letter {
  text-transform: capitalize;
}
.moj-filter__tag {
  cursor: pointer;
}
</style>
