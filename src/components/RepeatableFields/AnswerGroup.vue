<template>
  <div>
    <TextField
      :id="`answer_group_${id}_${index}`"
      v-model="row.group"
      :label="`${label} ${1 + index}`"
    />
    <slot name="removeButton" />

    <div class="govuk-!-margin-left-8">
      <RepeatableFields
        v-model="row.answers"
        :component="repeatableFields.Answer"
        ident="answer"
        type-name="answer"
        required
      />
    </div>
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import Answer from '@/components/RepeatableFields/Answer.vue';
import { shallowRef } from 'vue';

export default {
  name: 'AnswerGroup',
  components: {
    TextField,
    RepeatableFields,
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
    id: {
      required: false,
      type: String,
      default: '',
    },
    label: {
      required: false,
      type: String,
      default: 'Answer option',
    },
  },
  data() {
    return {
      repeatableFields: shallowRef({
        Answer,
      }),
    };
  },
};
</script>
