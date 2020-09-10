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
import TextField from '@/components/Form/TextField';

export default {
  components: {
    TextField,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    text: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
