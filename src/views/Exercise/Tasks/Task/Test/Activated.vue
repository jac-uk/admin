<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="text-right govuk-grid-column-one-half">
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <p class="govuk-body govuk-!-margin-bottom-4">
      Please log in to the
      <a
        :href="testAdminURL"
        target="_blank"
      >
        QT Platform</a> to run and manage the {{ $filters.lookup(type) }}.
    </p>
    <p class="govuk-body govuk-!-margin-bottom-4">
      When the test and mop-ups have been completed you may continue.
    </p>
    <ActionButton
      class="govuk-!-margin-bottom-0"
      type="primary"
      :action="btnContinue"
    >
      Continue
    </ActionButton>
    <span
      v-if="errorMessage"
      class="govuk-body text--error govuk-!-display-inline-block govuk-!-margin-bottom-0 govuk-!-margin-left-2 govuk-!-padding-top-1"
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
        {{ testURL }}
      </h2>
      <ActionButton
        class="govuk-!-margin-bottom-0"
        :action="() => copyToClipboard(testURL)"
      >
        Copy URL to clipboard
      </ActionButton>
    </div>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { beforeRouteEnter, btnNext } from '../helper';
import { getTaskSteps } from '@jac-uk/jac-kit/helpers/exerciseHelper';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { functions } from '@/firebase';
import { TASK_TYPE } from '@/helpers/constants';

export default {
  components: {
    ActionButton,
    FullScreenButton,
    ProgressBar,
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
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
    isScenario() {
      return this.type === TASK_TYPE.SCENARIO;
    },
    testURL() {
      let url = '';
      if (this.$store.getters.isProduction) {
        url = 'https://qt.judicialappointments.digital';
      } else {
        url = 'https://qt-develop.judicialappointments.digital';
      }
      url += `/${this.task.test.id}`;
      return url;
    },
    testAdminURL() {
      let url = '';
      if (this.$store.getters.isProduction) {
        url = 'https://qt-admin.judicialappointments.digital';
      } else {
        url = 'https://qt-admin-develop.judicialappointments.digital';
      }
      url += `/folder/${this.task.folderId}/qualifying-tests/${this.task.test.id}`;
      return url;
    },
  },
  methods: {
    btnNext,
    async btnContinue() {
      this.errorMessage = '';
      const response = await httpsCallable(functions, 'updateTask')({
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
      return true;
    },
  },
};
</script>
