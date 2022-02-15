<template>
  <form
    @submit.prevent="validateAndSave"
  >
    <ErrorSummary
      :errors="errors"
      :show-save-button="false"
      @save="save"
    />

    <slot />

    <button
      class="govuk-button govuk-!-margin-right-3"
    >
      Save
    </button>
    <button
      class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
      type="button"
      @click="cancel"
    >
      Cancel
    </button>
    <button
      v-if="id"
      class="govuk-button govuk-button--warning govuk-!-margin-right-3"
      type="button"
      @click="remove"
    >
      Delete
    </button>
  </form>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';

export default {
  name: 'PanellistsForm',
  components: {
    ErrorSummary,
  },
  extends: Form,
  props: {
    data: {
      type: Object,
      required: false,
      default: () => {},
    },
    id: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      formData: this.load(this.data),
    };
  },
  methods: {
    load(data) {  // this method should be overriden with model-specific data
      return { ...data };
    },
    save() {
      this.$emit('save', this.formData);
    },
    cancel() {
      this.formData = this.load(this.data);
      this.$emit('cancel');
    },
    remove() {
      this.$emit('delete');
    },
  },
};
</script>
