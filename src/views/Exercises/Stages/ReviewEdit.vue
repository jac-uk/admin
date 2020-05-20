<template>
  <div>
    <RadioGroup
      id="review-status"
      v-model="newStatus"
      label="Add status"
      hint=""
      required
    >
      <RadioItem
        v-for="item in availableStatuses"
        :key="item.ref"
        :value="item.ref"
        :label="item.title"
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
  computed: {
    availableStatuses() {
      return this.$store.getters['stageReview/availableStatuses'];
    },
  },
};
</script>
