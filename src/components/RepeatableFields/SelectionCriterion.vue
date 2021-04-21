<template>
  <div>
    <TextField
      :id="selectionCriterionTitle"
      v-model="row.title"
      label="Provide title to be displayed to the candidate."
      required
    />

    <RichTextInput
      :id="selectionCriterionText"
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
  computed: {
    selectionCriterionTitle() {
      return `selection_criterion_title_${this.index}`;
    },
    selectionCriterionText() {
      return `selection_criterion_text_${this.index}`;
    },
  },
};
</script>
