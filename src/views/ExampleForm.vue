<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-xl">
          Form title
        </h1>

        <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
          <h2 class="govuk-error-summary__title" id="error-summary-title">
            There is a problem
          </h2>
          <div class="govuk-error-summary__body">
            <ul class="govuk-list govuk-error-summary__list">
              <li>
                <a href="#text-field-error">Text field error</a>
              </li>
            </ul>
          </div>
        </div>

        <TextField
          id="text-field"
          v-model="textField"
          label="Text field"
          hint="hint here"
        />

        <TextField
          id="email-field"
          v-model="emailField"
          label="Email address"
          required
          :checkErrors="checkErrors"
          @handle-error="handleError"
          type="email"
          :pattern="['*@judicialappointments.digital','*@judicialappointments.gov.uk']"
        />
{{errors}}
        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>  
</template>

<script>
import TextField from '@/components/Form/TextField';
import Test from '@/views/Test';

export default {
  extends: Test,
  components: {
    TextField,
  },
  data() {
    return {
      textField: '',
      emailField: '',
      errorMessage: '',
      checkErrors: false,
      errors: {},
    };
  },
  methods: {
    handleError(payload) {
      console.log('handle error', payload);
      this.errors = payload;
    },
    async save() {
      console.log('save');
      this.warren();
      this.checkErrors = true;
      await this.$nextTick();
      console.log('check errors', this.errors);
    },
  },
};
</script>

<style>

</style>
