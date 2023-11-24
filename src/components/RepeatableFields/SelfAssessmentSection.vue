<template>
  <div>
    <TextField
      id="word-limit"
      :v-model="row.wordLimit"
      input-class="govuk-input--width-5 govuk-!-margin-10"
      :hint="`What is the word limit for question ${index + 1} of this assessment?`"
      type="number"
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';

export default {
  name: 'SelfAssessmentSection',
  components: {
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
