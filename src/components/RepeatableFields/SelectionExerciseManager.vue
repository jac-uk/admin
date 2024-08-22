<template>
  <div>
    <PredictiveSearch
      :id="`selection_exercise_manager_${index}`"
      v-model="row.name"
      label="Selection exercise manager"
      hint="An email address is required."
      :show-full-list-on-focus="true"
      :data="users"
      :search-fields="['email', 'displayName']"
      required
      @update:model-value="handleSelection"
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import PredictiveSearch from './PredictiveSearch.vue';

export default {
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
    handleSelection(selectedItem) {
      this.row.name = selectedItem;
    },
  },
};
</script>
