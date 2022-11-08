<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <div
          v-if="!hasJourney"
          class="text-right"
        >
          <BackLink class="govuk-!-margin-top-0 govuk-!-margin-bottom-0" />
        </div>

        <h2 class="govuk-heading-l">
          Contacts
        </h2>

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
          v-model="formData.exerciseMailbox"
          label="Exercise mailbox"
          type="email"
          required
          :pattern="patternJACEmail"
        />

        <TextField
          id="exercise-email-signature-name"
          v-model="formData.emailSignatureName"
          label="Email signature name"
          type="email"
          required
        />

        <TextField
          id="exercise-phone-number"
          v-model="formData.exercisePhoneNumber"
          label="Exercise phone number"
          type="tel"
          required
        />

        <RepeatableFields
          v-model="formData.seniorSelectionExerciseManager"
          :component="repeatableFields.SeniorSelectionExerciseManager"
          required
          :pattern="patternJACEmail"
        />

        <RepeatableFields
          v-model="formData.selectionExerciseManager"
          :component="repeatableFields.SelectionExerciseManager"
          required
          :pattern="patternJACEmail"
        />

        <RepeatableFields
          v-model="formData.selectionExerciseOfficer"
          :component="repeatableFields.SelectionExerciseOfficer"
          required
        />

        <RepeatableFields
          v-model="formData.assignedCommissioner"
          :component="repeatableFields.AssignedCommissioner"
          required
        />

        <h2 class="govuk-heading-l">
          Other contacts
        </h2>

        <CheckboxGroup
          id="appropriate-authority"
          v-model="formData.appropriateAuthority"
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
              v-model="formData.otherAppropriateAuthority"
              label="Name of the appropriate authority"
              required
            />
          </CheckboxItem>
        </CheckboxGroup>

        <TextField
          id="hmcts-welshgov-lead"
          v-model="formData.hmctsWelshGovLead"
          label="HMCTS or Welsh Government lead contact"
          type="email"
        />

        <TextField
          id="hmcts-welshgov-contact"
          v-model="formData.hmctsWelshGovContact"
          label="HMCTS or Welsh Government contact"
          type="email"
        />

        <TextField
          id="judicial-office-contact"
          v-model="formData.judicialOfficeContact"
          name="judicial-office-contact"
          label="Judicial Office contact"
          type="email"
        />

        <RepeatableFields
          v-model="formData.leadJudge"
          :component="repeatableFields.LeadJudge"
          required
        />

        <RepeatableFields
          v-model="formData.draftingJudge"
          :component="repeatableFields.DraftingJudge"
          required
        />

        <RepeatableFields
          v-model="formData.statutoryConsultee"
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
  name: 'ContactsEdit',
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
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
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
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.contacts'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-contacts'));
    },
  },
};
</script>
