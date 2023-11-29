<template>
  <div>
    <TextField
      :id="`selection-criterion-title_${index}`"
      v-model="row.title"
      style="display:inline-block;"
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
    <TextField
      id="word-limit"
      v-model="row.wordLimit"
      input-class="govuk-input--width-5"
      label="Would you like to add a custom word limit to this question?"
      :hint="hint"
      type="number"
    />
    <hr>

    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import RichTextInput from '@jac-uk/jac-kit/draftComponents/Form/RichTextInput.vue';
import { shallowRef } from 'vue';

export default {
  name: 'SelectionCriterion',
  components: {
    TextField,
    RichTextInput,
  },
  inject: ['defaultWordLimit'],
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
  data() {
    return {
      hint: shallowRef(`The default word limit for this question is ${this.defaultWordLimit} words, if you would like to customise the word limit, please add the new figure in the field below.`),
    };
  },
};
</script>
<style scoped>
hr {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
