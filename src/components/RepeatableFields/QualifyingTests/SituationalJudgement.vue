<template>
  <div>
    <TextField
      id="situational-judgement-question-input"
      v-model="text"
      ident="situational-judgement-question-input"
      label="Question Text"
    />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';

export default {
  name: 'SituationalJudgement',
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
