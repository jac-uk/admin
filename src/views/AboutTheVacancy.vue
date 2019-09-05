<template>
  <div class="govuk-grid-row">
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
        v-model="typeOfExercise"
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
        v-model="isCourtOrTribunal"
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
        v-model="appointmentType"
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
          <div class="govuk-form-group">
            <label
              class="govuk-label"
              for="fee-paid-salary-input"
            >
              Fee
            </label>
            <span class="moj-label__currency">&pound;</span>
            <input
              id="fee-paid-salary-input"
              class="govuk-input moj-input__currency govuk-input--width-10"
              type="text"
              pattern="[0-9]*"
            >
          </div>
        </RadioItem>
        <RadioItem
          value="unpaid"
          label="Unpaid"
        />
      </RadioGroup>

      <RadioGroup
        id="is-sptw-offered"
        v-model="isSPTWOffered"
        label="Is salaried part-time working (SPTW) offered?"
      >
        <RadioItem
          value="true"
          label="Yes"
        >
          <div class="govuk-form-group">
            <label
              class="govuk-label"
              for="yes-salary-details"
            >
              Detail of salaried part-time working (SPTW)
            </label>
            <textarea
              id="yes-salary-details"
              v-model="yesSalaryDetails"
              class="govuk-textarea"
              rows="5"
            />
          </div>
        </RadioItem>
        <RadioItem
          value="no"
          label="No"
        >
          <div class="govuk-form-group">
            <label
              class="govuk-label"
              for="no-salary-details"
            >
              Add why SPTW is not offered
            </label>
            <textarea
              id="no-salary-details"
              v-model="noSalaryDetails"
              class="govuk-textarea"
              rows="5"
            />
          </div>
        </RadioItem>
      </RadioGroup>

      <h2 class="govuk-label-input">
        Number of vacancies
      </h2>

      <TextField
        id="immediate-start"
        v-model="immediateStart"
        label="Immediate start"
        input-class="govuk-input--width-3"
        hint="These are also called Section 87 (S87) vacancies."
      />

      <TextField
        id="future-start"
        v-model="futureStart"
        label="Future start"
        input-class="govuk-input--width-3"
        hint="These are also called Section 94 (S94) vacancies."
      />

      <div class="govuk-form-group">
        <label
          class="govuk-heading-m"
          for="location"
        >
          Location
        </label>
        <textarea
          id="location"
          v-model="location"
          class="govuk-textarea"
          rows="2"
        />
      </div>

      <div class="govuk-form-group">
        <label
          class="govuk-heading-m"
          for="jurisdiction"
        >
          Jurisdiction
        </label>
        <p class="govuk-hint">
          For example, Employment, Family.
        </p>
        <textarea
          id="location"
          v-model="jurisdiction"
          class="govuk-textarea"
          rows="5"
        />
      </div>

      <div class="govuk-form-group">
        <label
          class="govuk-heading-m"
          for="about-the-role"
        >
          About the role
        </label>
        <p class="govuk-hint">
          Add information about this role for the information page.
        </p>
        <textarea
          id="about-the-role"
          v-model="aboutTheRole"
          class="govuk-textarea"
          rows="5"
        />
      </div>

      <CheckboxGroup
        id="welsh-requirement"
        v-model="welshRequirement"
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

      <button
        ref="linkToAddEligibilityInformation"
        class="govuk-button"
        @click="$router.push('add-eligibility-information')"
      >
        Save and continue
      </button>
    </div>
  </div>
</template>

<script>
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';
import TextField from '@/components/Form/TextField';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';

export default {
  components: {
    RadioGroup,
    RadioItem,
    TextField,
    CheckboxGroup,
    CheckboxItem,
  },
  data(){
    return {
      typeOfExercise: [],
      isCourtOrTribunal: [],
      appointmentType: [],
      isSPTWOffered: [],
      yesSalaryDetails: null,
      noSalaryDetails: null,
      immediateStart: null,
      futureStart: null,
      location: null,
      jurisdiction: null,
      aboutTheRole: null,
      welshRequirement: [],

    };
  },
};
</script>
