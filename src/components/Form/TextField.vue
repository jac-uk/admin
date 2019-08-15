<template>
  <div class="govuk-form-group">
    <label
      :for="id"
      class="govuk-heading-m" >
      {{label}}
    </label>
    <span 
      v-if="hint"
      id="event-name-hint" 
      class="govuk-hint">
      {{hint}}
    </span>
    <input 
      :class="[ narrow ? 'govuk-input--width-5 govuk-input' : 'govuk-input' ]"
      id="key" 
      name="key" 
      type="text" 
      v-model="textFieldValue">
  </div>
</template>

<script>
  export default {
    data() {
      return {
        textFieldValue: ''
      };
    },
    props: {
      label: String,
      hint: String,
      id: String,
      narrow: Boolean
    }
  }
</script>
