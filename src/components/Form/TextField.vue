<template>
  <div class="govuk-form-group">
    <label
      :for="id"
      class="govuk-heading-m"
    >
      {{ label }}
    </label>
    <span 
      v-if="hint"
      id="event-name-hint" 
      class="govuk-hint"
    >
      {{ hint }}
    </span>
    <input 
      id="key"
      v-model="textFieldValue" 
      :class="[ (type === 'narrow') ? 'govuk-input--width-5 govuk-input' : 'govuk-input' ]" 
      name="key" 
      type="text"
    >
  </div>
</template>

<script>
export default {
  props: {
    label: {
      default: '',
      type: String,
    },
    hint: {
      default: '',
      type: String,
    },
    id: {
      default: '',
      type: String,
    },
    type: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      textFieldValue: '',
    };
  },
};
</script>
