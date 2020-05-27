<template>
  <div>
    <h1>Shortlisted</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.application.id"
      >
        <RouterLink
          :to="{ name: 'exercise-stages-shortlist-edit', params: { applicationId: item.application.id } }"
          class=""
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
      return this.$store.state.stageShortlisted.records;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  created() {
    this.$store.dispatch('stageShortlisted/bind', { exerciseId: this.exercise.id });
  },
};
</script>
