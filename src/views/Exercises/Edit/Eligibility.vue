<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-xl">
          Add eligibility information
        </h1>

        <p class="govuk-body-l">
          You'll find this information in the eligibility statement from HMCTS.
        </p>

        <RadioGroup
          id="post-qualification-experience"
          v-model="exercise.postQualificationExperience"
          label="Post-qualification experience (PQE)"
          hint="This is the minimum number of years of law-related work experience the candidate must have."
        >
          <RadioItem
            value="5 years"
            label="5 years"
          />
          <RadioItem
            value="7 years"
            label="7 years"
          />
          <RadioItem
            value="other"
            label="Other"
          >
            <TextField
              id="other-years"
              v-model="exercise.otherYears"
              label="Number of years"
              class="govuk-!-width-one-quarter"
            />
          </RadioItem>
        </RadioGroup>

        <RadioGroup
          id="schedule-2d-apply"
          v-model="exercise.schedule2DApply"
          label="Does Schedule 2(d) apply?"
          hint="This lets appropriate candidates apply, even if they do not have the right legal experience."
        >
          <RadioItem
            value="true"
            label="Yes"
          />
          <RadioItem
            value="false"
            label="No"
          />
        </RadioGroup>

        <CheckboxGroup
          id="qualifications"
          v-model="exercise.qualifications"
          label="Qualifications"
          hint="Select all that apply."
        >
          <CheckboxItem
            value="Advocate"
            label="Advocate – enrolled with the Scottish bar"
          />
          <CheckboxItem
            value="Barrister"
            label="Barrister"
          />
          <CheckboxItem
            value="CILEx"
            label="CILEx fellow (this might be called Fellow ILEX)"
          />
          <CheckboxItem
            value="solicitor"
            label="Solicitor"
          />
          <CheckboxItem
            value="other"
            label="Other"
          >
            <TextField
              id="other-qualifications"
              v-model="exercise.otherQualifications"
              label="Add details of other relevant professions, qualifications or experience"
            />
          </CheckboxItem>
        </CheckboxGroup>

        <RadioGroup
          id="additional-selection-criteria-apply"
          v-model="exercise.aSCApply"
          label="Does additional selection criteria (ASC) apply?"
          hint="This is also known as non-statutory eligibility. It describes what additional skills or experience candidates must have."
        >
          <RadioItem
            value="true"
            label="Yes"
          />
          <RadioItem
            value="false"
            label="No"
          />
        </RadioGroup>

        <RadioGroup
          id="reasonable-length-service"
          v-model="exercise.reasonableLengthService"
          label="Reasonable length of service"
          hint="This is the minimum number of years the candidate must work."
        >
          <RadioItem
            value="3 years"
            label="3 years"
          />
          <RadioItem
            value="4 years"
            label="4 years"
          />
          <RadioItem
            value="5 years"
            label="5 years"
          />
          <RadioItem
            value="other"
            label="Other"
          >
            <TextField
              id="other-LOS"
              v-model="exercise.otherLOS"
              label="Number of years"
              class="govuk-!-width-one-quarter"
            />
          </RadioItem>
        </RadioGroup>

        <RadioGroup
          id="retirement-age"
          v-model="exercise.retirementAge"
          label="Retirement age"
        >
          <RadioItem
            value="70 years"
            label="70 years"
          />
          <RadioItem
            value="other"
            label="Other"
          >
            <TextField
              id="other-retirement"
              v-model="exercise.otherRetirement"
              label="Retirement age"
              class="govuk-!-width-one-quarter"
            />
          </RadioItem>
        </RadioGroup>

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

 <script>
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import TextField from '@/components/Form/TextField';

export default {
  components: {
    RadioGroup,
    RadioItem,
    CheckboxGroup,
    CheckboxItem,
    TextField,
  },
  data(){
    const exercise = this.$store.state.exerciseDocument.record;

    return {
      exercise: {
        postQualificationExperience: exercise.postQualificationExperience || [],
        otherYears: exercise.otherYears || null,
        schedule2DApply: exercise.schedule2DApply || null,
        qualifications: exercise.qualifications || [],
        otherQualifications: exercise.otherQualifications || null,
        aSCApply: exercise.aSCApply || null,
        reasonableLengthService: exercise.reasonableLengthService || [],
        otherLOS: exercise.otherLOS || null,
        retirementAge: exercise.retirementAge || null,
        otherRetirement: exercise.otherRetirement || null,
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
