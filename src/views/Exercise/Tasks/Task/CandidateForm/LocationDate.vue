<template>
  <div class="location-date-form">
    <DateInput
      :id="`date_${index}`"
      v-model="row.date"
      class="inline-block"
      :messages="{ required: 'Please enter a date' }"
      required
    />
    <TextField
      :id="`location_${index}`"
      v-model="row.location"
      input-class="govuk-input--width-20"
      label="Location"
      class="location"
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';

export default {
  name: 'LocationDate',
  components: {
    DateInput,
    TextField,
  },
  props: {
    row: {
      required: true,
      type: Object,
    },
    index: {
      required: true,
      type: Number,
    },
  },
};
</script>

<style lang="scss">
.location-date-form {
  .jac-add-another__remove-button {
    position: relative !important;
    vertical-align: bottom !important;
    margin-bottom: 32px !important;
    margin-left: 20px !important;
  }
  .govuk-form-group {
    display: inline-block;
  }
  .location > label {
    font-size: 19px;
    margin-bottom: 5px !important;
    font-weight: normal;  
  }
}
</style>
