<template>
  <Form
    @save="save"
    @cancel="cancel"
  >
    <Select
      id="exercise-state"
      v-model="formData.panelId"
      label="Please select from the available options"
      required
    >
      <option
        v-for="panel in panels"
        :key="panel.id"
        :value="panel.id"
      >
        {{ panel.name }}
      </option>
    </Select>
  </Form>
</template>

<script>
import Form from '@/components/Page/Form';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';

export default {
  name: 'SelectPanel',
  components: {
    Form,
    Select,
  },
  extends: Form,
  props: {
    panels: {
      required: true,
      type: Array,
    },
  },
  methods: {
    load(data) {
      return {
        panelId: data ? data.panelId : '',
      };
    },
  },
};
</script>
