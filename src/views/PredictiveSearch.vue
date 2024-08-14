<template>
  <div
    class="govuk-form-group"
    :class="{'govuk-form-group--error': hasError}"
  >
    <label
      v-if="label"
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
    <div class="autocomplete-container">
      <input
        :id="id"
        v-model="searchTerm"
        class="govuk-input"
        :class="{'govuk-input--error': hasError}"
        :required="required"
        aria-autocomplete="list"
        aria-controls="autocomplete-list"
        @input="onInput"
        @keydown.down="onArrowDown"
        @keydown.up="onArrowUp"
        @keydown.enter="onEnter"
      >
      <ul
        v-if="filteredResults.length"
        id="autocomplete-list"
        class="autocomplete-results"
      >
        <li
          v-for="(result, index) in filteredResults"
          :key="result.id"
          :class="{'highlighted': highlightedIndex === index}"
          @mousedown="onSelect(result)"
          @mouseover="highlightedIndex = index"
        >
          {{ result.name }} - {{ result.referenceNumber }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import FormField from './FormField.vue';
// import FormFieldError from './FormFieldError.vue';
import FormField from '@jac-uk/jac-kit/draftComponents/Form/FormField.vue';
import FormFieldError from '@jac-uk/jac-kit/draftComponents/Form/FormFieldError.vue';

export default {
  name: 'PredictiveSearch',
  components: {
    FormFieldError,
  },
  extends: FormField,
  props: {
    modelValue: {
      default: '',
      type: [Object, String, Number, Boolean],
    },
    data: {
      type: Array,
      default: () => [],
    },
    searchFields: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: () => '',
    },
    hint: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      searchTerm: '',
      filteredResults: [],
      highlightedIndex: -1,
    };
  },
  computed: {
    hasError() {
      return !!this.errorMessage;
    },
  },
  watch: {
    searchTerm() {
      this.filterResults();
    },
  },
  methods: {
    filterResults() {
      if (!this.searchTerm) {
        this.filteredResults = [];
        return;
      }

      const searchTerm = this.searchTerm.toLowerCase();
      this.filteredResults = this.data.filter(item => {
        return this.searchFields.some(field =>
          item[field].toLowerCase().includes(searchTerm)
        );
      });
    },
    onInput() {
      this.filterResults();
    },
    onArrowDown() {
      if (this.highlightedIndex < this.filteredResults.length - 1) {
        this.highlightedIndex += 1;
      }
    },
    onArrowUp() {
      if (this.highlightedIndex > 0) {
        this.highlightedIndex -= 1;
      }
    },
    onEnter() {
      if (this.highlightedIndex >= 0 && this.filteredResults[this.highlightedIndex]) {
        this.onSelect(this.filteredResults[this.highlightedIndex]);
      }
    },
    onSelect(result) {
      this.searchTerm = result.name;
      this.$emit('update:modelValue', result);
      this.filteredResults = [];
      this.highlightedIndex = -1;
    },
  },
};
</script>

<style scoped>
.autocomplete-container {
  position: relative;
}
.autocomplete-results {
  position: absolute;
  border: 1px solid #ddd;
  border-top: none;
  background: #fff;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.autocomplete-results li {
  padding: 8px;
  cursor: pointer;
}
.autocomplete-results li.highlighted {
  background: #b3d4fc;
}
</style>
