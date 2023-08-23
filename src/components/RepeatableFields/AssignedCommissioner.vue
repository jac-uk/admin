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
      const originalEmails = this.$store.getters['services/getEmails']('commissioners');
      // make a copy of the array so we don't mutate the original
      const emails = [...originalEmails];
      // sort emails alphabetically
      emails.sort((a, b) => {
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      return emails;
    },
  },
};
</script>
