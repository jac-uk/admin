<template>
  <form @submit.prevent="validateAndSave">
    <BackLink />
    <h1 class="govuk-heading-l">
      Update {{ itemsToChange.length }} {{ $filters.pluralise('application', itemsToChange.length) }}
    </h1>
    <ErrorSummary
      :errors="errors"
    />
    <RadioGroup
      id="selected-status"
      v-model="newSelectedStatus"
      label="New status"
      hint=""
      :required="!editEmpApplied"
    >
      <RadioItem
        v-for="item in availableStatuses"
        :key="item"
        :value="item"
        :label="`${$filters.lookup(item)}${getStatusMark(item)}`"
      />
    </RadioGroup>
    <Checkbox
      v-if="!hasPassingStatus && hasNextStage"
      id="next-stage"
      v-model="moveToNextStage"
      label="Move to next stage"
    >
      {{ $filters.lookup(nextStage) }}
    </Checkbox>
    <Checkbox
      id="emp-edit-toggle"
      v-model="editEmpApplied"
      label="Equal Merit Provision"
    >
      Update EMP<br><br>
      <RadioGroup
        v-if="editEmpApplied"
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
    </Checkbox>     
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
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink.vue';
import { availableStatuses, getNextStage, getStagePassingStatuses, getStageMoveBackStatuses } from '../../../helpers/exerciseHelper';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
    Checkbox,
    BackLink,
  },
  extends: Form,
  data() {
    return {
      moveToNextStage: false,
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
    stagePassingStatuses() {
      const statuses = getStagePassingStatuses(this.exercise, this.stage);
      return statuses;
    },
    hasPassingStatus() {
      return this.stagePassingStatuses && this.stagePassingStatuses.length > 0;
    },
    stageMoveBackStatuses() {
      const statuses = getStageMoveBackStatuses(this.exercise, this.stage);
      return statuses;
    },
    nextStage() {
      return getNextStage(this.exercise, this.stage);
    },
    hasNextStage() {
      return this.stage !== this.nextStage;
    },
    itemsToChange() {
      const selectedItems = this.$store.state.applicationRecords.selectedItems;
      return selectedItems;
    },
  },
  created() {
    // on refresh if there's no IDs to change => redirect to the list
    if (this.itemsToChange.length === 0) {
      this.$router.push({ name: 'exercise-stage-list' });
    }
  },
  methods: {
    getStatusMark(status) {
      if (this.stagePassingStatuses && this.stagePassingStatuses.indexOf(status) >= 0) {
        return ' *';
      }
      if (this.stageMoveBackStatuses && this.stageMoveBackStatuses.indexOf(status) >= 0) {
        return ' *';
      }
      return '';
    },
    async save() {
      const data = {};
      if (this.newSelectedStatus) {
        data.status = this.newSelectedStatus;
        if (this.moveToNextStage && this.hasNextStage) {
          data.stage = this.nextStage;
        } else {
          const nextStage = getNextStage(this.exercise, this.stage, this.newSelectedStatus);
          if (this.stage !== nextStage) {
            data.stage = nextStage;
          }
        }
      }
      if (this.editEmpApplied) {
        data['flags.empApplied'] = this.empApplied;
      }
      await this.$store.dispatch('applicationRecords/updateStatus', data);
      this.$router.push({ name: 'exercise-stage-list', params: { stage: this.stage } });
    },
  },
};
</script>
