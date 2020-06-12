<template>
  <form @submit.prevent="validateAndSave">
    <h1 class="govuk-heading-xl">
      Character checks options
    </h1>

    <ErrorSummary
      :errors="errors"
      :show-save-button="true"
      @save="save"
    />

    <p class="govuk-body-l">
      Will a HMRC check be required?
    </p>

    <RadioGroup
      id="character-checks-hmrc"
      v-model="exercise.characterChecks.HMRC"
      label="HMRC check"
      required
    >
      <RadioItem
        :value="true"
        label="Yes"
      />

      <RadioItem
        :value="false"
        label="No"
      />
    </RadioGroup>

    <button class="govuk-button">
      Save and continue
    </button>
  </form>
</template>
<script>
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  data(){
    const defaults = {
      characterChecks: {
        HMRC: null,
      },
    };
    
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };

    if (data.characterChecks) {
      exercise.characterChecks = { ...defaults.characterChecks, ...data.characterChecks };
    }

    return {
      exercise: exercise,
    };
  },
  methods: {
    async save(isValid) {
      if (isValid) {
        await this.$store.dispatch('exerciseDocument/save', this.exercise);
        this.$router.push({ name: 'exercise-tasks-character-checks' });
      }
    },
  },
};
</script>
