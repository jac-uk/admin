<template>
  <div>
    <ErrorSummary
      :errors="errors"
    />
    <form @submit.prevent="validateAndSave">
      <RadioGroup
        id="feedback-for-proxy"
        v-model="feedbackForProxy"
        label="Are you raising this issue for yourself or a candidate?"
        :inline="true"
      >
        <RadioItem
          value="0"
          label="Myself"
        />
        <RadioItem
          value="1"
          label="Candidate"
        />
      </RadioGroup>

      <div
        class="govuk-warning-text"
      >
        <span
          class="govuk-warning-text__icon"
          aria-hidden="true"
        >!</span>
        <strong class="govuk-warning-text__text">
          <span class="govuk-warning-text__assistive">Warning</span>
          <span v-if="showFormForProxy">Please ensure you are on the relevant candidate application page before raising the issue</span>
          <span v-else>Please ensure you are on the relevant page before raising the issue</span>
        </strong>
      </div>

      <RadioGroup
        v-show="feedbackForProxy === '1'"
        id="cps-device"
        v-model="formData.cpsDevice"
        label="Is the candidate using a CPS device?"
        :inline="true"
      >
        <RadioItem
          value="0"
          label="No"
        />
        <RadioItem
          value="1"
          label="Yes"
        />
      </RadioGroup>

      <CaptureScreenshot
        v-if="!showFormForProxy"
        id="capture-screenshot"
        ref="screenshot"
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

      <template v-if="showFormForProxy">
        <TextField
          id="name"
          v-model="formData.candidate"
          label="Name of candidate"
          type="text"
          required
        />
        <TextField
          id="browser"
          v-model="formData.browser"
          label="Candidate browser"
          type="text"
          required
        />
        <TextField
          id="os"
          v-model="formData.os"
          label="Candidate operating system"
          type="text"
          required
        />
      </template>
      <TextArea
        id="issue"
        v-model="formData.issue"
        label="What happened?"
        rows="2"
        required
      />
      <TextArea
        id="expectation"
        v-model="formData.expectation"
        :label="expectationLabel"
        rows="2"
        required
      />
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
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import TextArea from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import { detect } from 'detect-browser';
import CaptureScreenshot from '../Micro/CaptureScreenshot.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import { functions } from '@/firebase';

export default {
  name: 'FeedbackForm',
  components: {
    TextField,
    TextArea,
    Select,
    ErrorSummary,
    CaptureScreenshot,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  emits: ['close', 'success'],
  data() {
    return {
      feedbackForProxy: '0',
      client: null,
      fileTypes: '.bmp, .jpg, .jpeg, .gif, .png',
      formData: {
        url: '',
        criticality: '',
        expectation: '',
        issue: '',
        reporter: '',
        candidate: '',
        userId: '',
        browser: '',
        os: '',
        cpsDevice: '0',
      },
      errors: [],
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
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    exerciseReferenceNumber() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.referenceNumber : null;
    },
    applicationId() {
      return this.$store.state.application.record ? this.$store.state.application.record.id : null;
    },
    applicationReferenceNumber() {
      return this.$store.state.application.record ? this.$store.state.application.record.referenceNumber : null;
    },
    showFormForProxy() {
      return this.feedbackForProxy === '1';
    },
    expectationLabel() {
      const str = this.showFormForProxy ? 'they' : 'you';
      return `What did ${str} expect to happen?`;
    },
    bugReportId() {
      return this.$store.state.bugReport.record ? this.$store.state.bugReport.record.id : null;
    },
    hasScreenshot() {
      return this.$refs.screenshot.$data.thumbnail ? true : false;
    },
  },
  watch: {
    showFormForProxy(newVal) {
      if (newVal) {
        this.formData.browser = '';
        this.formData.os = '';
      }
      else {
        this.formData.candidate = '';
        this.formData.browser = `${this.client.name} ${this.client.version}`;
        this.formData.os = this.client.os;
      }
    },
  },
  mounted() {
    this.client = detect();
    this.formData.browser = `${this.client.name} ${this.client.version}`;
    this.formData.os = this.client.os;
    this.formData.url = window.location.href;
    this.formData.reporter = this.displayName;
    this.formData.userId = this.userId;
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async save() {
      this.formData.contactDetails = this.email;
      this.formData.exercise = {
        id: this.exerciseId,
        referenceNumber: this.exerciseReferenceNumber,
      };
      this.formData.application = {
        id: this.applicationId,
        referenceNumber: this.applicationReferenceNumber,
      };
      try {
        let screenshot = null;
        await this.$store.dispatch('bugReport/create', this.formData);

        // Store the screenshot (uses the bugReportId in it's path)
        if (this.hasScreenshot) {
          screenshot = await this.$refs.screenshot.uploadScreenshot();

          // Update the bugReport with the screenshot file path
          await this.$store.dispatch('bugReport/update', { data: {
            screenshot: screenshot,
          }, id: this.bugReportId });
        }
        await functions.httpsCallable('createZenhubIssue')(this.bugReportId);
        this.$emit('success');
      }
      catch (e) {
        console.log(e);
        const str = this.showFormForProxy || this.formData.candidate === '' ? 'Development Team' : 'Admin Team';
        const msg = `We were unable to save your bug report. Please report the problem directly to the ${str}`;
        this.errors.push({
          id: 'error',
          message: msg,
        });
      }
    },
  },
};
</script>
<style>
  label[for="criticality"] {
    display: inline-block !important;
    margin-right: 40px !important;
}
</style>
