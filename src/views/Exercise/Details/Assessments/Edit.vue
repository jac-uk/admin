<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <h2 class="govuk-heading-l">
          Assessment options
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />
        <div
          v-for="method in Object.values(ASSESSMENT_METHOD)"
          :key="method"
        >
          <!-- remove CV assessment option -->
          <template v-if="method !== ASSESSMENT_METHOD.CV">
            <Checkbox
              :id="`assessment-method-${method}`"
              v-model="formData.assessmentMethods[method]"
            >
              {{ $filters.lookup(method) }}
            </Checkbox>
            <div
              v-if="method == ASSESSMENT_METHOD.SELF_ASSESSMENT_WITH_COMPETENCIES && formData.assessmentMethods[method]"
            >
              <span
                class="govuk-hint"
              >
                Please add a word limit for each question within the self assessment.
              </span>
              <RepeatableFields
                v-model="formData.selfAssessmentWordLimits"
                :component="repeatableFields.SelfAssessmentSection"
                type-name="Self Assessment Section"
                required
              />
              <slot name="removeButton" />
            </div>
          </template>
        </div>
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
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import SelfAssessmentSection from '@/components/RepeatableFields/SelfAssessmentSection.vue';
import { ASSESSMENT_METHOD } from '@/helpers/constants';
import { shallowRef } from 'vue';

export default {
  components: {
    RepeatableFields,
    ErrorSummary,
    Checkbox,
  },
  extends: Form,
  data() {
    const assessmentMethods = {};
    Object.values(ASSESSMENT_METHOD).forEach(method => {
      // set default values
      assessmentMethods[method] = method === ASSESSMENT_METHOD.INDEPENDENT_ASSESSMENTS;
    });
    const defaults = {
      assessmentMethods,
      selfAssessmentWordLimits: [],
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      ASSESSMENT_METHOD,
      formData: formData,
      repeatableFields: shallowRef({
        SelfAssessmentSection,
      }),
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
