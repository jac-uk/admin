<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
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
          v-model="exercise.exerciseMailbox"
          label="Exercise mailbox"
          type="email"
        />

        <TextField
          id="senior-selection-exercise-manager"
          v-model="exercise.seniorSelectionExerciseManager"
          label="Senior selection exercise manager"
        />

        <TextField
          id="selection-exercise-manager"
          v-model="exercise.selectionExerciseManager"
          label="Selection exercise manager"
        />

        <RepeatableFields
          v-model="exercise.selectionExerciseOfficer"
          :component="repeatableFields.SelectionExerciseOfficer"
        />

        <RepeatableFields
          v-model="exercise.assignedCommissioner"
          :component="repeatableFields.AssignedCommissioner"
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
              v-model="exercise.otherAppropriateAuthority"
              label="Name of the appropriate authority"
            />
          </CheckboxItem>
        </CheckboxGroup>

        <TextField
          id="hmcts-welshgov-lead"
          v-model="exercise.hmctsWelshGovLead"
          label="HMCTS or Welsh Government lead"
        />

        <TextField
          id="judicial-office-contact"
          v-model="exercise.judicialOfficeContact"
          name="judicial-office-contact"
          label="Judicial Office contact"
        />

        <TextField
          id="lead-judge"
          v-model="exercise.leadJudge"
          name="lead-judge"
          label="Lead judge"
        />

        <RepeatableFields
          v-model="exercise.draftingJudge"
          :component="repeatableFields.DraftingJudge"
        />

        <RepeatableFields
          v-model="exercise.statutoryConsultee"
          :component="repeatableFields.StatutoryConsultee"
        />

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import RepeatableFields from '@/components/RepeatableFields';
import DraftingJudge from '@/components/RepeatableFields/DraftingJudge';
import StatutoryConsultee from '@/components/RepeatableFields/StatutoryConsultee';
import SelectionExerciseOfficer from '@/components/RepeatableFields/SelectionExerciseOfficer';
import AssignedCommissioner from '@/components/RepeatableFields/AssignedCommissioner';

export default {
  components: {
    TextField,
    CheckboxGroup,
    CheckboxItem,
    RepeatableFields,
  },
  data(){
    const exercise = this.$store.getters['exerciseDocument/exerciseData']();

    return {
      repeatableFields: {
        DraftingJudge,
        StatutoryConsultee,
        SelectionExerciseOfficer,
        AssignedCommissioner,
      },
      exercise: {
        exerciseMailbox: exercise.exerciseMailbox || null,
        selectionExerciseManager: exercise.selectionExerciseManager || null,
        selectionExerciseOfficer: exercise.selectionExerciseOfficer || null,
        assignedCommissioner: exercise.assignedCommissioner || null,
        appropriateAuthority: exercise.appropriateAuthority || [],
        otherAppropriateAuthority: exercise.otherAppropriateAuthority|| null,
        hmctsWelshGovLead: exercise.hmctsWelshGovLead || null,
        judicialOfficeContact: exercise.judicialOfficeContact || null,
        leadJudge: exercise.leadJudge || null,
        draftingJudge: exercise.draftingJudge || null,
        statutoryConsultee: exercise.statutoryConsultee || null,
      },
    };
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']);
    },
  },
};
</script>
