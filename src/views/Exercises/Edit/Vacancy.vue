<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Vacancy information
        </h1>

        <ErrorSummary :errors="errors" />

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

        <RadioGroup
          id="appointment-type"
          v-model="exercise.appointmentType"
          label="Appointment type"
          required
        >
          <RadioItem
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

        <TextareaInput
          id="jurisdiction"
          v-model="exercise.jurisdiction"
          label="Jurisdiction"
          hint="For example, Employment, Family."
        />

        <CheckboxGroup
          id="welsh-requirement"
          v-model="exercise.welshRequirement"
          label="Welsh requirement"
          hint="Select all that apply."
        >
          <CheckboxItem
            value="welsh-language"
            label="Welsh language"
          />
          <CheckboxItem
            value="devolution-questions"
            label="Devolution questions"
          />
        </CheckboxGroup>

        <TextareaInput
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
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';
import TextField from '@/components/Form/TextField';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import Currency from '@/components/Form/Currency';
import TextareaInput from '@/components/Form/TextareaInput';
import booleanOrNull from '@/helpers/booleanOrNull';
import BackLink from '@/components/BackLink';

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
    BackLink,
  },
  extends: Form,
  data() {
    const exercise = this.$store.getters['exerciseDocument/data']();

    return {
      exercise: {
        typeOfExercise: exercise.typeOfExercise || null,
        isCourtOrTribunal: exercise.isCourtOrTribunal || null,
        appointmentType: exercise.appointmentType || null,
        salaryGrouping: exercise.salaryGrouping || null,
        feePaidFee: exercise.feePaidFee || null,
        isSPTWOffered: booleanOrNull(exercise.isSPTWOffered),
        yesSalaryDetails: exercise.yesSalaryDetails || null,
        noSalaryDetails: exercise.noSalaryDetails || null,
        immediateStart: exercise.immediateStart || null,
        futureStart: exercise.futureStart || null,
        location: exercise.location || null,
        jurisdiction: exercise.jurisdiction || null,
        welshRequirement: exercise.welshRequirement || null,
        aboutTheRole: exercise.aboutTheRole || null,
      },
    };
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        await this.$store.dispatch('exerciseDocument/save', this.exercise);
        this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-vacancy'));
      }
    },
  },
};
</script>
