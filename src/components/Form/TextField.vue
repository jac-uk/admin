<template>
  <div
    class="govuk-form-group"
    :class="{'govuk-form-group--error': hasError}"
  >
    <label
      :for="id"
      class="govuk-heading-m govuk-!-margin-bottom-2"
    >
      {{ label }}
    </label>
    <span
      v-if="hint"
      class="govuk-hint"
    >
      {{ hint }}
    </span>
    <FormFieldError
      :id="id"
      :error-message="errorMessage"
    />
    <input
      :id="id"
      v-model="text"
      class="govuk-input"
      :class="[inputClass, {'govuk-input--error': hasError}]"
      :type="fieldType"
      @change="validate"
    >
  </div>
</template>

<script>
import FormField from '@/components/Form/FormField';
import FormFieldError from '@/components/Form/FormFieldError';

export default {
  components: {
    FormFieldError,
  },
  extends: FormField,
  props: {
    inputClass: {
      default: '',
      type: String,
    },
    value: {
      default: '',
      type: String,
    },
    type: {
      default: 'text',
      type: String,
    },
    required: Boolean,
    checkErrors: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      errorMessage: '',
    };
  },
  computed: {
    text: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    fieldType() {
      switch(this.type) {
      case 'text':
      case 'email':
        return 'text'; // we are using custom email validation, so don't use html5 input types
      default:
        return this.type;
      }
    },
  },
  watch: {
    checkErrors: function (newVal, oldVal) {
      console.log('showErrors changed', oldVal, newVal);
      this.validate();
    },
  }, 
  methods: {
    validate() {
      console.log('validate');
      this.setError('');
      if (this.checkErrors) {
        if (this.required && !this.value) {
          this.setError(`Enter your ${this.label}`);
        }
      }
    },
    setError(message) {
      this.errorMessage = message;
      // this.errors[this.id] = message;
      // console.log('update:errors', this.errors);
      //this.$emit('update:errors', this.errorMessage);
      this.$emit('handle-error', { id: this.id, message: this.errorMessage });
    },
  }, 
};
</script>
