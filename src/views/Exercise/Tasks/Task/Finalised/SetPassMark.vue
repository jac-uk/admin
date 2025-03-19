<template>
  <Form
    @save="save"
    @cancel="cancel"
  >
    <Select
      id="pass-mark"
      v-model="formData.passMark"
      label="Available scores"
      required
    >
      <option
        v-for="scoreData in scores"
        :key="scoreData.score"
        :value="scoreData.score"
      >
        <template v-if="scoreType === 'gradeScore'">
          {{ scoreData.score }}
        </template>
        <template v-else>
          {{ $filters.formatNumber(scoreData.score, 2) }}
        </template>
        ({{ scoreData.rank + scoreData.count - 1 }} with this score or higher)
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
    scores: {
      required: true,
      type: Array,
    },
    scoreType: {
      required: true,
      type: String,
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
