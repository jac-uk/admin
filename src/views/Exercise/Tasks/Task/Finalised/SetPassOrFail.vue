<template>
  <Form
    @save="save"
    @cancel="cancel"
  >
    <p class="govuk-body">
      Please choose whether the outcome should be Pass or Fail.
    </p>
    <Select
      id="pass-or-fail"
      v-model="formData.outcome"
      required
    >
      <option
        v-for="outcome in ['pass', 'fail']"
        :key="outcome"
        :value="outcome"
      >
        {{ $filters.lookup(outcome) }}
      </option>
    </Select>
  </Form>
</template>

<script>
import Form from '@/components/Page/Form.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';

export default {
  name: 'SelectPanel',
  components: {
    Form,
    Select,
  },
  extends: Form,
  props: {
    items: {
      required: true,
      type: Array,
    },
  },
};
</script>
