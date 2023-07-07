<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ $filters.lookup(type) }}
    </h1>
    <p class="govuk-body govuk-!-margin-bottom-4">
      Please log in to the
      <a
        :href="testAdminURL"
        target="_blank"
      >
        QT Platform</a> to set up the {{ $filters.lookup(type) }}.
    </p>
    <p class="govuk-body govuk-!-margin-bottom-4">
      When all applications are ready please transfer them to the QT Platform.
    </p>
    <ActionButton
      type="primary"
      @click="updateTask"
    >
      Transfer applications to the QT Platform
    </ActionButton>
    <!-- <div class="panel govuk-!-margin-top-6 govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
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
        @click="copyToClipboard(testURL)"
      >
        Copy URL to clipboard
      </ActionButton>
    </div> -->
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
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
      url += `/folder/${this.task.folderId}/qualifying-tests/${this.task.test.id}/edit`;
      return url;
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
    async copyToClipboard(text) {
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      return true;
    },
  },
};
</script>
