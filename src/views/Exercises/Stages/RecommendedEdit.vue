<template>
  <div>
    <RadioGroup
      id="recommended-status"
      v-model="newStatus"
      label="Add status"
      hint=""
      required
    >
      <RadioItem
        value="passedSift"
        label="Passed Sift"
      />
      <RadioItem
        value="failedSift"
        label="Failed Sift"
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
      newStatus: null,
    };
  },
};
</script>
