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
      <ErrorSummary
        :errors="errors"
      />

      <CheckboxGroup
        id="candidate-form-parts"
        v-model="formData.parts"
        label="Which pertinent information would you like to collect/reconfirm with candidates?"
        required
      >
        <CheckboxItem
          v-for="part in CandidateFormParts"
          :key="part"
          :value="part"
          :label="$filters.lookup(part)"
        />
      </CheckboxGroup>

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
    const exercise = this.$store.state.exerciseDocument.record;
    const openDate = exercise.preSelectionDayQuestionnaireSendDate;
    const closeDate = exercise.preSelectionDayQuestionnaireReturnDate;
    return {
      formData: {
        openDate: openDate,
        closeDate: closeDate,
        parts: [],
        panellists: [],
      },
      CandidateFormParts: [ // TODO check these names are correct and then add human-readable versions to lookup filter
        'candidateAvailability',
        'panelConflicts',
        'commissionerConflicts',
        'characterChecks',
        'reasonableAdjustments',
        'workingPreferences',
        'welshPosts',
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
      return this.$store.state.panellists.records.map(item => ({ id: item.id, fullName: item.fullName }));
    },
  },
  created() {
    this.$store.dispatch('panellists/bind', {});
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
      await this.$store.dispatch('candidateForm/create', saveData);
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
