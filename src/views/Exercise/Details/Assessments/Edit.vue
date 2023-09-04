<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <div
          v-if="!hasJourney"
          class="text-right"
        >
          <BackLink class="govuk-!-margin-top-0 govuk-!-margin-bottom-0" />
        </div>

        <h2 class="govuk-heading-l">
          Assessment options
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <Checkbox
          v-for="method in Object.values(ASSESSMENT_METHOD)"
          :id="`assessment-method-${method}`"
          :key="method"
          v-model="formData.assessmentMethods[method]"
        >
          {{ $filters.lookup(method) }}
          <TextField
            v-if="method == 'selfAssessmentWithCompetencies' && formData.assessmentMethods[method]"
            id="word-limit"
            v-model="formData.selfAssessmentWordLimit"
            input-class="govuk-input--width-5"
            hint="What is the word limit for this assessment?"
            :required="formData.assessmentMethods[method]"
          />
        </Checkbox>

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink.vue';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import { ASSESSMENT_METHOD } from '@/helpers/constants';

export default {
  components: {
    TextField,
    ErrorSummary,
    BackLink,
    Checkbox,
  },
  extends: Form,
  data() {
    const assessmentMethods = {};
    Object.values(ASSESSMENT_METHOD).forEach(method => {
      // set default values
      assessmentMethods[method] = method === ASSESSMENT_METHOD.INDEPENDENT_ASSESSMENTS;
    });
    const defaults = { assessmentMethods };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      ASSESSMENT_METHOD,
      formData: formData,
    };
  },
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.assessmentOptions'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-assessments'));
    },
  },
};
</script>
