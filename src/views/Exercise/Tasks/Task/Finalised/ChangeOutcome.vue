<template>
  <Form
    @save="save"
    @cancel="cancel"
  >
    <p class="govuk-body-l">
      Would you like to change outcome to
      <strong v-if="isPassingScore" class="govuk-tag govuk-tag--red">FAIL</strong>
      <strong v-else class="govuk-tag govuk-tag--green">PASS</strong>?<br>
      <!-- <span class="govuk-hint">With a pass mark of {{ task.passMark }} and a score of {{ item.score }} the expected outcome is 
      <strong v-if="isPassingScore" class="govuk-tag govuk-tag--green">PASS</strong>
      <strong v-else class="govuk-tag govuk-tag--red">FAIL</strong>.</span> -->
    </p>
    <RadioGroup
      id="change-outcome"
      v-model="formData.changeOutcome"
      required
    >
      <RadioItem
        :value="true"
        label="Yes"
      />
      <RadioItem
        :value="false"
        label="No"
      />
    </RadioGroup>

    <Select
      v-if="formData.changeOutcome"
      id="reason"
      v-model="formData.reason"
      label="Reason for change"
      required
    >
      <option
        v-for="reason in reasons"
        :key="reason.value"
        :value="reason.value"
      >
        {{ reason.label }}
      </option>
    </Select>    
  </Form>
</template>

<script>
import Form from '@/components/Page/Form.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import { getDefaultOutcome, getCurrentOutcome, getNewOutcome, getOverrideReasons, isPassingScore, getOverride } from './meritListHelper';

export default {
  name: 'SelectPanel',
  components: {
    Form,
    Select,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  props: {
    item: {
      required: true,
      type: Object,
    },
    task: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      reasons: getOverrideReasons()
    };
  },
  created() {
    this.formData.defaultOutcome = getDefaultOutcome(this.task, this.item.score).value;
    this.formData.currentOutcome = getCurrentOutcome(this.task, this.item.score).value;
    this.formData.newOutcome = getNewOutcome(this.task, this.item.score).value;
    const override = getOverride(this.task, this.item.id);
    if (override) {
      this.formData.changeOutcome = true;
      this.formData.reason = override.reason;
    }
  },
  computed: {
    isPassingScore() {
      return isPassingScore(this.task, this.item.score);
    },
  },
};
</script>
