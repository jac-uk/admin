<template>
  <div>
    <h1>Recommended</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.application.id"
      >
        <RouterLink
          :to="{ name: 'exercise-stages-recommended-edit', params: { applicationId: item.application.id } }"
        >
          {{ item.candidate.fullName }}, {{ item.status }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    applicationRecords() {
      return this.$store.state.stageRecommended.records;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  created() {
    this.$store.dispatch('stageRecommended/bind', { exerciseId: this.exercise.id });
  },
};
</script>
