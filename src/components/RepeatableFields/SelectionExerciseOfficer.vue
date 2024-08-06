<template>
  <div>
    <Select
      :id="`selection_exercise_officer_${index}`"
      v-model="row.name"
      label="Selection exercise officer"
      hint="An email address is required."
      required
    >
      <option
        v-for="user in users"
        :key="user.uid"
        :value="user.email"
      >
        {{ user.displayName }} ({{ user.email }})
      </option>
    </Select>
    <slot name="removeButton" />
  </div>
</template>

<script>
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';

export default {
  name: 'SelectionExerciseOfficer',
  components: {
    Select,
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
    users: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
