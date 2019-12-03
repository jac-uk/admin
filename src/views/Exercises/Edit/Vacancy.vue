<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Vacancy information
        </h1>

        <p class="govuk-body-l">
          You'll find this information in the vacancy request (VR) from HMCTS. You can return to this page later to add or change information.
        </p>

        <RadioGroup
          id="type-of-exercise"
          v-model="exercise.typeOfExercise"
          label="Type of exercise"
        >
          <RadioItem
            value="Legal"
            label="Legal"
          />
          <RadioItem
            value="Non legal"
            label="Non legal"
          />
          <RadioItem
            value="Senior"
            label="Senior"
          />
          <RadioItem
            value="Leadership"
            label="Leadership"
          />
          <RadioItem
            value="Leadership - non legal"
            label="Leadership - non legal"
          />
        </RadioGroup>

        <RadioGroup
          id="is-court-or-tribunal"
          v-model="exercise.isCourtOrTribunal"
          label="Is the vacancy for a court or tribunal?"
        >
          <RadioItem
            value="Court"
            label="Court"
          />
          <RadioItem
            value="Tribunal"
            label="Tribunal"
          />
        </RadioGroup>

        <RadioGroup
          id="appointment-type"
          v-model="exercise.appointmentType"
          label="Appointment type"
        >
          <RadioItem
            value="Salaried"
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
                <option value="roup 1 - £262,264">
                  Group 1 - £262,264
                </option>
                <option value="Group 1.1 - £234,184">
                  Group 1.1 - £234,184
                </option>
                <option value="Group 2 - £226,193">
                  Group 2 - £226,193
                </option>
                <option value="Group 3 - £215,094">
                  Group 3 - £215,094
                </option>
                <option value="Group 4 - £188,901">
                  Group 4 - £188,901
                </option>
                <option value="Group 5+ - £160,377">
                  Group 5+ - £160,377
                </option>
                <option value="Group 5 - £151,497">
                  Group 5 - £151,497
                </option>
                <option value="Group 6.1 - £140,289">
                  Group 6.1 - £140,289
                </option>
                <option value="Group 6.2 - £132,075">
                  Group 6.2 - £132,075
                </option>
                <option value="Group 7 - £112,542">
                  Group 7 - £112,542
                </option>
                <option value="Group 8 - £89,428">
                  Group 8 - £89,428
                </option>
              </select>
            </div>
          </RadioItem>
          <RadioItem
            value="Fee paid"
            label="Fee paid"
          >
            <TextField
              id="fee-paid-fee"
              v-model="exercise.feePaidFee"
              label="Fee"
            />
          </RadioItem>
          <RadioItem
            value="Unpaid"
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
            value="Welsh language"
            label="Welsh language"
          />
          <CheckboxItem
            value="Devolution questions"
            label="Devolution questions"
          />
        </CheckboxGroup>

        <h2 class="govuk-heading-l">
          Additional information
        </h2>

        <TextareaInput
          id="about-the-role"
          v-model="exercise.aboutTheRole"
          label="About the role"
          hint="Add information about this role for the information page."
        />

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
import TextareaInput from '@/components/Form/TextareaInput';
import booleanOrNull from '@/helpers/booleanOrNull';
import BackLink from '@/components/BackLink';

export default {
  components: {
    RadioGroup,
    RadioItem,
    TextField,
    CheckboxGroup,
    CheckboxItem,
    TextareaInput,
    BackLink,
  },
  data(){
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
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']);
    },
  },
};
</script>
