<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <h2 class="govuk-heading-l">
          Vacancy information
        </h2>

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
          v-model="formData.typeOfExercise"
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
          v-model="formData.isCourtOrTribunal"
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
          v-model="formData.jurisdiction"
          label="Jurisdiction"
        >
          <div
            v-if="formData.isCourtOrTribunal === 'court'"
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
            v-if="formData.isCourtOrTribunal === 'tribunal'"
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
              v-model="formData.otherJurisdiction"
              class="govuk-!-width-one-half"
              label="Other jurisdiction"
              type="text"
              required
            />
          </CheckboxItem>
        </CheckboxGroup>

        <RadioGroup
          id="is-statutory-consultation-waived"
          v-model="formData.statutoryConsultationWaived"
          label="Is statutory consultation waived for this exercise?"
          required
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <TextareaInput
              id="statutory-consultation-waived-details"
              v-model="formData.statutoryConsultationWaivedDetails"
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
          v-model="formData.appointmentType"
          label="Appointment type"
          required
        >
          <RadioItem
            v-if="formData.salaryGrouping"
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
                v-model="formData.salaryGrouping"
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
              v-model="formData.salary"
              label="Amount"
              :required="formData.appointmentType == 'salaried'"
            />
          </RadioItem>

          <RadioItem
            value="fee-paid"
            label="Fee paid"
          >
            <Currency
              id="fee-paid-fee"
              v-model="formData.feePaidFee"
              label="Fee"
              :required="formData.appointmentType == 'fee-paid'"
            />
          </RadioItem>
          <RadioItem
            value="unpaid"
            label="Unpaid"
          />
        </RadioGroup>

        <RadioGroup
          v-if="formData.appointmentType == 'salaried'"
          id="is-sptw-offered"
          v-model="formData.isSPTWOffered"
          label="Is salaried part-time working (SPTW) offered?"
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <TextareaInput
              id="yes-salary-details"
              v-model="formData.yesSalaryDetails"
              label="Detail of salaried part-time working (SPTW)"
              :required="formData.isSPTWOffered"
            />
          </RadioItem>
          <RadioItem
            :value="false"
            label="No"
          >
            <TextareaInput
              id="no-salary-details"
              v-model="formData.noSalaryDetails"
              label="Add why SPTW is not offered"
            />
          </RadioItem>
        </RadioGroup>

        <h2 class="govuk-label-input">
          Number of vacancies
        </h2>

        <TextField
          id="immediate-start"
          v-model="formData.immediateStart"
          label="Immediate start"
          input-class="govuk-input--width-3"
          hint="These are also called Section 87 (S87) vacancies."
        />

        <TextField
          id="future-start"
          v-model="formData.futureStart"
          label="Future start"
          input-class="govuk-input--width-3"
          hint="These are also called Section 94 (S94) vacancies."
        />

        <TextareaInput
          id="location"
          v-model="formData.location"
          label="Location"
          rows="2"
        />

        <TextareaInput
          id="location-welsh"
          v-model="formData.locationWelsh"
          label="Location (Welsh)"
          rows="2"
        />

        <RadioGroup
          id="welsh-requirement"
          v-model="formData.welshRequirement"
          label="Is there a Welsh requirement?"
          required
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <CheckboxGroup
              id="welsh-requirement-type"
              v-model="formData.welshRequirementType"
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

        <RichTextInput
          id="brief-overview"
          v-model="formData.roleSummary"
          label="Brief Overview"
          hint="Short summary of the role for the vacancies listing page."
          class="custom-html"
          required
        />

        <RichTextInput
          v-if="formData.welshPosts"
          id="brief-overview-welsh"
          v-model="formData.roleSummaryWelsh"
          label="Brief Overview (Welsh)"
          hint="Fersywn Cymraeg"
          class="custom-html"
          required
        />

        <RichTextInput
          id="full-details"
          v-model="formData.aboutTheRole"
          label="Full Details"
          hint="Add information about this role for the information page."
          class="custom-html"
          required
        />

        <RichTextInput
          v-if="formData.welshPosts"
          id="full-details-welsh"
          v-model="formData.aboutTheRoleWelsh"
          label="Full Details (Welsh)"
          hint="Add information about this role for the information page."
          class="custom-html"
          required
        />

        <ListingPreview
          class="govuk-!-margin-bottom-4"
          :exercise="{...exercise, ...formData }"
        />
        <DetailPreview
          v-if="{...exercise, ...formData }.advertType !== 'listing'"
          class="govuk-!-margin-bottom-4"
          :exercise="{...exercise, ...formData }"
        />

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
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
import Currency from '@jac-uk/jac-kit/draftComponents/Form/Currency.vue';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import RichTextInput from '@jac-uk/jac-kit/draftComponents/Form/RichTextInput.vue';
import ListingPreview from '@/components/Previews/ListingPreview.vue';
import DetailPreview from '@/components/Previews/DetailPreview.vue';

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
    DetailPreview,
    ListingPreview,
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
      locationWelsh: null,
      jurisdiction: null,
      otherJurisdiction: null,
      statutoryConsultationWaived: null,
      statutoryConsultationWaivedDetails: null,
      welshPosts: null,
      welshRequirement: null,
      welshRequirementType: null,
      roleSummary: '',
      roleSummaryWelsh: '',
      aboutTheRole: '',
      aboutTheRoleWelsh: '',
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.vacancyInformation'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-vacancy'));
    },
  },
};
</script>
