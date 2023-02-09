<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Request a Late Application
    </div>
    <div class="modal__message govuk-body-l modal__content govuk-!-padding-4">
      <p class="govuk-body">
        Your request has been sent to the leadership team.
      </p>
      <p class="govuk-body">
        You will recieve an answer soon.
      </p>
      <p>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeModal"
        >
          Close
        </button>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LateApplicationConfirmation',
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
  .modal__title {
    color: govuk-colour("white");
  }
</style>
