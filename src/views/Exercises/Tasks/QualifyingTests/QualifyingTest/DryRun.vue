<template>
  <div class="govuk-grid-column-two-thirds">
    <form @submit.prevent="validateAndSave">
      <h2 class="govuk-heading-l">
        Edit qualifying test dry run details
      </h2>

      <ErrorSummary
        :errors="errors"
        :show-save-button="false"
        @save="save"
      />

      <TextareaInput
        id="invitedEmailsText"
        v-model="invitedEmailsText"
        label="Invited emails"
        hint="Please add one email address per line"
        rows="20"
      />

      <button class="govuk-button">
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';

export default {
  components: {
    ErrorSummary,
    TextareaInput,
  },
  extends: Form,
  data() {
    const data = this.$store.getters['qualifyingTest/data']();

    const defaults = {
      invitedEmails: [],
    };

    const qualifyingTest = { ...defaults, ...data };

    return {
      qualifyingTest: qualifyingTest,
      invitedEmailsText: qualifyingTest.invitedEmails.join('\n'),
    };
  },
  methods: {
    async save() {
      this.formatEmails();
      await this.$store.dispatch('qualifyingTest/save', this.qualifyingTest);
      this.$router.push({ name: 'qualifying-test-review' });
    },
    formatEmails() {
      this.qualifyingTest.invitedEmails = [];
      this.invitedEmailsText.split('\n').forEach(email => {
        const emailAddress = email.trim().toLowerCase();
        if (emailAddress.length) {
          if (!this.qualifyingTest.invitedEmails.includes(emailAddress)) {
            this.qualifyingTest.invitedEmails.push(emailAddress);
          }
        }
      });
    },
  },
};
</script>
