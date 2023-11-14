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

    <form @submit.prevent="validateAndSave">
      <CheckboxGroup
        id="candidate-form-parts"
        v-model="formData.formParts"
        label="Form parts go here"
      >
        <CheckboxItem
          v-for="part in CandidateFormParts"
          :key="part"
          :value="part"
          :label="$filters.lookup(part)"
        />
      </CheckboxGroup>

      <CheckboxGroup
        v-if="formData.formParts.indexOf('panelConflicts') >= 0"
        id="panellists"
        v-model="formData.panellists"
        label="Panellists"
      >
        <CheckboxItem
          v-for="panellist in panellists"
          :key="panellist.id"
          :value="panellist.id"
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
import { getTaskSteps } from '@/helpers/exerciseHelper';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
import { functions } from '@/firebase';

export default {
  components: {
    ErrorSummary,
    CheckboxGroup,
    CheckboxItem,
    FullScreenButton,
    ProgressBar,
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
    return {
      formData: {
        formParts: [],
      },
      CandidateFormParts: [
        'candidateAvailability',
        'panelConflicts',
        'commissionerConflicts',
      ],
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
      return this.$store.state.panellists.records;
    },
  },
  created() {
    this.$store.dispatch('panellists/bind', {});
  },
  methods: {
    btnNext,
    async save() {
      // TODO save form data in a new `CandidateForms` document
      // await this.$store.dispatch('candidateForm/save', this.formData);
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
