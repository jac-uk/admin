<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <h2 class="govuk-heading-l">
          Application form
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <CheckboxGroup
          id="application-content"
          v-model="exercise.applicationContent.registration"
          required
          :messages="{required: 'Please choose at least one item'}"
          label="Configure which parts to include on the application form for this exercise"
        >
          <CheckboxItem
            v-for="item in applicationParts"
            :key="item"
            :value="item"
            :label="item | lookup"
          />
        </CheckboxGroup>
        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';

export default {
  components: {
    ErrorSummary,
    CheckboxGroup,
    CheckboxItem,
  },
  filters: {
    lookup(value) {
      const applicationPartsLookup = {
        personalDetails: 'Personal details',
        characterInformation: 'Character information',
        equalityAndDiversitySurvey: 'Equality and diversity',
        partTimeWorkingPreferences: 'Set part-time working preferences',
        locationPreferences: 'Location preferences',
        jurisdictionPreferences: 'Jurisdiction preferences',
        additionalWorkingPreferences: 'Additional preferences',
        welshPosts: 'Welsh posts',
        relevantQualifications: 'Relevant qualifications',
        postQualificationWorkExperience: 'Post-qualification work experience',
        judicialExperience: 'Judicial experience',
        relevantMemberships: 'Relevant memberships',
        relevantExperience: 'Relevant experience',
        employmentGaps: 'Gaps in employment',
        reasonableLengthOfService: 'Reasonable length of service',
        assessorsDetails: 'Independent assessors\' details',
        leadershipJudgeDetails: 'Leadership Judge details',
        statementOfSuitability: 'Statement of suitability',
        cv: 'Curriculum vitae (CV)',
        coveringLetter: 'Covering letter',
        statementOfEligibility: 'Statement of eligibility',
        selfAssessmentCompetencies: 'Self assessment with competencies',
        additionalInfo: 'Additional Information',
      };
      return applicationPartsLookup[value] ? applicationPartsLookup[value] : value;
    },
  },
  extends: Form,
  data(){
    const applicationParts = [
      'personalDetails',
      'characterInformation',
      'equalityAndDiversitySurvey',

      'partTimeWorkingPreferences', // if isSPTWOffered
      'locationPreferences',  // if locationQuestion
      'jurisdictionPreferences',  // if jurisdictionQuestion
      'additionalWorkingPreferences',
      'welshPosts', // if welshRequirement

      // legal
      'relevantQualifications',
      'postQualificationWorkExperience',
      'judicialExperience', // if previousJudicialExperienceApply

      // non-legal
      'relevantMemberships',  // if memberships has content
      'relevantExperience',

      'employmentGaps',
      'reasonableLengthOfService',

      // referees
      'assessorsDetails',
      'leadershipJudgeDetails',

      // assessment options
      'statementOfSuitability',
      'cv',
      'coveringLetter',
      'statementOfEligibility',
      'selfAssessmentCompetencies',

      'additionalInfo',
    ];
    const defaults = {
      applicationContent: {
        registration: applicationParts,
      },
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
      applicationParts,
    };
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-overview'));
    },
  },
};
</script>
