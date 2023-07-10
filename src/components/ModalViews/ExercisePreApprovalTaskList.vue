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
          Please make the information page and application form (if relevant) has been cleared by the following bodies before submitting for approval.
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li>JAC Policy and Diversity Teams</li>
          <li>JAC Digital Team</li>
          <li>The Head of Operations and Digital</li>
        </ul>
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
export default {
  name: 'ExercisePreApprovalTaskList',
  emits: ['close', 'confirmed'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmModal() {
      this.modalOpen = false;
      this.$emit('confirmed');
    },
  },
};
</script>
