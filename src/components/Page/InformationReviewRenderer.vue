<template>
  <div>
    <div>
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
        <!-- Only for Personal Details section -->
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
        v-else-if="isMultiSelection"
      >
        <EditableField
          :edit-mode="edit"
          :value="data"
          :field="field"
          :index="index"
          :type="type"
          :extension="extension"
          :options="options"
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
          :index="index"
          type="selection"
          :extension="extension"
          :options="options"
          @changeField="changeField"
        />
      </div>

      <div
        v-else-if="isRankedSelection"
      >
        <span>
          <EditableField
            :edit-mode="edit"
            :value="data"
            :field="field"
            :index="index"
            :extension="extension"
            :options="options"
            type="ranked-selection"
            @changeField="changeField"
          />
        </span>
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
  </div>
</template>

<script>
import EditableField from '@jac-uk/jac-kit/draftComponents/EditableField';
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
    applicationId: {
      type: String,
      required: false,
      default: () => '',
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
    field: {
      type: String,
      required: true,
      default: () => '',
    },
    data: {
      type: [String, Date, Boolean, Array],
      required: false,
      default: () => null,
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
      // return this.$props.data instanceof Date;
      return this.$props.type === 'date';
    },
    isEmail() {
      return this.$props.type === 'email';
    },
    isSelection() {
      return this.$props.type === 'selection';
    },
    isMultiSelection() {
      return this.$props.type === 'multi-selection';
    },
    isRankedSelection() {
      return this.$props.type === 'ranked-selection';
    },
    isRouted() {
      return this.$props.type === 'route';
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
