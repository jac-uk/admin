<template>
  <div>
    <form @submit.prevent="validateAndSave">
      <h1 class="govuk-heading-l">{{ title }}</h1>
      
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
        v-model="datefrom"
        label="Date range from"
        :value="datefrom"
      />
      <DateInput
        id="date-to"
        v-model="dateto"
        label="to"
        :value="dateto"
      />
      <TextareaInput
        id="additional"
        v-model="additional"
        label="Additional information"
        rows="3"
      />
      <TextField
        id="googledrive"
        v-model="googledrive"
        label="Google Drive Folder URL"
      />

      <button class="govuk-button">
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import firebase from '@firebase/app';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';

export default {
  components: {
    ErrorSummary,
    TextField,
    DateInput,
    TextareaInput,
  },
  extends: Form,
  data() {
    return {
      name: null,
      datefrom: null,
      dateto: null,
      additional: null,
      googledrive: null,
    };
  },
  computed: {
    isSift() {
      const route = this.$route.fullPath.includes('/tasks/sift/');
      return route;
    },
    isSelectionDay() {
      const route = this.$route.fullPath.includes('/tasks/selection-days/');
      return route;
    },
    title() {
      let returnTitle = 'New Panel for';
      if (this.isSift) {
        returnTitle = `${returnTitle} Sift`; 
      }
      if (this.isSelectionDay) {
        returnTitle = `${returnTitle} Selection Days`; 
      }
      return returnTitle;
    },
    type() {
      let returnType = '';
      if (this.isSift) {
        returnType = 'sift';
      }
      if (this.isSelectionDay) {
        returnType = 'selection-days';
      }
      return returnType;
    },
    exerciseId() {
      return this.$route.params.id;
    },
  },
  methods: {
    async validateAndSave() {
      this.validate();
      if (this.isValid()) {
        const data = {
          name: this.name,
          type: this.type,
          datefrom: this.datefrom,
          dateto: this.dateto,
          additional: this.additional,
          googledrive: this.googledrive,
          exerciseId: this.exerciseId,
          status: 'created',
          created: firebase.firestore.FieldValue.serverTimestamp(),
        };
        // eslint-disable-next-line no-console
        console.log('validateAndSave', data);
        await this.$store.dispatch('panels/create', data);
        this.$router.push({ 
          name: `exercise-tasks-${this.type}`,
        });
      }
    },
  },
};
</script>

<style scoped>

</style>
