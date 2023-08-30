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
//import ExtendedError from '@/errors/extendedError';
export default {
  name: 'FeedbackForm',
  components: {
    TextField,
    TextArea,
    Select,
    ErrorSummary,
  },
  extends: Form,
  emits: ['close'],
  data() {
    return {
      client: null,
      formData: {
        url: '',
        expectation: '',
        complaint: '',
        contactDetailType: '',
        contactDetails: '',
        fullName: '',
        userId: '',
        browser: '',
        os: '',
      },
      errors: [],

      // @TODO: Validation??
      contactDetailTypes: ['slack', 'teams', 'email'],
    };
  },
  computed: {
    email() {
      return this.$store.state.auth.currentUser.email;
    },
    userId() {
      return this.$store.state.auth.currentUser.uid;
    },
    displayName() {
      return this.$store.state.auth.currentUser.displayName;
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
      console.log('SAVE!');
      // @TODO: See Request.vue
    },
  },
};
</script>
