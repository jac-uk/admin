<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <h2 class="govuk-heading-l">
          External Vacancy
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <TextField
          id="exercise-name"
          v-model="formData.name"
          label="Exercise name"
          required
        />

        <DateInput
          id="open-for-applications"
          v-model="formData.applicationOpenDate"
          label="Open for applications"
          required
        />
        <DateInput
          id="closed-for-applications"
          v-model="formData.applicationCloseDate"
          label="Closed for applications"
          required
        />

        <TextField
          id="subscriber-alerts-url"
          v-model="formData.subscriberAlertsUrl"
          label="Subscriber alerts url"
          type="url"
        />

        <TextField
          id="contact"
          v-model="formData.exerciseMailbox"
          label="Contact"
          type="email"
        />

        <Checkbox
          id="welsh-posts"
          v-model="formData.welshPosts"
          label="Are there Welsh posts?"
          hint="If this exercise has any posts in Wales you should tick this box. You then need to complete the Brief Overview (Welsh)."
        />

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
          id="about-the-role"
          v-model="formData.aboutTheRole"
          label="About the role"
          hint="Short summary of the role for the vacancies listing page."
          class="custom-html"
          required
        />

        <RichTextInput
          v-if="formData.welshPosts"
          id="about-the-role-welsh"
          v-model="formData.aboutTheRoleWelsh"
          label="About the role (Welsh)"
          hint="Fersywn Cymraeg"
          class="custom-html"
          required
        />

        <Select
          id="advert-type"
          v-model="formData.advertType"
          label="Advert Type"
          hint="Type of advert when published."
          required
        >
          <option
            v-for="exerciseAdvertType in exerciseAdvertTypes"
            :key="exerciseAdvertType"
            :value="exerciseAdvertType"
          >
            {{ $filters.lookup(exerciseAdvertType) }}
          </option>
        </Select>

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
              <Select
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
              </Select>
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

        <TextareaInput
          id="location"
          v-model="formData.location"
          label="Location"
          rows="2"
        />

        <h2 class="govuk-label-input">
          Number of vacancies
        </h2>

        <TextField
          id="future-start"
          v-model="formData.futureStart"
          label="Future start"
          input-class="govuk-input--width-3"
          hint="These are also called Section 94 (S94) vacancies."
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
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import RichTextInput from '@jac-uk/jac-kit/draftComponents/Form/RichTextInput.vue';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput.vue';
import { exerciseAdvertTypes } from '@/helpers/exerciseHelper';
import { ADVERT_TYPES } from '@/helpers/constants';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import ListingPreview from '@/components/Previews/ListingPreview.vue';
import DetailPreview from '@/components/Previews/DetailPreview.vue';
import exerciseMixin from '@/views/Exercise/exerciseMixin.js';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import Currency from '@jac-uk/jac-kit/draftComponents/Form/Currency.vue';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';

export default {
  name: 'SummaryEdit',
  components: {
    ErrorSummary,
    TextField,
    RichTextInput,
    DateInput,
    Checkbox,
    ListingPreview,
    DetailPreview,
    RadioGroup,
    RadioItem,
    Select,
    Currency,
    TextareaInput,
  },
  extends: Form,
  mixins: [exerciseMixin],
  data() {
    const defaults = {
      name: null,
      estimatedLaunchDate: null,
      inviteOnly: false,
      welshPosts: false,
      roleSummary: '',
      roleSummaryWelsh: '',
      subscriberAlertsUrl: null,
      advertType: ADVERT_TYPES.FULL,
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
      setDay: true,
      exerciseAdvertTypes: exerciseAdvertTypes({}),
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    launchDate: {
      get() {
        return this.parseDate({ ...this.exercise, ...this.formData }.estimatedLaunchDate);
      },
      set(val) {
        if (!val || !(val instanceof Date)){
          return;
        }

        let dateString = `${val.getUTCFullYear()}-${val.getUTCMonth() + 1}`;
        if (this.setDay) {
          dateString = `${dateString}-${val.getUTCDate()}`;
        }

        this.formData.estimatedLaunchDate = dateString;
      },
    },
    applicationOpenDate: {
      get() {
        return this.parseDate({ ...this.exercise, ...this.formData }.applicationOpenDate);
      },
      set(val) {
        if (!val || !(val instanceof Date)){
          return;
        }

        let dateString = `${val.getUTCFullYear()}-${val.getUTCMonth() + 1}`;
        if (this.setDay) {
          dateString = `${dateString}-${val.getUTCDate()}`;
        }

        this.formData.applicationOpenDate = dateString;
      },
    },
    applicationCloseDate: {
      get() {
        return this.parseDate({ ...this.exercise, ...this.formData }.applicationCloseDate);
      },
      set(val) {
        if (!val || !(val instanceof Date)){
          return;
        }

        let dateString = `${val.getUTCFullYear()}-${val.getUTCMonth() + 1}`;
        if (this.setDay) {
          dateString = `${dateString}-${val.getUTCDate()}`;
        }

        this.formData.applicationCloseDate = dateString;
      },
    },
    toggleLabel() {
      if (this.setDay) {
        return 'Remove launch day';
      }
      return 'Add launch day';
    },
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.vacancySummary'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-summary'));
    },
    toggleDay() {
      this.setDay = !this.setDay;
    },
    parseDate(value) {
      if (value instanceof Date) {
        return value;
      }

      if (typeof value != 'string') {
        return;
      }
      const parts = value.split('-');
      if (parts.length === 3) {
        this.setDay = true;
      }
      const [year, month, day] = [...parts, 1];
      const date = new Date(Date.UTC(year, month - 1, day));

      return date;
    },
  },
};
</script>
