<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Contacts
        </h1>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <p class="govuk-body-l">
          You can return to this page later to add or change contact emails.
        </p>

        <h2 class="govuk-heading-l">
          JAC contacts
        </h2>

        <TextField
          id="exercise-mailbox"
          v-model="exercise.exerciseMailbox"
          label="Exercise mailbox"
          type="email"
          required
          :pattern="patternJACEmail"
        />

        <TextField
          id="exercise-email-signature-name"
          v-model="exercise.emailSignatureName"
          label="Email signature name"
          required
        />

        <TextField
          id="exercise-phone-number"
          v-model="exercise.exercisePhoneNumber"
          label="Exercise phone number"
          type="tel"
          required
        />

        <RepeatableFields
          v-model="exercise.seniorSelectionExerciseManager"
          :component="repeatableFields.SeniorSelectionExerciseManager"
          required
          :pattern="patternJACEmail"
        />

        <RepeatableFields
          v-model="exercise.selectionExerciseManager"
          :component="repeatableFields.SelectionExerciseManager"
          required
          :pattern="patternJACEmail"
        />

        <RepeatableFields
          v-model="exercise.selectionExerciseOfficer"
          :component="repeatableFields.SelectionExerciseOfficer"
          required
        />

        <RepeatableFields
          v-model="exercise.assignedCommissioner"
          :component="repeatableFields.AssignedCommissioner"
          required
        />

        <h2 class="govuk-heading-l">
          Other contacts
        </h2>

        <CheckboxGroup
          id="appropriate-authority"
          v-model="exercise.appropriateAuthority"
          label="Appropriate authority"
          hint="Select all that apply."
        >
          <CheckboxItem
            value="lord-chancellor"
            label="Lord Chancellor"
          />
          <CheckboxItem
            value="lord-chief-justice"
            label="Lord Chief Justice"
          />
          <CheckboxItem
            value="senior-president-of-tribunals"
            label="Senior President of Tribunals (SPT)"
          />
          <CheckboxItem
            value="scottish-ministers"
            label="Scottish ministers"
          />
          <CheckboxItem
            value="welsh-government"
            label="Welsh Government"
          />
          <CheckboxItem
            value="other"
            label="Other"
          >
            <TextField
              id="other-text-input"
              v-model="exercise.otherAppropriateAuthority"
              label="Name of the appropriate authority"
              required
            />
          </CheckboxItem>
        </CheckboxGroup>

        <TextField
          id="hmcts-welshgov-lead"
          v-model="exercise.hmctsWelshGovLead"
          label="HMCTS or Welsh Government lead contact"
          type="email"
        />

        <TextField
          id="hmcts-welshgov-contact"
          v-model="exercise.hmctsWelshGovContact"
          label="HMCTS or Welsh Government contact"
          type="email"
        />

        <TextField
          id="judicial-office-contact"
          v-model="exercise.judicialOfficeContact"
          name="judicial-office-contact"
          label="Judicial Office contact"
          type="email"
        />

        <RepeatableFields
          v-model="exercise.leadJudge"
          :component="repeatableFields.LeadJudge"
          required
        />

        <RepeatableFields
          v-model="exercise.draftingJudge"
          :component="repeatableFields.DraftingJudge"
          required
        />

        <RepeatableFields
          v-model="exercise.statutoryConsultee"
          :component="repeatableFields.StatutoryConsultee"
          required
        />

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
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields';
import SeniorSelectionExerciseManager from '@/components/RepeatableFields/SeniorSelectionExerciseManager';
import SelectionExerciseManager from '@/components/RepeatableFields/SelectionExerciseManager';
import DraftingJudge from '@/components/RepeatableFields/DraftingJudge';
import LeadJudge from '@/components/RepeatableFields/LeadJudge';
import StatutoryConsultee from '@/components/RepeatableFields/StatutoryConsultee';
import SelectionExerciseOfficer from '@/components/RepeatableFields/SelectionExerciseOfficer';
import AssignedCommissioner from '@/components/RepeatableFields/AssignedCommissioner';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';

export default {
  components: {
    ErrorSummary,
    TextField,
    CheckboxGroup,
    CheckboxItem,
    RepeatableFields,
    BackLink,
  },
  extends: Form,
  data(){
    const defaults = {
      exerciseMailbox: null,
      emailSignatureName: null,
      exercisePhoneNumber: null,
      seniorSelectionExerciseManager: null,
      selectionExerciseManager: null,
      selectionExerciseOfficer: null,
      assignedCommissioner: null,
      appropriateAuthority: [],
      otherAppropriateAuthority: null,
      hmctsWelshGovLead: null,
      hmctsWelshGovContact: null,
      judicialOfficeContact: null,
      leadJudge: null,
      draftingJudge: null,
      statutoryConsultee: null,
      progress: {},
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
      patternJACEmail: { match: /@judicialappointments.(digital|gov.uk)$/, message: 'Please use a JAC email address' },
      repeatableFields: {
        SeniorSelectionExerciseManager,
        SelectionExerciseManager,
        DraftingJudge,
        LeadJudge,
        StatutoryConsultee,
        SelectionExerciseOfficer,
        AssignedCommissioner,
      },
      //@TODO@ add pattern for mobile number
    };
  },
  methods: {
    async save(isValid) {
      this.exercise.progress.contacts = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-contacts'));
    },
  },
};
</script>
