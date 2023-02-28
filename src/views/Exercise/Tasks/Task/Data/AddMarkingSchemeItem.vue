<template>
  <Form
    @save="save"
    @cancel="cancel"
  >
    <Select
      id="type"
      v-model="formData.type"
      label="Please select a type"
      required
    >
      <option
        v-for="type in types"
        :key="type.value"
        :value="type.value"
      >
        {{ type.title }}
      </option>
    </Select>

    <TextField
      id="title"
      v-model="formData.title"
      type="text"
      label="Title"
      required
    />
    <TextField
      id="ref"
      v-model="formData.ref"
      type="text"
      label="Ref"
      required
    />
    <Checkbox
      id="exclude-from-score"
      v-model="formData.excludeFromScore"
    >
      Exclude from score?
    </Checkbox>
  </Form>
</template>

<script>
import Form from '@/components/Page/Form';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox';

export default {
  name: 'SelectPanel',
  components: {
    Form,
    Select,
    TextField,
    Checkbox,
  },
  extends: Form,
  data() {
    return {
      types: [
        {
          value: 'grade',
          title: 'Grade',
        },
        {
          value: 'bool',
          title: 'Boolean',
        },
        {
          value: 'number',
          title: 'Number',
        },
        // {
        //   value: 'select',
        //   title: 'Choice',
        // },
      ],
    };
  },
};
</script>
