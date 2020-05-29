<template>
  <div>
    <h1>Selected</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.application.id"
      >
        <RouterLink
          :to="{ name: 'exercise-stages-selected-edit', params: { applicationId: item.application.id } }"
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
      return this.$store.state.stageSelected.records;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  created() {
    this.$store.dispatch('stageSelected/bind', { exerciseId: this.exercise.id });
  },
};
</script>
