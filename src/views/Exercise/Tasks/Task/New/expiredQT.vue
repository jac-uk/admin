<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>
    <p
      class="govuk-body"
    >
      It looks like the {{ type | lookup }} has already been completed. Please choose the correct test from below and continue
    </p>

    <RadioGroup
      id="selected-qt"
      v-model="formData.selectedQT"
      required
      :messages="{
        required: 'Please choose one of the following options'
      }"
    >
      <RadioItem
        v-for="qualifyingTest in qualifyingTests"
        :key="qualifyingTest.id"
        :value="qualifyingTest.id"
        :label="qualifyingTest.title"
      />
    </RadioGroup>
    <ActionButton
      class="govuk-!-margin-bottom-0"
      type="primary"
      :disabled="!formData.selectedQT"
      @click="btnContinue"
    >
      Continue
    </ActionButton>

  </div>
</template>

<script>
import defaultView from './default';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';
import { QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';
import { functions } from '@/firebase';

export default {
  extends: defaultView,
  components: {
    RadioGroup,
    RadioItem,
  },
  data() {
    return {
      formData: {
        selectedQT: '',
      },
    };
  },
  computed: {
    qualifyingTests() {
      return this.$store.getters['qualifyingTest/getCompletedQTs'].filter(qualifyingTest => qualifyingTest.mode !== QUALIFYING_TEST.MODE.DRY_RUN);
    },
  },
  created() {
    this.$store.dispatch('qualifyingTest/bindQTs', { exerciseId: this.exercise.id, type: 'scenario' });
  },
  methods: {
    async btnContinue() {
      const params = {
        exerciseId: this.exercise.id,
        type: this.type,
        qualifyingTestId: this.formData.selectedQT,
      };
      await functions.httpsCallable('createTaskForExistingQT')(params);
      this.btnNext();
    },
  },
};
</script>
