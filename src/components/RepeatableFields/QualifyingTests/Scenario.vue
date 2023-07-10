<template>
  <div>
    <RichTextInput
      id="scenario-question-input"
      v-model="text"
      label="Scenario text"
      required
    />
  </div>
</template>

<script>
import RichTextInput from '@jac-uk/jac-kit/draftComponents/Form/RichTextInput.vue';

export default {
  components: {
    RichTextInput,
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
