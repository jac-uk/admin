<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }} test
    </h1>
    <p class="govuk-body-l">
      This test is hosted on the
      <a
        :href="`https://qt-admin-develop.judicialappointments.digital/folder/${task.folderId}/qualifying-tests/${task.test.id}`"
        target="_blank"
      >
        QT Platform</a>.
      When completed you may continue.
    </p>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <div class="govuk-caption-m">
            Participants
          </div>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ task.applications.length }}
          </h2>
        </div>
      </div>

      <div class="govuk-grid-column-one-half">
        <ActionButton
          class="govuk-!-margin-bottom-0"
          type="primary"
          @click="btnContinue"
        >
          Continue
        </ActionButton>
        <div v-if="errorMessage" class="govuk-body govuk-!-margin-top-2 text--error">{{ errorMessage }}</div>
      </div>
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
  },
};
</script>
