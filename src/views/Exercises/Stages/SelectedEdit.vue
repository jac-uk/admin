<template>
  <div>
    <RadioGroup
      id="shortlisted-status"
      v-model="newSelectedStatus"
      label="Shortlisted Status"
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
    <router-link :to="{name: 'exercise-stages-shortlisted-list'}">
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
};
</script>
