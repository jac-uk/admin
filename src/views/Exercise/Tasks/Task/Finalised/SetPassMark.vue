<template>
  <Form
    @save="save"
    @cancel="cancel"
  >
    <Select
      id="pass-mark"
      v-model="formData.passMark"
      label="Please select from the available scores"
      required
    >
      <option
        v-for="scoreData in scores"
        :key="scoreData.score"
        :value="scoreData.score"
      >
        {{ scoreData.score }} ({{ scoreData.rank + scoreData.count - 1 }} with this score or higher)
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
    scores: {
      required: true,
      type: Array,
    },
  },
  methods: {
    load(data) {
      return {
        passMark: data ? data.passMark : '',
      };
    },
  },
};
</script>
