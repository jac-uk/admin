<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-xl">
          Create an exercise
        </h1>
        <div class="govuk-form-group">
          <label
            for="ref-number"
            class="govuk-heading-m"
          >
            Reference number
          </label>
          <span class="govuk-hint">
            This will be generated automatically when you save.
          </span>
          <input
            id="ref-number"
            class="govuk-input--width-5 govuk-input"
            type="text"
            placeholder="XXX"
            disabled
          >
        </div>
        <TextField
          id="exercise-name"
          v-model="exerciseName"
          name="exercise-name"
          label="Exercise name"
          hint="Reference codes are automatically created - you do not need to enter one."
        />
        <RadioGroup
          id="type-of-exercise"
          v-model="exerciseType"
          label="Type of exercise"
        >
          <RadioItem
            value="legal"
            label="Legal"
          />
          <RadioItem
            value="non-legal"
            label="Non legal"
          />
          <RadioItem
            value="senior"
            label="Senior"
          />
          <RadioItem
            value="leadership"
            label="Leadership"
          />
        </RadioGroup>
        <RadioGroup
          id="add-information"
          v-model="isMoreInfoNeeded"
          label="Do you want to add more information about this exercise now?"
          hint="You can add exercise contacts, shortlisting methods, timeline dates, or information from HMCTS. You can also do this later"
        >
          <RadioItem
            :value="true"
            label="Yes"
          />
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
import TextField from '@/components/Form/TextField';
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';

export default {
  components: {
    TextField,
    RadioGroup,
    RadioItem,
  },
  data() {
    return {
      exerciseName: null,
      exerciseType: null,
      isMoreInfoNeeded: null,
    };
  },
  methods: {
    async save() {
      const data = {
        name: this.exerciseName,
        type: this.exerciseType,
      };
      await this.$store.dispatch('exerciseDocument/create', data);
    },
  },
};
</script>
