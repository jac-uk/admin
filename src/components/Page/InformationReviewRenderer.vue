<template>
  <div>
    <div
      v-if="!(data === null || data.length == 0)"
    >
      <div
        v-if="isDate"
      >
        <EditableField
          :edit-mode="edit"
          :value="data"
          :field="field"
          :type="type"
          :index="index"
          :extension="extension"
          @changeField="changeField"
        />
      </div>

      <div
        v-else-if="isRouted"
      >
        <EditableField
          :edit-mode="edit"
          :value="data"
          :field="field"
          :route-to="{ name: 'candidates-view', params: { id: applicationId } }"
          :extension="extension"
          type="route"
          @changeField="changeField"
        />
      </div>

      <div
        v-else-if="isEmail"
      >
        <EditableField
          :edit-mode="edit"
          :value="data"
          :field="field"
          :route-to="{ name: 'candidates-view', params: { id: applicationId } }"
          type="email"
          :extension="extension"
          @changeField="changeField"
        />
      </div>

      <div
        v-else-if="isSelection"
      >
        <EditableField
          :edit-mode="edit"
          :value="data"
          :field="field"
          type="selection"
          :extension="extension"
          :options="options"
          @changeField="changeField"
        />
      </div>

      <div
        v-else
      >
        <EditableField
          :edit-mode="edit"
          :value="data"
          :field="field"
          :extension="extension"
          :type="type"
          :index="index"
          @changeField="changeField"
        />
      </div>
    </div>
    <div v-if="data === null || data.length == 0">
      {{ 'No ' + (filters.lookup(field)) + (extension ? ' ' + filters.lookup(extension) : '' ) + ' provided' }}
    </div>
  </div>
</template>

<script>
import EditableField from '@jac-uk/jac-kit/draftComponents/EditableField';
// import { formatDate } from '@jac-uk/jac-kit/filters/filters';
import * as filters from '@jac-uk/jac-kit/filters/filters';

export default {
  components: {
    EditableField,
  },
  props: {
    edit: {
      type: [Boolean, Function, Promise],
      required: true,
      default: () => false,
    },
    type: {
      type: String,
      required: false,
      default: () => 'text',
    },
    extension: {
      type: String,
      required: false,
      default: () => null,
    },
    index: {
      type: [Number, String],
      required: false,
      default: () => null,
    },
    applicationId: {
      type: String,
      required: false,
      default: () => '',
    },
    field: {
      type: String,
      required: true,
      default: () => '',
    },
    data: {
      type: [Array, String, Date, Boolean],
      required: false,
      default: () => null,
    },
    selection: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    options: {
      type: Array,
      required: false,
      default: () => [],
    },
    isDraftApplication: {
      type: Boolean,
      required: false,
      default: false,
    },
    displayMonthYearOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      filters: filters,
    };
  },
  computed: {
    isDate() {
      return this.$props.data instanceof Date;
    },
    isEmail() {
      return this.$props.field === 'email';
    },
    isSelection() {
      return this.$props.selection === true;
    },
    isRouted() {
      return ['title', 'firstName', 'lastName'].some(field => field === this.$props.field) && this.applicationId;
    },
  },
  methods: {
    displayDate(date) {
      return this.displayMonthYearOnly ? filters.formatDate(date, 'month') : filters.formatDate(date);
    },
    changeField(obj) {
      this.$emit('changeField', obj);
    },
  },
};
</script>
