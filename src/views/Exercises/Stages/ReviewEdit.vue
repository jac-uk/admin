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
        v-for="item in availableStatuses"
        :key="item.ref"
        :value="item.ref"
        :label="item.title"
      />
    </RadioGroup>
    <router-link :to="{name: 'exercise-stages-review-list'}">
      <button class="govuk-button">
        Save and continue
      </button>
    </router-link>
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
  methods: {
    submitForApproval() {
      this.$store.dispatch('exerciseDocument/submitForApproval');
    },
  },
  computed: {
    availableStatuses() {
      return this.$store.getters['stageReview/availableStatuses'];
    },
  },
};
</script>
