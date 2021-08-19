<template>
  <div>
    <RadioGroup
      :id="`selection-criterion-title_${index}`"
      v-model="row.hasCustomWordLimit"
      label="Would you like to add a custom word limit to this question?"
      hint="if none is provided this will default to 250 words"
      required
    >
      <RadioItem
        :value="true"
        label="Yes"
      >
        <TextField
          id="word-limit"
          v-model="row.wordLimit"
          label="Word Limit"
          class="govuk-!-width-one-quarter"
          type="number"
          required
        />
      </RadioItem>
      <RadioItem
        :value="false"
        label="No"
      />
    </RadioGroup>

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
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';

export default {
  name: 'SelectionCriterion',
  components: {
    TextField,
    RichTextInput,
    RadioGroup,
    RadioItem,
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
