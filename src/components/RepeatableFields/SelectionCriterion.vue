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
import TextareaInput from '@/components/Form/TextareaInput';
import TextField from '@/components/Form/TextField';

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
    selectionCriterionTitle() {
      return `selection_criterion_title_${this.index}`;
    },
    selectionCriterionText() {
      return `selection_criterion_text_${this.index}`;
    },
  },
};
</script>
