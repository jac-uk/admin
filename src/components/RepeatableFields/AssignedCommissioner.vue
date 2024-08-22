<template>
  <div>
    <PredictiveSearch
      :id="`assigned_comissioner_${index}`"
      v-model="row.name"
      label="Assigned commissioner"
      hint="An email address is required."
      :show-full-list-on-focus="true"
      :data="sortedCommissioners"
      :search-fields="['email', 'name']"
      required
      @update:model-value="handleSelection"
    />    <slot name="removeButton" />
  </div>
</template>

<script>
import PredictiveSearch from './PredictiveSearch.vue';

export default {
  name: 'AssignedCommissioner',
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
  },
  computed: {
    sortedCommissioners() {
      const commissioners = this.$store.getters['services/getCommissioners']();
      commissioners.sort((a, b) => {
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      return commissioners;
    },
  },
  methods: {
    handleSelection(selectedItem) {
      this.row.name = selectedItem;
    },
  },
};
</script>
