<template>
  <div>
    <TextField
      :id="`statutory_consultee_${index}`"
      v-model="row.name"
      type="email"
      label="Statutory Consultee"
      :required="!exercise.statutoryConsultationWaived"
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';

export default {
  name: 'StatutoryConsultee',
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
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
};
</script>
