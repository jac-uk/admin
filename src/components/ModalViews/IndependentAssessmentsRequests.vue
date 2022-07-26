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
          <div class="govuk-!-margin-bottom-5">
            <span class="govuk-body-m">Before proceeding, please confirm that you wish to send a {{ typeOfEmail }} to </span>
            <span class="govuk-body-m govuk-!-font-weight-bold">{{ numberOfCandidates }} candidate(s) </span>
            <span class="govuk-body-m">and the email template contains all required information</span>
          </div>
          <button
            class="govuk-button govuk-!-margin-right-3 govuk-!-top-3"
            @click.prevent="send"
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
export default {
  name: 'IndependentAssessmentsRequests',
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
    };
  },
  computed: {
    typeOfEmail() {
      let str = '';

      if (this.type === 'requests' || this.type === 'request') {
        str += 'request';
      } else if (this.type === 'reminders' || this.type === 'reminder') {
        str += 'reminder';
      } else if (this.type === 'testRequest') {
        str += 'test request';
      }

      return str;
    },
    numberOfCandidates() {
      let str = '';

      if (this.type === 'requests' || this.type === 'reminders') {
        str += this.params.length.toString();
      } else if (this.type === 'testRequest' || this.type === 'request' || this.type === 'reminder') {
        str += '1';
      }

      return str;
    },
    buttonText() {
      if (this.processing === true) {
        return 'Processing...';
      }

      let str = '';
      if (this.type === 'requests' || this.type === 'request') {
        str += 'request';
      } else if (this.type === 'testRequest') {
        str += 'test request';
      } else if (this.type === 'reminders' || this.type === 'reminder') {
        str += 'reminder';
      }
      return `I confirm, please send ${str}`;
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
      this.$emit('ok', this.params);
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
