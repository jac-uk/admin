<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Assessment options
        </h1>

        <RadioGroup
          id="shortlisting-methods"
          v-model="exercise.assessmentOptions"
        >
          <RadioItem
            value="self-assessment-with-competencies"
            label="Self Assessment with competencies"
          />
          <RadioItem
            value="statement-of-suitability-with-competencies"
            label="Statement of Suitability with competencies"
          />
          <RadioItem
            value="statement-of-suitability-with-skills-and-abilities"
            label="Statement of Suitability with skills and abilities"
          />
          <RadioItem
            value="statement-of-suitability-with-skills-and-abilities-and-cv"
            label="Statement of Suitability with skills and abilities and CV"
          />
          <RadioItem
            value="statement-of-eligibility"
            label="Statement of eligibility"
          />
          <RadioItem
            value="none"
            label="None"
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
import BackLink from '@/components/BackLink';
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';

export default {
  components: {
    BackLink,
    RadioGroup,
    RadioItem,
  },
  data(){
    const defaults = {
      assessmentOptions: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
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
