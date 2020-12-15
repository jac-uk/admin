<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Vacancy information
        </h1>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <p class="govuk-body-l">
          You'll find this information in the vacancy request (VR) from HMCTS. You can return to this page later to add or change information.
        </p>

        <RadioGroup
          id="type-of-exercise"
          v-model="exercise.typeOfExercise"
          label="Type of exercise"
          required
        >
          <RadioItem
            value="legal"
            label="Legal"
          />
          <RadioItem
            value="non-legal"
            label="Non legal"
          />
          <!-- <RadioItem
            value="senior"
            label="Senior"
          /> -->
          <RadioItem
            value="leadership"
            label="Leadership"
          />
          <RadioItem
            value="leadership-non-legal"
            label="Leadership - non legal"
          />
        </RadioGroup>

        <RadioGroup
          id="is-court-or-tribunal"
          v-model="exercise.isCourtOrTribunal"
          label="Is the vacancy for a court or tribunal?"
        >
          <RadioItem
            value="court"
            label="Court"
          />
          <RadioItem
            value="tribunal"
            label="Tribunal"
          />
        </RadioGroup>

        <CheckboxGroup
          id="jurisdiction"
          v-model="exercise.jurisdiction"
          label="Jurisdiction"
        >
          <div
            v-if="exercise.isCourtOrTribunal === 'court'"
          >
            <CheckboxItem
              value="crime"
              label="Crime"
            />
            <CheckboxItem
              value="civil"
              label="Civil"
            />
            <CheckboxItem
              value="family"
              label="Family"
            />
          </div>

          <div
            v-if="exercise.isCourtOrTribunal === 'tribunal'"
            class="govuk-!-margin-bottom-5"
          >
            <p class="govuk-heading-s govuk-!-margin-bottom-1">
              First-tier tribunal
            </p>
            <CheckboxItem
              value="general-regulatory-chamber"
              label="General Regulatory Chamber"
            />
            <CheckboxItem
              value="health-education-and-social-care-chamber"
              label="Health, Education and Social Care Chamber"
            />
            <CheckboxItem
              value="immigration-and-asylum-chamber"
              label="Immigration and Asylum Chamber"
            />
            <CheckboxItem
              value="property-chamber"
              label="Property Chamber"
            />
            <CheckboxItem
              value="social-entitlement-chamber"
              label="Social Entitlement Chamber"
            />
            <CheckboxItem
              value="tax-chamber"
              label="Tax Chamber"
            />
            <CheckboxItem
              value="war-pension-and-armed-forces-compensation-chamber"
              label="War Pension and Armed Forces Compensation Chamber"
            />

            <p class="govuk-heading-s govuk-!-margin-top-4 govuk-!-margin-bottom-1">
              Upper tribunal
            </p>
            <CheckboxItem
              value="administrative-appeals-chamber"
              label="Administrative Appeals Chamber"
            />
            <CheckboxItem
              value="second-tier-immigration-and-asylum-chamber"
              label="Immigration and Asylum Chamber"
            />
            <CheckboxItem
              value="lands-chamber"
              label="Lands Chamber"
            />
            <CheckboxItem
              value="tax-and-chancery"
              label="Tax and Chancery"
            />

            <p class="govuk-heading-s govuk-!-margin-top-4 govuk-!-margin-bottom-1">
              Employment Tribunal
            </p>
            <CheckboxItem
              value="employment-tribunal"
              label="Employment Tribunal"
            />
            <CheckboxItem
              value="employment-appeals-tribunal"
              label="Employment Appeals Tribunal"
            />
          </div>

          <CheckboxItem
            value="other"
            label="Other"
          >
            <TextField
              id="other-jurisdiction"
              v-model="exercise.otherJurisdiction"
              class="govuk-!-width-one-half"
              label="Other jurisdiction"
              type="text"
              required
            />
          </CheckboxItem>
        </CheckboxGroup>

        <RadioGroup
          id="is-statutory-consultation-waived"
          v-model="exercise.statutoryConsultationWaived"
          label="Is statutory consultation waived for this exercise?"
          required
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <TextareaInput
              id="statutory-consultation-waived-details"
              v-model="exercise.statutoryConsultationWaivedDetails"
              label="Explain why."
              required
            />
          </RadioItem>
          <RadioItem
            :value="false"
            label="No"
          />
        </RadioGroup>

        <RadioGroup
          id="appointment-type"
          v-model="exercise.appointmentType"
          label="Appointment type"
          required
        >
          <RadioItem
            v-if="exercise.salaryGrouping"
            value="salaried"
            label="Salaried"
          >
            <div class="govuk-form-group">
              <label
                class="govuk-heading-m govuk-!-margin-bottom-2"
                for="salary-group"
              >
                Salary group
              </label>
              <select
                id="salary-group"
                v-model="exercise.salaryGrouping"
                class="govuk-select"
              >
                <option value="">
                  Select an option
                </option>
                <option value="group-1">
                  Group 1 - £262,264
                </option>
                <option value="group-1.1">
                  Group 1.1 - £234,184
                </option>
                <option value="group-2">
                  Group 2 - £226,193
                </option>
                <option value="group-3">
                  Group 3 - £215,094
                </option>
                <option value="group-4">
                  Group 4 - £188,901
                </option>
                <option value="group-5">
                  Group 5 - £151,497
                </option>
                <option value="group-5+">
                  Group 5+ - £160,377
                </option>
                <option value="group-6.1">
                  Group 6.1 - £140,289
                </option>
                <option value="group-6.2">
                  Group 6.2 - £132,075
                </option>
                <option value="group-7">
                  Group 7 - £112,542
                </option>
                <option value="group-8">
                  Group 8 - £89,428
                </option>
              </select>
            </div>
          </RadioItem>

          <RadioItem
            v-else
            value="salaried"
            label="Salary Group"
          >
            <Currency
              id="salary"
              v-model="exercise.salary"
              label="Amount"
              :required="exercise.appointmentType == 'salaried'"
            />
          </RadioItem>

          <RadioItem
            value="fee-paid"
            label="Fee paid"
          >
            <Currency
              id="fee-paid-fee"
              v-model="exercise.feePaidFee"
              label="Fee"
              :required="exercise.appointmentType == 'fee-paid'"
            />
          </RadioItem>
          <RadioItem
            value="unpaid"
            label="Unpaid"
          />
        </RadioGroup>

        <RadioGroup
          v-if="exercise.appointmentType == 'salaried'"
          id="is-sptw-offered"
          v-model="exercise.isSPTWOffered"
          label="Is salaried part-time working (SPTW) offered?"
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <TextareaInput
              id="yes-salary-details"
              v-model="exercise.yesSalaryDetails"
              label="Detail of salaried part-time working (SPTW)"
            />
          </RadioItem>
          <RadioItem
            :value="false"
            label="No"
          >
            <TextareaInput
              id="no-salary-details"
              v-model="exercise.noSalaryDetails"
              label="Add why SPTW is not offered"
            />
          </RadioItem>
        </RadioGroup>

        <h2 class="govuk-label-input">
          Number of vacancies
        </h2>

        <TextField
          id="immediate-start"
          v-model="exercise.immediateStart"
          label="Immediate start"
          input-class="govuk-input--width-3"
          hint="These are also called Section 87 (S87) vacancies."
        />

        <TextField
          id="future-start"
          v-model="exercise.futureStart"
          label="Future start"
          input-class="govuk-input--width-3"
          hint="These are also called Section 94 (S94) vacancies."
        />

        <TextareaInput
          id="location"
          v-model="exercise.location"
          label="Location"
          rows="2"
        />

        <RadioGroup
          id="welsh-requirement"
          v-model="exercise.welshRequirement"
          label="Is there a Welsh requirement?"
          required
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <CheckboxGroup
              id="welsh-requirement-type"
              v-model="exercise.welshRequirementType"
              label="Type of requirement"
              hint="Select all that apply."
            >
              <CheckboxItem
                value="welsh-speaking"
                label="Speak Welsh"
              />
              <CheckboxItem
                value="welsh-reading-writing"
                label="Read and/or write Welsh"
              />
              <CheckboxItem
                value="welsh-administration-questions"
                label="Welsh administration questions"
              />
            </CheckboxGroup>
          </RadioItem>
          <RadioItem
            :value="false"
            label="No"
          />
        </RadioGroup>

        <TextareaInput
          id="role-summary"
          v-model="exercise.roleSummary"
          label="Role summary"
          hint="Short summary of the role for the vacancies listing page."
          rows="2"
          required
        />

        <RichTextInput
          id="about-the-role"
          v-model="exercise.aboutTheRole"
          label="About the role"
          hint="Add information about this role for the information page."
          required
        />

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
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';
import Currency from '@jac-uk/jac-kit/draftComponents/Form/Currency';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import RichTextInput from '@jac-uk/jac-kit/draftComponents/Form/RichTextInput';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
    TextField,
    CheckboxGroup,
    CheckboxItem,
    Currency,
    TextareaInput,
    RichTextInput,
    BackLink,
  },
  extends: Form,
  data() {
    const defaults = {
      typeOfExercise: null,
      isCourtOrTribunal: null,
      appointmentType: null,
      salary: null,
      salaryGrouping: null,
      feePaidFee: null,
      isSPTWOffered: null,
      yesSalaryDetails: null,
      noSalaryDetails: null,
      immediateStart: null,
      futureStart: null,
      location: null,
      jurisdiction: null,
      otherJurisdiction: null,
      statutoryConsultationWaived: null,
      statutoryConsultationWaivedDetails: null,
      welshRequirement: null,
      welshRequirementType: null,
      roleSummary: null,
      aboutTheRole: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
    };
  },
  methods: {
    async save(isValid) {
      this.exercise.progress.vacancyInformation = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-vacancy'));
    },
  },
};
</script>
