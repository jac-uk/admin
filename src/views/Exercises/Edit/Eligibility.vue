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
              required
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
          required
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
          >
            <TextField
              id="pje-days"
              v-model="exercise.pjeDays"
              label="Number of days"
              class="govuk-!-width-one-quarter"
              type="number"
              required
            />
          </RadioItem>

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
          required
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
          <CheckboxItem
            value="none"
            label="None"
          />
        </CheckboxGroup>

        <CheckboxGroup
          v-if="isNonLegal"
          id="memberships"
          v-model="exercise.memberships"
          label="Memberships"
          required
        >
          <CheckboxItem
            v-for="membership in memberships"
            :key="membership.value"
            :value="membership.value"
            :label="membership.label"
          />

          <CheckboxItem
            value="none"
            label="None"
          />
        </CheckboxGroup>

        <details
          class="govuk-details"
          data-module="govuk-details"
        >
          <summary class="govuk-details__summary">
            <span class="govuk-details__summary-text">
              Manage exercise-specific memberships
            </span>
          </summary>
          <div class="govuk-details__text">
            <RepeatableFields
              v-model="exercise.otherMemberships"
              ident="otherMemberships"
              :allow-empty="true"
              :component="repeatableFields.Membership"
              required
            />
          </div>
        </details>

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
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields';
import SelectionCriterion from '@/components/RepeatableFields/SelectionCriterion';
import Membership from '@/components/RepeatableFields/Membership';

const fixedFields = {
  memberships: [
    {
      value: 'chartered-association-of-building-engineers',
      label: 'Chartered Association of Building Engineers',
    },
    {
      value: 'chartered-institute-of-building',
      label: 'Chartered Institute of Building',
    },
    {
      value: 'chartered-institute-of-environmental-health',
      label: 'Chartered Institute of Environmental Health',
    },
    {
      value: 'general-medical-council',
      label: 'General Medical Council',
    },
    {
      value: 'royal-college-of-psychiatrists',
      label: 'Royal College of Psychiatrists',
    },
    {
      value: 'royal-institution-of-chartered-surveyors',
      label: 'Royal Institution of Chartered Surveyors',
    },
    {
      value: 'royal-institute-of-british-architects',
      label: 'Royal Institute of British Architects',
    },
  ],
};

const findRemoved = (oldArray, newArray) => {

  return oldArray.filter(item => !newArray.includes(item));
};

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
      otherMemberships: [],
      reasonableLengthService: null,
      otherLOS: null,
      retirementAge: null,
      otherRetirement: null,
      pjeDays: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = {
      ...defaults,
      ...data,
    };
    return {
      repeatableFields: {
        SelectionCriterion,
        Membership,
      },
      exercise: exercise,
      isCourtOrTribunal: exercise.isCourtOrTribunal,
      typeOfExercise: exercise.typeOfExercise,
    };
  },
  computed: {
    memberships() {
      if (Array.isArray(this.exercise.otherMemberships)) {
        return [
          ...fixedFields.memberships,
          ...this.exercise.otherMemberships,
        ];
      }
      return fixedFields.memberships;
    },
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
  watch: {
    memberships(newMemberships, oldMemberships) {
      // @NOTE remove deleted custom membership from selected
      if (Array.isArray(this.exercise.memberships) && oldMemberships.length > newMemberships.length) {
        const removedMembership = findRemoved(oldMemberships, newMemberships);
        const selectedIndex = this.exercise.memberships.indexOf(removedMembership[0].value);
        if (selectedIndex > -1) {
          this.exercise.memberships.splice(selectedIndex, 1);
        }
      }
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
