<template>
  <form
    class="govuk-form-group notes__delete"
    @submit.prevent="save"
  >
    <fieldset
      class="govuk-fieldset"
      role="group"
    >
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
        <h2 class="govuk-fieldset__heading">
          Delete Note?
        </h2>
      </legend>
      <div class="govuk-inset-text">
        <span class="notes__delete__date">{{ note.created | formatDate('long') }}</span>
        <span class="notes__delete__body">{{ note.body }}</span>
      </div>
      <ErrorSummary :errors="errors" />
      <RadioGroup
        id="delete-note"
        v-model="selected"
        hint=""
        required
      >
        <RadioItem
          v-for="item in deleted"
          :key="item"
          :value="item"
          :label="item"
        />
      </RadioGroup>
      <button 
        class="govuk-button"
      >
        Save and return
      </button>
    </fieldset>
  </form>
</template>

<script>
import Form from '@/components/Form/Form';
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';
import ErrorSummary from '@/components/Form/ErrorSummary';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  props: {
    note: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      deleted: [
        'Yes',
        'No',
      ],
      selected: null,
    };
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        if (this.selected === 'Yes') {
          this.$store.dispatch('notes/delete', { id: this.note.id });
        }
        this.$emit('changeAction', null);
      }
    },
  },
};
</script>

<style scoped>
  .notes__delete__date {
    font-weight: bold;
  }
  .notes__delete__date, .notes__delete__body {
    display: block;
  }
</style>
