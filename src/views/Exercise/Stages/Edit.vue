<template>
  <form @submit.prevent="validateAndSave">
    <ErrorSummary
      :errors="errors"
    />
    <RadioGroup
      id="selected-status"
      v-model="newSelectedStatus"
      label="Update status"
      hint=""
      required
    >
      <RadioItem
        v-for="item in availableStatuses"
        :key="item"
        :value="item"
        :label="$filters.lookup(item)"
      />
    </RadioGroup>
    <CheckboxGroup
      id="emp-edit-toggle"
      v-model="editEmpApplied"
      label="Equal Merit Provision"
      hint=""
    >
      <CheckboxItem
        :value="true"
        label="Update EMP"
      >
        <RadioGroup
          id="emp-edit-input"
          v-model="empApplied"
          label=""
          hint=""
          required
          :messages="{
            required: 'Please specify a value'
          }"
        >
          <RadioItem
            value="gender"
            label="Yes - EMP has been Applied on basis of gender"
          />
          <RadioItem
            value="ethnicity"
            label="Yes - EMP has been Applied on basis of ethnicity"
          />
          <RadioItem
            :value="false"
            label="No - EMP has not been Applied"
          />
        </RadioGroup>
      </CheckboxItem>
    </CheckboxGroup>
    <button class="govuk-button">
      Save and continue
    </button>
  </form>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
import { availableStatuses, getNextStage } from '../../../helpers/exerciseHelper';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
    CheckboxGroup,
    CheckboxItem,
  },
  extends: Form,
  data() {
    return {
      newSelectedStatus: null,
      editEmpApplied: null,
      empApplied: null,
    };
  },
  computed: {
    stage() {
      return this.$route.params.stage;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    availableStatuses() {
      const statuses = availableStatuses(this.exercise, this.stage);
      return statuses;
    },
    itemsToChange() {
      const selectedItems = this.$store.state.applicationRecords.selectedItems;
      return selectedItems;
    },
  },
  created() {
    // on refresh if there's no IDs to change => redirect to the list
    if (this.itemsToChange.length === 0) {
      this.$router.push({ name: 'exercise-stages-list' });
    }
  },
  methods: {
    async save() {
      const nextStage = getNextStage(this.exercise, this.stage, this.newSelectedStatus);
      const data = {};
      data.status = this.newSelectedStatus;
      if (nextStage !== this.stage) {
        data.stage = nextStage;
      }
      if (this.editEmpApplied[0]) {
        data['flags.empApplied'] = this.empApplied;
      }
      await this.$store.dispatch('applicationRecords/updateStatus', data);
      this.$router.push({ name: 'exercise-stages-list', params: { stage: this.stage } });
    },
  },
};
</script>
