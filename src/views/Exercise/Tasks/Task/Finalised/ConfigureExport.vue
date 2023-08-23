<template>
  <Form
    @save="save"
    @cancel="cancel"
  >
    <RadioGroup
      id="configure-export"
      v-model="formData.type"
      label="Choose a data format"
      required
      :messages="{
        required: 'Please specify a format for data to be exported'
      }"
    >
      <RadioItem
        v-for="type in types"
        :key="type.value"
        :value="type.value"
        :label="type.name"
      />  
    </RadioGroup>
  </Form>
</template>

<script>
import Form from '@/components/Page/Form';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';

export default {
  name: 'ConfigureExport',
  components: {
    Form,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  props: {
    types: {
      required: true,
      type: Array,
    },
  },
};
</script>
