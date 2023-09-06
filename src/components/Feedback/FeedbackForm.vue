<template>
  <div>
    <ErrorSummary
      :errors="errors"
    />
    <form @submit.prevent="validateAndSave">
      <TextField
        id="url"
        v-model="formData.url"
        label="Current Page"
        type="text"
        :disabled="true"
        required
      />
      <FileUpload
        id="screenshot-file"
        ref="screenshot-file"
        v-model="formData.screenshotFileName"
        name="screenshot"
        :path="screenshotUploadPath"
        types="fileTypes"
        label="Upload screenshot"
        :enable-delete="true"
        @update:model-value="val => doFileUpload(val, 'screenshotFileName')"
      />
      <Select
        id="criticality"
        v-model="formData.criticality"
        label="How critical is this issue"
        required
      >
        <option
          value=""
          selected
        >
          Please select
        </option>
        <option
          v-for="(criticalityType, index) in criticalityTypes"
          :key="(index + 1)"
          :value="criticalityType"
        >
          {{ criticalityType }}
        </option>
      </Select>
      <TextArea
        id="complaint"
        v-model="formData.complaint"
        label="What happened?"
        required
      />
      <TextField
        id="expectation"
        v-model="formData.expectation"
        label="What did you want to happen?"
        type="text"
        required
      />

      <TextField
        id="name"
        v-model="formData.fullName"
        label="Your name"
        type="text"
        required
      />

      <div class="govuk-form-group">
        <Select
          id="contact-detail-type"
          v-model="formData.contactDetailType"
          label="Best way to contact you"
          required
        >
          <option
            value=""
            selected
          >
            Please select
          </option>
          <option
            v-for="(contactDetailType, index) in contactDetailTypes"
            :key="(index + 1)"
            :value="contactDetailType"
          >
            {{ contactDetailType }}
          </option>
        </Select>
        <TextField
          id="contactDetails"
          v-model="formData.contactDetails"
          label="Your contact details"
          type="text"
          required
        />

        <div
          id="accordion-default"
          class="govuk-accordion"
          data-module="govuk-accordion"
        >
          <div class="govuk-accordion__section">
            <div class="govuk-accordion__section-header">
              <h2 class="govuk-accordion__section-heading">
                <span
                  id="accordion-default-heading-1"
                  class="govuk-accordion__section-button"
                >
                  Loop in other contacts?
                </span>
              </h2>
            </div>
            <div
              id="accordion-default-content-1"
              class="govuk-accordion__section-content"
              aria-labelledby="accordion-default-heading-1"
            >
              <TextArea
                id="other-contacts"
                v-model="formData.otherContacts"
                label="Add a list of comma-separated email addresses"
                required
              />
            </div>
          </div>
        </div>

        <TextField
          id="browser"
          v-model="formData.browser"
          label="Your browser"
          type="text"
          :disabled="true"
          required
        />
        <TextField
          id="os"
          v-model="formData.os"
          label="Your operating system"
          type="text"
          :disabled="true"
          required
        />
      </div>

      <button
        type="button"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="closeModal"
      >
        Cancel
      </button>
      <button
        class="govuk-button"
        type="submit"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script>
// @TODO: THIS COMPONENT IS BASED ON MODALINNER!
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import TextArea from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import { detect } from 'detect-browser';
import FileUpload from '@jac-uk/jac-kit/draftComponents/Form/FileUpload.vue';

//import ExtendedError from '@/errors/extendedError';
export default {
  name: 'FeedbackForm',
  components: {
    TextField,
    TextArea,
    Select,
    ErrorSummary,
    FileUpload,
  },
  extends: Form,
  emits: ['close', 'success'],
  data() {
    return {
      client: null,
      fileTypes: '.bmp, .jpg, .jpeg, .gif, .png',
      formData: {
        url: '',
        screenshotFileName: '',
        criticalityType: '',
        expectation: '',
        complaint: '',
        contactDetailType: '',
        contactDetails: '',
        otherContacts: '',
        fullName: '',
        userId: '',
        browser: '',
        os: '',
      },
      // formData: {
      //   url: '',
      //   screenshotFileName: '',
      //   criticalityType: '',
      //   expectation: 'ddddsd',
      //   complaint: 'dddd',
      //   contactDetailType: 'email',
      //   contactDetails: 'ddcds',
      //   otherContacts: '',
      //   fullName: 'dcdd',
      //   userId: '',
      //   browser: '',
      //   os: '',
      // },

      errors: [],

      // @TODO: Validation??
      contactDetailTypes: ['slack', 'teams', 'email'],
      criticalityTypes: ['critical', 'major', 'minor', 'low'],
    };
  },
  computed: {
    email() {
      return this.$store.getters['auth/getEmail'];
    },
    userId() {
      return this.$store.getters['auth/getUserId'];
    },
    displayName() {
      return this.$store.getters['auth/getDisplayName'];
    },
    screenshotUploadPath() {
      //return `/exercise/${this.exercise.id}/user/${this.application.userId}`;
      return 'test';
    },
  },
  watch: {
    'formData.contactDetailType'(val) {
      if (val === 'email') {
        this.formData.contactDetails = this.email;
      }
      else {
        this.formData.contactDetails = '';
      }
    },
  },
  mounted() {
    this.client = detect();
    this.formData.browser = `${this.client.name} ${this.client.version}`;
    this.formData.os = this.client.os;
    this.formData.url = window.location.href;
    this.formData.fullName = this.displayName;
    this.formData.userId = this.userId;
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async save() {
      this.$emit('success');
      // @TODO: See Request.vue
    },
    doFileUpload(val, field) {
      console.log('Do Upload with...');
      console.log(`Field: ${field}`);
      console.log(`Val: ${val}`);
      if (val) {
        //this.$emit('updateApplication', { [field]: val });
      }
    },
  },
};
</script>
