<template>
  <div>
    <div v-if="!questionConfig">
      <div
        v-if="isDate"
      >
        <EditableField
          :id="field"
          :edit-mode="edit"
          :value="data"
          :field="field"
          :type="type"
          :date-format="dateFormat"
          :index="index"
          :extension="extension"
          :display-month-year-only="displayMonthYearOnly"
          :is-asked="isAsked"
          :is-required="isRequired"
          :display-label="displayLabel"
          :error-field-name="errorFieldName"
          @change-field="changeField"
        />
      </div>

      <div
        v-else-if="isRouted"
      >
        <!-- Only for Personal Details section -->
        <EditableField
          :id="field"
          :edit-mode="edit"
          :value="data"
          :field="field"
          :route-to="{ name: 'candidates-view', params: { id: applicationId } }"
          :extension="extension"
          type="route"
          :is-asked="isAsked"
          :is-required="isRequired"
          :display-label="displayLabel"
          :error-field-name="errorFieldName"
          @change-field="changeField"
        />
      </div>

      <div
        v-else-if="isEmail"
      >
        <EditableField
          :id="field"
          :edit-mode="edit"
          :value="data"
          :field="field"
          :route-to="{ name: 'candidates-view', params: { id: applicationId } }"
          type="email"
          :extension="extension"
          :is-asked="isAsked"
          :is-required="isRequired"
          :display-label="displayLabel"
          :error-field-name="errorFieldName"
          @change-field="changeField"
        />
      </div>

      <div
        v-else-if="isPhone"
      >
        <EditableField
          :id="field"
          :edit-mode="edit"
          :value="data"
          :field="field"
          :route-to="{ name: 'candidates-view', params: { id: applicationId } }"
          type="tel"
          :extension="extension"
          :is-asked="isAsked"
          :is-required="isRequired"
          :display-label="displayLabel"
          :error-field-name="errorFieldName"
          @change-field="changeField"
        />
      </div>

      <div
        v-else-if="isMultiSelection"
      >
        <EditableField
          :id="field"
          :edit-mode="edit"
          :value="data"
          :field="field"
          :index="index"
          :type="type"
          :extension="extension"
          :options="options"
          :is-asked="isAsked"
          @change-field="changeField"
        />
      </div>

      <div
        v-else-if="isSelection"
      >
        <EditableField
          :id="field"
          :edit-mode="edit"
          :value="data"
          :field="field"
          :index="index"
          type="selection"
          :extension="extension"
          :options="options"
          :is-asked="isAsked"
          @change-field="changeField"
        />
      </div>

      <div
        v-else-if="isRankedSelection"
      >
        <span>
          <EditableField
            :id="field"
            :edit-mode="edit"
            :value="data"
            :field="field"
            :index="index"
            :extension="extension"
            :options="options"
            type="ranked-selection"
            :is-asked="isAsked"
            @change-field="changeField"
          />
        </span>
      </div>

      <div
        v-else-if="isTextarea"
      >
        <EditableField
          :id="field"
          :edit-mode="edit"
          :value="data"
          :field="field"
          :extension="extension"
          :type="type"
          :type-props="typeProps"
          :index="index"
          :is-asked="isAsked"
          :disable-submit-on-error="disableSubmitOnError"
          :disable-universal-validation="disableUniversalValidation"
          :word-limit="typeProps.wordLimit"
          :is-required="isRequired"
          :display-label="displayLabel"
          :error-field-name="errorFieldName"
          @change-field="changeField"
          @edit-field="editField"
        />
      </div>

      <div
        v-else
      >
        <EditableField
          :id="field"
          :edit-mode="edit"
          :value="data"
          :field="field"
          :extension="extension"
          :type="type"
          :type-props="typeProps"
          :index="index"
          :is-asked="isAsked"
          :disable-submit-on-error="disableSubmitOnError"
          :disable-universal-validation="disableUniversalValidation"
          @change-field="changeField"
          @edit-field="editField"
        />
      </div>
    </div>
    <div v-else>
      <EditableField
        :edit-mode="edit"
        :value="data"
        :field="field"
        :index="index"
        :type="type"
        :extension="extension"
        :options="options"
        :is-asked="isAsked"
        :config="questionConfig"
        @change-field="changeField"
      />
    </div>
  </div>
</template>

<script>
// import EditableField from '@jac-uk/jac-kit/draftComponents/EditableField.vue';
import EditableField from './EditableField.vue';
import * as filters from '@jac-uk/jac-kit/filters/filters';

export default {
  name: 'InformationReviewRenderer',
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
    // Specify properties specific to the type of input (to assist with using the InformationReviewRenderer)
    typeProps: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    dateFormat: {
      type: String,
      required: false,
      default: () => '',
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
      type: [String, Date, Boolean, Array, Object],
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
      default: false,
    },
    isAsked: {
      type: Boolean,
      required: false,
      default: true,
    },
    questionConfig: {
      type: Object,
      required: false,
      default: () => { false; },
    },
    disableSubmitOnError: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableUniversalValidation: { // Ignore other invalid fields
      type: Boolean,
      required: false,
      default: false,
    },
    displayLabel: {
      type: Boolean,
      default: false,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    errorFieldName: {
      type: String,
      default: '',
    },
  },
  emits: ['changeField', 'editField'],
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
    isPhone() {
      return this.$props.type === 'tel';
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
    isTextarea() {
      return this.$props.type === 'textarea';
    },
  },
  methods: {
    displayDate(date) {
      return this.displayMonthYearOnly ? filters.formatDate(date, 'month') : filters.formatDate(date);
    },
    changeField(obj) {
      this.$emit('changeField', obj);
    },
    editField(obj) {
      this.$emit('editField', obj);
    },
  },
};
</script>
