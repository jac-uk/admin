<template>
  <fieldset class="govuk-fieldset govuk-!-margin-bottom-5">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <div class="govuk-body govuk-!-margin-0">
        <span v-if="type">{{ $filters.lookup(type) }} {{ index + 1 }}</span>
        <span v-else>Custom question {{ index + 1 }}</span>
      </div>
    </legend>
    <TextField
      v-if="!type"
      id="working-preference-topic"
      v-model="row.topic"
      hint="This will be used as the title of links to this question - e.g. Division preferences"
      label="Preference type"
    />

    <TextField
      id="working-preference-question"
      v-model="row.question"
      label="What question would you like to ask?"
    />
    <RadioGroup
      :id="`working-preference-question-type_${index}`"
      v-model="row.questionType"
      label="How would you like the question answered?"
      :messages="{
        required: 'Please choose one of the following options'
      }"
    >
      <RadioItem
        value="single-choice"
        label="Single choice"
      />
      <RadioItem
        value="multiple-choice"
        label="Multiple choice"
      />
      <RadioItem
        value="ranked-choice"
        label="Ranked choice"
      />
    </RadioGroup>
    <RepeatableFields
      v-model="row.answers"
      :component="repeatableFields.Answer"
      ident="answer"
      type-name="answer"
      required
    />
    <slot name="removeButton" />
  </fieldset>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import Answer from '@/components/RepeatableFields/Answer.vue';

export default {
  name: 'WorkingPreferenceQuestion',
  components: {
    TextField,
    RepeatableFields,
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
    type: {
      required: false,
      type: String,
      default: '',
    },
  },
  data() {
    return {
      repeatableFields: {
        Answer,
      },
    };
  },
  computed: {
  },
};
</script>

<style lang="scss" scoped>

.govuk-fieldset {
  @include govuk-responsive-padding(6);
  border: 2px solid $govuk-border-colour;
}

</style>
