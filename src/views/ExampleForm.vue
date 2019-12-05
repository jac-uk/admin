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
          :errors="errors"
          @update:errors="errors = $event"
          type="email"
          :pattern="['*@judicialappointments.digital','*@judicialappointments.gov.uk']"
        />

        <!-- <RadioGroup
          id="is-more-info-needed"
          v-model="addMoreInfo"
          label="Do you want to add more information about this exercise now?"
          hint="You can add exercise contacts, shortlisting methods, timeline dates, or information from HMCTS. You can also do this later"
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <CheckboxGroup
              id="select-more-info"
              v-model="addMoreInfoSelection"
              label="What do you want to add?"
              hint="Select all that apply."
            >
              <CheckboxItem
                value="contacts"
                label="Exercise contacts"
              />
              <CheckboxItem
                value="shortlisting"
                label="Shortlisting methods"
              />
              <CheckboxItem
                value="timeline"
                label="Timeline"
              />
              <CheckboxItem
                value="vacancy"
                label="Vacancy information"
              />
              <CheckboxItem
                value="eligibility"
                label="Eligibility Information"
              />
            </CheckboxGroup>
          </RadioItem>

          <RadioItem
            :value="false"
            label="No - I'll do this later"
          />
        </RadioGroup>
 -->
{{ errors }}
        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>  
</template>

<script>
import TextField from '@/components/Form/TextField';

export default {
  components: {
    TextField,
  },
  data() {
    return {
      textField: '',
      emailField: '',
      errors: {},
      errorMessage: '',
      checkErrors: false
    };
  },
  methods: {
    save() {
      console.log('save');
      this.checkErrors = true;
    },
  },
};
</script>

<style>

</style>
