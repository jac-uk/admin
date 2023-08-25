<template>
  <div>
    <ErrorSummary
      :errors="errors"
    />
    <form @submit.prevent="validateAndSave">
      <TextField
        id="url"
        v-model="formData.url"
        label="Url"
        type="text"
        required
      />
      <TextArea
        id="complaint"
        v-model="formData.complaint"
        label="What happened?"
        required
      />
      <TextField
        id="expectation"
        v-model="formData.expectation"
        label="What did you want to happen?"
        type="text"
        required
      />

      <TextField
        id="name"
        v-model="formData.fullName"
        label="Your name"
        type="text"
        required
      />

      <div class="govuk-form-group">
        <Select
          id="contact-detail-type"
          v-model="formData.contactDetailType"
          label="Contact type"
          hint="The best way to get in touch"
          required
        >
          <option
            value=""
            selected
          >
            Please select
          </option>
          <option
            v-for="(contactDetailType, index) in contactDetailTypes"
            :key="(index + 1)"
            :value="contactDetailType"
          >
            {{ contactDetailType }}
          </option>
        </Select>
        <TextField
          id="contactDetails"
          v-model="formData.contactDetails"
          label="Your contact details"
          type="text"
          required
        />
      </div>

      <button
        type="button"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="closeModal"
      >
        Cancel
      </button>
      <button
        class="govuk-button"
        type="submit"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script>
// @TODO: THIS COMPONENT IS BASED ON MODALINNER!
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import TextArea from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
//import ExtendedError from '@/errors/extendedError';
export default {
  name: 'FeedbackForm',
  components: {
    TextField,
    TextArea,
    Select,
    ErrorSummary,
  },
  extends: Form,
  emits: ['close'],
  data() {
    return {
      formData: {
        url: '',
        expectation: '',
        complaint: '',
        contactDetailType: '',
        contactDetails: '',
        fullName: '',
        reason: '',
        seniorLeadership: '', // @TODO: DO WE NEED THIS (OR SEND TO WHOLE TEAM??) - Warren said send to whole team
      },
      errors: [],

      // @TODO: Validation??
      contactDetailTypes: ['slack', 'teams', 'email'],
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async save() {
      console.log('SAVE!');
      // try {
      //   await this.$store.dispatch('candidates/getByEmail', this.formData.email);
      //   if (!this.candidate) {
      //     throw {
      //       id: 'error',
      //       message: 'A candidate with that email does not exist.',
      //     };
      //   }
      //   else if (this.hasAppliedForExercise) {
      //     throw new ExtendedError({
      //       id: 'error',
      //       message: 'The candidate has already applied for the exercise.',
      //       routerLink: {
      //         link: { name: 'exercise-overview', params: { id: this.exerciseId } },
      //         text: 'Click here to open the exercise',
      //       },
      //     });
      //   }
      //   else if (this.hasLateApplicationRequest) {
      //     throw {
      //       id: 'error',
      //       message: 'An application request has already been created for this candidate.',
      //     };
      //   }
      //   else {
      //     const route = this.$router.resolve({
      //       name: 'exercise-overview',
      //       params: { id: this.exerciseId },
      //     });
      //     const absoluteURL = new URL(route.href, window.location.origin).href;
      //     await this.$store.dispatch(
      //       'lateApplicationRequestMsg/create', {
      //         exerciseId: this.exerciseId,
      //         exercise: this.exercise,
      //         requester: {
      //           fullName: this.$store.getters['auth/getDisplayName'],
      //           email: this.$store.getters['auth/getEmail'],
      //         },
      //         candidate: this.candidate,
      //         reason: this.formData.reason,
      //         url: absoluteURL,
      //       });
      //     this.openConfirmModal();
      //   }
      // }
      // catch (error) {
      //   this.errors.push(error);
      // }
    },
  },
};
</script>

<style lang="css" scoped>
.modal {
  text-align: center;
}
.modal__title {
  text-align: center;
  vertical-align: middle;
  border: solid 2px #1d70b8;
  background-color: #1d70b8;
  color: white;
}
.modal__message {
  vertical-align: middle;
}
.deny {
  background-color: #f3f2f1;
}
</style>
