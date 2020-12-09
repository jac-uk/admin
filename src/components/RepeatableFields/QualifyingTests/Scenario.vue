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
import RichTextInput from '@jac-uk/jac-kit/draftComponents/Form/RichTextInput';

export default {
  components: {
    RichTextInput,
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
