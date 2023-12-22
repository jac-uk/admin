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

      <div v-if="formData.parts.indexOf('candidateAvailability') >= 0 && formData.candidateAvailabilityDates">
        <h2 class="govuk-heading-m govuk-!-margin-bottom-2">
          Which dates would you like to check for candidate availability?
        </h2>
        <RepeatableFields
          v-model="formData.candidateAvailabilityDates"
          :component="repeatableFields.LocationDate"
          :allow-empty="false"
          required
        />
      </div>

      <CheckboxGroup
        v-if="formData.parts.indexOf('panelConflicts') >= 0"
        id="panellists"
        v-model="formData.panellists"
        label="Which panellists should be checked for panel conflicts?"
        required
      >
        <CheckboxItem
          v-for="panellist in panellists"
          :key="panellist.id"
          :value="{ id: panellist.id, name: panellist.fullName }"
          :label="panellist.fullName"
        />
      </CheckboxGroup>

      <button class="govuk-button">
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from '../helper';
import { getTaskSteps, exerciseApplicationParts } from '@/helpers/exerciseHelper';
import { APPLICATION_FORM_PARTS } from '@/helpers/constants';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
import { functions } from '@/firebase';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import LocationDate from './LocationDate.vue';
import { shallowRef } from 'vue';

export default {
  components: {
    ErrorSummary,
    CheckboxGroup,
    CheckboxItem,
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
      }),
      CandidateFormParts: candidateFormParts,
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
    panellists() {
      return this.$store.state.panellists.records.map(item => ({ id: item.id, fullName: item.fullName }));
    },
  },
  async created() {
    this.$store.dispatch('panellists/bind', {});
    await this.$store.dispatch('candidateForm/bind', this.task.formId);
    const candidateForm = this.$store.getters['candidateForm/data']();
    this.formData.openDate = candidateForm.openDate;
    this.formData.closeDate = candidateForm.closeDate;
    this.formData.panellists = candidateForm.panellists ? candidateForm.panellists : [];
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
      await this.$store.dispatch('candidateForm/update', { saveData, formId: this.task.formId });
      await this.btnContinue();
    },
    async btnContinue() {
      await functions.httpsCallable('updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
  },
};
</script>
