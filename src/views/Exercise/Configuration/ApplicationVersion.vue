<template>
  <div>
    <h2 class="govuk-heading-l">
      Application version
    </h2>

    <form @submit.prevent="validateAndSave">
      <ErrorSummary
        :errors="errors"
      />
      <RadioGroup
        id="feedback-for-proxy"
        v-model="formData._applicationVersion"
        label="Which version of the application form would you like to use?"
        hint="See operations manual for full details of the different application form versions"
        required
      >
        <RadioItem
          value="3"
          label="Application version 3.0"
          hint="Introduces combined work history which replaces PQE, Employment Gaps and Judicial Experience"
        />
        <RadioItem
          value="2"
          label="Application version 2.0"
          hint="[ changes TBC ]"
        />
        <RadioItem
          value="1"
          label="Application version 1.0"
          hint="The original!"
          disabled
        />
      </RadioGroup>
      <button 
        class="govuk-button"
        :disabled="!hasChanges"
      >
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  data() {
    const defaults = {
      _applicationVersion: 2,
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);    
    return {
      formData,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    hasChanges() {
      return this.exercise._applicationVersion !== this.formData._applicationVersion;
    },
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.formData);
    },
  },
};
</script>
