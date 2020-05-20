<template>
  <div>
    <RadioGroup
      id="selected-status"
      v-model="newSelectedStatus"
      label="Update status (TBC)"
      hint=""
      required
    >
      <RadioItem
        value="passedSelection"
        label="Passed Selection"
      />
      <RadioItem
        value="failedSelection"
        label="Failed Selection"
      />
      <RadioItem
        value="PassedButNotRecommended"
        label="Passed but not recommended"
      />
    </RadioGroup>
    <button class="govuk-button">
      Save and continue
    </button>
  </div>
</template>

<script>
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';

export default {
  components: {
    RadioGroup,
    RadioItem,
  },
  data() {
    return {
      newSelectedStatus: null,
    };
  },
};
</script>
