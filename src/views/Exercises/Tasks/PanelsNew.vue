<template>
  <div>
    <form @submit.prevent="validateAndSave">
      <h1 class="govuk-heading-l">
        {{ title }}
      </h1>

      <ErrorSummary
        :errors="errors"
        :show-save-button="false"
        @save="validateAndSave"
      />

      <TextField
        id="panel-name"
        v-model="name"
        label="Panel Name"
        required
      />
      <DateInput
        id="date-from"
        v-model="dateFrom"
        label="Date range from"
        :value="dateFrom"
      />
      <DateInput
        id="date-to"
        v-model="dateTo"
        label="to"
        :value="dateTo"
      />
      <button class="govuk-button">
        Save and continue
      </button>
    </form>
    <button
      class="govuk-button govuk-button--secondary"
      @click="cancel"
    >
      Cancel
    </button>
  </div>
</template>

<script>
import firebase from '@firebase/app';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput';

export default {
  components: {
    ErrorSummary,
    TextField,
    DateInput,
  },
  extends: Form,
  data() {
    return {
      name: null,
      dateFrom: null,
      dateTo: null,
    };
  },
  computed: {
    isSift() {
      // TODO: add this from store panel.js
      const route = this.$route.fullPath.includes('/tasks/sift/');
      return route;
    },
    isSelectionDay() {
      // TODO: add this from store panel.js
      const route = this.$route.fullPath.includes('/tasks/selection/');
      return route;
    },
    title() {
      let returnTitle = 'New Panel for';
      if (this.isSift) {
        returnTitle = `${returnTitle} Sift`;
      }
      if (this.isSelectionDay) {
        returnTitle = `${returnTitle} Selection`;
      }
      return returnTitle;
    },
    type() {
      let returnType = '';
      if (this.isSift) {
        returnType = 'sift';
      }
      if (this.isSelectionDay) {
        returnType = 'selection';
      }
      return returnType;
    },
    exerciseId() {
      return this.$route.params.id;
    },
  },
  methods: {
    async save(isValid) {
      if (isValid) {
        const data = {
          name: this.name,
          type: this.type,
          dateFrom: this.dateFrom,
          dateTo: this.dateTo,
          exerciseId: this.exerciseId,
          status: 'draft',
          // @TODO statuses
          created: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await this.$store.dispatch('panels/create', data);
        this.$router.push({
          name: `exercise-tasks-${this.type}`,
        });
      }
    },
    cancel() {
      this.$router.push({
        name: `exercise-tasks-${this.type}`,
      });
    },
  },
};
</script>
