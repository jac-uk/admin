<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-xl">
          Example form
        </h1>

        <ErrorSummary :errors="errors" />

        <TextField
          id="text-field"
          v-model="textField"
          label="Your name"
          hint="Between 5 and 10 characters"
          required
          :min-length="5"
          :max-length="10"
        />

        <TextField
          id="email-field"
          v-model="emailField"
          label="Email address"
          hint="Any email address"
          type="email"
          required
        />

        <TextField
          id="jac-email-field"
          v-model="JACEmailField"
          label="JAC email address"
          hint="Ends with @judicialappointments.digital or @judicialappointments.gov.uk"
          type="email"
          required
          :pattern="{ match: /@judicialappointments.(digital|gov.uk)$/, message: 'Please use a JAC email address'}"
        />

        <Currency 
          id="currency-field"
          v-model="currencyField"
          label="Salary"
          required
        />

        <TextareaInput 
          id="textarea-field"
          v-model="textareaField"
          label="Description"
          required
        />

        <DateInput 
          id="date-field"
          v-model="dateField"
          label="Date of birth"
          required        
        />

        <TimeInput 
          id="time-field"
          v-model="timeField"
          label="Start time"
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
import TextField from '@/components/Form/TextField';
import Currency from '@/components/Form/Currency';
import TextareaInput from '@/components/Form/TextareaInput';
import DateInput from '@/components/Form/DateInput';
import TimeInput from '@/components/Form/TimeInput';

export default {
  components: {
    ErrorSummary,
    TextField,
    Currency,
    TextareaInput,
    DateInput,
    TimeInput,
  },
  extends: Test,
  extends: Form,
  data() {
    return {
      textField: '',
      emailField: '',
      JACEmailField: '',
      currencyField: '',
      textareaField: '',
      dateField: null,
      timeField: null,
    };
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        // process form here
      }
    },
  },
};
</script>
