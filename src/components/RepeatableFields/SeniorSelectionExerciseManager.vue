<template>
  <div>
    <Select
      :id="`senior_selection_exercise_manager_${index}`"
      v-model="row.name"
      label="Senior selection exercise manager"
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
  name: 'SeniorSelectionExerciseManager',
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
