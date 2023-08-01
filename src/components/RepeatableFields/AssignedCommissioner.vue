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
        v-for="email in emails"
        :key="email"
        :value="email"
      >
        {{ email }}
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
    emails() {
      return this.$store.getters['services/getEmails']('commissioners');
    },
  },
};
</script>
