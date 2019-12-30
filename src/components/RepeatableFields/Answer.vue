<template>
  <div>
    <TextField
      :id="`answer_${ident}_${index}`"
      v-model="row.answer"
      :label="`Answer option ${1 + index}`"
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';

export default {
  name: 'Answer',
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
    ident: {
      required: false,
      type: String,
      default: '',
    },    
  },
};
</script>
