<template>
  <div>
    <form
      ref="form"
      @submit.prevent="validateAndSave"
    >
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-three-quarters">
          <h1
            class="govuk-heading-l govuk-!-margin-top-9 govuk-!-margin-bottom-6"
          >
            Update candidate login email address
          </h1>
        </div>
      </div>

      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <Banner
            v-if="status"
            :message="message"
            :status="status"
          />
        </div>
      </div>

      <div class="govuk-grid-row">
        <div class="govuk-grid-column-three-quarters">
          <span
            v-if="submitted && !status"
            class="govuk-body govuk-!-margin-top-6 govuk-!-margin-bottom-2"
          >
            Please wait... Your request is being processed.
          </span>
        </div>
      </div>

      <div class="govuk-grid-row">
        <div class="govuk-grid-column-three-quarters">
          <h2
            class="govuk-heading-m govuk-!-margin-top-6 govuk-!-margin-bottom-6"
          >
            Current email address: {{ currentEmail }}
          </h2>
          <TextField
            id="new-login-email-address"
            v-model="newEmailAddress"
            class="govuk-!-width-one-half"
            label="New email address:"
            type="email"
            required
          />
          <ActionButton
            type="primary"
            class="govuk-!-margin-bottom-4"
            :action="save"
          >
            Update
          </ActionButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner.vue';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'UpdateLoginEmail',
  components: {
    TextField,
    Banner,
    ActionButton,
  },
  extends: Form,
  mixins: [permissionMixin],
  props: {
    candidateId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentEmailAddress: 'unknown',
      newEmailAddress: null,
      message: '',
      status: null,
      submitted: false,
    };
  },
  computed: {
    currentEmail() {
      return this.currentEmailAddress;
    },
  },
  async created() {
    this.getCurrentEmailAddress(this.candidateId);
  },
  methods: {
    async getCurrentEmailAddress() {
      try {
        const response = await functions.httpsCallable('getUserEmailByID')({
          candidateId: this.candidateId });

        if (response.data === false) {
          this.setMessage('Current email address could not be retrieved.', 'warning');
        } else {
          this.currentEmailAddress = response.data;
        }
      }
      catch (error) {
        this.setMessage('Failed to perform action.', 'warning');
      }
    },
    async save() {
      this.validate();
      let isSuccess = false;
      if (this.isValid()) {
        if (this.hasPermissions([this.PERMISSIONS.candidates.permissions.canUpdateCandidates.value])) {
          this.submitted = true;
          try {
            const response = await functions.httpsCallable('updateEmailAddress')({
              currentEmailAddress: this.currentEmailAddress,
              newEmailAddress: this.newEmailAddress });

            const result = response.data;
            if (result.status === 'success') {
              this.setMessage('Email address was updated.', 'success');
              this.currentEmailAddress = result.data.email;
              isSuccess = true;
            } else {
              if (result.data.code === 'auth/email-already-exists') {
                this.setMessage('An account already exists with this email address. To update the candidate login email address with this email address the other account will need to be removed. Please contact the Digital Team for assistance.', 'warning');
              } else if (result.data.code === 'auth/invalid-email') {
                this.setMessage(result.data.message, 'warning');
              } else {
                this.setMessage('Failed to update email address.', 'warning');
              }
            }
          }
          catch (error) {
            this.setMessage('Failed to perform action.', 'warning');
          }
          this.$refs.form.reset();
          setTimeout(() => {
            this.submitted = false;
          },5000);
          setTimeout(() => {
            this.status = null;
          },5000);
        } else {
          this.setMessage('Unauthorised to perform action.', 'warning');
        }
      }

      return isSuccess;
    },
    setMessage(message, status) {
      this.status = status;
      this.message = message;
    },
  },
};
</script>
