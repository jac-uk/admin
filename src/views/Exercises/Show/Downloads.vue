<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="canEdit"
        class="govuk-link"
        :to="{name: 'exercise-edit-downloads'}"
      >
        Update downloads
      </router-link>
    </div>
    <h2 class="govuk-heading-l">
      Downloads
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Job Description Template
        </dt>
        <dd class="govuk-summary-list__value">
          <DownloadLink
            :file-name="exercise.uploadedJobDescriptionTemplate"
            :exercise-id="exerciseId"
          />
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Terms and Conditions Template
        </dt>
        <dd class="govuk-summary-list__value">
          <DownloadLink
            :file-name="exercise.uploadedTermsAndConditionsTemplate"
            :exercise-id="exerciseId"
          />
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Independent Assessor Template
        </dt>
        <dd class="govuk-summary-list__value">
          <DownloadLink
            :file-name="exercise.uploadedIndependentAssessorTemplate"
            :exercise-id="exerciseId"
          />
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Candidate Assessment Form Template
        </dt>
        <dd class="govuk-summary-list__value">
          <DownloadLink
            :file-name="exercise.uploadedCandidateAssessmentFormTemplate"
            :exercise-id="exerciseId"
            :title="downloadNameGenerator"
          />
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import DownloadLink from '@/components/DownloadLink';

export default {
  components: {
    DownloadLink,
  },
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    isApproved() {
      if (this.exercise) {
        switch (this.exercise.state) {
        case 'draft':
        case 'ready':
          return false;
        default:
          return true;
        }
      }
      return false;
    },
    canEdit() {
      return !this.isApproved;
    },    
    userId() {
      return this.$store.state.auth.currentUser.uid;
    },
    exerciseId() {
      return this.$store.getters['exerciseDocument/id'];
    },
    downloadNameGenerator() {
      let outcome = null;
      if (this.exercise.assessmentOptions == 'statement-of-suitability-with-competencies') {
        outcome = 'statement-of-suitability-with-competencies';
      } else if (
        this.exercise.assessmentOptions == 'statement-of-suitability-with-skills-and-abilities' ||
        this.exercise.assessmentOptions == 'statement-of-suitability-with-skills-and-abilities-and-cv'
      ) {
        outcome = 'statement-of-suitability-with-skills-and-abilities';
      }
      let fileName = this.exercise.uploadedCandidateAssessmentFormTemplate;
      if (fileName) {
        outcome = outcome + '.' + fileName.split('.').pop();
      }
      return outcome;
    },    
  },
};
</script>

<style scoped>

</style>
