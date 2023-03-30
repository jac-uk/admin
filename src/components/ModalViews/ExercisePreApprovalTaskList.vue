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
