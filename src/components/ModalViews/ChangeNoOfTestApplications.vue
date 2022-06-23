<template>
  <div>
    <div class="modal__title text-left govuk-!-padding-2 background-blue">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Create test applications
      </h2>
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div style="text-align: left;">
        <form
          @submit.prevent="validateAndSave"
        >
          <ErrorSummary
            :errors="errors"
          />

          <div>
            <fieldset>
              <TextField
                id="no-of-applications"
                v-model="formData.noOfTestApplications"
                type="number"
                label="Number of test applications"
                hint="You can create 1-3000 test applications."
                :pattern="{ match: /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-2][0-9][0-9][0-9]|3000)$/, message: 'Only allowed 1-3000 test applications'}"
                required
              />
            </fieldset>
          </div>
          <button
            class="govuk-button govuk-!-margin-right-3"
          >
            Create
          </button>
          <button
            type="button"
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
  name: 'ChangeNoOfTestApplications',
  components: {
    ErrorSummary,
    TextField,
  },
  extends: Form,
  props: {
    noOfTestApplications: {
      type: Number,
      required: true,
    },
  },
  data () {
    return {
      formData: {
        noOfTestApplications: 1,
      },
    };
  },
  created () {
    this.formData.state = this.state;
  },
  methods: {
    closeModal () {
      this.$emit('close');
    },
    confirmModal () {
      this.modalOpen = false;
      this.$emit('confirmed');
      document.body.style.overflow = '';
    },
    async save () {
      if (this.formData.noOfTestApplications === 0) return;
      this.$store.dispatch('exerciseDocument/changeNoOfTestApplications', this.formData.noOfTestApplications);
      this.confirmModal();
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
</style>
