<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Create an exercise
        </h1>

        <ErrorSummary
          :errors="errors"
          :show-save-button="false"
          @save="save"
        />

        <label class="govuk-heading-m">
          Reference number
        </label>
        <span class="govuk-hint">
          This will be generated automatically when you save.
        </span>

        <TextField
          id="exercise-name"
          v-model="exerciseName"
          label="Exercise name"
          required
        />
        <RadioGroup
          id="is-more-info-needed"
          v-model="addMoreInfo"
          label="Do you want to add more information about this exercise now?"
          hint="You can add exercise contacts, shortlisting methods, timeline dates, or information from HMCTS. You can also do this later"
          required
          :messages="{
            required: 'Please specify whether you\'d like to add more information'
          }"
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <CheckboxGroup
              id="select-more-info"
              v-model="addMoreInfoSelection"
              label="What do you want to add?"
              hint="Select all that apply."
            >
              <CheckboxItem
                value="summary"
                label="Website listing"
              />
              <CheckboxItem
                value="contacts"
                label="Exercise contacts"
              />
              <CheckboxItem
                value="shortlisting"
                label="Shortlisting methods"
              />
              <CheckboxItem
                value="timeline"
                label="Timeline"
              />
              <CheckboxItem
                value="vacancy"
                label="Vacancy information"
              />
              <CheckboxItem
                value="eligibility"
                label="Eligibility Information"
              />
              <CheckboxItem
                value="working-preferences"
                label="Working Preferences"
              />
              <CheckboxItem
                value="assessment-options"
                label="Assessment Options"
              />
              <CheckboxItem
                value="downloads"
                label="Exercise Downloads"
              />
            </CheckboxGroup>
          </RadioItem>

          <RadioItem
            :value="false"
            label="No - I'll do this later"
          />
        </RadioGroup>
        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';

export default {
  components: {
    ErrorSummary,
    TextField,
    RadioGroup,
    RadioItem,
    CheckboxGroup,
    CheckboxItem,
    BackLink,
  },
  extends: Form,
  data() {
    return {
      exerciseName: null,
      addMoreInfo: null,
      addMoreInfoSelection: null,
    };
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        const data = {
          name: this.exerciseName,
          exerciseMailbox: this.$store.state.auth.currentUser.email,
        };
        await this.$store.dispatch('exerciseDocument/create', data);
        const selectedPages = this.addMoreInfo ? this.addMoreInfoSelection : [];
        this.$store.dispatch('exerciseCreateJourney/start', selectedPages);
        this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']());
      }
    },
  },
};
</script>
