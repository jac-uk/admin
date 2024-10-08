<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
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
          hint="Enter Selection Exercise Manager name here"
          type=""
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
          :pattern="patternJACEmail"
          :extra-props="{ users: operationsSeniorManagers }"
          required
        />

        <RepeatableFields
          v-model="formData.selectionExerciseManager"
          :component="repeatableFields.SelectionExerciseManager"
          :pattern="patternJACEmail"
          :extra-props="{ users: operationsTeamMembers }"
          required
        />

        <RepeatableFields
          v-model="formData.selectionExerciseOfficer"
          :component="repeatableFields.SelectionExerciseOfficer"
          :extra-props="{ users: operationsTeamMembers }"
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
            value="lady-chief-justice"
            label="Lady Chief Justice"
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
import { shallowRef } from 'vue';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import SeniorSelectionExerciseManager from '@/components/RepeatableFields/SeniorSelectionExerciseManager.vue';
import SelectionExerciseManager from '@/components/RepeatableFields/SelectionExerciseManager.vue';
import DraftingJudge from '@/components/RepeatableFields/DraftingJudge.vue';
import LeadJudge from '@/components/RepeatableFields/LeadJudge.vue';
import StatutoryConsultee from '@/components/RepeatableFields/StatutoryConsultee.vue';
import SelectionExerciseOfficer from '@/components/RepeatableFields/SelectionExerciseOfficer.vue';
import AssignedCommissioner from '@/components/RepeatableFields/AssignedCommissioner.vue';

export default {
  name: 'ContactsEdit',
  components: {
    ErrorSummary,
    TextField,
    CheckboxGroup,
    CheckboxItem,
    RepeatableFields,
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
      repeatableFields: shallowRef({
        SeniorSelectionExerciseManager,
        SelectionExerciseManager,
        DraftingJudge,
        LeadJudge,
        StatutoryConsultee,
        SelectionExerciseOfficer,
        AssignedCommissioner,
      }),
      //@TODO@ add pattern for mobile number
    };
  },
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
    roles() {
      return this.$store.state.roles.records;
    },
    operationsSeniorManagers() {
      const role = this.roles.find(role => role.roleName === 'Operations Senior Manager');
      if (!role) return [];
      const users = this.$store.getters['users/getUsersByRoleId'](role.id);
      return users;
    },
    operationsTeamMembers() {
      const role = this.roles.find(role => role.roleName === 'Operations Team Member');
      if (!role) return [];
      const users = this.$store.getters['users/getUsersByRoleId'](role.id);
      return users;
    },
  },
  async mounted() {
    await this.$store.dispatch('roles/bind',  { where: [{ field: 'roleName', comparator: 'in', value: ['Operations Senior Manager', 'Operations Team Member'] }] });
    await this.$store.dispatch('users/bind', { orderBy: 'displayName', direction: 'asc' });
  },
  async unmounted() {
    await this.$store.dispatch('users/unbind');
    await this.$store.dispatch('roles/unbind');
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
