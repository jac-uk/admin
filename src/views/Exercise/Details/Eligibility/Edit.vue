<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <h2 class="govuk-heading-l">
          Eligibility information
        </h2>

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
          v-model="formData.postQualificationExperience"
          label="Post-qualification experience (PQE)"
          hint="This is the minimum number of years of law-related work experience the candidate must have."
          required
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
              v-model="formData.otherYears"
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
          v-model="formData.schedule2Apply"
          label="Does Schedule 2(d) or Schedule 3(d) apply?"
          hint="This lets appropriate candidates apply, even if they don't have the right qualifications. It only applies to tribunal vacancies."
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <RadioGroup
              id="yes-schedule-2-applies"
              v-model="formData.appliedSchedule"
              label="Which Schedule applies?"
              required
            >
              <RadioItem
                value="schedule-2-d"
                label="Schedule 2(d)"
              />
              <RadioItem
                value="schedule-2-3"
                label="Schedule 3(d)"
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
          v-model="formData.authorisations"
          label="Authorisations"
          hint="Select all that apply."
        >
          <CheckboxItem
            value="s9-1"
            label="s9(1)"
          />
          <CheckboxItem
            value="s9-4"
            label="Class 1 ticket"
          />
        </CheckboxGroup>

        <RadioGroup
          id="additional-selection-criteria-apply"
          v-model="formData.aSCApply"
          label="Does additional selection criteria (ASC) apply?"
          hint="This is also known as non-statutory eligibility. It describes what additional skills or experience candidates must have."
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <RepeatableFields
              v-model="formData.selectionCriteria"
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
          v-model="formData.previousJudicialExperienceApply"
          label="Does previous judicial experience (PJE) apply?"
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <TextField
              id="pje-days"
              v-model="formData.pjeDays"
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
          v-model="formData.qualifications"
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
              v-model="formData.otherQualifications"
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
          v-model="formData.memberships"
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
              v-model="formData.otherMemberships"
              ident="otherMemberships"
              :allow-empty="true"
              :component="repeatableFields.Membership"
              required
            />
          </div>
        </details>

        <RadioGroup
          id="reasonable-length-service"
          v-model="formData.reasonableLengthService"
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
              v-model="formData.otherLOS"
              label="Number of years"
              class="govuk-!-width-one-quarter"
              type="number"
              required
            />
          </RadioItem>
        </RadioGroup>

        <RadioGroup
          id="retirement-age"
          v-model="formData.retirementAge"
          label="Retirement age"
        >
          <RadioItem
            value="75"
            label="75 years"
          />
          <RadioItem
            value="other"
            label="Other"
          >
            <TextField
              id="other-retirement"
              v-model="formData.otherRetirement"
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
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import SelectionCriterion from '@/components/RepeatableFields/SelectionCriterion.vue';
import Membership from '@/components/RepeatableFields/Membership.vue';
import { isLegal, isNonLegal, isTribunal } from '@/helpers/exerciseHelper';
import { shallowRef } from 'vue';
import { DEFAULT_WORD_COUNT } from '@/helpers/constants';

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
    RepeatableFields,
  },
  extends: Form,
  provide() {
    return {
      defaultWordLimit: this.defaultWordLimit,
    };
  },
  data(){
    const defaultWordCount = DEFAULT_WORD_COUNT.ADDITIONAL_SELECTION_CRITERIA;
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
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
      repeatableFields: shallowRef({
        SelectionCriterion,
        Membership,
      }),
      defaultWordLimit: shallowRef(defaultWordCount),
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isLegal() {
      return isLegal(this.exercise);
    },
    isNonLegal() {
      return isNonLegal(this.exercise);
    },
    isTribunal() {
      return isTribunal(this.exercise);
    },
    memberships() {
      if (Array.isArray(this.formData.otherMemberships)) {
        return [
          ...fixedFields.memberships,
          ...this.formData.otherMemberships,
        ];
      }
      return fixedFields.memberships;
    },
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  watch: {
    memberships(newMemberships, oldMemberships) {
      // @NOTE remove deleted custom membership from selected
      if (Array.isArray(this.formData.memberships) && oldMemberships.length > newMemberships.length) {
        const removedMembership = findRemoved(oldMemberships, newMemberships);
        const selectedIndex = this.formData.memberships.indexOf(removedMembership[0].value);
        if (selectedIndex > -1) {
          this.formData.memberships.splice(selectedIndex, 1);
        }
      }
    },
    'formData.aSCApply': {
      handler: function(val) {
        if (val === false) {
          // Reset the value to null when parent radio is set to off
          this.formData.selectionCriteria = null;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.eligibility'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-eligibility'));
    },
  },
};
</script>
