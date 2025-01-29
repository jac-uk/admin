<template>
  <Form
    @save="save"
    @cancel="cancel"
  >
    <Select
      id="exercise-state"
      v-model="formData.panelId "
      label="Please select from the available options"
      required
    >
      <template
        v-for="panel in panels"
        :key="panel.id"
      >
        <optgroup
          v-if="panel.timetable"
          :label="panel.name"
        >
          <option
            v-for="item in panel.timetable.filter(i => i.totalSlots > 0)"
            :key="item"
            :value="`${panel.id}__${item.date}__${item.location}`"
          >
            {{ $filters.formatDate(item.date) }} {{ item.location }} ({{ item.totalSlots }} slots)
          </option>
        </optgroup>
        <option
          v-else
          :value="panel.id"
        >
          {{ panel.name }}
        </option>
      </template>
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
    panels: {
      required: true,
      type: Array,
    },
  },
  methods: {
    load(data) {
      return {
        panelId: data ? data.panelId : '',
      };
    },
  },
};
</script>
