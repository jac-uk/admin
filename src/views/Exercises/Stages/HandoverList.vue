<template>
  <div>
    <h1>Handover</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.application.id"
      >
        <RouterLink
          :to="{ name: 'exercise-show-application', params: { applicationId: item.application.id } }"
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
      return this.$store.state.stageHandover.records;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  created() {
    this.$store.dispatch('stageHandover/bind', { exerciseId: this.exercise.id });
  },
};
</script>
