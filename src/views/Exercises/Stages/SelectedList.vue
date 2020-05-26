<template>
  <div>
    <h1>Selected</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.id"
      >
        <RouterLink
          :to="{ name: 'exercise-stages-selected-edit', params: { applicationId: item.id } }"
          class=""
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
      return this.$store.state.stageSelected.applicationRecords;
    },
  },
};
</script>
