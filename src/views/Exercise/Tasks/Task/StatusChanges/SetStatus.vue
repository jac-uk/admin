<template>
  <Form
    :id="id"
    @save="save"
    @cancel="cancel"
    @delete="remove"
  >
    <RadioGroup
      id="status"
      v-model="formData.status"
      label="Please select from the available statuses"
      required
    >
      <RadioItem
        v-for="status in statuses"
        :key="status"
        :value="status"
        :label="$filters.lookup(status)"
      />
    </RadioGroup>
  </Form>
</template>

<script>
import Form from '@/components/Page/Form.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';

export default {
  name: 'SelectPanel',
  components: {
    Form,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  props: {
    statuses: {
      required: true,
      type: Array,
    },
  },
  methods: {
    load() {
      return {
        status: '',
      };
    },
  },
};
</script>
