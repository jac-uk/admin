<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="text-right govuk-grid-column-one-third">
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <form
      @submit.prevent="validateAndSave"
    >
      <ErrorSummary
        :errors="errors"
      />

      <p class="govuk-body-l">
        Please finalise selection day interview dates and panellist details below
      </p>

      <Checkbox
        id="ask-candidate-availability"
        v-model="askCandidateAvailability"
      >
        Do you want to ask candidates about their availability?
      </Checkbox>
      <div v-if="askCandidateAvailability && formData.candidateAvailabilityDates">
        <h2 class="govuk-heading-m govuk-!-margin-bottom-2">
          Which dates would you like to check for candidate availability?
        </h2>
        <RepeatableFields
          v-model="formData.candidateAvailabilityDates"
          :component="repeatableFields.LocationDate"
          ident="candidate-availability-date"
          :allow-empty="false"
          required
        />
      </div>

      <div v-if="formData.parts.indexOf('panelConflicts') >= 0">
        <h2 class="govuk-heading-m govuk-!-margin-bottom-2">
          Add panellists (first name last name) to be checked for panel conflicts
        </h2>
        <RepeatableFields
          v-model="formData.panellists"
          :component="repeatableFields.Panellist"
          ident="panellist"
          type-name="panellist"
          :allow-empty="true"
        />
      </div>

      <button class="govuk-button">
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { beforeRouteEnter, btnNext } from '../helper';
import { getTaskSteps, exerciseApplicationParts } from '@/helpers/exerciseHelper';
import { APPLICATION_FORM_PARTS } from '@/helpers/constants';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import { functions } from '@/firebase';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import LocationDate from './LocationDate.vue';
import { shallowRef } from 'vue';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import Panellist from './Panellist.vue';

export default {
  components: {
    ErrorSummary,
    Checkbox,
    FullScreenButton,
    ProgressBar,
    RepeatableFields,
  },
  extends: Form,
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    const formParts = [
      APPLICATION_FORM_PARTS.CANDIDATE_AVAILABILITY,
      APPLICATION_FORM_PARTS.PANEL_CONFLICTS,
      APPLICATION_FORM_PARTS.CHARACTER_CHECKS,
      APPLICATION_FORM_PARTS.REASONABLE_ADJUSTMENTS,
    ];
    const optionalAppplicationParts = [
      APPLICATION_FORM_PARTS.COMMISSIONER_CONFLICTS,
      APPLICATION_FORM_PARTS.LOCATION_PREFERENCES,
      APPLICATION_FORM_PARTS.JURISDICTION_PREFERENCES,
      APPLICATION_FORM_PARTS.WELSH_POSTS,
    ];
    const exercise = this.$store.state.exerciseDocument.record;
    const applicationParts = exerciseApplicationParts(exercise).filter(part => optionalAppplicationParts.indexOf(part) >= 0);
    const candidateFormParts = [
      ...formParts,
      ...applicationParts,
    ];
    return {
      formData: {
        openDate: null,
        closeDate: null,
        parts: candidateFormParts,  // hardcoded
        panellists: [],
        candidateAvailabilityDates: null,
      },
      repeatableFields: shallowRef({
        LocationDate,
        Panellist,
      }),
      candidateFormParts,
      askCandidateAvailability: true,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
  },
  watch: {
    askCandidateAvailability(newValue) {
      if (newValue === true) {
        this.formData.candidateFormParts = this.candidateFormParts;
      } else {
        this.formData.candidateFormParts = this.candidateFormParts.filter(part => part !== APPLICATION_FORM_PARTS.CANDIDATE_AVAILABILITY);
      }
    },
  },
  async created() {
    await this.$store.dispatch('candidateForm/bind', this.task.formId);
    const candidateForm = this.$store.getters['candidateForm/data']();
    this.formData.openDate = candidateForm.openDate;
    this.formData.closeDate = candidateForm.closeDate;
    this.formData.candidateAvailabilityDates = candidateForm.candidateAvailabilityDates ? candidateForm.candidateAvailabilityDates : [];
  },
  methods: {
    btnNext,
    async save() {
      const saveData = {
        exercise: {
          id: this.exercise.id,
        },
        task: {
          type: this.task.type,
        },
        ...this.formData,
      };

      console.log('save', saveData);
      await this.$store.dispatch('candidateForm/update', { saveData, formId: this.task.formId });
      await this.btnContinue();
    },
    async btnContinue() {
      await httpsCallable(functions, 'updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
  },
};
</script>
