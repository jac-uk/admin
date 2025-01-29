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
  </Form>
</template>

<script>
import Form from '@/components/Page/Form.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';

export default {
  name: 'SelectPanel',
  components: {
    Form,
    TextField,
  },
  extends: Form,
  methods: {
    load(data) {
      return {
        name: data ? data.name : '',
      };
    },
  },
};
</script>
