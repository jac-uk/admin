<template>
  <Form
    :id="id"
    @save="save"
    @cancel="cancel"
    @delete="remove"
  >
    <TextField
      id="full-name"
      v-model="formData.fullName"
      label="Full name"
      required
    />
    <TextField
      id="email"
      v-model="formData.email"
      label="Email"
      type="email"
      required
    />
    <TextField
      id="phone"
      v-model="formData.phone"
      label="Phone"
      type="tel"
      required
    />
  </Form>
</template>

<script>
import Form from '@/components/Page/Form';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';

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
        fullName: data ? data.fullName : '',
        email: data ? data.email : '',
        phone: data ? data.phone : '',
      };
    },
  },
};
</script>
