<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Downloads
        </h1>

        <ErrorSummary :errors="errors" />

        <!-- Make JD and TC Repeatable. Give them ID's in the title and refs. Include a title box in there. -->
        <FileUpload
          id="job-description"
          ref="job-description"
          v-model="exercise.jobDescription"
          name="job-description"
          :path="uploadPath"
          label="Job description"
          required
        />

        <FileUpload
          id="terms-and-conditions"
          ref="terms-and-conditions"
          v-model="exercise.termsAndConditions"
          name="terms-and-conditions"
          :path="uploadPath"
          label="Terms and conditions"
          required
        />

        <FileUpload
          id="independent-assessors"
          ref="independent-assessors"
          v-model="exercise.independentAssessors"
          name="independent-assessors"
          :path="uploadPath"
          label="Independent assessors"
          required
        />

        <FileUpload
          id="candidate-assessment"
          ref="candidate-assessment"
          v-model="exercise.candidateAssessment"
          name="candidate-assessment"
          :path="uploadPath"
          label="Candidate assessment"
          required
        />

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@/components/Form/Form';
import BackLink from '@/components/BackLink';
import FileUpload from '@/components/Form/FileUpload';
import ErrorSummary from '@/components/Form/ErrorSummary';

export default {
  components: {
    BackLink,
    FileUpload,
    ErrorSummary,
  },
  extends: Form,
  data() {
    const defaults = {
      jobDescription: null,
      termsAndConditions: null,
      independentAssessors: null,
      candidateAssessment: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
    };
  },
  computed: {
    userId() {
      return this.$store.state.auth.currentUser.uid;
    },
    exerciseId() {
      return this.$store.getters['exerciseDocument/id'];
    },
    uploadPath() {
      return `/exercise/${this.exercise.id}/user/${this.userId}`;
    },
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        const isJobDescriptionUploaded = await this.$refs['job-description'].upload();
        const isTermsAndConditionsUploaded = await this.$refs['terms-and-conditions'].upload();
        const isIndependentAssessorsUploaded = await this.$refs['independent-assessors'].upload();
        const isCandidateAssessmentUploaded = await this.$refs['candidate-assessment'].upload();
        if (!isJobDescriptionUploaded || !isTermsAndConditionsUploaded
          || !isIndependentAssessorsUploaded || !isCandidateAssessmentUploaded) {
          return false;
        }
        await this.$store.dispatch('exerciseDocument/save', this.exercise);
        this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-downloads'));
      }
    },
  },
};
</script>
