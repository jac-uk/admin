<template>
  <div>
    <TextField
      id="critical-analysis-question-input"
      v-model="text"
      ident="critical-analysis-question-input"
      label="Question Text"
    />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';

export default {
  name: 'CriticalAnalysis',
  components: {
    TextField,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    text: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
  },
};
</script>
