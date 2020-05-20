<template>
  <div>
    <h1>Review</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.id"
      >
        <RouterLink
          :to="{ name: 'exercise-stages-review-edit', params: { applicationId: item.id } }"
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
  },
};
</script>
