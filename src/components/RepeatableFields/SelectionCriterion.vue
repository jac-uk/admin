<template>
  <div>
    <TextField
      :id="selectionCriterionTitle"
      v-model="row.title"
      label="Provide title to be displayed to the candidate."
      required
    />

    <TextareaInput
      :id="selectionCriterionText"
      v-model="row.text"
      label="Provide text to be displayed to the candidate."
      required
    />

    <slot name="removeButton" />
  </div>
</template>

<script>
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';

export default {
  name: 'SelectionCriterion',
  components: {
    TextareaInput,
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
  computed: {
    selectionCriterionText() {
      return `selection_criterion_text_${this.index}`;
    },
  },
};
</script>
