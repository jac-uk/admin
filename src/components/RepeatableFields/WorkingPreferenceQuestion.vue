<template>
  <div>
    <fieldset class="govuk-fieldset govuk-!-margin-bottom-5">
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
        <h3 class="govuk-fieldset__heading">
          Custom question
        </h3>
      </legend>
      <TextField
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
      <hr class="govuk-section-break govuk-section-break--visible">
    </fieldset>
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import Answer from '@/components/RepeatableFields/Answer.vue';
import { shallowRef } from 'vue';

export default {
  name: 'WorkingPreferenceQuestionV1',
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
  },
  data() {
    return {
      repeatableFields: shallowRef({
        Answer,
      }),
    };
  },
  computed: {
  },
};
</script>