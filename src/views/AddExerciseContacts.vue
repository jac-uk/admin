<template>
  <main class="govuk-main-wrapper">
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">

        <h1 class="govuk-heading-xl">
          Add exercise contacts
        </h1>

        <p class="govuk-body-l">
          You can return to this page later to add or change contacts.
        </p>

        <h2 class="govuk-heading-l">
          JAC contacts
        </h2>

        <TextField
          id="policy-contact"
          v-model="policyContact"
          name="policy-contact"
          label="Policy contact"
        />

        <TextField
          id="equality-diversity-contact"
          v-model="equalityDiversityContact"
          name="equality-diversity-contact"
          label="Equality and diversity contact"
        />

        <TextField
          id="senior-selection-exercise-manager"
          v-model="seniorSelectionExerciseManager"
          name="senior-selection-exercise-manager"
          label="Senior selection exercise manager"
        />

        <TextField
          id="selection-exercise-manager"
          v-model="selectionExerciseManager"
          name="selection-exercise-manager"
          label="Selection exercise manager"
        />

        <TextField
          id="selection-exercise-officer"
          v-model="selectionExerciseOfficer"
          name="selection-exercise-officer"
          label="Selection exercise officer"
        />

        <p class="govuk_body">
          <a href="#">Add another</a>
        </p>

        <TextField
          id="assigned-commissioner"
          v-model="assignedCommissioner"
          name="assigned-commissioner"
          label="Assigned commissioner"
        />

        <p class="govuk_body">
          <a href="#">Add another</a>
        </p>

        <h2 class="govuk-heading-l">
          Other contacts
        </h2>

        <CheckboxGroup
          id="appropriate-authority"
          v-model="appropriateAuthority"
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
            value="senior-president-tribunals"
            label="Senior President of Tribunals"
          />
        </CheckboxGroup>

        <TextField
          id="judicial-office-contact"
          v-model="judicialOfficeContact"
          name="judicial-office-contact"
          label="Judicial Office contact"
        />

        <TextField
          id="hmcts-welshgov-lead"
          v-model="hmctsWelshGovLead"
          name="hmcts-welshgov-lead"
          label="HMCTS or Welsh Government lead"
        />

        <TextField
          id="lead-judge"
          v-model="leadJudge"
          name="lead-judge"
          label="Lead judge"
        />

        <TextField
          id="drafting-judge"
          v-model="draftingJudge"
          name="drafting-judge"
          label="Drafting judge"
        />

        <p class="govuk_body">
          <a href="#">Add another</a>
        </p>

        <TextField
          id="statutory-consultee"
          v-model="statutoryConsultee"
          name="statutory-consultee"
          label="Statutory consultee"
        />

        <p class="govuk_body">
          <a href="#">Add another</a>
        </p>

        <button
          class="govuk-button"
        >
          Save and continue
        </button>

      </div>
    </div>
  </main>
</template>

<script>
  import TextField from '@/components/Form/TextField';
  import CheckboxGroup from '@/components/Form/CheckboxGroup';
  import CheckboxItem from '@/components/Form/CheckboxItem';

  export default {
    components: {
      TextField,
      CheckboxGroup,
      CheckboxItem,
    },
    data(){
      return {
        policyContact: null,
        equalityDiversityContact: null,
        seniorSelectionExerciseManager: null,
        selectionExerciseManager: null,
        selectionExerciseOfficer: null,
        assignedCommissioner: null,
        appropriateAuthority: [],
        judicialOfficeContact: null,
        hmctsWelshGovLead: null,
        leadJudge: null,
        draftingJudge: null,
        statutoryConsultee: null,
      };
    },
}
</script>
