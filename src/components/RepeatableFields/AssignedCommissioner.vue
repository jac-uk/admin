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
        v-for="user in users"
        :key="user.uid"
        :value="user.email"
      >
        {{ user.email }}
      </option>
    </Select>
    <slot name="removeButton" />
  </div>
</template>

<script>
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import { mapGetters } from 'vuex';

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
    ...mapGetters({
      users: 'users/enabledMicrosoftUsers',
    }),
  },
};
</script>
