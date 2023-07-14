<template>
  <div>
    <div class="modal__title text-left govuk-!-padding-2 background-blue">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Submit for Approval
      </h2>
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div style="text-align: left;">
        <p class="govuk-body">
          Please make sure all of the following tasks are completed before submitting for approval.
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li>Has the information page and application form (if relevant) been cleared by the JAC Policy and Diversity Teams?</li>
          <li>Has the information page and application form (if relevant) been cleared by the JAC Digital Team?</li>
          <li>Has the information page and application form (if relevant) been cleared by the Head of Operations and Digital?</li>
        </ul>
        <template v-if="wasPreviouslyRejected">
          <p>
            <a
              href="javascript:void(0);"
              role="button"
              tabindex="0"
              @click="showNote = !showNote"
            >{{ buttonText }}</a>
          </p>
          <TextArea
            v-if="showNote"
            id="rejection-reason-reply"
            v-model.trim="rejectionReasonReply"
            class="govuk-!-margin-top-7"
            required
          />
        </template>
        <button
          type="button"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          type="button"
          class="govuk-button"
          @click="confirmModal"
        >
          Submit for Approval
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import TextArea from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import _has from 'lodash/has.js';
export default {
  name: 'ExercisePreApprovalTaskList',
  components: {
    TextArea,
  },
  emits: ['close', 'confirmed'],
  data() {
    return {
      showNote: false,
      rejectionReasonReply: '',
    };
  },
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    wasPreviouslyRejected() {
      return _has(this.exercise, '_approval.rejected.message') && this.exercise._approval.rejected.message;
    },
    buttonText() {
      return this.showNote ? 'Hide note to the approver?' : 'Add a note to the approver?';
    },
  },
  watch: {
    showNote(val) {
      if (!val) {
        // Reset the reply
        this.rejectionReasonReply = '';
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmModal() {
      this.modalOpen = false;
      this.$emit('confirmed', this.rejectionReasonReply);
    },
  },
};
</script>
