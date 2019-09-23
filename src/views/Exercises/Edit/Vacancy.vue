<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <a
          ref="BackLinkToAddExerciseTimeline"
          class="govuk-back-link"
          @click="$router.push('add-exercise-timeline')"
        >
          Back
        </a>

        <h1 class="govuk-heading-xl">
          About the vacancy
        </h1>

        <p class="govuk-body-l">
          You'll find this information in the vacancy request (VR) from HMCTS.
        </p>

        <RadioGroup
          id="type-of-exercise"
          v-model="exercise.typeOfExercise"
          label="Type of exercise"
        >
          <RadioItem
            value="legal"
            label="Legal"
          />
          <RadioItem
            value="non-legal"
            label="Non legal"
          />
          <RadioItem
            value="senior"
            label="Senior"
          />
          <RadioItem
            value="leadership"
            label="Leadership"
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
        >
          <RadioItem
            value="salaried"
            label="Salaried"
          >
            <div class="govuk-form-group">
              <label
                class="govuk-label"
                for="salary-group"
              >
                Salary group
              </label>
              <select
                id="salary-group"
                class="govuk-select"
              >
                <option value="group1">
                  Group 1
                </option>
                <option value="group1.1">
                  Group 1.1
                </option>
                <option value="group2">
                  Group 2
                </option>
                <option value="group3">
                  Group 3
                </option>
                <option value="group4">
                  Group 4
                </option>
                <option value="group5+">
                  Group 5+
                </option>
                <option value="group5">
                  Group 5
                </option>
                <option value="group6.1">
                  Group 6.1
                </option>
                <option value="group6.2">
                  Group 6.7
                </option>
                <option value="group7">
                  Group 7
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

        <TextareaInput
          id="about-the-role"
          v-model="exercise.aboutTheRole"
          label="About the role"
          hint="Add information about this role for the information page."
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

        <h2 class="govuk-label-input">
          Upload HMCTS documents
        </h2>

        <div class="govuk-form-group">
          <label
            class="govuk-heading-m"
            for="file-upload-1"
          >
            Upload job description
          </label>
          <input
            id="file-upload-1"
            class="govuk-file-upload"
            type="file"
          >
        </div>

        <div class="govuk-form-group">
          <label
            class="govuk-heading-m"
            for="file-upload-2"
          >
            Upload terms and conditions
          </label>
          <input
            id="file-upload-2"
            class="govuk-file-upload"
            type="file"
          >
        </div>

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
import TextField from '@/components/Form/TextField';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import Currency from '@/components/Form/Currency';
import TextareaInput from '@/components/Form/TextareaInput';
import booleanOrNull from '@/helpers/booleanOrNull';

export default {
  components: {
    RadioGroup,
    RadioItem,
    TextField,
    CheckboxGroup,
    CheckboxItem,
    Currency,
    TextareaInput,
  },
  data(){
    const exercise = this.$store.getters['exerciseDocument/data']();

    return {
      exercise: {
        typeOfExercise: exercise.typeOfExercise || [],
        isCourtOrTribunal: exercise.isCourtOrTribunal || [],
        appointmentType: exercise.appointmentType || [],
        feePaidFee: exercise.feePaidFee || null,
        isSPTWOffered: booleanOrNull(exercise.isSPTWOffered),
        yesSalaryDetails: exercise.yesSalaryDetails || null,
        noSalaryDetails: exercise.noSalaryDetails || null,
        immediateStart: exercise.immediateStart || null,
        futureStart: exercise.futureStart || null,
        location: exercise.location || null,
        jurisdiction: exercise.jurisdiction || null,
        aboutTheRole: exercise.aboutTheRole || null,
        welshRequirement: exercise.welshRequirement || [],
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
