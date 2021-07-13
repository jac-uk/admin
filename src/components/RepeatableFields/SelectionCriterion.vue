<template>
  <div>
    <TextField
      :id="`selection-criterion-title_${index}`"
      v-model="row.title"
      label="Provide title to be displayed to the candidate."
      required
    />

    <RichTextInput
      :id="`selection-criterion-text_${index}`"
      v-model="row.text"
      class="govuk-!-margin-bottom-5"
      label="Provide text to be displayed to the candidate."
      required
    />

    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import RichTextInput from '@jac-uk/jac-kit/draftComponents/Form/RichTextInput';

export default {
  name: 'SelectionCriterion',
  components: {
    TextField,
    RichTextInput,
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
