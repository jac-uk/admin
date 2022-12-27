<template>
  <div>
    <div class="modal__title text-left govuk-!-padding-2 background-blue">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Submit for Approval
      </h2>
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div style="text-align: left;">
        <div class="govuk-inset-text">
          Please check that the following tasks are completed before submitting for approval.
        </div>
        <p class="govuk-body">
          List of tasks to complete:
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li>Task to complete 1</li>
          <li>Task to complete 2</li>
          <li>Task to complete 3</li>
          <li>Task to complete 4</li>
          <li>Task to complete 5</li>
          <li>Task to complete 6</li>
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
