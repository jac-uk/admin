<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <h2 class="govuk-heading-l">
          Exercise invitations
        </h2>

        <ErrorSummary :errors="errors" />

        <TextareaInput
          id="invitedEmailsText"
          v-model="invitedEmailsText"
          label="Invited candidate emails"
          hint="Please add one email address per line"
          rows="20"
          required
        />

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';

export default {
  name: 'InvitationsEdit',
  components: {
    ErrorSummary,
    TextareaInput,
  },
  extends: Form,
  data() {
    const invitations = this.$store.state.invitations.records;
    const invitedEmailsText = [];
    invitations.forEach(invite=>{
      invitedEmailsText.push(invite.candidate.email);
    });
    return {
      invitedEmailsText: invitedEmailsText.join('\n'),
    };
  },
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  methods: {
    async save(isValid) {
      await this.$store.dispatch('invitations/addInvites', {
        emails: this.formatEmails(),
      });
      await this.$store.dispatch('exerciseDocument/save', {
        'progress.invitations': isValid,
      });
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-invitations'));
    },
    formatEmails() {
      const formattedEmails = [];
      this.invitedEmailsText.split('\n').forEach(email => {
        const emailAddress = email.trim().toLowerCase();
        if (emailAddress.length) {
          if (!formattedEmails.includes(emailAddress)) {
            formattedEmails.push(emailAddress);
          }
        }
      });
      return formattedEmails;
    },
  },
};
</script>
