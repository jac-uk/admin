<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Create an exercise
        </h1>

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
        />
        <RadioGroup
          id="is-more-info-needed"
          v-model="addMoreInfo"
          label="Do you want to add more information about this exercise now?"
          hint="You can add exercise contacts, shortlisting methods, timeline dates, or information from HMCTS. You can also do this later"
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
import TextField from '@/components/Form/TextField';
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import BackLink from '@/components/BackLink';

export default {
  components: {
    TextField,
    RadioGroup,
    RadioItem,
    CheckboxGroup,
    CheckboxItem,
    BackLink,
  },
  data() {
    return {
      exerciseName: null,
      addMoreInfo: null,
      addMoreInfoSelection: null,
    };
  },
  methods: {
    async save() {
      const data = {
        name: this.exerciseName,
        exerciseMailbox: this.$store.state.auth.currentUser.email,
      };
      await this.$store.dispatch('exerciseDocument/create', data);

      const selectedPages = this.addMoreInfo ? this.addMoreInfoSelection : [];
      this.$store.dispatch('exerciseCreateJourney/start', selectedPages);

      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']);
    },
  },
};
</script>
