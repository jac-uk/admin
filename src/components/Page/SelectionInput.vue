<template>
  <div class="govuk-form-group">
    <fieldset
      class="govuk-fieldset"
      :aria-describedby="`${id}-hint`"
    >
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
        {{ title }}
      </legend>
      <span
        :id="`${id}-hint`"
        class="govuk-hint"
      >
        {{ hintText }}
      </span>

      <FormFieldError
        :id="id"
        :error-message="errorMessage"
      />

      <SingleChoice
        v-if="isSingleChoice"
        :id="id"
        v-model="localVModel"
        :answers="answers"
        :config="config"
      />

      <MultipleChoice
        v-if="isMultipleChoice"
        :id="id"
        v-model="localVModel"
        :answers="answers"
        :config="config"
      />

      <RankedChoice
        v-if="isRankedChoice"
        :id="id"
        v-model="localVModel"
        :answers="answers"
        :config="config"
      />
    </fieldset>
  </div>
</template>

<script>
import SingleChoice from '@/components/SelectionInput/SingleChoice.vue';
import MultipleChoice from '@/components/SelectionInput/MultipleChoice.vue';
import RankedChoice from '@/components/SelectionInput/RankedChoice.vue';
import FormField from '@/components/Form/FormField.vue';
import FormFieldError from '@/components/Form/FormFieldError.vue';
import { isGapInIntegers } from '@/helpers/array';

export default {
  compatConfig: {
    COMPONENT_V_MODEL: false,
    // or, for full vue 3 compat in this component:
    //MODE: 3,
  },
  name: 'SelectionInput',
  components: {
    FormFieldError,
    SingleChoice,
    MultipleChoice,
    RankedChoice,
  },
  extends: FormField,
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
    config: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    modelValue: {
      type: [String, Array, Object],
      required: false,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    localVModel: {
      get() {
        if (this.modelValue) return this.modelValue;
        switch (this.type) {
        case 'multiple-choice':
          return [];
        case 'ranked-choice':
          return {};
        default:
          return '';
        }
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
    hintText() {
      switch (this.type) {
      case 'single-choice':
        return 'Select one answer';
      case 'multiple-choice':
        switch (this.config.minimumAnswerMode) {
        case 'some':
          return `Select at least ${this.config.minimumAnswerQuantity} answers`;
        case 'exactly':
          return `Select exactly ${this.config.minimumAnswerQuantity} answers`;
        default:
          return 'Select all that apply';
        }
      case 'ranked-choice':
        // eslint-disable-next-line no-case-declarations
        let text = '';
        switch (this.config.minimumAnswerMode) {
        case 'all':
          text += 'Select and rank all answers.';
          break;
        case 'some':
          return `Select and rank at least ${this.config.minimumAnswerQuantity} answers.`;
        case 'exactly':
          return `Select and rank exactly ${this.config.minimumAnswerQuantity} answers.`;
        default:
          return 'Select and rank all that apply.';
        }
        text += ' With 1 being your top choice.';
        return text;
      default:
        return '';
      }
    },
    isSingleChoice() {
      return this.type === 'single-choice';
    },
    isMultipleChoice() {
      return this.type === 'multiple-choice';
    },
    isRankedChoice() {
      return this.type === 'ranked-choice';
    },
  },
  methods: {
    validate() {
      FormField.methods.validate.call(this);
      if (this.required && this.modelValue === null) {
        this.setError(`Please enter a value for ${this.label}`);
        return false;
      }
      if (!this.errorMessage && this.checkErrors && this.config) {
        switch (this.type) {
        case 'multiple-choice':
          if (this.config.minimumAnswerMode === 'some') {
            if (this.modelValue.length < this.config.minimumAnswerQuantity) {
              this.setError(`Please choose at least ${this.config.minimumAnswerQuantity} answers for ${this.label}`);
              return false;
            }
          }
          if (this.config.minimumAnswerMode === 'exactly') {
            if (this.modelValue.length !== this.config.minimumAnswerQuantity) {
              this.setError(`Please choose exactly ${this.config.minimumAnswerQuantity} answers for ${this.label}`);
              return false;
            }
          }
          break;
        case 'ranked-choice':
          if (this.config.minimumAnswerMode === 'all') {
            if (Object.keys(this.modelValue).length < this.config.answers.length) {
              this.setError(`Please select and rank all answers for ${this.label}`);
              return false;
            }
          }
          if (this.config.minimumAnswerMode === 'some') {
            if (Object.keys(this.modelValue).length < this.config.minimumAnswerQuantity) {
              this.setError(`Please select and rank at least ${this.config.minimumAnswerQuantity} answers for ${this.label}`);
              return false;
            }
          }
          if (this.config.minimumAnswerMode === 'exactly') {
            if (Object.keys(this.modelValue).length !== this.config.minimumAnswerQuantity) {
              this.setError(`Please select and rank exactly ${this.config.minimumAnswerQuantity} answers for ${this.label}`);
              return false;
            }
          }
          if (this.config.allowEqualRanking) {
            if (!this.validateNoGapInRankings(this.modelValue)) {
              this.setError('Please ensure there are no gaps in the rankings');
              return false;
            }
          }
          break;
        default:

        }
      }
    },
    validateNoGapInRankings(rankings) {
      const ranks = Object.values(rankings);
      if (ranks.length === 0) {
        return false;
      }
      ranks.sort((a, b) => a - b); // Sort the array in ascending order
      // Ensure the first rank is 1
      if (ranks[0] !== 1) {
        return false;
      }
      return !isGapInIntegers(ranks);
    },
  },
};

</script>
