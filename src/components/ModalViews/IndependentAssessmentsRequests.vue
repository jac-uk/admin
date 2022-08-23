<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Independent Assessments {{ typeOfEmail }}
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form
          ref="formRef"
        >
          <div
            v-if="isCancel || isReset || isDelete"
            class="govuk-!-margin-bottom-5"
            :style="isCancel ? 'text-align: left' : ''"
          >
            <span class="govuk-body-m">Before proceeding, please confirm that you wish to {{ type }} the assessments of </span>
            <span class="govuk-body-m govuk-!-font-weight-bold">{{ numberOfCandidates }} candidate(s) </span>
          </div>
          <div
            v-else
            class="govuk-!-margin-bottom-5"
          >
            <span class="govuk-body-m">Before proceeding, please confirm that you wish to send a {{ typeOfEmail }} to </span>
            <span class="govuk-body-m govuk-!-font-weight-bold">{{ numberOfCandidates }} candidate(s) </span>
            <span class="govuk-body-m">and the email template contains all required information</span>
          </div>

          <div v-if="isCancel" style="text-align: left;">
            <span class="govuk-body-m">Cancel reason:</span>
            <TextField
              id="reason"
              v-model="reason"
              label=""
              required
            />
          </div>

          <button
            class="govuk-button govuk-!-margin-right-3 govuk-!-top-3"
            @click.prevent="send"
            :disabled="isCancel && !reason"
          >
            {{ buttonText }}
          </button>
          <button
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click.prevent="closeModal"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';

export default {
  name: 'IndependentAssessmentsRequests',
  components: {
    TextField,
  },
  props: {
    type: {
      type: String,
      required: true,
      default: '',
    },
    params: {
      type: [Number, String, Object, Array],
      required: false,
      default: null,
    },
  },
  data() {
    return {
      processing: false,
      reason: '',
    };
  },
  computed: {
    typeOfEmail() {
      let str = '';

      if (this.type === 'request') {
        str += 'request';
      } else if (this.type === 'reminder') {
        str += 'reminder';
      } else if (this.type === 'testRequest') {
        str += 'test request';
      } else if (this.type === 'testReminder') {
        str += 'test reminder';
      } else if (this.type === 'cancel') {
        str += 'cancel';
      } else if (this.type === 'reset') {
        str += 'reset';
      } else if (this.type === 'delete') {
        str += 'delete';
      }

      return str;
    }, 
    isCancel() {
      return this.type === 'cancel';
    },
    isReset() {
      return this.type === 'reset';
    },
    isDelete() {
      return this.type === 'delete';
    },  
    numberOfCandidates() {
      return this.params.assessmentIds.length;
    },
    buttonText() {
      if (this.processing === true) {
        return 'Processing...';
      }

      let str = 'I confirm, please ';
      if (this.type === 'request') {
        str += 'send request';
      } else if (this.type === 'reminder') {
        str += 'send reminder';
      } else if (this.type === 'testRequest') {
        str += 'send test request';
      } else if (this.type === 'testReminder') {
        str += 'send test reminder';
      } else if (['cancel', 'reset', 'delete'].includes(this.type)) {
        return 'Ok';
      }

      return str;
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmModal() {
      this.modalOpen = false;
      this.$emit('confirmed');
      document.body.style.overflow = '';
    },
    send() {
      this.processing = true;
      if (this.isCancel) {
        this.$emit('ok', { ...this.params, cancelReason: this.reason });
      } else {
        this.$emit('ok', this.params);
      }
      this.processing = false;
      this.closeModal();
    },
  },
};
</script>

<style scoped>
  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }
</style>
