<template>
  <div>
    <RadioGroup
      id="selected-status"
      v-model="newSelectedStatus"
      label="Add status"
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
