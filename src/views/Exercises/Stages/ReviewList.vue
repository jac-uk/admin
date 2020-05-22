<template>
  <div>
    <h1>Review</h1>
    <ul>
      <li 
        v-for="item in applicationRecordsfromDB" 
        :key="item.application.id"
      >
        <RouterLink
          :to="{ name: 'exercise-stages-review-edit', params: { applicationId: item.application.id } }"
        >
          {{ item.candidate.fullName }} Lee
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    applicationRecordsfromDB() {
      // eslint-disable-next-line
      console.log('applicationRecords', this.$store);
      return this.$store.state.stageReview.applicationRecords;
    },
    created() {
      // eslint-disable-next-line
      console.log('create()');
      this.$store.dispatch('stageReview/bind', { exerciseId: this.exercise.id });
    },
  },
};
</script>
