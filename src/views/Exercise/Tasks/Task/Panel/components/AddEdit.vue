<template>
  <Form
    :id="id"
    @save="save"
    @cancel="cancel"
    @delete="remove"
  >
    <TextField
      id="panel-name"
      v-model="formData.name"
      label="Panel Name"
      required
    />
    <DateInput
      id="date-from"
      v-model="formData.dateFrom"
      label="Date from"
    />
    <DateInput
      id="date-to"
      v-model="formData.dateTo"
      label="to"
    />
  </Form>
</template>

<script>
import Form from '@/components/Page/Form.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput.vue';

export default {
  name: 'SelectPanel',
  components: {
    Form,
    TextField,
    DateInput,
  },
  extends: Form,
  methods: {
    load(data) {
      return {
        name: data.name,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
      };
    },
  },
};
</script>
