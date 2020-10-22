<template>
  <div />
</template>

<script>
import formatEmail from '@/helpers/Form/formatEmail';

export default {
  props: {
    id: {
      required: true,
      type: String,
      default: '',
    },
    label: {
      default: '',
      type: String,
    },
    hint: {
      default: '',
      type: String,
    },
    messages: {
      type: Object,
      default: () => {
        return {};
      },
    },
    required: Boolean,
    minLength: {
      type: Number,
      default: 0,
    },
    maxLength: {
      type: Number,
      default: 0,
    },
    pattern: {
      type: Object,
      default: () => {
        return {
          match: /^/,
          message: '',
        };
      },
    },
  },
  data() {
    return {
      errorMessage: '',
      checkErrors: false,
      regex: {
        // eslint-disable-next-line
        email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/,
      },
    };
  },
  computed: {
    hasError() {
      return this.errorMessage ? true :  false;
    },
  },
  mounted: function () {
    this.$root.$on('validate', this.handleValidate);
  },
  beforeDestroy: function() {
    this.setError('');
    this.$root.$off('validate', this.handleValidate);
  },
  methods: {
    handleValidate() {
      this.checkErrors = true;
      this.validate();
    },
    validate(event) {
      this.setError('');
      if (this.checkErrors) {
        let value = this.value;
        if (event && event.target) {
          value = event.target.value;
        }
        if (this.required && (value === null || value.length === 0)) {
          if (this.messages && this.messages.required) {
            this.setError(this.messages.required);
          } else {
            this.setError(`Please enter a value for ${this.label}`);
          }
        }
        if (this.type && this.type === 'email' && value) {
          value = formatEmail(value);
          this.text = value;
          if (!this.regex.email.test(value)) {
            this.setError(`Enter a valid email address for ${this.label}`);
          }
        }
        if (this.minLength && value) {
          if (value.length + 1 <= this.minLength) {
            this.setError(`${this.label} should have ${this.minLength} or more characters`);
          }
        }
        if (this.maxLength && value) {
          if (value.length > this.maxLength) {
            this.setError(`${this.label} should have ${this.maxLength} or fewer characters`);
          }
        }
        if (this.pattern && value) {
          if (!this.pattern.match.test(value)) {
            this.setError(this.pattern.message);
          }
        }
      }
    },
    setError(message) {
      this.errorMessage = message;
      this.$root.$emit('handle-error', { id: this.id, message: this.errorMessage });
    },
  },
};
</script>
