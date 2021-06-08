<template>
  <div
    class="govuk-body"
  >
    <div
      v-if="isDate"
    >
      <EditableField
        :value="data"
        :field="field"
        type="date"
        :index="index"
        :extension="extension"
        @changeField="changeField"
      />
    </div>

    <div
      v-else-if="isRouted"
    >
      <EditableField
        :value="data"
        :field="field"
        :route-to="{ name: 'candidates-view', params: { id: applicationId } }"
        type="route"
        :extension="extension"
        @changeField="changeField"
      />
    </div>

    <div
      v-else-if="isEmail"
    >
      <EditableField
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
        v-if="data"
        :value="data"
        :field="field"
        :extension="extension"
        :index="index"
        @changeField="changeField"
      />
    </div>
  </div>
</template>

<script>
import EditableField from '@jac-uk/jac-kit/draftComponents/EditableField';
import { formatDate } from '@jac-uk/jac-kit/filters/filters';

export default {
  components: {
    EditableField,
  },
  props: {
    type: {
      type: String,
      required: false,
      default: null,
    },
    extension: {
      type: String,
      required: false,
      default: null,
    },
    index: {
      type: [Number, String],
      required: false,
      default: null,
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
      return this.displayMonthYearOnly ? formatDate(date, 'month') : formatDate(date);
    },
    changeField(obj) {
      this.$emit('changeField', obj);
    },
  },
};
</script>
