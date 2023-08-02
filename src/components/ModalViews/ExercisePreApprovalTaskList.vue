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
          Please make sure the information page and application form (if relevant) have been cleared by the following bodies before submitting for approval.
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <CheckboxGroup
            id="approval-checklist"
            v-model="approvalChecklist"
            hint="Select all that apply."
          >
            <CheckboxItem
              value="policy-and-viversity-teams"
              label="JAC Policy and Diversity Teams"
            />
            <CheckboxItem
              value="jac-digital-teams"
              label="JAC Digital Team"
            />
            <CheckboxItem
              value="ops-and-digital"
              label="The Head of Operations and Digital"
            />
          </CheckboxGroup>
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
          :disabled="!isReadyForApproval"
          @click="confirmModal"
        >
          Submit for Approval
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';
import TextArea from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import _has from 'lodash/has.js';
export default {
  name: 'ExercisePreApprovalTaskList',
  components: {
    CheckboxGroup,
    CheckboxItem,
    TextArea,
  },
  emits: ['close', 'confirmed'],
  data() {
    return {
      approvalChecklist: null,
      showNote: false,
      rejectionReasonReply: '',
    };
  },
  computed: {
    isReadyForApproval() {
      return Array.isArray(this.approvalChecklist) && this.approvalChecklist.length === 3;
    },
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
