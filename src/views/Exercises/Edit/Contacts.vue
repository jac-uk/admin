<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <a
        ref="BackLinkToCreateAnExercise"
        class="govuk-back-link"
        @click="$router.push('exercise-new')"
      >
        Back
      </a>
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
        id="exercise-mailbox"
        v-model="exerciseMailbox"
        label="Exercise mailbox"
        type="email"
      />

      <TextField
        id="senior-selection-exercise-manager"
        v-model="seniorSelectionExerciseManager"
        label="Senior selection exercise manager"
      />

      <TextField
        id="selection-exercise-manager"
        v-model="selectionExerciseManager"
        label="Selection exercise manager"
      />

      <TextField
        id="selection-exercise-officer"
        v-model="selectionExerciseOfficer"
        label="Selection exercise officer"
      />
      <p class="govuk_body">
        <a
          class="govuk-link"
        >Add another</a>
      </p>

      <TextField
        id="assigned-commissioner"
        v-model="assignedCommissioner"
        label="Assigned commissioner"
      />
      <p class="govuk_body">
        <a
          class="govuk-link"
        >Add another</a>
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
          label="Senior President of Tribunals (SPT)"
        />
        <CheckboxItem
          value="senior-presiding-judge"
          label="Senior Presiding Judge (SPJ)"
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
            v-model="otherAppropriateAuthority"
            label="Name of the appropriate authority"
          />
        </CheckboxItem>
      </CheckboxGroup>

      <TextField
        id="hmcts-welshgov-lead"
        v-model="hmctsWelshGovLead"
        label="HMCTS or Welsh Government lead"
      />

      <TextField
        id="judicial-office-contact"
        v-model="judicialOfficeContact"
        name="judicial-office-contact"
        label="Judicial Office contact"
      />

      <TextField
        id="lead-judge"
        v-model="leadJudge"
        name="lead-judge"
        label="Lead judge"
      />

      <RepeatableFields
        v-model="draftingJudge"
        :component="repeatableFields.DraftingJudge"
      />
    
      <RepeatableFields
        v-model="statutoryConsultee"
        :component="repeatableFields.StatutoryConsultee"
      />


      <button
        ref="linkToAddShortlistingMethods"
        class="govuk-button"
        @click="$router.push({ name: 'exercise-edit-shortlisting', params: { id: 'example' } })"
      >
        Save and continue
      </button>
    </div>
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import RepeatableFields from '@/components/RepeatableFields';
import DraftingJudge from '@/components/RepeatableFields/DraftingJudge';
import StatutoryConsultee from '@/components/RepeatableFields/StatutoryConsultee';

export default {
  components: {
    TextField,
    CheckboxGroup,
    CheckboxItem,
    RepeatableFields,
  },
  data(){
    return {
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
      repeatableFields: {
        DraftingJudge,
        StatutoryConsultee,
      },
    };
  },
};
</script>
