<template>
  <div>
    <TextField
      :id="`drafting_judge_${index}`"
      v-model="row.name"
      type="email"
      label="Drafting judge"
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';

export default {
  name: 'DraftingJudge',
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
  },
};
</script>
