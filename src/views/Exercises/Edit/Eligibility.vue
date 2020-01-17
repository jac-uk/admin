<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Eligibility information
        </h1>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

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
            value="5"
            label="5 years"
          />
          <RadioItem
            value="7"
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
              type="number"
              required
            />
          </RadioItem>
        </RadioGroup>

        <RadioGroup
          v-if="isLegal && isTribunal"
          id="schedule-2d-or-3-apply"
          v-model="exercise.schedule2Apply"
          label="Does Schedule 2(d) or Schedule 2(3) apply?"
          hint="This lets appropriate candidates apply, even if they don't have the right qualifications. It only applies to tribunal vacancies."
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <RadioGroup
              id="yes-schedule-2-applies"
              v-model="exercise.appliedSchedule"
              label="Which Schedule applies?"
            >
              <RadioItem
                value="schedule-2-d"
                label="Schedule 2(d)"
              />
              <RadioItem
                value="schedule-2-3"
                label="Schedule 2(3)"
              />
            </RadioGroup>
          </RadioItem>

          <RadioItem
            :value="false"
            label="No"
          />
        </RadioGroup>

        <CheckboxGroup
          id="authorisations"
          v-model="exercise.authorisations"
          label="Authorisations"
          hint="Select all that apply."
        >
          <CheckboxItem
            value="s9-1"
            label="s9(1)"
          />
          <CheckboxItem
            value="s9-4"
            label="s9(4)"
          />
          <CheckboxItem
            value="none"
            label="None"
          />
        </CheckboxGroup>

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
            <RepeatableFields
              v-model="exercise.selectionCriteria"
              :component="repeatableFields.SelectionCriterion"
              :max="2"
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
            value="royal-college-of-psychiatrists"
            label="Royal College of Psychiatrists"
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
              id="other-memberships"
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
            value="3"
            label="3 years"
          />
          <RadioItem
            value="4"
            label="4 years"
          />
          <RadioItem
            value="5"
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
              type="number"
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
            value="70"
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
              type="number"
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
import BackLink from '@/components/BackLink';
import RepeatableFields from '@/components/RepeatableFields';
import SelectionCriterion from '@/components/RepeatableFields/SelectionCriterion';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
    CheckboxGroup,
    CheckboxItem,
    TextField,
    BackLink,
    RepeatableFields,
  },
  extends: Form,
  data(){
    const defaults = {
      postQualificationExperience: null,
      otherYears: null,
      schedule2Apply: null,
      appliedSchedule: null,
      authorisations: null,
      aSCApply: null,
      selectionCriteria: null,
      previousJudicialExperienceApply: null,
      qualifications: null,
      otherQualifications: null,
      memberships: null,
      otherMemberships: null,
      reasonableLengthService: null,
      otherLOS: null,
      retirementAge: null,
      otherRetirement: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      repeatableFields: {
        SelectionCriterion,
      },
      exercise: exercise,
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
    async save(isValid) {
      this.exercise.progress.eligibility = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-eligibility'));
    },
  },
};
</script>
