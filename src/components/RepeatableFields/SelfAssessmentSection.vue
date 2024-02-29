<template>
  <div>
    <Select
      :id="`assessment-question-${index + 1}`"
      v-model="row.question"
      :hint="`What is the question ${index + 1} of this assessment?`"
      required
    >
      <option
        v-for="option in selfAssessmentCompetenciesQuestions"
        :key="option"
        :value="option"
      >
        {{ option }}
      </option>
    </Select>
    <TextField
      :id="`assessment-question-word-limit-${index + 1}`"
      v-model="row.wordLimit"
      input-class="govuk-input--width-5 govuk-!-margin-10"
      :hint="`What is the word limit for question ${index + 1} of this assessment?`"
      type="number"
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import { SELF_ASSESSMENT_COMPETENCIES_QUESTIONS } from '@/helpers/constants';

export default {
  name: 'SelfAssessmentSection',
  components: {
    Select,
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
    selfAssessmentCompetenciesQuestions() {
      return SELF_ASSESSMENT_COMPETENCIES_QUESTIONS;
    },
  },
};
</script>
