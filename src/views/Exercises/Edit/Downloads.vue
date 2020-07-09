<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Downloads
        </h1>

        <ErrorSummary :errors="errors" />

        <h2 class="govuk-heading-l">
          Job description
        </h2>

        <RepeatableFields
          v-model="exercise.downloads.jobDescriptions"
          ident="job-description"
          :component="repeatableFields.MultiFileUpload"
          :path="uploadPath"
        />

        <h2 class="govuk-heading-l">
          Terms and conditions
        </h2>

        <RepeatableFields
          v-model="exercise.downloads.termsAndConditions"
          ident="terms-and-conditions"
          :component="repeatableFields.MultiFileUpload"
          :path="uploadPath"
        />

        <h2 class="govuk-heading-l">
          Independent assessors
        </h2>

        <RepeatableFields
          v-model="exercise.downloads.independentAssessors"
          ident="independent-assessors"
          :component="repeatableFields.MultiFileUpload"
          :path="uploadPath"
          :max="1"
        />

        <h2 class="govuk-heading-l">
          Candidate assessment form
        </h2>

        <RepeatableFields
          v-model="exercise.downloads.candidateAssessementForms"
          ident="candidate-assessement-forms"
          :component="repeatableFields.MultiFileUpload"
          :path="uploadPath"
        />

        <h2 class="govuk-heading-l">
          Pensions Information
        </h2>

        <RepeatableFields
          v-model="exercise.downloads.pensionsInformation"
          ident="candidate-assessement-forms"
          :component="repeatableFields.MultiFileUpload"
          :path="uploadPath"
        />

        <h2 class="govuk-heading-l">
          Competency framework
        </h2>

        <RepeatableFields
          v-model="exercise.downloads.competencyFramework"
          ident="candidate-assessement-forms"
          :component="repeatableFields.MultiFileUpload"
          :path="uploadPath"
        />

        <h2 class="govuk-heading-l">
          Welsh Translation
        </h2>

        <RepeatableFields
          v-model="exercise.downloads.welshTranslation"
          ident="candidate-assessement-forms"
          :component="repeatableFields.MultiFileUpload"
          :path="uploadPath"
        />

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Form from '@/components/Form/Form';
import BackLink from '@/components/BackLink';
import ErrorSummary from '@/components/Form/ErrorSummary';
import RepeatableFields from '@/components/RepeatableFields';
import MultiFileUpload from '@/components/RepeatableFields/MultiFileUpload';

export default {
  components: {
    BackLink,
    ErrorSummary,
    RepeatableFields,
  },
  extends: Form,
  data() {
    const defaults = {
      downloads: {
        jobDescriptions: [],
        termsAndConditions: [],
        independentAssessors: [],
        candidateAssessementForms: [],
        pensionsInformation: [],
        competencyFramework: [],
      },
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = {
      ...defaults,
      ...data,
    };

    return {
      exercise: exercise,
      repeatableFields: {
        MultiFileUpload,
      },
    };
  },
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
    }),
    ...mapGetters('exerciseDocument', {
      exerciseId: 'id',
    }),
    uploadPath() {
      return `/exercise/${this.exerciseId}`;
    },
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        this.exercise.progress.downloads = true;

        await this.$store.dispatch('exerciseDocument/save', this.exercise);
        this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-downloads'));
      }
    },
  },
};
</script>
