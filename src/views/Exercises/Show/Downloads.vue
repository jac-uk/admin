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
  },
};
</script>

<style scoped>

</style>
