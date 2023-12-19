<template>
  <div>
    <Select
      :id="`assigned_comissioner_${index}`"
      v-model="row.name"
      label="Assigned commissioner"
      hint="An email address is required."
      required
    >
      <option
        v-for="commissioner in sortedCommissioners"
        :key="commissioner.email"
        :value="commissioner.email"
      >
        {{ commissioner.name }} ({{ commissioner.email }})
      </option>
    </Select>
    <slot name="removeButton" />
  </div>
</template>

<script>
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';

export default {
  name: 'AssignedCommissioner',
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
};
</script>
