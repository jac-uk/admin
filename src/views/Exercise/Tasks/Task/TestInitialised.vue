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
      When all applications are ready please transfer them to the QT Platform.
    </p>
    <ActionButton
      type="primary"
      @click="updateTask"
    >
      Transfer {{ totalApplications }} applications to the QT Platform
    </ActionButton>
    <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
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
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    totalApplications() {
      return this.task._stats.totalApplications;
    },
  },
  methods: {
    btnNext,
    async updateTask() {
      const response = await functions.httpsCallable('updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      if (response && response.data && response.data.success) {
        this.btnNext();
      }
    },
  },
};
</script>
