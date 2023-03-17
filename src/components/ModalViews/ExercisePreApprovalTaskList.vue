<template>
  <div>
    <div class="modal__title text-left govuk-!-padding-2 background-blue">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Submit for approval
      </h2>
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div style="text-align: left;">
        <div class="govuk-inset-text govuk-!-margin-bottom-7">
          <p class="govuk-body">
            Please check that the following tasks are completed before submitting for approval.
          </p>
        </div>
        <p class="govuk-body">
          List of tasks to complete:
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li>Task to complete number one</li>
          <li>Task number two to complete before submitting</li>
          <li>This is the task number three to do.</li>
          <li>The fourth task to make</li>
          <li>Number fifth</li>
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
          Submit for approval
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
