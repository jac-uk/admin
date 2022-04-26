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

    <div ref="radios">
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
    </div>

    <button 
      v-if="hasPermission(PERMISSIONS.exercises.permissions.canUpdateExercises.value)"
      class="govuk-button"
    >
      Save and continue
    </button>
  </form>
</template>
<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';
import Permission from '@/components/Permission';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
  },
  mixins: [Form, Permission],
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
  mounted() {
    const canUpdateExercises = this.hasPermission(this.PERMISSIONS.exercises.permissions.canUpdateExercises.value);
    if (!canUpdateExercises) {
      const radiosRef = this.$refs.radios;
      if (radiosRef) {
        const inputs = radiosRef.querySelectorAll('input');
        inputs && inputs.forEach(input => input.disabled = true);
      }
    }
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
