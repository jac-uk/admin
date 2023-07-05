<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ $filters.lookup(type) }}
    </h1>
    <div
      class="govuk-inset-text"
    >
      It looks like the {{ $filters.lookup(type) }} has already been completed.
    </div>

    <RadioGroup
      id="selected-qt"
      v-model="formData.selectedQT"
      label="Please choose the completed live test"
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

    <Checkbox
      id="update-status"
      v-model="formData.allowStatusUpdates"
      label="Allow application status updates"
      hint="When this is checked, this task will be allowed to update the status of applications"
    >
      Yes - allow this task to update application status
    </Checkbox>

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
import defaultView from './default.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import { QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';
import { TASK_QT_MAP } from '@/helpers/constants';
import { functions } from '@/firebase';

export default {
  components: {
    RadioGroup,
    RadioItem,
    Checkbox,
  },
  extends: defaultView,
  data() {
    return {
      formData: {
        selectedQT: '',
        allowStatusUpdates: true,
      },
    };
  },
  computed: {
    qualifyingTests() {
      return this.$store.getters['qualifyingTest/getCompletedQTs'].filter(qualifyingTest => qualifyingTest.mode !== QUALIFYING_TEST.MODE.DRY_RUN);
    },
  },
  created() {
    this.$store.dispatch('qualifyingTest/bindQTs', { exerciseId: this.exercise.id, type: TASK_QT_MAP[this.type] });
  },
  methods: {
    async btnContinue() {
      const params = {
        exerciseId: this.exercise.id,
        type: this.type,
        qualifyingTestId: this.formData.selectedQT,
        allowStatusUpdates: this.formData.allowStatusUpdates,
      };
      await functions.httpsCallable('createTaskForExistingQT')(params);
      this.btnNext();
    },
  },
};
</script>
