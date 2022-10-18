<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>
    <p class="govuk-body-l govuk-!-margin-bottom-4">
      This test is hosted on the
      <a
        :href="`https://qt-admin-develop.judicialappointments.digital/folder/${task.folderId}/qualifying-tests/${task.test.id}`"
        target="_blank"
      >
        QT Platform</a>.
      When the test and mop-ups have been completed you may continue.
    </p>
    <ActionButton
      class="govuk-!-margin-bottom-0"
      type="primary"
      @click="btnContinue"
    >
      Continue
    </ActionButton>
    <span
      v-if="errorMessage"
      class="govuk-body text--error"
    >
      {{ errorMessage }}
    </span>
    <div class="panel govuk-!-margin-top-6 govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
      <div class="govuk-caption-m">
        URL for candidates to take this test
      </div>
      <h2
        class="govuk-heading-m govuk-!-margin-bottom-2"
      >
        https://qt-develop.judicialappointments.digital/{{ task.test.id }}
      </h2>
      <button
        type="button"
        class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
        @click="copyToClipboard(`https://qt-develop.judicialappointments.digital/${task.test.id}`)"
      >
        Copy URL to clipboard
      </button>
    </div>
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { functions } from '@/firebase';
import { TASK_TYPE } from '@/helpers/constants';

export default {
  components: {
    ActionButton,
  },
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      errorMessage: '',
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    isScenario() {
      return this.type === TASK_TYPE.SCENARIO;
    },
  },
  methods: {
    btnNext,
    async btnContinue() {
      this.errorMessage = '';
      const response = await functions.httpsCallable('updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      if (response && response.data) {
        if (response.data.success) {
          this.btnNext();
          return true;
        } else {
          this.errorMessage = response.data.message;
          return false;
        }
      } else {
        this.errorMessage = 'Sorry, an error occured';
        return false;
      }
    },
    async copyToClipboard(text) {
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    },
  },
};
</script>
