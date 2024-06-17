<template>
  <div class="report-info">
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Report Info
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <p class="govuk-body">
          There are now two reports for JO. The new Handover report, which contains HR details of candidates only, and the new Deployment report, which contains Location and Jurisdiction details, where relevant, only.
        </p>
        <div class=" text-center">
          <button
            type="button"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="closeModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReportInfo',
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
  .modal .report-info .govuk-form-group,
  .modal .report-info .govuk-inset-text {
    text-align: left;
  }
  /*
  .late-application .modal__title {
    color: #ffffff;
  }
  */
  .form-row {
    margin-bottom: 1em;
  }
</style>
