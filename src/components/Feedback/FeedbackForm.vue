<template>
  <div>
    <ErrorSummary
      :errors="errors"
    />

    <TextField
      v-if="!reporterSlackUID"
      id="slackUID"
      v-model="newReporterSlackUID"
      label="Your Slack member ID"
      type="text"
      required
    />

    <div v-if="isYourself">
      <div class="govuk-warning-text">
        <span
          class="govuk-warning-text__icon"
          aria-hidden="true"
        >!</span>
        <strong class="govuk-warning-text__text">
          <span class="govuk-warning-text__assistive">Warning</span>
          <span>Please ensure you are on the relevant page before raising the issue</span>
        </strong>
      </div>
      <CaptureScreenshot
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
      <TextArea
        id="issue"
        v-model="formData.issue"
        label="What happened? *"
        rows="2"
        required
      />
      <TextArea
        id="expectation"
        v-model="formData.expectation"
        label="What did you expect to happen? *"
        rows="2"
        required
      />
    </div>
    <div
      v-else-if="isAnotherUser"
      style="display: flex; gap: 20px;"
    >
      <div style="width: 50%;">
        <div class="govuk-warning-text">
          <span
            class="govuk-warning-text__icon"
            aria-hidden="true"
          >!</span>
          <strong class="govuk-warning-text__text">
            <span class="govuk-warning-text__assistive">Warning</span>
            <span>Please ensure you are on the relevant page before raising the issue</span>
            <span class="govuk-hint">
              e.g. Candidate application page
            </span>
          </strong>
        </div>
        <RadioGroup
          id="user-type"
          v-model="formData.userType"
          label="What is the user type?"
          :inline="true"
        >
          <RadioItem
            v-for="(userType, key) in userTypes"
            :key="userType"
            :value="userType"
            :label="key"
          />
        </RadioGroup>
        <RadioGroup
          id="cps-device"
          v-model="formData.cpsDevice"
          label="Is the user using a CPS device?"
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
        <TextField
          id="name"
          v-model="formData.candidate"
          label="Name of user *"
          type="text"
          required
        />
      </div>
      <div style="width: 50%;">
        <TextField
          v-if="formData.userType === userTypes.Candidate"
          id="browser"
          v-model="formData.browser"
          label="User's browser (candidate only)"
          type="text"
          required
        />
        <TextField
          v-if="formData.userType === userTypes.Candidate"
          id="os"
          v-model="formData.os"
          label="User's operating system (candidate only)"
          type="text"
          required
        />
        <TextArea
          id="issue"
          v-model="formData.issue"
          label="What happened? *"
          rows="2"
          required
        />
        <TextArea
          id="expectation"
          v-model="formData.expectation"
          label="What did they expect to happen? *"
          rows="2"
          required
        />
      </div>
    </div>
    <div v-else-if="isQuestion">
      <TextArea
        id="question"
        v-model="formData.question"
        label="If you have a Digital platform-related question, not an issue - please ask it here:"
        required
      />
    </div>

    <div class="text-right">
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
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';
import SlackLookupError from '@/errors/slackLookupError';
import UserError from '@/errors/userError';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { USER_FEEDBACK_TYPES } from '@/helpers/constants';

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
  props: {
    type: {
      type: String,
      required: true,
      default: '',
    },
  },
  emits: ['close', 'success'],
  data() {
    const userTypes = {
      Candidate: 'candidate',
      Assessor: 'assessor',
      Panellist: 'panellist',
    };

    return {
      client: null,
      fileTypes: '.bmp, .jpg, .jpeg, .gif, .png',
      formData: {
        type: this.type,
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
        userType: userTypes.Candidate,
        question: '',
      },
      errors: [],
      userTypes,
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
    isYourself() {
      return this.type === USER_FEEDBACK_TYPES.YOURSELF;
    },
    isAnotherUser() {
      return this.type === USER_FEEDBACK_TYPES.ANOTHER_USER;
    },
    isQuestion() {
      return this.type === USER_FEEDBACK_TYPES.QUESTION;
    },
    bugReportId() {
      return this.$store.state.bugReport.record ? this.$store.state.bugReport.record.id : null;
    },
    hasScreenshot() {
      return (this.$refs.screenshot && this.$refs.screenshot.$data.thumbnail) ? true : false;
    },
  },
  watch: {
    newReporterSlackUID() {
      this.checkSlackMemberIdOnBlur = true;
      this.hasSlackIdOnLoad = false;
    },
  },
  async mounted() {
    this.client = detect();
    this.formData.url = window.location.href;
    this.formData.reporter = this.displayName;
    this.formData.userId = this.userId;
    this.formData.slackMessages = {
      onCreate: {
        retries: 0,
        sentAt: null,
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async isValidSlackMemberId() {
      if (this.checkSlackMemberIdOnBlur) {
        const response = await httpsCallable(functions, 'verifySlackUser')({
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
        if (!this.isValid()) return false;
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

        if (this.isAnotherUser) {
          this.formData.browser = '';
          this.formData.os = '';
        } else {
          this.formData.candidate = '';
          this.formData.browser = `${this.client.name} ${this.client.version}`;
          this.formData.os = this.client.os;
        }

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

        if (this.isQuestion) {
          // Create a Slack message
          await httpsCallable(functions, 'createSlackMessage')({
            bugReportId: newBugReport.id,
            userId: this.userId,
          });
        } else {
          // Create a Zenhub issue
          await httpsCallable(functions, 'createZenhubIssue')({
            bugReportId: newBugReport.id,
            userId: this.userId,
          });
        }
        this.$emit('success');
        return true;
      }
      catch (e) {
        let msg, id = '';
        const reportErrorTo = this.formData.candidate === '' ? 'Development Team' : 'Admin Team';
        if (e instanceof SlackLookupError) {
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
