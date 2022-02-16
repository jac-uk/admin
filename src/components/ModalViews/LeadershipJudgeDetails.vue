<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Leadership Judge Details
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form @submit.prevent="validateAndSave">
          <ErrorSummary :errors="errors" />
          <fieldset>
            <TextField
              id="full-name"
              v-model="fullName"
              label="Full name"
              required
            />
            <TextField
              id="title"
              v-model="title"
              label="Title or position"
              required
            />
            <TextField
              id="email"
              v-model="email"
              label="Email"
              type="email"
              required
            />
            <TextField
              id="phone"
              v-model="phone"
              label="Phone"
              type="tel"
              required
            />
          </fieldset>
          <button
            class="govuk-button govuk-!-margin-right-3"
            @click="save"
          >
            Save
          </button>
          <button
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="closeModal"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';

export default {
  name: 'LeadershipJudgeDetails',
  components: {
    ErrorSummary,
    TextField,
  },
  extends: Form,
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    applicationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      email: null,
      fullName: null,
      phone: null,
      title: null,
    };
  },
  created() {
    this.email = this.$attrs.email;
    this.fullName = this.$attrs.fullName;
    this.phone = this.$attrs.phone;
    this.title = this.$attrs.title;
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmModal() {
      this.$emit('confirmed');
    },
    async save(isValid) {
      if (isValid()) {
        const data = {
          leadershipJudgeDetails: {
            email: this.email,
            fullName: this.fullName,
            phone: this.phone,
            title: this.title,
          },
        };
        await this.$store.dispatch('application/update', { data: data, id: this.applicationId });
        this.closeModal();
      }
    },
  },
};
</script>

<style scoped>
  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }
  .modal__title {
    color: white;
  }
</style>
