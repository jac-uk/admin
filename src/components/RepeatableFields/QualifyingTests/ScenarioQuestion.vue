<template>
  <div>
    <TextField
      :id="`scenarioquestion_${id}_${index}`"
      v-model="row.question"
      :label="`${label} ${1 + index}`"
    />
    <TextField
      :id="`scenarioquestion_word_limit_${id}_${index}`"
      v-model="row.wordLimit"
      type="number"
      :label="`${label} ${1 + index} - word limit`"
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';

export default {
  name: 'ScenarioQuestion',
  components: {
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
};
</script>
