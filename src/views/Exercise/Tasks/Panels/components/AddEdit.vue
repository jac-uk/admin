<template>
  <Form
    :id="id"
    @save="save"
    @cancel="cancel"
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
import Form from '@/components/Page/Form';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput';

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
