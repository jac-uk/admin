<template>
  <div>
    <TextField
      :id="`other_shortlisting_method_${index}`"
      v-model="row.name"
      type="text"
      label="Add method"
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';

export default {
  name: 'OtherShortlistingMethod',
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
