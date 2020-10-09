<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Exercise invitations
        </h1>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

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
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import TextareaInput from '@/components/Form/TextareaInput';
import BackLink from '@/components/BackLink';

export default {
  components: {
    ErrorSummary,
    TextareaInput,
    BackLink,
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
  methods: {
    async save(isValid) {
      // TODO clean emails
      await this.$store.dispatch('invitations/addInvites', {
        emails: this.invitedEmailsText.split('\n'),
      });
      await this.$store.dispatch('exerciseDocument/save', {
        'progress.invitations': isValid,
      });
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-invitations'));
    },
  },
};
</script>
