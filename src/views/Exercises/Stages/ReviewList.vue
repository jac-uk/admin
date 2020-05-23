<template>
  <div>
    <h1>Review</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.application.id"
      >
        <RouterLink
          :to="{ name: 'exercise-stages-review-edit', params: { applicationId: item.application.id } }"
        >
          {{ item.candidate.fullName }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    applicationRecords() {
      return this.$store.state.stageReview.applicationRecords;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  created() {
    this.$store.dispatch('stageReview/bind', { exerciseId: this.exercise.id });
  },
};
</script>
