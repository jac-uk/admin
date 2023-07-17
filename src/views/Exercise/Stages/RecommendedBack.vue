<template>
  <form @submit.prevent="validateAndSave">
    <ErrorSummary
      :errors="errors"
    />
    <RadioGroup
      id="selected-status"
      v-model="newSelectedStatus"
      label="Move back to the 'selected' stage?"
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
import { DEFAULT, EXERCISE_STAGE } from '@jac-uk/jac-kit/helpers/constants';

export default {
  name: 'RecommendedBack',
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  data() {
    return {
      newSelectedStatus: null,
    };
  },
  computed: {
    applicationId() {
      return this.$route.params.applicationId;
    },
    availableStatuses() {
      const myStatus = [
        DEFAULT.YES,
        DEFAULT.NO,
      ];
      return myStatus;
    },
  },
  methods: {
    async save() {
      let stageValue = EXERCISE_STAGE.RECOMMENDED;
      if (this.newSelectedStatus === DEFAULT.YES) {
        stageValue = EXERCISE_STAGE.SELECTED;
        await this.$store.dispatch('stageRecommended/updateStatus', {
          applicationId: this.applicationId,
          nextStage: stageValue,
        });
      }
      this.$router.push({ name: 'exercise-stages-recommended-list' });
    },
  },
};
</script>
