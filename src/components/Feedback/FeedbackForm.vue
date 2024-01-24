<template>
  <div>
    <ErrorSummary
      :errors="errors"
    />
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

    <TextField
      v-if="!reporterSlackUID"
      id="slackUID"
      v-model="newReporterSlackUID"
      label="Your Slack member ID"
      type="text"
      required
    />

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
        v-for="(criticalityType, key) in criticalityTypes"
        :key="key"
        :value="key"
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
    <ActionButton
      type="primary"
      class="govuk-button"
      :action="save"
    >
      Submit
    </ActionButton>
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
import SlackLookupError from '@/errors/slackLookupError';
import UserError from '@/errors/userError';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';

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
    ActionButton,
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
        issue: '',
        expectation: '',
        reporter: '',
        candidate: '',
        userId: '',
        browser: '',
        os: '',
        cpsDevice: '0',
      },
      errors: [],
      criticalityTypes: {
        Critical: 'Critical - a response will be provided within 2 hours',
        Major: 'Major - a response will be provided within 24 hours',
        Minor: 'Minor - a response will be provided within 48 hours',
        Low: 'Low - a response will be provided within 1 week',
      },
      newReporterSlackUID: '',
      hasSlackIdOnLoad: true,
      checkSlackMemberIdOnBlur: false,
    };
  },
  computed: {
    email() {
      return this.$store.getters['auth/getEmail'];
    },
    userId() {
      return this.$store.getters['auth/getUserId'];
    },

    // @TODO: TESTING
    isSignedIn() {
      return this.$store.getters['auth/isSignedIn'];
    },
    currentUser() {
      return this.$store.getters['auth/getCurrentUser'];
    },

    reporterSlackUID() {
      return this.$store.getters['auth/getSlackUID'];
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
      return (this.$refs.screenshot && this.$refs.screenshot.$data.thumbnail) ? true : false;
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
    newReporterSlackUID() {
      this.checkSlackMemberIdOnBlur = true;
      this.hasSlackIdOnLoad = false;
    },
  },
  async mounted() {

    console.log('Mounted:');
    console.log(`isSignedIn: ${this.isSignedIn}`);
    console.log('currentUser: ');
    console.log(this.currentUser);

    //mounted() {
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
    async isValidSlackMemberId() {
      if (this.checkSlackMemberIdOnBlur) {

        console.log('isValidSlackMemberId:');
        console.log(`isSignedIn: ${this.isSignedIn}`);
        console.log('currentUser: ');
        console.log(this.currentUser);
        console.log('userId: ');
        console.log(this.userId);
        console.log('formData:');
        console.log(this.formData);

        const response = await functions.httpsCallable('verifySlackUser')({
          userId: this.userId,
          slackMemberId: this.newReporterSlackUID,
          addSlackToProfile: true,
        });
        const confirmed = response.data;
        if (confirmed) {
          return {
            ok: true,
          };
        }
        else {
          return {
            ok: false,
            error: 'The Slack Member ID you provided was invalid',
          };
        }
      }
    },
    async save() {
      try {
        this.validate();
        if (!this.userId) {
          throw new UserError('Your user is missing a uid field.');
        }
        if (!this.reporterSlackUID) {
          // Check if the slack member id is valid
          const validSlackMember = await this.isValidSlackMemberId();
          if (validSlackMember.ok === false) {
            throw new SlackLookupError(validSlackMember.error);
          }
        }
        this.formData.contactDetails = this.email;
        this.formData.exercise = {
          id: this.exerciseId,
          referenceNumber: this.exerciseReferenceNumber,
        };
        this.formData.application = {
          id: this.applicationId,
          referenceNumber: this.applicationReferenceNumber,
        };

        let screenshot = null;
        const newBugReport = await this.$store.dispatch('bugReport/create', this.formData);

        // Store the screenshot (uses the bugReportId in it's path)
        if (this.hasScreenshot) {
          screenshot = await this.$refs.screenshot.uploadScreenshot();

          // Update the bugReport with the screenshot file path
          await this.$store.dispatch('bugReport/update', { data: {
            screenshot: screenshot,
          }, id: newBugReport.id });
        }
        await functions.httpsCallable('createZenhubIssue')({
          bugReportId: newBugReport.id,
          userId: this.userId,
        });
        this.$emit('success');
        return true;
      }
      catch (e) {

        console.log('Caught error with msg:');
        console.log(e.message);

        let msg, id = '';
        const reportErrorTo = this.showFormForProxy || this.formData.candidate === '' ? 'Development Team' : 'Admin Team';
        if (e instanceof SlackLookupError) {

          console.log('SlackLookupError!!!');

          id = 'slackUID';
          msg = e.message;
        }
        else if (e instanceof UserError) {
          id = 'uid';
          msg = `${e.message} Please report the problem directly to the ${reportErrorTo}`;
        }
        else {
          id = 'error';
          msg = `We were unable to save your bug report. Please report the problem directly to the ${reportErrorTo}`;
        }
        this.errors.push({
          id: id,
          message: msg,
        });
        return false;
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
