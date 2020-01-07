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
          You can return to this page later to add or change contacts.
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

        <TextField
          id="subscriber-alerts-url"
          v-model="exercise.subscriberAlertsUrl"
          label="Subscriber alerts url"
          type="url"
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
          id="judicial-office-contact"
          v-model="exercise.judicialOfficeContact"
          name="judicial-office-contact"
          label="Judicial Office contact"
          type="email"
        />

        <TextField
          id="lead-judge"
          v-model="exercise.leadJudge"
          name="lead-judge"
          label="Lead judge"
          type="email"
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
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import TextField from '@/components/Form/TextField';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import RepeatableFields from '@/components/RepeatableFields';
import SeniorSelectionExerciseManager from '@/components/RepeatableFields/SeniorSelectionExerciseManager';
import SelectionExerciseManager from '@/components/RepeatableFields/SelectionExerciseManager';
import DraftingJudge from '@/components/RepeatableFields/DraftingJudge';
import StatutoryConsultee from '@/components/RepeatableFields/StatutoryConsultee';
import SelectionExerciseOfficer from '@/components/RepeatableFields/SelectionExerciseOfficer';
import AssignedCommissioner from '@/components/RepeatableFields/AssignedCommissioner';
import BackLink from '@/components/BackLink';

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
      subscriberAlertsUrl: null,
      exerciseMailbox: null,
      seniorSelectionExerciseManager: null,
      selectionExerciseManager: null,
      selectionExerciseOfficer: null,
      assignedCommissioner: null,
      appropriateAuthority: [],
      otherAppropriateAuthority: null,
      hmctsWelshGovLead: null,
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
        StatutoryConsultee,
        SelectionExerciseOfficer,
        AssignedCommissioner,
      },      
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
