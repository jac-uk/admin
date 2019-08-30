<template>
  <main class="govuk-main-wrapper">
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-xl">
          Add exercise contacts
        </h1>
        <p class="govuk-body-l">You can return to this page later
            to add or change contacts.
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
      </div>
    </div>
  </main>
</template>

<script>
  import TextField from '@/components/Form/TextField';
  export default {
    components: {
      TextField,
    },
    data(){
      return {
        policyContact: null,
        equalityDiversityContact: null,
        seniorSelectionExerciseManager: null,
        selectionExerciseManager: null,
        selectionExerciseOfficer: null,
        assignedCommissioner: null,
      };
    },
}
</script>
