<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Eligibility information
        </h1>

        <ErrorSummary :errors="errors" />

        <p class="govuk-body-l">
          You'll find this information in the eligibility statement from HMCTS. You can return to this page later to add or change information.
        </p>

        <RadioGroup
          v-if="isLegal"
          id="post-qualification-experience"
          v-model="exercise.postQualificationExperience"
          label="Post-qualification experience (PQE)"
          hint="This is the minimum number of years of law-related work experience the candidate must have."
        >
          <RadioItem
            value="5-years"
            label="5 years"
          />
          <RadioItem
            value="7-years"
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
              required
            />
          </RadioItem>
        </RadioGroup>

        <RadioGroup
          v-if="isLegal && isTribunal"
          id="schedule-2d-apply"
          v-model="exercise.schedule2DApply"
          label="Does Schedule 2(d) or Schedule 3 apply?"
          hint="This lets appropriate candidates apply, even if they don't have the right qualifications. It only applies to tribunal vacancies."
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

        <RadioGroup
          id="additional-selection-criteria-apply"
          v-model="exercise.aSCApply"
          label="Does additional selection criteria (ASC) apply?"
          hint="This is also known as non-statutory eligibility. It describes what additional skills or experience candidates must have."
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <TextareaInput
              id="yes-asc-apply"
              v-model="exercise.yesASCApply"
              label="Additional skills and experience"
              required
            />
          </RadioItem>

          <RadioItem
            :value="false"
            label="No"
          />
        </RadioGroup>

        <RadioGroup
          id="previous-judicial-experience-apply"
          v-model="exercise.previousJudicialExperienceApply"
          label="Does previous judicial experience (PJE) apply?"
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

        <CheckboxGroup
          v-if="isLegal"
          id="qualifications"
          v-model="exercise.qualifications"
          label="Qualifications"
          hint="Select all that apply."
        >
          <CheckboxItem
            value="advocate-scottish-bar"
            label="Advocate – enrolled with the Scottish bar"
          />
          <CheckboxItem
            value="barrister"
            label="Barrister"
          />
          <CheckboxItem
            value="cilex"
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
              hint="For example, Patent attorney."
              required
            />
          </CheckboxItem>
        </CheckboxGroup>

        <CheckboxGroup
          v-if="isNonLegal"
          id="memberships"
          v-model="exercise.memberships"
          label="Memberships"
        >
          <CheckboxItem
            value="chartered-association-of-building-engineers"
            label="Chartered Association of Building Engineers"
          />
          <CheckboxItem
            value="chartered-institute-of-building"
            label="Chartered Institute of Building"
          />
          <CheckboxItem
            value="chartered-institute-of-environmental-health"
            label="Chartered Institute of Environmental Health"
          />
          <CheckboxItem
            value="general-medical-council"
            label="General Medical Council"
          />
          <CheckboxItem
            value="royal-college-of-psychaitrists"
            label="Royal College of Psychaitrists"
          />
          <CheckboxItem
            value="royal-institution-of-chartered-surveyors"
            label="Royal Institution of Chartered Surveyors"
          />
          <CheckboxItem
            value="royal-institute-of-british-architects"
            label="Royal Institute of British Architects"
          />
          <CheckboxItem
            value="other"
            label="Other"
          >
            <TextField
              id="other-qualifications"
              v-model="exercise.otherMemberships"
              label="Associations or Institutes"
              required
            />
          </CheckboxItem>
        </CheckboxGroup>

        <RadioGroup
          id="reasonable-length-service"
          v-model="exercise.reasonableLengthService"
          label="Reasonable length of service"
          hint="This is the minimum number of years the candidate must work."
        >
          <RadioItem
            value="3-years"
            label="3 years"
          />
          <RadioItem
            value="4-years"
            label="4 years"
          />
          <RadioItem
            value="5-years"
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
              required
            />
          </RadioItem>
        </RadioGroup>

        <RadioGroup
          id="retirement-age"
          v-model="exercise.retirementAge"
          label="Retirement age"
        >
          <RadioItem
            value="70-years"
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
              required
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
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import TextField from '@/components/Form/TextField';
import TextareaInput from '@/components/Form/TextareaInput';
import booleanOrNull from '@/helpers/booleanOrNull';
import BackLink from '@/components/BackLink';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
    CheckboxGroup,
    CheckboxItem,
    TextField,
    TextareaInput,
    BackLink,
  },
  extends: Form,
  data(){
    const exercise = this.$store.getters['exerciseDocument/data']();

    return {
      exercise: {
        postQualificationExperience: exercise.postQualificationExperience || null,
        otherYears: exercise.otherYears || null,
        schedule2DApply: booleanOrNull(exercise.schedule2DApply),
        aSCApply: booleanOrNull(exercise.aSCApply),
        yesASCApply: exercise.yesASCApply || null,
        previousJudicialExperienceApply: booleanOrNull(exercise.previousJudicialExperienceApply),
        qualifications: exercise.qualifications || null,
        otherQualifications: exercise.otherQualifications || null,
        memberships: exercise.memberships || null,
        otherMemberships: exercise.otherMemberships || null,
        reasonableLengthService: exercise.reasonableLengthService || null,
        otherLOS: exercise.otherLOS || null,
        retirementAge: exercise.retirementAge || null,
        otherRetirement: exercise.otherRetirement || null,
      },
      isCourtOrTribunal: exercise.isCourtOrTribunal,
      typeOfExercise: exercise.typeOfExercise,
    };
  },
  computed: {
    isLegal() {
      if (this.typeOfExercise === 'legal') {
        return true;
      }
      if (this.typeOfExercise === 'leadership') {
        return true;
      }
      return false;
    },
    isNonLegal() {
      if (this.typeOfExercise === 'non-legal') {
        return true;
      }
      if (this.typeOfExercise === 'leadership-non-legal') {
        return true;
      }
      return false;
    },
    isTribunal() {
      return this.isCourtOrTribunal === 'tribunal';
    },
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        await this.$store.dispatch('exerciseDocument/save', this.exercise);
        this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-eligibility'));
      }      
    },
  },
};
</script>
