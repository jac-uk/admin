<template>
  <div>
    <PredictiveSearch
      :id="`senior_selection_exercise_manager_${index}`"
      v-model="row.name"
      label="Senior selection exercise manager"
      hint="An email address is required."
      :show-full-list-on-focus="true"
      :data="users"
      :search-fields="['email', 'displayName']"
      required
    />
    <!-- @update:model-value="handleSelection" -->
    <slot name="removeButton" />
    HERE
  </div>
</template>

<script>
import PredictiveSearch from './PredictiveSearch.vue';

export default {
  name: 'SeniorSelectionExerciseManager',
  components: {
    PredictiveSearch,
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
  methods: {
  //   handleSelection(selectedItem) {
  //     console.log('Selected Item:', selectedItem); // Debugging output
  //     if (selectedItem && selectedItem.email) {
  //       this.row.name = selectedItem.email;
  //     } else {
  //       console.error('No email found on selected item'); // Debugging output
  //     }
  //   },
  },
};
</script>
