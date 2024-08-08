<template>
  <div
    class="govuk-form-group"
    :class="{'govuk-form-group--error': hasError}"
  >
    <label
      v-show="displayLabel"
      :for="id"
      :class="labelHidden ? 'govuk-visually-hidden' : 'govuk-heading-m govuk-!-margin-bottom-2'"
    >
      {{ label }}
    </label>
    <CustomHTML
      v-if="hint"
      :value="hint"
      class="govuk-hint"
    />
    <FormFieldError
      :id="id"
      :error-message="errorMessage"
    />
    <textarea
      :id="id"
      v-model="text"
      class="govuk-textarea"
      :class="disabled ? 'disabled': ''"
      name="word-count"
      :rows="rows"
      :disabled="disabled"
      :style="style"
      @keydown="handleLimit($event)"
      @keyup="handleLimit($event)"
      @change="validate"
    />

    <div
      v-if="wordLimit"
      class="govuk-hint govuk-character-count__message"
    >
      <span
        :class="wordsTooMany > 0 ? 'govuk-error-message' : ''"
      >
        {{ wordLimitCount }}
      </span>
    </div>
  </div>
</template>

<script>
import FormField from '@jac-uk/jac-kit/draftComponents/Form/FormField.vue';
import FormFieldError from '@jac-uk/jac-kit/draftComponents/Form/FormFieldError.vue';
import CustomHTML from '@jac-uk/jac-kit/components/CustomHTML.vue';
export default {
  compatConfig: {
    COMPONENT_V_MODEL: false,
    // or, for full vue 3 compat in this component:
    //MODE: 3,
  },
  name: 'TextareaInput',
  components: {
    FormFieldError,
    CustomHTML,
  },
  extends: FormField,
  props: {
    modelValue: {
      default: '',
      type: String,
    },
    rows: {
      default: '5',
      type: String,
    },
    wordLimit: {
      required: false,
      default: 0,
      type: Number,
    },
    labelHidden: {
      default: false,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    style: {
      default: () => {},
      type: Object,
    },
    displayLabel: { // Need to be able to suppress displaying the label when we want more control over it
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    wordsTooMany() {
      return this.words.length - this.wordLimit;
    },
    wordLimitCount() {
      let result;
      const plural = Math.abs(this.wordsTooMany) > 1 ? 's' : '';
      if (this.words.length > this.wordLimit) {
        result = `You have ${this.wordsTooMany} word${plural} too many`;
      } else if (Math.floor(this.wordLimit * 0.20) > Math.abs(this.wordsTooMany)) {
        result = `You have ${Math.abs(this.wordsTooMany)} word${plural} remaining`;
      } else {
        result = `${this.words.length}/${this.wordLimit}`;
      }
      if (this.wordsTooMany == 0) {
        result = 'You have no words remaining';
      }
      return result;
    },
    text: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
  },

  methods: {
    handleLimit(e){
      if (this.wordLimit && [8, 46].indexOf(e.keyCode) === -1) {
        this.handleValidate();
      }
    },
  },
};
</script>
<style>
.disabled {
  background-color: darkgrey;
}
</style>
